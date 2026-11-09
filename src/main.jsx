import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft, ArrowRight, Box, Building2, CalendarDays, Check, CheckCircle2,
  ChevronRight, Clipboard, Clock3, Edit3, ExternalLink, FileText, Home,
  Info, LineChart, MapPin, MessageCircle, PackageCheck, Phone, Plus,
  ShieldCheck, Sparkles, Star, Trash2, Truck, Upload, X
} from './icons.jsx';
import './styles.css';
import { buildRecordSnapshot, readHistory, writeHistory } from './history.js';

const steps = [
  { label: '搬家需求', short: '需求', icon: Home },
  { label: '推薦業者', short: '推薦', icon: Truck },
  { label: '聯絡詢價', short: '詢價', icon: MessageCircle },
  { label: '整理報價', short: '報價', icon: FileText },
  { label: '比較方案', short: '比較', icon: LineChart },
];

const companies = [
  {
    id: 'orange', name: '橘子搬家', initials: '橘', color: '#f47b4d', rating: '4.9', jobs: '328',
    desc: '專注台北、新北小型搬家與租屋族需求，提供紙箱租借與基本家具防護。',
    areas: ['台北市', '新北市'], types: ['套房搬家', '小家庭'], services: ['大型家具', '紙箱租借'],
    phone: '02-2345-6789', line: '@orange-moving', response: '約 10 分鐘回覆'
  },
  {
    id: 'ant', name: '螞蟻快搬', initials: '蟻', color: '#2f6672', rating: '4.8', jobs: '216',
    desc: '彈性快速的小型搬運團隊，擅長窄巷、公寓無電梯與少量急件。',
    areas: ['台北市', '新北市', '桃園市'], types: ['套房搬家', '少量搬運'], services: ['無電梯搬運', '大型家具'],
    phone: '02-2766-3018', line: '@antgo', response: '約 30 分鐘回覆'
  },
  {
    id: 'good', name: '好日子搬運', initials: '好', color: '#d4a64f', rating: '4.7', jobs: '184',
    desc: '重視物品包裝與溝通，適合在意家具保護及週末搬家的使用者。',
    areas: ['台北市', '新北市'], types: ['套房搬家', '小家庭'], services: ['大型家具', '易碎物品'],
    phone: '', line: '@gooddaymove', response: '約 1 小時回覆'
  }
];

const initialForm = {
  date: '2026-12-12', fromCity: '台北市', fromDistrict: '大安區', toCity: '新北市',
  toDistrict: '板橋區', size: '套房搬家', boxes: '10', items: '單人床墊、書桌、辦公椅、三層櫃',
  fromFloor: '4', fromElevator: '無電梯', toFloor: '8', toElevator: '有電梯', special: ['大型家具'], note: ''
};

const quoteExamples = {
  orange: `橘子搬家報價：基本車資 3,200 元，含 1.75 噸貨車一車、2 位搬運人員及家具防護。大安區 4 樓無電梯加收 800 元。總計 4,000 元。若現場超出一車另計。`,
  ant: `您好，螞蟻快搬估價總額 NT$3,800，包含貨車一車、兩位師傅、上下車搬運。樓層費已含，床墊套免費。停車費依現場實支，是否含拆裝需再確認。`
};

const parsedExamples = {
  orange: { id: 'q1', company: '橘子搬家', total: 4000, included: ['1.75 噸貨車一車', '2 位搬運人員', '家具基礎防護'], extra: ['超出一車另計'], pending: ['停車費是否另計'], confirmed: false },
  ant: { id: 'q2', company: '螞蟻快搬', total: 3800, included: ['貨車一車', '2 位搬運人員', '樓層費', '床墊套'], extra: ['停車費依現場實支'], pending: ['家具拆裝是否包含'], confirmed: false }
};

