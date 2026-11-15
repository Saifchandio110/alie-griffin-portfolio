import { useSyncExternalStore } from 'react';

export type WelcomeStatus = 'open' | 'leaving' | 'closed';

// Must match the key used by the inline script in WelcomeGate.
export const WELCOME_KEY = 'alie-welcome';

let status: WelcomeStatus = 'open';
let initialised = false;
const listeners = new Set<() => void>();

function init() {
  if (initialised || typeof window === 'undefined') return;
  initialised = true;
  try {
    if (window.sessionStorage.getItem(WELCOME_KEY) === '1') status = 'closed';
  } catch {
    // Storage blocked: the welcome shows once per page load instead.
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function getWelcomeStatus(): WelcomeStatus {
  init();
  return status;
}

export function setWelcomeStatus(next: WelcomeStatus) {
  init();
  status = next;
  if (next !== 'open') {
    try {
      window.sessionStorage.setItem(WELCOME_KEY, '1');
    } catch {
      // ignore
    }
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useWelcomeStatus(): WelcomeStatus {
  return useSyncExternalStore(subscribe, getWelcomeStatus, (): WelcomeStatus => 'open');
}
