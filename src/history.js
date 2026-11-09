export const HISTORY_STORAGE_KEY = 'moveeasy.quote-history';
export const HISTORY_VERSION = 1;

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isStringArray = value => Array.isArray(value) && value.every(item => typeof item === 'string');

export function isValidHistoryRecord(record) {
  if (!isObject(record)) return false;
  if (!['id', 'createdAt', 'updatedAt'].every(key => typeof record[key] === 'string' && record[key])) return false;
  if (!Number.isInteger(record.lastCompletedStep) || record.lastCompletedStep < 1 || record.lastCompletedStep > 4) return false;
  if (!isObject(record.form) || !isStringArray(record.form.special)) return false;
  if (record.selectedCompanyId !== null && typeof record.selectedCompanyId !== 'string') return false;
  if (typeof record.message !== 'string' || typeof record.quoteDraft !== 'string') return false;
  if (typeof record.activeExample !== 'string') return false;
  if (record.parsedQuote !== null && !isObject(record.parsedQuote)) return false;
  if (!Array.isArray(record.quotes) || !record.quotes.every(isObject)) return false;
  return !Number.isNaN(Date.parse(record.createdAt)) && !Number.isNaN(Date.parse(record.updatedAt));
}

export function readHistory(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const envelope = JSON.parse(raw);
    if (!isObject(envelope) || envelope.version !== HISTORY_VERSION || !Array.isArray(envelope.records)) return [];
    return envelope.records.every(isValidHistoryRecord) ? envelope.records : [];
  } catch {
    return [];
  }
}

export function writeHistory(records, storage = globalThis.localStorage) {
  try {
    storage?.setItem(HISTORY_STORAGE_KEY, JSON.stringify({ version: HISTORY_VERSION, records }));
    return true;
  } catch {
    return false;
  }
}

export function createRecordId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `request-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildRecordSnapshot(existing, state, now = new Date().toISOString()) {
  const previousStep = existing?.lastCompletedStep ?? 1;
  return {
    id: existing?.id ?? createRecordId(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    lastCompletedStep: Math.max(previousStep, Math.min(4, Math.max(1, state.step))),
    form: structuredClone(state.form),
    selectedCompanyId: state.selectedCompanyId ?? null,
    message: state.message,
    quoteDraft: state.quoteDraft,
    activeExample: state.activeExample,
    parsedQuote: state.parsedQuote ? structuredClone(state.parsedQuote) : null,
    quotes: structuredClone(state.quotes),
  };
}
