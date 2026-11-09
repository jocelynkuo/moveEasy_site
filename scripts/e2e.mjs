const targets = await fetch('http://127.0.0.1:9223/json').then(response => response.json());
const page = targets.find(target => target.type === 'page' && target.url.startsWith('http://127.0.0.1:5174'));
if (!page) throw new Error('MoveEasy page target not found');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let requestId = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function send(method, params = {}) {
  const id = ++requestId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? 'Browser evaluation failed');
  return result.result.value;
}

const run = body => evaluate(`(async () => { ${body} })()`);
const reload = async () => {
  await send('Page.reload', { ignoreCache: true });
  await new Promise(resolve => setTimeout(resolve, 350));
};

await run(`
  localStorage.clear();
  return true;
`);
await reload();

const result = await run(`
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const buttons = () => [...document.querySelectorAll('button')];
  const button = text => buttons().find(item => item.textContent.includes(text));
  const click = async text => { const target = button(text); if (!target) throw new Error('Missing button: ' + text); target.click(); await sleep(80); };
  const setInput = (element, value) => {
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value').set;
    setter.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const stored = () => JSON.parse(localStorage.getItem('moveeasy.quote-history'));

  await click('詢價紀錄');
  assert(document.body.textContent.includes('還沒有詢價紀錄'), 'Fresh history did not show empty state');
  assert(!document.querySelector('.progress-wrap'), 'History rendered inside numbered progress');
  await click('建立搬家需求');
  await click('查看推薦業者');
  assert(stored().records.length === 1, 'Valid submit did not create exactly one record');
  const firstId = stored().records[0].id;

  await click('查看聯絡與詢價');
  const message = document.querySelector('.message-card textarea');
  setInput(message, message.value + '\\n測試保留內容');
  await sleep(80);
  await click('我已取得報價');
  const quoteDraft = document.querySelector('.input-panel textarea');
  setInput(quoteDraft, '橘子搬家測試報價 4000 元');
  await click('開始模擬辨識');
  await click('確認並加入比較');
  setInput(document.querySelector('.input-panel textarea'), '尚未送出的草稿');
  await sleep(80);
  await click('返回推薦業者');
  assert(stored().records.length === 1, 'Returning to recommendations duplicated the record');
  assert(stored().records[0].quotes.length === 1, 'Confirmed quote was not persisted');

  await click('查看聯絡與詢價');
  assert(document.querySelector('.message-card textarea').value.includes('測試保留內容'), 'Edited message was not preserved');
  await click('我已取得報價');
  assert(document.querySelector('.input-panel textarea').value === '尚未送出的草稿', 'Quote draft was not restored');
  assert(document.body.textContent.includes('1 份報價已加入比較'), 'Confirmed quote disappeared after navigation');
  await click('前往比較');
  assert(document.body.textContent.includes('報價差異，一眼看清楚'), 'Comparison stage did not open');
  await click('返回推薦業者');

  await click('詢價紀錄');
  const firstCard = [...document.querySelectorAll('.history-card')].find(card => card.querySelector('button'));
  assert(firstCard && firstCard.textContent.includes('1 份已確認報價'), 'History summary did not show quote count');
  await click('建立新的搬家需求');
  setInput(document.querySelector('input[placeholder="例如：大安區"]'), '信義區');
  await click('查看推薦業者');
  assert(stored().records.length === 2, 'Second request was not created');
  const secondId = stored().records.find(record => record.id !== firstId).id;
  await click('詢價紀錄');
  const cards = [...document.querySelectorAll('.history-card')];
  assert(cards.length === 2, 'History did not list both records');
  assert(cards[0].textContent.includes('信義區'), 'History was not ordered newest first');
  cards[0].querySelector('button').click();
  await sleep(80);
  assert(document.body.textContent.includes('找到') && document.body.textContent.includes('符合條件的業者'), 'Recommendation-stage record did not resume at recommendations');
  assert(document.querySelector('input[placeholder="例如：大安區"]') === null, 'Recommendation-stage resume opened the wrong stage');
  await click('詢價紀錄');
  const older = [...document.querySelectorAll('.history-card')].find(card => !card.textContent.includes('信義區'));
  older.querySelector('button').click();
  await sleep(80);
  assert(document.body.textContent.includes('報價差異，一眼看清楚'), 'Later-stage record did not resume at its latest stage');
  assert(document.body.textContent.includes('橘子搬家'), 'Resumed quote data was missing');

  return { firstId, secondId };
`);

await reload();
const reloaded = await run(`
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const find = text => [...document.querySelectorAll('button')].find(item => item.textContent.includes(text));
  find('詢價紀錄').click(); await sleep(60);
  const cards = [...document.querySelectorAll('.history-card')];
  const newer = cards.find(card => card.textContent.includes('信義區'));
  const older = cards.find(card => !card.textContent.includes('信義區'));
  const bothPresent = cards.length === 2;
  newer.querySelector('button').click(); await sleep(60);
  const recommendationRestored = document.body.textContent.includes('符合條件的業者');
  find('詢價紀錄').click(); await sleep(60);
  [...document.querySelectorAll('.history-card')].find(card => !card.textContent.includes('信義區')).querySelector('button').click(); await sleep(60);
  const comparisonRestored = document.body.textContent.includes('報價差異，一眼看清楚');
  localStorage.setItem('moveeasy.quote-history', '{malformed');
  return { bothPresent, recommendationRestored, comparisonRestored };
`);
if (!Object.values(reloaded).every(Boolean)) throw new Error('Reload/resume verification failed: ' + JSON.stringify(reloaded));

await reload();
const malformed = await run(`
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const find = text => [...document.querySelectorAll('button')].find(item => item.textContent.includes(text));
  find('詢價紀錄').click(); await sleep(60);
  const empty = document.body.textContent.includes('還沒有詢價紀錄');
  find('建立搬家需求').click(); await sleep(60);
  const usable = Boolean(find('查看推薦業者'));
  localStorage.setItem('moveeasy.quote-history', JSON.stringify({ version: 999, records: [] }));
  return { empty, usable };
`);
if (!malformed.empty || !malformed.usable) throw new Error('Malformed storage fallback failed');

await reload();
await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 720, deviceScaleFactor: 1, mobile: true });
const responsive = await run(`
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const history = [...document.querySelectorAll('button')].find(item => item.textContent.includes('詢價紀錄'));
  const visible = history && history.getBoundingClientRect().width > 0;
  history.click(); await sleep(60);
  return { visible, scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth, empty: document.body.textContent.includes('還沒有詢價紀錄') };
`);
if (!responsive.visible || responsive.scrollWidth > 320 || responsive.viewport !== 320 || !responsive.empty) {
  throw new Error('320px responsive or unsupported-version fallback check failed: ' + JSON.stringify(responsive));
}

await send('Emulation.clearDeviceMetricsOverride');
socket.close();
console.log(JSON.stringify({ flow: result, reloaded, malformed, responsive }, null, 2));
