'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const JSZip = require('jszip');
const XLSX = require('xlsx');
const { createAppServer } = require('../server');

const ADMIN_EMAIL = 'tai.nh@itc.edu.vn';
const ADMIN_PW = 'ItcAdmin@2027!';
const ADMIN_PIN = '202700';
const STAFF1_EMAIL = 'dien.tn@itc.edu.vn';
const STAFF2_EMAIL = 'lam.v@itc.edu.vn';
const STAFF_PW = 'ItcStaff@2027!';

function reqJson(baseUrl, method, urlPath, { body = null, token = null, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlPath, baseUrl);
    const payload = body !== null && body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
    const reqHeaders = { ...headers };
    if (token) reqHeaders['Authorization'] = `Bearer ${token}`;
    if (payload !== null && !reqHeaders['Content-Type']) {
      reqHeaders['Content-Type'] = 'application/json';
    }
    if (payload !== null) reqHeaders['Content-Length'] = Buffer.byteLength(payload);

    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method,
      headers: reqHeaders
    }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const ct = res.headers['content-type'] || '';
        let data = buf;
        if (ct.includes('application/json')) {
          try { data = JSON.parse(buf.toString('utf8')); } catch (_) { data = buf.toString('utf8'); }
        } else if (ct.includes('text/')) {
          data = buf.toString('utf8');
        }
        resolve({ status: res.statusCode, headers: res.headers, data, raw: buf });
      });
    });
    req.on('error', reject);
    if (payload !== null) req.write(payload);
    req.end();
  });
}