function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [quoteText, setQuoteText] = useState('');
  const [activeExample, setActiveExample] = useState('orange');
  const [parsed, setParsed] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [editingQuote, setEditingQuote] = useState(null);
  const [records, setRecords] = useState(() => readHistory());
  const [activeRecordId, setActiveRecordId] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const matches = useMemo(() => companies.filter(c =>
    c.areas.includes(form.fromCity) && c.areas.includes(form.toCity) &&
    (!form.special.length || form.special.every(s => c.services.includes(s)))
  ), [form]);

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const toggleSpecial = value => setForm(f => ({
    ...f, special: f.special.includes(value) ? f.special.filter(x => x !== value) : [...f.special, value]
  }));

  const snapshotState = currentStep => ({
    step: currentStep,
    form,
    selectedCompanyId: selectedCompany?.id ?? null,
    message,
    quoteDraft: quoteText,
    activeExample,
    parsedQuote: parsed,
    quotes,
  });

  const persistActive = (currentStep = step) => {
    if (!activeRecordId) return;
    setRecords(current => {
      const existing = current.find(record => record.id === activeRecordId);
      if (!existing) return current;
      const updated = buildRecordSnapshot(existing, snapshotState(currentStep));
      const next = current.map(record => record.id === activeRecordId ? updated : record);
      writeHistory(next);
      return next;
    });
  };

  useEffect(() => {
    persistActive(step);
  }, [activeRecordId, step, form, selectedCompany, message, quoteText, activeExample, parsed, quotes]);

  const validate = () => {
    const next = {};
    if (!form.date) next.date = '請選擇搬家日期';
    if (!form.fromCity || !form.fromDistrict) next.from = '請填寫搬出區域';
    if (!form.toCity || !form.toDistrict) next.to = '請填寫搬入區域';
    if (!form.size) next.size = '請選擇搬家規模';
    if (!form.boxes && !form.items.trim()) next.items = '請至少填寫箱數或物品';
    setErrors(next);
    if (!Object.keys(next).length) {
      if (activeRecordId) {
        persistActive(1);
      } else {
        const record = buildRecordSnapshot(null, snapshotState(1));
        setRecords(current => {
          const nextRecords = [...current, record];
          writeHistory(nextRecords);
          return nextRecords;
        });
        setActiveRecordId(record.id);
      }
      setStep(1);
    }
  };

  const makeMessage = company => {
    const special = form.special.length ? form.special.join('、') : '無';
    const text = `您好，我想詢問 ${form.date.replaceAll('-', '/')} 的搬家報價：\n\n・搬出：${form.fromCity}${form.fromDistrict}，${form.fromFloor || '未提供'} 樓（${form.fromElevator}）\n・搬入：${form.toCity}${form.toDistrict}，${form.toFloor || '未提供'} 樓（${form.toElevator}）\n・規模：${form.size}，約 ${form.boxes || '未提供'} 箱\n・主要物品：${form.items || '未提供'}\n・特殊需求：${special}${form.note ? `\n・備註：${form.note}` : ''}\n\n想請問預估總價、包含的服務與可能的額外費用，謝謝！`;
    setSelectedCompany(company);
    if (selectedCompany?.id !== company.id || !message) setMessage(text);
    setStep(2); setCopied(false);
  };

  const copyMessage = async () => {
    try { await navigator.clipboard.writeText(message); } catch { /* preview may block clipboard */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  const analyzeQuote = () => {
    if (!quoteText.trim()) return;
    const base = parsedExamples[activeExample];
    setParsed({ ...base, id: `${base.id}-${Date.now()}` });
  };

  const saveQuote = quote => {
    const confirmed = { ...quote, confirmed: true };
    setQuotes(prev => [...prev.filter(q => q.company !== quote.company), confirmed]);
    setParsed(null); setQuoteText(''); setEditingQuote(null);
  };

  const returnToRecommendations = () => {
    persistActive(1);
    setStep(1);
  };

  const openHistory = () => {
    persistActive(step);
    setHistoryOpen(true);
  };

  const resetWorkflow = () => {
    setStep(0);
    setForm(structuredClone(initialForm));
    setErrors({});
    setSelectedCompany(companies[0]);
    setMessage('');
    setCopied(false);
    setQuoteText('');
    setActiveExample('orange');
    setParsed(null);
    setQuotes([]);
    setEditingQuote(null);
    setActiveRecordId(null);
    setHistoryOpen(false);
  };

  const restoreRecord = record => {
    setForm(structuredClone(record.form));
    setSelectedCompany(companies.find(company => company.id === record.selectedCompanyId) ?? companies[0]);
    setMessage(record.message);
    setQuoteText(record.quoteDraft);
    setActiveExample(record.activeExample);
    setParsed(record.parsedQuote ? structuredClone(record.parsedQuote) : null);
    setQuotes(structuredClone(record.quotes));
    setEditingQuote(null);
    setErrors({});
    setActiveRecordId(record.id);
    setStep(record.lastCompletedStep);
    setHistoryOpen(false);
  };

  return (
    <div className="app-shell">
      <Header onHistory={openHistory} historyOpen={historyOpen} />
      {!historyOpen && <Progress step={step} setStep={setStep} />}
      <main>
        {historyOpen ? <History records={records} onResume={restoreRecord} onNew={resetWorkflow} /> : <>
          {step === 0 && <RequestForm form={form} update={update} toggleSpecial={toggleSpecial} errors={errors} onNext={validate} />}
          {step === 1 && <Recommendations matches={matches} form={form} onEdit={() => setStep(0)} onSelect={makeMessage} />}
          {step === 2 && <Contact company={selectedCompany} message={message} setMessage={setMessage} copied={copied} onCopy={copyMessage} onBack={returnToRecommendations} onNext={() => setStep(3)} />}
          {step === 3 && <QuoteOrganizer quoteText={quoteText} setQuoteText={setQuoteText} activeExample={activeExample} setActiveExample={setActiveExample} parsed={parsed} setParsed={setParsed} quotes={quotes} onAnalyze={analyzeQuote} onSave={saveQuote} editingQuote={editingQuote} setEditingQuote={setEditingQuote} onCompare={() => setStep(4)} onBack={returnToRecommendations} />}
          {step === 4 && <Comparison quotes={quotes} setQuotes={setQuotes} onAdd={() => setStep(3)} onRestart={resetWorkflow} onBack={returnToRecommendations} />}
        </>}
      </main>
      <Footer />
    </div>
  );
}

function Header({ onHistory, historyOpen }) {
  return <header className="topbar">
    <button className="brand brand-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="MoveEasy 首頁"><span className="brand-mark"><Truck size={22} /></span><span>Move<span>Easy</span></span></button>
    <div className="prototype-badge"><Sparkles size={14} /> MVP 測試版</div>
    <div className="header-actions"><div className="help"><ShieldCheck size={16} /> 不需填寫真實個資</div><button className={`history-action ${historyOpen ? 'active' : ''}`} onClick={onHistory}><Clock3 size={17} /> 詢價紀錄</button></div>
  </header>;
}

function Progress({ step, setStep }) {
  return <nav className="progress-wrap" aria-label="搬家詢價進度"><div className="progress">
    {steps.map((s, i) => { const Icon = s.icon; const done = i < step; return <React.Fragment key={s.label}>
      <button className={`progress-step ${i === step ? 'active' : ''} ${done ? 'done' : ''}`} onClick={() => i < step && setStep(i)} disabled={i > step}>
        <span className="step-dot">{done ? <Check size={16}/> : <Icon size={17}/>}</span><span className="step-name">{s.label}</span><span className="step-short">{s.short}</span>
      </button>{i < steps.length - 1 && <span className={`step-line ${i < step ? 'done' : ''}`} />}
    </React.Fragment>})}
  </div></nav>;
}

function PageIntro({ eyebrow, title, text }) { return <div className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>; }
function Field({ label, required, error, children, hint }) { return <label className={`field ${error ? 'has-error' : ''}`}><span className="field-label">{label}{required && <b>*</b>}</span>{children}{hint && <small>{hint}</small>}{error && <small className="error-text">{error}</small>}</label>; }
function BackControl({ children, onClick }) { return <button className="page-back" onClick={onClick}><ArrowLeft size={18}/><span>{children}</span></button>; }

function History({ records, onResume, onNew }) {
  const sorted = [...records].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const dateTime = new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short' });
  return <section className="container history-view">
    <PageIntro eyebrow="儲存在此瀏覽器" title="詢價紀錄" text="回到先前的搬家需求，繼續聯絡業者、整理報價或比較方案。" />
    {sorted.length ? <div className="history-grid">{sorted.map(record => <article className="card history-card" key={record.id}>
      <div className="history-card-head"><span className="history-date"><CalendarDays size={17}/>{record.form.date}</span><span className={`status-badge stage-${record.lastCompletedStep}`}>{steps[record.lastCompletedStep]?.label ?? '推薦業者'}</span></div>
      <h2>{record.form.fromCity}{record.form.fromDistrict} <ArrowRight size={17}/> {record.form.toCity}{record.form.toDistrict}</h2>
      <div className="history-meta"><span><LineChart size={16}/> 進度：{record.lastCompletedStep + 1} / 5</span><span><FileText size={16}/> {record.quotes.length} 份已確認報價</span><span><Clock3 size={16}/> 更新於 {dateTime.format(new Date(record.updatedAt))}</span></div>
      <button className="primary full" onClick={() => onResume(record)}>繼續這筆詢價 <ArrowRight size={17}/></button>
    </article>)}</div> : <div className="empty-state history-empty"><span><Clock3 size={34}/></span><h2>還沒有詢價紀錄</h2><p>完成搬家需求並查看推薦業者後，紀錄就會安全地保存在這個瀏覽器。</p><button className="primary" onClick={onNew}><Plus size={17}/> 建立搬家需求</button></div>}
    {sorted.length > 0 && <div className="action-row center"><button className="secondary" onClick={onNew}><Plus size={17}/> 建立新的搬家需求</button></div>}
  </section>;
}

function RequestForm({ form, update, toggleSpecial, errors, onNext }) {
  const cityOptions = ['台北市', '新北市', '桃園市'];
  return <section className="container narrow">
    <PageIntro eyebrow="STEP 1 / 5" title="先告訴我們，這次要怎麼搬？" text="大約 2 分鐘完成。你的資訊只會用來篩選適合的模擬業者與產生詢價內容。" />
    <div className="card form-card">
      <div className="section-title"><span><CalendarDays /></span><div><h2>搬家時間</h2><p>先確認預計日期</p></div></div>
      <div className="form-grid one"><Field label="搬家日期" required error={errors.date}><input type="date" value={form.date} onChange={e => update('date', e.target.value)} /></Field></div>
      <hr />
      <div className="section-title"><span><MapPin /></span><div><h2>起訖地點</h2><p>區域即可，不需要詳細地址</p></div></div>
      <div className="route-grid">
        <div className="route-point"><i>A</i><div className="form-grid two"><Field label="搬出縣市" required><select value={form.fromCity} onChange={e => update('fromCity', e.target.value)}>{cityOptions.map(x => <option key={x}>{x}</option>)}</select></Field><Field label="行政區" required error={errors.from}><input value={form.fromDistrict} onChange={e => update('fromDistrict', e.target.value)} placeholder="例如：大安區" /></Field></div></div>
        <div className="route-dash" />
        <div className="route-point destination"><i>B</i><div className="form-grid two"><Field label="搬入縣市" required><select value={form.toCity} onChange={e => update('toCity', e.target.value)}>{cityOptions.map(x => <option key={x}>{x}</option>)}</select></Field><Field label="行政區" required error={errors.to}><input value={form.toDistrict} onChange={e => update('toDistrict', e.target.value)} placeholder="例如：板橋區" /></Field></div></div>
      </div>
      <hr />
      <div className="section-title"><span><Box /></span><div><h2>搬運內容</h2><p>概略估算即可，之後可以修改</p></div></div>
      <Field label="搬家規模" required error={errors.size}><div className="choice-row">{['少量搬運', '套房搬家', '小家庭'].map(x => <button type="button" key={x} className={form.size === x ? 'selected' : ''} onClick={() => update('size', x)}><PackageCheck size={18}/>{x}</button>)}</div></Field>
      <div className="form-grid two"><Field label="預估箱數" required><div className="input-suffix"><input type="number" min="0" value={form.boxes} onChange={e => update('boxes', e.target.value)} /><span>箱</span></div></Field><Field label="主要家具與物品" required error={errors.items}><input value={form.items} onChange={e => update('items', e.target.value)} /></Field></div>
      <div className="floor-grid"><FloorGroup title="搬出地點" floor={form.fromFloor} elevator={form.fromElevator} onFloor={v => update('fromFloor', v)} onElevator={v => update('fromElevator', v)} /><FloorGroup title="搬入地點" floor={form.toFloor} elevator={form.toElevator} onFloor={v => update('toFloor', v)} onElevator={v => update('toElevator', v)} /></div>
      <Field label="特殊搬運需求（可複選）"><div className="chip-row">{['大型家具', '易碎物品', '無電梯搬運'].map(x => <button type="button" key={x} className={form.special.includes(x) ? 'chip active' : 'chip'} onClick={() => toggleSpecial(x)}>{form.special.includes(x) && <Check size={14}/>} {x}</button>)}</div></Field>
      <Field label="其他備註" hint="請避免填入姓名、電話或詳細地址"><textarea rows="3" value={form.note} onChange={e => update('note', e.target.value)} placeholder="例如：巷口較窄，希望協助評估車型" /></Field>
    </div>
    <div className="action-row end"><button className="primary" onClick={onNext}>查看推薦業者 <ArrowRight size={18}/></button></div>
  </section>;
}

function FloorGroup({ title, floor, elevator, onFloor, onElevator }) { return <div className="floor-box"><strong>{title}</strong><div><div className="input-suffix"><input type="number" min="1" value={floor} onChange={e => onFloor(e.target.value)} /><span>樓</span></div><select value={elevator} onChange={e => onElevator(e.target.value)}><option>有電梯</option><option>無電梯</option><option>不確定</option></select></div></div>; }

function Recommendations({ matches, form, onEdit, onSelect }) {
  return <section className="container">
    <PageIntro eyebrow="STEP 2 / 5" title={`找到 ${matches.length} 家符合條件的業者`} text="以下依服務區域、搬家規模與特殊需求篩選；推薦不代表品質認證。" />
    <div className="summary-bar"><div><MapPin size={17}/><span>{form.fromCity}{form.fromDistrict}</span><ChevronRight size={15}/><span>{form.toCity}{form.toDistrict}</span></div><div><CalendarDays size={17}/>{form.date}</div><div><Box size={17}/>{form.size}・約 {form.boxes} 箱</div><button onClick={onEdit}><Edit3 size={15}/> 修改需求</button></div>
    {matches.length ? <div className="company-grid">{matches.map((c, i) => <article className="company-card" key={c.id}>
      {i === 0 && <span className="recommend-tag"><Sparkles size={13}/> 條件最完整</span>}
      <div className="company-head"><div className="company-logo" style={{ background: c.color }}>{c.initials}</div><div><h2>{c.name}</h2><p className="rating"><Star size={15} fill="currentColor"/> {c.rating} <span>・{c.jobs} 次服務</span></p></div></div>
      <p className="company-desc">{c.desc}</p>
      <div className="meta"><span>服務區域</span><p>{c.areas.join('、')}</p><span>適合類型</span><p>{c.types.join('、')}</p></div>
      <div className="tag-list">{c.services.map(s => <span key={s}><Check size={12}/>{s}</span>)}</div>
      <div className="response"><Clock3 size={15}/>{c.response}</div>
      <button className="primary full" onClick={() => onSelect(c)}>查看聯絡與詢價 <ArrowRight size={17}/></button>
      <small className="mock-label">模擬業者資料・僅供原型測試</small>
    </article>)}</div> : <div className="empty-state"><span><Truck size={34}/></span><h2>目前沒有完全符合的業者</h2><p>試著調整服務區域或特殊搬運需求，我們不會推薦條件不明的業者。</p><button className="secondary" onClick={onEdit}>返回修改條件</button></div>}
  </section>;
}

function Contact({ company, message, setMessage, copied, onCopy, onBack, onNext }) {
  return <section className="container narrow">
    <BackControl onClick={onBack}>上一頁</BackControl>
    <PageIntro eyebrow="STEP 3 / 5" title="把需求一次說清楚" text="確認訊息後複製到 LINE 或電話聯絡業者；MoveEasy 不會替你自動發送。" />
    <div className="contact-layout">
      <aside className="card contact-card"><div className="company-logo large" style={{ background: company.color }}>{company.initials}</div><h2>{company.name}</h2><span className="mock-label block">模擬業者資料</span><p>{company.desc}</p><hr/>
        <div className="contact-item"><Phone size={18}/><div><small>電話</small><strong>{company.phone || '未提供'}</strong></div>{company.phone && <ExternalLink size={15}/>}</div>
        <div className="contact-item"><MessageCircle size={18}/><div><small>LINE</small><strong>{company.line}</strong></div><ExternalLink size={15}/></div>
        <div className="notice"><Info size={16}/><span>聯絡將在外部管道進行，請自行確認業者身分與報價內容。</span></div>
      </aside>
      <div className="card message-card"><div className="card-heading"><div><span className="eyebrow">詢價訊息</span><h2>已依你的需求產生</h2></div><Edit3 size={19}/></div><textarea value={message} onChange={e => setMessage(e.target.value)} rows="14"/><div className="message-actions"><span><Info size={14}/> 可直接修改文字</span><button className={copied ? 'success-btn' : 'primary'} onClick={onCopy}>{copied ? <CheckCircle2 size={17}/> : <Clipboard size={17}/>} {copied ? '已複製' : '複製詢價訊息'}</button></div></div>
    </div>
    <div className="action-row end"><button className="primary" onClick={onNext}>我已取得報價，下一步 <ArrowRight size={17}/></button></div>
  </section>;
}

function QuoteOrganizer({ quoteText, setQuoteText, activeExample, setActiveExample, parsed, setParsed, quotes, onAnalyze, onSave, editingQuote, setEditingQuote, onCompare, onBack }) {
  const loadExample = key => { setActiveExample(key); setQuoteText(quoteExamples[key]); setParsed(null); };
  return <section className="container">
    <BackControl onClick={onBack}>返回推薦業者</BackControl>
    <PageIntro eyebrow="STEP 4 / 5" title="把零散報價，整理成好比較的格式" text="貼上業者回覆或上傳截圖。此版本使用規則模擬辨識，結果仍需由你確認。" />
    <div className="ai-note"><Sparkles size={19}/><div><strong>模擬 AI 辨識</strong><span>不代表真實 AI 準確度，重要價格與服務內容請務必人工核對。</span></div></div>
    <div className="quote-workspace">
      <div className="card input-panel"><div className="card-heading"><div><span className="eyebrow">01 輸入報價</span><h2>貼上業者回覆</h2></div></div>
        <div className="example-row"><span>快速載入測試資料</span><button className={activeExample === 'orange' ? 'active' : ''} onClick={() => loadExample('orange')}>橘子搬家</button><button className={activeExample === 'ant' ? 'active' : ''} onClick={() => loadExample('ant')}>螞蟻快搬</button></div>
        <textarea rows="11" value={quoteText} onChange={e => setQuoteText(e.target.value)} placeholder="貼上 LINE、簡訊或 Email 收到的報價內容…" />
        <button className="upload-zone" onClick={() => loadExample(activeExample)}><Upload size={23}/><span><strong>或上傳報價截圖</strong><small>原型將載入模擬辨識內容</small></span></button>
        <button className="primary full" disabled={!quoteText.trim()} onClick={onAnalyze}><Sparkles size={17}/> 開始模擬辨識</button>
      </div>
      <div className="card result-panel"><div className="card-heading"><div><span className="eyebrow">02 確認結果</span><h2>辨識出的報價資料</h2></div></div>
        {parsed ? <QuoteEditor quote={parsed} onCancel={() => setParsed(null)} onSave={onSave} /> : <div className="result-placeholder"><span><FileText size={32}/></span><h3>等待辨識報價</h3><p>辨識後的金額、服務與待確認事項會顯示在這裡。</p></div>}
      </div>
    </div>
    {quotes.length > 0 && <div className="saved-quotes"><div className="saved-head"><div><span className="eyebrow">已確認報價</span><h2>{quotes.length} 份報價已加入比較</h2></div><button className="primary" onClick={onCompare}>前往比較 <ArrowRight size={17}/></button></div><div className="saved-list">{quotes.map(q => <div key={q.id}><CheckCircle2 size={19}/><strong>{q.company}</strong><span>NT$ {q.total.toLocaleString()}</span><button onClick={() => setEditingQuote(editingQuote === q.id ? null : q.id)}><Edit3 size={15}/></button>{editingQuote === q.id && <div className="inline-edit"><QuoteEditor quote={q} onCancel={() => setEditingQuote(null)} onSave={onSave}/></div>}</div>)}</div>{quotes.length === 1 && <p className="one-quote"><Info size={15}/> 再新增一份報價，就能並列比較差異。</p>}</div>}
    {quotes.length > 0 && <div className="action-row end"><button className="secondary" onClick={onCompare}>查看目前報價</button></div>}
  </section>;
}

function QuoteEditor({ quote, onCancel, onSave }) {
  const [draft, setDraft] = useState({ ...quote, includedText: quote.included.join('、'), extraText: quote.extra.join('、'), pendingText: quote.pending.join('、') });
  const finish = () => onSave({ ...draft, total: Number(draft.total) || 0, included: splitTags(draft.includedText), extra: splitTags(draft.extraText), pending: splitTags(draft.pendingText) });
  return <div className="quote-editor">
    <Field label="業者名稱"><input value={draft.company} onChange={e => setDraft(d => ({...d, company: e.target.value}))}/></Field>
    <Field label="報價總金額"><div className="money-input"><span>NT$</span><input type="number" value={draft.total} onChange={e => setDraft(d => ({...d, total: e.target.value}))}/></div></Field>
    <Field label="包含的服務"><textarea rows="2" value={draft.includedText} onChange={e => setDraft(d => ({...d, includedText: e.target.value}))}/></Field>
    <Field label="額外費用"><textarea rows="2" value={draft.extraText} onChange={e => setDraft(d => ({...d, extraText: e.target.value}))}/></Field>
    <Field label="待確認事項"><textarea rows="2" value={draft.pendingText} onChange={e => setDraft(d => ({...d, pendingText: e.target.value}))}/></Field>
    <div className="confidence"><Info size={15}/> 金額信心度高・服務細節請人工確認</div>
    <div className="editor-actions"><button className="ghost" onClick={onCancel}>取消</button><button className="primary" onClick={finish}><Check size={17}/> 確認並加入比較</button></div>
  </div>;
}
const splitTags = text => text.split(/[、,，\n]/).map(x => x.trim()).filter(Boolean);

function Comparison({ quotes, setQuotes, onAdd, onRestart, onBack }) {
  const lowest = quotes.length > 1 ? Math.min(...quotes.map(q => q.total)) : null;
  const remove = id => setQuotes(qs => qs.filter(q => q.id !== id));
  return <section className="container">
    <BackControl onClick={onBack}>返回推薦業者</BackControl>
    <div className="complete-icon"><CheckCircle2 size={32}/></div><PageIntro eyebrow="STEP 5 / 5" title="報價差異，一眼看清楚" text={quotes.length > 1 ? '價格只是其中一項，記得一起確認服務範圍、額外費用與未確認事項。' : '目前只有一份報價，仍可查看整理結果；新增另一份後即可並列比較。'} />
    {quotes.length ? <div className="comparison-scroll"><table className="comparison-table"><thead><tr><th>比較項目</th>{quotes.map(q => <th key={q.id}><div><span>{q.company}</span><button aria-label={`刪除 ${q.company}`} onClick={() => remove(q.id)}><Trash2 size={15}/></button></div></th>)}</tr></thead><tbody>
      <tr className="price-row"><td>報價總金額</td>{quotes.map(q => <td key={q.id}><strong>NT$ {q.total.toLocaleString()}</strong>{lowest === q.total && <span className="low-tag">目前最低價</span>}</td>)}</tr>
      <CompareRow title="包含服務" quotes={quotes} field="included" good />
      <CompareRow title="額外費用" quotes={quotes} field="extra" />
      <CompareRow title="待確認事項" quotes={quotes} field="pending" warning />
    </tbody></table></div> : <div className="empty-state"><span><FileText size={34}/></span><h2>還沒有已確認的報價</h2><p>先加入一份報價，再回來查看整理結果。</p></div>}
    {quotes.length === 1 && <div className="single-notice"><Info size={19}/><div><strong>尚不足以比較</strong><span>再整理至少一份其他業者的報價，就能看見價格與服務差異。</span></div><button className="secondary" onClick={onAdd}><Plus size={16}/> 新增報價</button></div>}
    {quotes.length > 1 && <div className="decision-note"><ShieldCheck size={21}/><div><strong>最低價不一定是最適合的選擇</strong><p>預約前請向業者確認樓層費、停車費、家具拆裝、防護方式及臨時加價條件。</p></div></div>}
    <div className="action-row center"><button className="secondary" onClick={onAdd}><Plus size={17}/> 新增其他報價</button><button className="ghost" onClick={onRestart}>重新建立搬家需求</button></div>
  </section>;
}

function CompareRow({ title, quotes, field, good, warning }) { return <tr><td>{title}</td>{quotes.map(q => <td key={q.id}><ul className={warning ? 'warning-list' : ''}>{q[field].length ? q[field].map(x => <li key={x}>{good ? <Check size={14}/> : warning ? <Info size={14}/> : <Plus size={14}/>}<span>{x}</span></li>) : <li><span>未提供</span></li>}</ul></td>)}</tr>; }

function Footer() { return <footer><div className="brand small"><span className="brand-mark"><Truck size={17}/></span><span>Move<span>Easy</span></span></div><p>本服務為 MVP 原型，所有業者、報價與 AI 結果皆為模擬測試資料。</p></footer>; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
