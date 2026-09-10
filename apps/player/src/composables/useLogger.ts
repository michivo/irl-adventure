import { reactive, readonly } from 'vue';

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  id: number;
  level: LogLevel;
  source: string;
  message: string;
  timestamp: Date;
}

const MAX_LOG_ENTRIES = 200;

// Module-scoped state so every caller (components and plain composables) shares the same log.
const entries = reactive<LogEntry[]>([]);
let nextId = 0;

function addEntry(level: LogLevel, source: string, message: string) {
  entries.push({ id: nextId++, level, source, message, timestamp: new Date() });
  if (entries.length > MAX_LOG_ENTRIES) {
    entries.splice(0, entries.length - MAX_LOG_ENTRIES);
  }
  console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](`[${source}]`, message);
}

export function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function useLogger(source: string) {
  return {
    logInfo: (message: string) => addEntry('info', source, message),
    logWarn: (message: string) => addEntry('warn', source, message),
    logError: (message: string) => addEntry('error', source, message),
  };
}

export function useLogEntries() {
  return readonly(entries);
}

export function clearLogEntries() {
  entries.splice(0, entries.length);
}