function connectWs(port, token = null, origin = null) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (origin) headers['Origin'] = origin;
    const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`, { headers });
    const messages = [];
    ws.on('message', (d) => {
      try { messages.push(JSON.parse(String(d))); } catch (_) {}
    });
    ws.once('open', () => resolve({ ws, messages }));
    ws.once('unexpected-response', (_req, res) => reject({ statusCode: res.statusCode }));
    ws.once('error', (err) => reject(err));
  });
}

function waitFor(fn, timeoutMs = 2500) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      const val = fn();
      if (val) return resolve(val);
      if (Date.now() - start > timeoutMs) return reject(new Error('Timeout waiting for condition'));
      setTimeout(tick, 20);
    };
    tick();
  });
}

async function runAll() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'itc-test-'));
  const dbPath = path.join(tmpDir, 'test.sqlite');
  const backupDir = path.join(tmpDir, 'backups');

  let app = createAppServer({
    port: 0,
    host: '127.0.0.1',
    dataDir: tmpDir,
    backupDir,
    dbPath,
    maxBodyBytes: 256 * 1024, // 256KB for oversized payload test
    disableScheduledBackup: true
  });

  const { port } = await app.start();
  const baseUrl = `http://127.0.0.1:${port}`;
  const results = [];

  async function scenario(num, name, fn) {
    const t0 = Date.now();
    try {
      const detail = await fn();
      const ms = Date.now() - t0;
      results.push({ num, name, pass: true, ms, detail: detail || 'OK' });
      console.log(`  [PASS] #${num} ${name} (${ms}ms)${detail ? ' -> ' + detail : ''}`);
    } catch (err) {
      results.push({ num, name, pass: false, error: err.message });
      console.error(`  [FAIL] #${num} ${name}: ${err.stack || err.message}`);
      throw err;
    }
  }

  let adminToken = '';
  let staff1Token = '';
  let staff2Token = '';

  try {
    console.log('\n=== CHAY BO NGHIEM THU 16 TINH HUONG (BAO CAO ITC) ===\n');

    // 1. Auth, RBAC, Account Lock & WS Revocation
    await scenario(1, 'Quyền truy cập, phiên server & khóa tài khoản ngắt HTTP/WS', async () => {
      // Unauthenticated HTTP blocked
      const unauthApi = await reqJson(baseUrl, 'GET', '/api/registrations');
      assert.strictEqual(unauthApi.status, 401);
      const unauthBoot = await reqJson(baseUrl, 'GET', '/api/bootstrap');
      assert.strictEqual(unauthBoot.status, 401);

      // Unauthenticated WS rejected with 401
      let wsRejectedCode = null;
      try {
        await connectWs(port, null);
      } catch (e) {
        wsRejectedCode = e.statusCode;
      }
      assert.strictEqual(wsRejectedCode, 401, 'WS unauthenticated must return 401');

      // Bad origin WS rejected with 403
      const loginAdm = await reqJson(baseUrl, 'POST', '/api/auth/login', { body: { email: ADMIN_EMAIL, password: ADMIN_PW } });
      assert.strictEqual(loginAdm.status, 200);
      adminToken = loginAdm.data.token;

      let badOriginCode = null;
      try {
        await connectWs(port, adminToken, 'https://evil.example.com');
      } catch (e) {
        badOriginCode = e.statusCode;
      }
      assert.strictEqual(badOriginCode, 403, 'WS untrusted origin must return 403');

      // Consultant logins
      const l1 = await reqJson(baseUrl, 'POST', '/api/auth/login', { body: { email: STAFF1_EMAIL, password: STAFF_PW } });
      assert.strictEqual(l1.status, 200);
      staff1Token = l1.data.token;
      const l2 = await reqJson(baseUrl, 'POST', '/api/auth/login', { body: { email: STAFF2_EMAIL, password: STAFF_PW } });
      staff2Token = l2.data.token;

      // Consultant cannot escalate permissions or restore system
      const escAttempt = await reqJson(baseUrl, 'PATCH', '/api/admin/users/usr_staff_1', { token: staff1Token, body: { can_delete: true, role: 'super_admin' } });
      assert.strictEqual(escAttempt.status, 403);
      const rstAttempt = await reqJson(baseUrl, 'POST', '/api/backup/restore', { token: staff1Token, body: { dryRun: true, backupPayload: {} } });
      assert.strictEqual(rstAttempt.status, 403);

      // Open WS for staff1, then Admin locks staff1 -> WS closed 4001 & HTTP returns 401 immediately!
      const s1Ws = await connectWs(port, staff1Token);
      let closeCode = null;
      s1Ws.ws.on('close', (code) => { closeCode = code; });

      const lockRes = await reqJson(baseUrl, 'PATCH', '/api/admin/users/usr_staff_1', { token: adminToken, body: { active: false } });
      assert.strictEqual(lockRes.status, 200);

      await waitFor(() => closeCode === 4001);
      const staleHttp = await reqJson(baseUrl, 'GET', '/api/auth/me', { token: staff1Token });
      assert.strictEqual(staleHttp.status, 401, 'Locked user HTTP session must be invalidated immediately');

      // Unlock staff1 & re-login for next scenarios
      await reqJson(baseUrl, 'PATCH', '/api/admin/users/usr_staff_1', { token: adminToken, body: { active: true } });
      const relog = await reqJson(baseUrl, 'POST', '/api/auth/login', { body: { email: STAFF1_EMAIL, password: STAFF_PW } });
      staff1Token = relog.data.token;

      // Super Admin protection: locking 1 of 2 super admins allowed, locking the LAST one blocked!
      const lockLe = await reqJson(baseUrl, 'PATCH', '/api/admin/users/usr_admin_le', { token: adminToken, body: { active: false } });
      assert.strictEqual(lockLe.status, 200);
      const lockLast = await reqJson(baseUrl, 'PATCH', '/api/admin/users/usr_admin_tai', { token: adminToken, body: { active: false } });
      assert.strictEqual(lockLast.status, 400);
      await reqJson(baseUrl, 'PATCH', '/api/admin/users/usr_admin_le', { token: adminToken, body: { active: true } });

      return 'HTTP/WS 401, RBAC 403, immediate WS close 4001 on lock, last-admin guard verified';
    });

    // 2. Record Scope Enforcement (HTTP, Export, Realtime WS)
    await scenario(2, 'Phạm vi hồ sơ (own/all) trên HTTP, Export Excel & WebSocket', async () => {
      const ws1 = await connectWs(port, staff1Token);
      const ws2 = await connectWs(port, staff2Token);

      const c1 = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Học sinh thuộc Điển', student_phone: '0901000001', intake_year: '2027', assigned_staff_id: 'stf_1' }
      });
      const c2 = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Học sinh thuộc Lâm', student_phone: '0901000002', intake_year: '2027', assigned_staff_id: 'stf_2' }
      });
      assert.strictEqual(c1.status, 201);
      assert.strictEqual(c2.status, 201);

      // staff1 tries to access & edit staff2's record -> 403 FORBIDDEN_SCOPE!
      const forbidGet = await reqJson(baseUrl, 'GET', `/api/registrations/${c2.data.record.id}`, { token: staff1Token });
      assert.strictEqual(forbidGet.status, 403);
      const forbidPatch = await reqJson(baseUrl, 'PATCH', `/api/registrations/${c2.data.record.id}`, { token: staff1Token, body: { patch: { notes: 'hacked' } } });
      assert.strictEqual(forbidPatch.status, 403);

      // staff1 list & Excel export ONLY contain stf_1 records
      const list1 = await reqJson(baseUrl, 'GET', '/api/registrations?intakeYear=2027', { token: staff1Token });
      assert.ok(list1.data.items.every(r => r.assigned_staff_id === 'stf_1'));
      const exp1 = await reqJson(baseUrl, 'GET', '/api/registrations/export?intakeYear=2027', { token: staff1Token });
      assert.strictEqual(exp1.status, 200);
      const wb = XLSX.read(exp1.raw, { type: 'buffer' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      assert.strictEqual(rows.length, 1);
      assert.strictEqual(rows[0]['Họ và tên'], 'Học sinh thuộc Điển');

      // Realtime WS scope check: ws1 received c1, NEVER received c2!
      await waitFor(() => ws1.messages.some(m => m.type === 'domain_event' && m.id === c1.data.record.id));
      await waitFor(() => ws2.messages.some(m => m.type === 'domain_event' && m.id === c2.data.record.id));
      assert.strictEqual(ws1.messages.some(m => m.id === c2.data.record.id), false, 'staff1 WS must NEVER see staff2 record');

      // Disable can_export on staff1 -> export blocked 403!
      await reqJson(baseUrl, 'PATCH', '/api/admin/users/usr_staff_1', { token: adminToken, body: { can_export: false } });
      const blockedExp = await reqJson(baseUrl, 'GET', '/api/registrations/export?intakeYear=2027', { token: staff1Token });
      assert.strictEqual(blockedExp.status, 403);
      await reqJson(baseUrl, 'PATCH', '/api/admin/users/usr_staff_1', { token: adminToken, body: { can_export: true } });

      ws1.ws.close(); ws2.ws.close();
      return 'Cross-scope GET/PATCH 403, Export & WS strictly scoped, can_export enforced';
    });

    // 3. Safe HTML Escaping & Strict Schema / Size Limits
    await scenario(3, 'HTML an toàn (XSS) & từ chối payload sai kiểu / quá dung lượng', async () => {
      const xssName = `<img src=x onerror=alert('xss')>Nguyễn Văn <script>1</script>`;
      const created = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: xssName, student_phone: '0901000003', intake_year: '2027', assigned_staff_id: 'stf_1', notes: '<b>Bold</b>' }
      });
      assert.strictEqual(created.status, 201);
      assert.strictEqual(created.data.record.full_name, xssName);

      // Verify frontend escape function served by single-file server turns tags into inert entities
      const utilsRes = await reqJson(baseUrl, 'GET', '/js/utils.js');
      assert.strictEqual(utilsRes.status, 200);
      const utilsCode = utilsRes.raw.toString('utf8');
      const fakeWin = {};
      new Function('window', utilsCode)(fakeWin);
      const escaped = fakeWin.ITCUtils.esc(xssName);
      assert.ok(!escaped.includes('<img') && !escaped.includes('<script'), 'HTML tags must be escaped');
      assert.ok(escaped.includes('&lt;img') && escaped.includes('&lt;script'));

      // Invalid enum / wrong type rejected 400
      const badEnum = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Bad', student_phone: '0901000004', stage_code: 'hacked_stage' }
      });
      assert.strictEqual(badEnum.status, 400);

      const badType = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: ['not', 'an', 'object']
      });
      assert.strictEqual(badType.status, 400);

      // Oversized payload rejected 413 without mutating DB
      const beforeCount = app.dbm.db.prepare('SELECT COUNT(*) AS c FROM registrations').get().c;
      const bigBody = JSON.stringify({ full_name: 'Big', notes: 'A'.repeat(300 * 1024) });
      const overRes = await reqJson(baseUrl, 'POST', '/api/registrations', { token: adminToken, body: bigBody }).catch(() => ({ status: 413 }));
      assert.strictEqual(overRes.status, 413);
      const afterCount = app.dbm.db.prepare('SELECT COUNT(*) AS c FROM registrations').get().c;
      assert.strictEqual(afterCount, beforeCount);

      return 'XSS escaped, invalid enum/type 400, oversized 413 without mutation';
    });

    // 4. Multi-Month (50 Nov, 2 Dec) & Multi-Year (2027 vs 2028) Isolation + Official 4000/1440/900 KPI
    await scenario(4, 'Phân tách Tháng (50 T11 vs 2 T12) & Đa Niên Khóa (2027 vs 2028)', async () => {
      // Verify official 2027 KPI targets sum accurately to 4,000 / 1,440 / 900
      const kpiInit = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2027&monthKey=2026-11', { token: adminToken });
      assert.strictEqual(kpiInit.data.roomAnnualTarget.lead, 4000);
      assert.strictEqual(kpiInit.data.roomAnnualTarget.submitted, 1440);
      assert.strictEqual(kpiInit.data.roomAnnualTarget.enrolled, 900);

      // Create 50 leads in 11/2026 and 2 leads in 12/2026 for stf_3 (clean staff)
      for (let i = 1; i <= 50; i++) {
        const ph = '093' + String(1000000 + i);
        await reqJson(baseUrl, 'POST', '/api/registrations', {
          token: adminToken,
          body: { full_name: `Lead Nov ${i}`, student_phone: ph, intake_year: '2027', assigned_staff_id: 'stf_3', source_received_at: '2026-11-15T03:00:00.000Z', crm_received_at: '2026-11-15T03:00:00.000Z' }
        });
      }
      for (let i = 1; i <= 2; i++) {
        const ph = '093' + String(2000000 + i);
        await reqJson(baseUrl, 'POST', '/api/registrations', {
          token: adminToken,
          body: { full_name: `Lead Dec ${i}`, student_phone: ph, intake_year: '2027', assigned_staff_id: 'stf_3', source_received_at: '2026-12-10T03:00:00.000Z', crm_received_at: '2026-12-10T03:00:00.000Z' }
        });
      }
      // Create 3 leads in intakeYear 2028 (11/2027)
      for (let i = 1; i <= 3; i++) {
        const ph = '094' + String(3000000 + i);
        await reqJson(baseUrl, 'POST', '/api/registrations', {
          token: adminToken,
          body: { full_name: `Lead 2028 #${i}`, student_phone: ph, intake_year: '2028', assigned_staff_id: 'stf_3', source_received_at: '2027-11-12T03:00:00.000Z', crm_received_at: '2027-11-12T03:00:00.000Z' }
        });
      }

      const kNov = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2027&monthKey=2026-11&cutoffIso=2028-01-01T00:00:00.000Z', { token: adminToken });
      const kDec = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2027&monthKey=2026-12&cutoffIso=2028-01-01T00:00:00.000Z', { token: adminToken });
      const k2028 = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2028&monthKey=2027-11&cutoffIso=2028-12-01T00:00:00.000Z', { token: adminToken });

      const stf3Nov = kNov.data.staffRows.find(s => s.staff_id === 'stf_3');
      const stf3Dec = kDec.data.staffRows.find(s => s.staff_id === 'stf_3');
      assert.strictEqual(stf3Nov.monthActual.lead, 50);
      assert.strictEqual(stf3Dec.monthActual.lead, 2, 'Dec must be 2, NOT 52!');
      assert.strictEqual(stf3Dec.annualActual.lead, 52);

      // 2028 cycle is 2027-11..2028-10 and completely isolated from 2027 data
      assert.strictEqual(k2028.data.months[0].key, '2027-11');
      assert.strictEqual(k2028.data.months[11].key, '2028-10');
      assert.strictEqual(k2028.data.roomAnnualActual.lead, 3, '2027 leads must NEVER leak into 2028');

      return 'T11=50, T12=2, NK2028=3 isolated, official 2027 plan=4000/1440/900';
    });

    // 5. Negative Statuses & Unknown Statuses
    await scenario(5, 'Trạng thái phủ định (Chưa nộp/Chưa nhập học/Rút) & Trạng thái lạ', async () => {
      const pasteLines = [
        'Họ và tên\tSĐT\tNgành quan tâm\tNguồn\tNhân sự\tTrạng thái chăm sóc\tKết quả cuối cùng\tGhi chú',
        'Neg 1\t0951000001\tKế toán\tWeb\tVõ Đặng Kim Trang\tĐã gọi\tChưa nộp hồ sơ\tTest phủ định',
        'Neg 2\t0951000002\tKế toán\tWeb\tVõ Đặng Kim Trang\tĐã gọi\tChưa nhập học\tTest phủ định',
        'Neg 3\t0951000003\tKế toán\tWeb\tVõ Đặng Kim Trang\tĐã gọi\tDự định nộp hồ sơ\tTest dự định',
        'Neg 4\t0951000004\tKế toán\tWeb\tVõ Đặng Kim Trang\tĐã gọi\tRút hồ sơ\tTest rút',
        'Unk 5\t0951000005\tKế toán\tWeb\tVõ Đặng Kim Trang\tĐã gọi\tTrạng thái lạ XYZ\tTest lạ',
        'Pos 6\t0951000006\tKế toán\tWeb\tVõ Đặng Kim Trang\tĐã gọi\tĐã nộp hồ sơ\tHợp lệ',
        'Pos 7\t0951000007\tKế toán\tWeb\tVõ Đặng Kim Trang\tĐã gọi\tĐã nhập học\tHợp lệ'
      ].join('\n');

      const prev = await reqJson(baseUrl, 'POST', '/api/import/crm/preview', { token: adminToken, body: { intakeYear: '2027', pasteText: pasteLines } });
      assert.strictEqual(prev.status, 200);
      const byName = Object.fromEntries(prev.data.rows.map(r => [r.parsed.full_name, r.parsed.stage_code]));
      assert.strictEqual(byName['Neg 1'], 'lead');
      assert.strictEqual(byName['Neg 2'], 'lead');
      assert.strictEqual(byName['Neg 3'], 'lead');
      assert.strictEqual(byName['Neg 4'], 'withdrawn');
      assert.strictEqual(byName['Unk 5'], 'pending_verify');
      assert.strictEqual(byName['Pos 6'], 'submitted');
      assert.strictEqual(byName['Pos 7'], 'enrolled');

      await reqJson(baseUrl, 'POST', '/api/import/crm/commit', { token: adminToken, body: { intakeYear: '2027', targetType: 'crm_paste', rows: prev.data.rows } });

      const kpi = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2027&cutoffIso=2028-01-01T00:00:00.000Z', { token: adminToken });
      const stf4 = kpi.data.staffRows.find(s => s.staff_id === 'stf_4');
      assert.strictEqual(stf4.annualActual.submitted, 2, 'Only Pos 6 (submitted) + Pos 7 (enrolled) count as cumulative submitted');
      assert.strictEqual(stf4.annualActual.enrolled, 1, 'Only Pos 7 counts as enrolled');

      return 'Negative strings never inflate completed metrics; unknown -> pending_verify; submitted=2, enrolled=1';
    });

    // 6. Independent Milestones (Register Nov, Submit Dec, Enroll Aug)
    await scenario(6, 'Mốc tuyển sinh độc lập (ĐK T11, Nộp T12, Nhập học T08)', async () => {
      const reg = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: {
          full_name: 'Thí sinh 3 Mốc',
          student_phone: '0961000001',
          intake_year: '2028',
          assigned_staff_id: 'stf_2',
          source_received_at: '2027-11-10T03:00:00.000Z',
          crm_received_at: '2027-11-10T03:00:00.000Z'
        }
      });
      const rId = reg.data.record.id;
      await reqJson(baseUrl, 'POST', `/api/registrations/${rId}/milestones`, {
        token: adminToken,
        body: { milestone_type: 'submitted', occurred_at: '2027-12-05T04:00:00.000Z', evidence_note: 'Biên nhận HS #01' }
      });
      await reqJson(baseUrl, 'POST', `/api/registrations/${rId}/milestones`, {
        token: adminToken,
        body: { milestone_type: 'enrolled', occurred_at: '2028-08-15T04:00:00.000Z', evidence_note: 'Biên lai học phí #01' }
      });

      const kNov = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2028&monthKey=2027-11&cutoffIso=2028-11-01T00:00:00.000Z', { token: adminToken });
      const kDec = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2028&monthKey=2027-12&cutoffIso=2028-11-01T00:00:00.000Z', { token: adminToken });
      const kAug = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2028&monthKey=2028-08&cutoffIso=2028-11-01T00:00:00.000Z', { token: adminToken });

      const sNov = kNov.data.staffRows.find(s => s.staff_id === 'stf_2').monthActual;
      const sDec = kDec.data.staffRows.find(s => s.staff_id === 'stf_2').monthActual;
      const sAug = kAug.data.staffRows.find(s => s.staff_id === 'stf_2').monthActual;

      assert.deepStrictEqual(sNov, { lead: 1, submitted: 0, enrolled: 0 });
      assert.deepStrictEqual(sDec, { lead: 0, submitted: 1, enrolled: 0 });
      assert.deepStrictEqual(sAug, { lead: 0, submitted: 0, enrolled: 1 });
      return 'Nov(1/0/0), Dec(0/1/0), Aug(0/0/1) verified independently';
    });

    // 7. SLA Classification & Report Deadlines
    await scenario(7, 'Phân loại SLA (đúng hạn 5p, trễ 30p, ngoài giờ, chưa giao, thiếu mốc)', async () => {
      // Use clean year 2029 so SLA counts are exact
      await reqJson(baseUrl, 'POST', '/api/registrations', { token: adminToken, body: { full_name: 'SLA OnTime', student_phone: '0971000001', intake_year: '2029', assigned_staff_id: 'stf_1', crm_received_at: '2028-11-20T01:30:00.000Z', first_contact_at: '2028-11-20T01:35:00.000Z', contact_status: 'contacted_interested' } });
      await reqJson(baseUrl, 'POST', '/api/registrations', { token: adminToken, body: { full_name: 'SLA OverdueHandled', student_phone: '0971000002', intake_year: '2029', assigned_staff_id: 'stf_1', crm_received_at: '2028-11-20T01:00:00.000Z', first_contact_at: '2028-11-20T01:30:00.000Z', contact_status: 'contacted_interested' } });
      await reqJson(baseUrl, 'POST', '/api/registrations', { token: adminToken, body: { full_name: 'SLA OverdueUnhandled', student_phone: '0971000003', intake_year: '2029', assigned_staff_id: 'stf_1', crm_received_at: '2028-11-20T01:00:00.000Z' } });
      await reqJson(baseUrl, 'POST', '/api/registrations', { token: adminToken, body: { full_name: 'SLA Unassigned', student_phone: '0971000004', intake_year: '2029', assigned_staff_id: null, crm_received_at: '2028-11-20T01:00:00.000Z' } });
      await reqJson(baseUrl, 'POST', '/api/registrations', { token: adminToken, body: { full_name: 'SLA MissingTs', student_phone: '0971000005', intake_year: '2029', assigned_staff_id: 'stf_1', crm_received_at: null, source_received_at: null } });

      // Evaluate at 2028-11-20 09:00 VN (02:00 UTC, Monday morning)
      const slaDay = await reqJson(baseUrl, 'GET', '/api/sla?intakeYear=2029&now=2028-11-20T02:00:00.000Z', { token: adminToken });
      const bMap = Object.fromEntries(slaDay.data.items.map(i => [i.full_name, i.sla.bucket]));
      assert.strictEqual(bMap['SLA OnTime'], 'on_time');
      assert.strictEqual(bMap['SLA OverdueHandled'], 'overdue_handled');
      assert.strictEqual(bMap['SLA OverdueUnhandled'], 'overdue_unhandled');
      assert.strictEqual(bMap['SLA Unassigned'], 'unassigned');
      assert.strictEqual(bMap['SLA MissingTs'], 'insufficient_timestamp');
      // 1 on_time out of 4 measurable (1 on_time + 1 overdue_handled + 1 overdue_unhandled + 1 overdue_unassigned) = 25%
      assert.strictEqual(slaDay.data.onTimeSlaRate, 25);

      // After-hours check: arrived 22:10 VN (15:10 UTC), evaluated at 22:40 VN (15:40 UTC)
      await reqJson(baseUrl, 'POST', '/api/registrations', { token: adminToken, body: { full_name: 'SLA AfterHours', student_phone: '0971000006', intake_year: '2029', assigned_staff_id: 'stf_1', crm_received_at: '2028-11-20T15:10:00.000Z' } });
      const slaNight = await reqJson(baseUrl, 'GET', '/api/sla?intakeYear=2029&now=2028-11-20T15:40:00.000Z', { token: adminToken });
      const ah = slaNight.data.items.find(i => i.full_name === 'SLA AfterHours');
      assert.strictEqual(ah.sla.bucket, 'after_hours_pending');

      // Monthly report deadline check: on Nov 20, deadline must be Nov 24 23:59:59 VN (16:59:59 UTC), strictly BEFORE Day 25!
      assert.ok(slaDay.data.deadlines.monthly.deadlineAt.startsWith('2028-11-24T16:59:59'));

      return 'All 6 SLA buckets + onTime=25% (excluding missing ts) + monthly deadline <Day 25 verified';
    });

    // 8. Deduplication across Excel + Zalo & Siblings Sharing Parent Phone
    await scenario(8, 'Chống trùng đa nguồn (Excel + Zalo) & 2 anh em chung SĐT phụ huynh', async () => {
      const kpiBefore = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2029&cutoffIso=2030-01-01T00:00:00.000Z', { token: adminToken });
      const leadsBefore = kpiBefore.data.roomAnnualActual.lead;

      // 1. Import via Excel/paste
      const p1 = await reqJson(baseUrl, 'POST', '/api/import/crm/preview', {
        token: adminToken,
        body: { intakeYear: '2029', pasteText: 'Lê Minh Tâm\t0905556677\tKế toán\tExcel Web\tTô Nhựt Điển\tChưa gọi điện\tĐang tư vấn\tTừ web' }
      });
      await reqJson(baseUrl, 'POST', '/api/import/crm/commit', { token: adminToken, body: { intakeYear: '2029', targetType: 'crm_excel', rows: p1.data.rows } });

      // 2. Same person arrives in Zalo -> parse & approve -> merged, NOT double counted!
      const zParse = await reqJson(baseUrl, 'POST', '/api/zalo-staging/parse', {
        token: adminToken,
        body: { intakeYear: '2029', sourceGroup: 'Group Zalo Q12', rawText: 'Lê Minh Tâm - 0905556677 - quan tâm ngành Kế toán' }
      });
      assert.strictEqual(zParse.data.count, 1);
      assert.ok(zParse.data.items[0].suspected_duplicate_reg_id, 'Zalo must detect existing CRM duplicate');
      const zApp = await reqJson(baseUrl, 'POST', `/api/zalo-staging/${zParse.data.items[0].id}/approve`, { token: adminToken, body: {} });
      assert.strictEqual(zApp.data.status, 'merged');

      const kpiAfterDup = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2029&cutoffIso=2030-01-01T00:00:00.000Z', { token: adminToken });
      assert.strictEqual(kpiAfterDup.data.roomAnnualActual.lead, leadsBefore + 1, 'Same person from Excel + Zalo must only add +1 to KPI!');

      // 3. Two siblings sharing parent_phone 0981112222
      const sib1 = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Nguyễn Anh Tú', parent_phone: '0981112222', intake_year: '2029', assigned_staff_id: 'stf_1', allow_shared_parent_phone: true }
      });
      const sib2 = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Nguyễn Anh Thư', parent_phone: '0981112222', intake_year: '2029', assigned_staff_id: 'stf_1', allow_shared_parent_phone: true }
      });
      assert.strictEqual(sib1.status, 201);
      assert.strictEqual(sib2.status, 201);
      assert.notStrictEqual(sib1.data.record.person_id, sib2.data.record.person_id);
      assert.notStrictEqual(sib1.data.record.id, sib2.data.record.id);

      return 'Excel+Zalo merged (KPI +1 only); 2 siblings sharing parent phone exist separately';
    });

    // 9. Round-trip Imports (Regional Template, 8-Col CRM Quick Paste, 2-Person Zalo Chat)
    await scenario(9, 'Vòng nhập/xuất: Mẫu Tuyến giữ Trường/Tỉnh, Dán nhanh 8 cột, Zalo 2 người', async () => {
      // 9a. Regional template round-trip
      const tplRes = await reqJson(baseUrl, 'GET', '/api/templates/regional', { token: adminToken });
      assert.strictEqual(tplRes.status, 200);
      const rgnPrev = await reqJson(baseUrl, 'POST', '/api/regional/import/preview', {
        token: adminToken,
        body: { region: 'mientay', fileBase64: tplRes.raw.toString('base64') }
      });
      assert.strictEqual(rgnPrev.data.rows.length, 1);
      assert.strictEqual(rgnPrev.data.rows[0].parsed.school, 'THPT Nguyễn Đình Chiểu');
      assert.strictEqual(rgnPrev.data.rows[0].parsed.province, 'Tiền Giang');

      // 9b. 8-column CRM quick paste WITHOUT header row
      const paste8 = 'Phạm Gia Bảo\t0908887766\tThiết kế đồ họa\tSharePoint\tVõ Văn Lâm\tHẹn gọi lại\tĐang tư vấn\tCột 8 ghi chú quan trọng';
      const p8 = await reqJson(baseUrl, 'POST', '/api/import/crm/preview', { token: adminToken, body: { intakeYear: '2029', pasteText: paste8 } });
      const row8 = p8.data.rows[0].parsed;
      assert.strictEqual(row8.full_name, 'Phạm Gia Bảo');
      assert.strictEqual(row8.major, 'Thiết kế đồ họa');
      assert.strictEqual(row8.assigned_staff_id, 'stf_2');
      assert.strictEqual(row8.contact_status, 'callback_scheduled');
      assert.strictEqual(row8.stage_code, 'lead');
      assert.strictEqual(row8.notes, 'Cột 8 ghi chú quan trọng');

      // 9c. Zalo chat with 2 candidates (1 = Kế toán, 2 = no major & arbitrary chat text)
      const chat2 = [
        '1. Đặng Thanh Sơn - 0913445566 - đăng ký ngành Kế toán - THPT Long An',
        '2. Hoàng Mỹ Linh - 0913778899 - nhờ anh chị gửi học phí giúp em'
      ].join('\n');
      const z2 = await reqJson(baseUrl, 'POST', '/api/zalo-staging/parse', { token: adminToken, body: { intakeYear: '2029', rawText: chat2 } });
      assert.strictEqual(z2.data.count, 2, 'Must extract 2 candidates from 2-person chat');
      assert.strictEqual(z2.data.items[0].extracted_major, 'Kế toán', 'Must NOT turn Kế toán into CNTT');
      assert.strictEqual(z2.data.items[1].extracted_major, '', 'Unknown major must stay empty, NEVER invent CNTT');
      assert.strictEqual(z2.data.items[1].suggested_staff_id, null, 'Chat text must NEVER become staff name');

      return 'Regional template round-trip, 8-col paste exact mapping, Zalo 2-person strict parse OK';
    });

    // 10. Concurrency: Different-Field Merge, Same-Field 409 Conflict, Safe Single-ID Delete
    await scenario(10, 'Sửa đồng thời (gộp khác trường, 409 cùng trường) & Xóa A không xóa B', async () => {
      const recA = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Hồ sơ A', student_phone: '0904000001', intake_year: '2029', major: 'Công nghệ thông tin', notes: 'Ban đầu', assigned_staff_id: 'stf_1' }
      });
      const idA = recA.data.record.id;
      assert.strictEqual(recA.data.record.version, 1);

      // User 1 updates notes based on v1 -> v2
      const u1 = await reqJson(baseUrl, 'PATCH', `/api/registrations/${idA}`, {
        token: adminToken,
        body: { expectedVersion: 1, patch: { notes: 'Ghi chú từ User 1' } }
      });
      assert.strictEqual(u1.status, 200);
      assert.strictEqual(u1.data.record.version, 2);

      // User 2 updates major (different field!) based on v1 -> merges cleanly -> v3 with BOTH changes!
      const u2 = await reqJson(baseUrl, 'PATCH', `/api/registrations/${idA}`, {
        token: adminToken,
        body: { expectedVersion: 1, patch: { major: 'Kế toán' } }
      });
      assert.strictEqual(u2.status, 200);
      assert.strictEqual(u2.data.merged, true);
      assert.strictEqual(u2.data.record.notes, 'Ghi chú từ User 1');
      assert.strictEqual(u2.data.record.major, 'Kế toán');

      // User 3 updates notes (SAME field!) based on stale v1 -> HTTP 409 Conflict!
      const u3 = await reqJson(baseUrl, 'PATCH', `/api/registrations/${idA}`, {
        token: adminToken,
        body: { expectedVersion: 1, patch: { notes: 'Ghi chú xung đột User 3' } }
      });
      assert.strictEqual(u3.status, 409);
      assert.strictEqual(u3.data.error, 'CONFLICT');
      assert.strictEqual(u3.data.conflicts[0].field, 'notes');

      // Server adds Record B, stale client deletes Record A -> B stays intact!
      const recB = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Hồ sơ B mới thêm', student_phone: '0904000002', intake_year: '2029', assigned_staff_id: 'stf_1' }
      });
      const delA = await reqJson(baseUrl, 'DELETE', `/api/registrations/${idA}`, { token: adminToken });
      assert.strictEqual(delA.status, 200);
      const getB = await reqJson(baseUrl, 'GET', `/api/registrations/${recB.data.record.id}`, { token: adminToken });
      assert.strictEqual(getB.status, 200);
      assert.strictEqual(getB.data.record.full_name, 'Hồ sơ B mới thêm');

      return 'Different-field merged, same-field 409 Conflict, delete A preserved B';
    });

    // 11. Network Loss, Idempotent Retry & Client Outbox Protection
    await scenario(11, 'Mất mạng, thử lại chống lặp (Idempotency) & bảo toàn Outbox', async () => {
      const idemKey = 'idem_test_offline_retry_001';
      const body = { full_name: 'Thí sinh Retry An Toàn', student_phone: '0904999888', intake_year: '2029', assigned_staff_id: 'stf_1' };

      const r1 = await reqJson(baseUrl, 'POST', '/api/registrations', { token: adminToken, body, headers: { 'X-Idempotency-Key': idemKey } });
      const r2 = await reqJson(baseUrl, 'POST', '/api/registrations', { token: adminToken, body, headers: { 'X-Idempotency-Key': idemKey } });
      assert.strictEqual(r1.status, 201);
      assert.strictEqual(r2.status, 201);
      assert.strictEqual(r2.headers['x-idempotent-replay'], 'true');
      assert.strictEqual(r1.data.record.id, r2.data.record.id, 'Retried operation with same idempotency key must execute ONCE');

      // Verify exact DB count = 1 for this phone
      const cnt = app.dbm.db.prepare("SELECT COUNT(*) AS c FROM persons WHERE student_phone = '0904999888'").get().c;
      assert.strictEqual(cnt, 1);

      return 'Duplicate retry replayed cleanly with 1 DB record';
    });

    // 12. Commit-Before-ACK Durability, Simulated Write Failure, Versioned Backup & Atomic Restore
    await scenario(12, 'Lỗi lưu đĩa trả 500 (không báo giả) & Sao lưu/Khôi phục có xác thực', async () => {
      // Simulate storage commit failure -> MUST return 500 and NOT mutate DB!
      const cntBefore = app.dbm.db.prepare('SELECT COUNT(*) AS c FROM registrations').get().c;
      app.dbm.simulateWriteError = true;
      const failRes = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Không được lưu', student_phone: '0904111222', intake_year: '2029' }
      });
      app.dbm.simulateWriteError = false;
      assert.strictEqual(failRes.status, 500, 'Write failure MUST return HTTP 500, never 200');
      assert.strictEqual(app.dbm.db.prepare('SELECT COUNT(*) AS c FROM registrations').get().c, cntBefore);

      // Create versioned backup
      const bkp = await reqJson(baseUrl, 'POST', '/api/backup', { token: adminToken, body: {} });
      assert.strictEqual(bkp.status, 201);
      const bkpFile = bkp.data.backup.filename;

      // Add a post-backup record that should disappear after restore
      const postRec = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Bản ghi sau backup', student_phone: '0904333444', intake_year: '2029' }
      });
      assert.strictEqual(postRec.status, 201);

      // Restore dry-run passes validation
      const dry = await reqJson(baseUrl, 'POST', '/api/backup/restore', { token: adminToken, body: { filename: bkpFile, dryRun: true } });
      assert.strictEqual(dry.status, 200);
      assert.strictEqual(dry.data.valid, true);

      // Restore without elevated auth -> 403!
      const noPin = await reqJson(baseUrl, 'POST', '/api/backup/restore', { token: adminToken, body: { filename: bkpFile, dryRun: false } });
      assert.strictEqual(noPin.status, 403);

      // Restore with Admin PIN -> succeeds + creates pre_restore checkpoint + rolls back post-backup record!
      const doRst = await reqJson(baseUrl, 'POST', '/api/backup/restore', { token: adminToken, body: { filename: bkpFile, dryRun: false, confirmPin: ADMIN_PIN } });
      assert.strictEqual(doRst.status, 200);
      assert.ok(doRst.data.checkpoint.startsWith('backup-'));
      assert.strictEqual(app.dbm.db.prepare('SELECT COUNT(*) AS c FROM registrations').get().c, cntBefore);

      return `Write error -> 500; backup ${bkpFile} restored atomically with PIN & checkpoint`;
    });

    // 13. Period-Scoped Reports & Frozen Approved Snapshot
    await scenario(13, 'Báo cáo đúng kỳ (loại ngoài kỳ, tách lũy kế) & Snapshot đóng băng', async () => {
      // Query Dec 2026 ONLY in NK 2027 (remember Scenario 4 added 50 in Nov + 2 in Dec for stf_3)
      const q = 'intakeYear=2027&periodType=custom&startDate=2026-12-01T00:00:00.000Z&endDate=2026-12-31T23:59:59.000Z&cutoffAt=2026-12-31T23:59:59.000Z';
      const prevDec = await reqJson(baseUrl, 'GET', `/api/reports/preview?${q}`, { token: adminToken });
      assert.strictEqual(prevDec.status, 200);
      assert.strictEqual(prevDec.data.data.crm.inPeriod.registered, 2, 'Dec period must exclude 50 Nov leads!');
      assert.ok(prevDec.data.data.crm.cumulative.registered >= 52, 'Cumulative must include Nov + Dec');

      // Freeze & approve snapshot
      const snap = await reqJson(baseUrl, 'POST', '/api/reports/snapshots', {
        token: adminToken,
        body: { intakeYear: '2027', periodType: 'custom', startDate: '2026-12-01T00:00:00.000Z', endDate: '2026-12-31T23:59:59.000Z', cutoffAt: '2026-12-31T23:59:59.000Z' }
      });
      assert.strictEqual(snap.status, 201);
      const snapId = snap.data.snapshot.id;
      const appv = await reqJson(baseUrl, 'POST', `/api/reports/snapshots/${snapId}/approve`, { token: adminToken, body: {} });
      assert.strictEqual(appv.status, 200);
      assert.strictEqual(appv.data.snapshot.status, 'approved');

      // Add another lead in Dec AFTER snapshot approval -> snapshot MUST preserve original frozen number (2)!
      await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Lead sau khi chốt BC', student_phone: '0939999111', intake_year: '2027', assigned_staff_id: 'stf_3', source_received_at: '2026-12-20T03:00:00.000Z', crm_received_at: '2026-12-20T03:00:00.000Z' }
      });
      const frozen = await reqJson(baseUrl, 'GET', `/api/reports/preview?snapshotId=${snapId}`, { token: adminToken });
      assert.strictEqual(frozen.data.data.crm.inPeriod.registered, 2, 'Approved snapshot must remain frozen at 2');

      return `Dec inPeriod=2 vs cumulative=${prevDec.data.data.crm.cumulative.registered}; frozen snapshot immutable`;
    });

    // 14. Real OOXML .docx, Dynamic Multi-Sheet Excel & Honest Email Status
    await scenario(14, 'DOCX chuẩn OOXML tiếng Việt, Excel theo checkbox & Trạng thái Email trung thực', async () => {
      const docxRes = await reqJson(baseUrl, 'GET', '/api/reports/export/docx?intakeYear=2027&periodType=year', { token: adminToken });
      assert.strictEqual(docxRes.status, 200);
      assert.strictEqual(docxRes.raw[0], 0x50, 'DOCX must be real ZIP (P)');
      assert.strictEqual(docxRes.raw[1], 0x4b, 'DOCX must be real ZIP (K)');
      const zip = await JSZip.loadAsync(docxRes.raw);
      assert.ok(zip.file('word/document.xml'), 'OOXML word/document.xml must exist');
      const docXml = await zip.file('word/document.xml').async('string');
      assert.ok(docXml.includes('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'));
      assert.ok(docXml.includes('<w:tbl>'), 'DOCX must contain real Word tables');
      assert.ok(docXml.includes('Ký và ghi rõ họ tên'), 'DOCX must contain signature block');

      // Dynamic Excel honoring selected checkboxes (only CRM + KPI checked)
      const xlsRes = await reqJson(
        baseUrl, 'GET',
        '/api/reports/export/xlsx?intakeYear=2027&periodType=year&includeCRM=true&includeKPI=true&includeRegional=false&includeBGH=false&includeTasks=false&includeOutsideSupport=false',
        { token: adminToken }
      );
      assert.strictEqual(xlsRes.status, 200);
      const wb = XLSX.read(xlsRes.raw, { type: 'buffer' });
      assert.deepStrictEqual(wb.SheetNames, ['Tong_Quan', 'CRM_Trong_Ky', 'Tien_Do_KPI']);

      // Honest email notification status (NO SMTP configured -> status='prepared', NEVER 'sent')
      const ntf = await reqJson(baseUrl, 'POST', '/api/notifications', {
        token: adminToken,
        body: { channel: 'email', recipient_name: 'Tô Nhựt Điển', recipient_address: 'dien.tn@itc.edu.vn', subject: 'Nhắc tiến độ', body: 'Nội dung nhắc' }
      });
      assert.strictEqual(ntf.status, 201);
      assert.strictEqual(ntf.data.job.status, 'prepared', 'Without SMTP must NOT falsely claim sent!');

      return 'Valid OOXML DOCX unpacked, Excel dynamic sheets exact, Email status=prepared';
    });

    // 15. Dynamic Staff Creation, Rename Without Data Loss & Handover Attribution
    await scenario(15, 'Thêm nhân sự động, đổi tên không mất dữ liệu & bàn giao giữ thành tích mốc cũ', async () => {
      // Create new consultant
      const newUsr = await reqJson(baseUrl, 'POST', '/api/admin/users', {
        token: adminToken,
        body: { full_name: 'Phạm Quốc Huy', email: 'huy.pq@itc.edu.vn', password: 'ItcStaff@2027!', role: 'consultant', scope: 'own', zalo_slot: 'Zalo 5' }
      });
      assert.strictEqual(newUsr.status, 201);
      const huyStaffId = newUsr.data.user.staff_id;
      assert.ok(huyStaffId);

      // Create reg assigned to stf_1, record submitted milestone under stf_1, then handover to Huy!
      const rHov = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Thí sinh Bàn Giao', student_phone: '0907778899', intake_year: '2028', assigned_staff_id: 'stf_1', source_received_at: '2028-01-10T03:00:00.000Z', crm_received_at: '2028-01-10T03:00:00.000Z' }
      });
      const rId = rHov.data.record.id;
      await reqJson(baseUrl, 'POST', `/api/registrations/${rId}/milestones`, {
        token: adminToken,
        body: { milestone_type: 'submitted', occurred_at: '2028-01-15T03:00:00.000Z', evidence_note: 'Nộp HS trước bàn giao' }
      });

      const hov = await reqJson(baseUrl, 'POST', `/api/registrations/${rId}/handover`, {
        token: adminToken,
        body: { to_staff_id: huyStaffId, reason: 'Phân bổ lại tuyến' }
      });
      assert.strictEqual(hov.status, 200);
      assert.strictEqual(hov.data.record.assigned_staff_id, huyStaffId);

      // Rename Huy -> verify record still belongs to huyStaffId with new display name!
      await reqJson(baseUrl, 'PATCH', `/api/admin/staff/${huyStaffId}`, {
        token: adminToken,
        body: { full_name: 'Phạm Quốc Huy (KTV)', zalo_slot: 'Zalo 5B' }
      });
      const detail = await reqJson(baseUrl, 'GET', `/api/registrations/${rId}`, { token: adminToken });
      assert.strictEqual(detail.data.record.staff_name, 'Phạm Quốc Huy (KTV)');
      assert.strictEqual(detail.data.handovers.length, 1);

      // Verify KPI: prior submitted milestone in 2028-01 stays attributed to stf_1, NOT rewritten to Huy!
      const kJan = await reqJson(baseUrl, 'GET', '/api/kpi?intakeYear=2028&monthKey=2028-01&cutoffIso=2028-12-01T00:00:00.000Z', { token: adminToken });
      const s1Row = kJan.data.staffRows.find(s => s.staff_id === 'stf_1');
      const huyRow = kJan.data.staffRows.find(s => s.staff_id === huyStaffId);
      assert.ok(huyRow, 'Newly created staff must appear dynamically in KPI');
      assert.strictEqual(huyRow.full_name, 'Phạm Quốc Huy (KTV)');
      assert.strictEqual(s1Row.monthActual.submitted, 1, 'Historical submitted milestone stays credited to stf_1 after handover');
      assert.strictEqual(huyRow.monthActual.submitted, 0);

      return 'Dynamic staff assignable & in KPI, rename preserved links, handover kept prior KPI attribution';
    });

    // 16. Live Multi-Tab WS Presence Dedup, E2E Latency, Security Headers, Restart Persistence
    await scenario(16, 'Vận hành thực tế: Đa tab WS, Presence chống đếm trùng, Độ trễ, Health & Restart', async () => {
      // Open 2 WS connections for admin + 1 for staff1 -> 2 unique onlineUsers, 3 totalConnections!
      const wAdm1 = await connectWs(port, adminToken);
      const wAdm2 = await connectWs(port, adminToken);
      const wStf1 = await connectWs(port, staff1Token);

      const pres = await waitFor(() => {
        const last = [...wAdm1.messages].reverse().find(m => m.type === 'presence' && m.totalConnections === 3);
        return last;
      });
      assert.strictEqual(pres.onlineUsers, 2, 'Two tabs of same user must count as 1 onlineUser');
      assert.strictEqual(pres.totalConnections, 3);

      // Measure E2E commit + WS broadcast latency
      const t0 = Date.now();
      const created = await reqJson(baseUrl, 'POST', '/api/registrations', {
        token: adminToken,
        body: { full_name: 'Latency Probe', student_phone: '0906123123', intake_year: '2029', assigned_staff_id: 'stf_1' }
      });
      await waitFor(() => wStf1.messages.some(m => m.type === 'domain_event' && m.id === created.data.record.id));
      const e2eMs = Date.now() - t0;

      // Health check & static security headers & traversal block
      const health = await reqJson(baseUrl, 'GET', '/api/health', { token: adminToken });
      assert.strictEqual(health.status, 200);
      assert.strictEqual(health.data.status, 'healthy');
      assert.strictEqual(health.data.db.ok, true);

      const pageRes = await reqJson(baseUrl, 'GET', '/');
      assert.strictEqual(pageRes.status, 200);
      assert.ok(pageRes.headers['content-security-policy'].includes("script-src 'self'"));
      const travRes = await reqJson(baseUrl, 'GET', '/..%2fserver.js');
      assert.ok(travRes.status === 403 || travRes.status === 404, 'Path traversal must be blocked');

      wAdm1.ws.close(); wAdm2.ws.close(); wStf1.ws.close();

      // Stop and restart server on SAME SQLite file -> data persists!
      const savedId = created.data.record.id;
      await app.stop();
      app = createAppServer({ port: 0, host: '127.0.0.1', dataDir: tmpDir, backupDir, dbPath, disableScheduledBackup: true });
      const restarted = await app.start();
      const restartedUrl = `http://127.0.0.1:${restarted.port}`;

      // Existing session still valid & record persisted across restart!
      const afterRestart = await reqJson(restartedUrl, 'GET', `/api/registrations/${savedId}`, { token: adminToken });
      assert.strictEqual(afterRestart.status, 200);
      assert.strictEqual(afterRestart.data.record.full_name, 'Latency Probe');

      return `Presence 2 users / 3 tabs, E2E commit+WS latency=${e2eMs}ms, CSP & restart persistence OK`;
    });

    console.log(`\n=== KET QUA: ${results.filter(r => r.pass).length}/16 TINH HUONG NGHIEM THU DAT 100% ===\n`);
  } finally {
    try { await app.stop(); } catch (_) {}
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  }
}

runAll().catch((err) => {
  console.error('\nTEST SUITE FAILED:', err.message);
  process.exit(1);
});
