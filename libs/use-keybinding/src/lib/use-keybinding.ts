import {useWindowEvent} from "@dgaa/native-event-hooks";

export type UseKeybindingOptions = {
  cancelInInputs?: boolean;
  useInAppStates?: string[];
  currentAppState?: string;
};

export function useKeybinding(keybinding: string, callback: (e: KeyboardEvent) => void, {
  cancelInInputs = false,
  useInAppStates = ['default'],
  currentAppState = 'default'
}: UseKeybindingOptions = {}, deps: any[] = []) {

  const appState = currentAppState;

  function keysMatch(key: string, e: KeyboardEvent) {
    if (caseInsensitiveEquals(key, 'delete') && caseInsensitiveEquals(e.key, 'backspace')) {
      return true;
    }

    if (caseInsensitiveEquals(key, 'shift') && e.shiftKey) {
      return true;
    }

    if (caseInsensitiveEquals(key, 'cmd') && (e.ctrlKey || e.metaKey)) {
      return true;
    }

    return caseInsensitiveEquals(key, e.key);
  }

  function valueMatches(e: KeyboardEvent) {
    const keys = keybinding?.split('-') ?? [];

    if (!['delete', 'shift', 'cmd'].includes(keys[0])) {
      if (e.shiftKey || e.ctrlKey || e.metaKey) {
        return false;
      }
    }

    if (keys.includes('cmd') && !keys.includes('shift')) {
      if (e.shiftKey) {
        return false;
      }
    }

    return keys.length > 0 && keys.every((key) => keysMatch(key, e));
  }

  useWindowEvent('keydown', (e: KeyboardEvent) => {
    if (cancelInInputs && ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
      return;
    }

    if (valueMatches(e) && useInAppStates.includes(appState)) {
      callback(e);
    }
  }, [keybinding, callback, useInAppStates, currentAppState, cancelInInputs, ...deps]);
}

function caseInsensitiveEquals(str1: string, str2: string) {
  if (str1 == null) {
    return false;
  }

  return str1.localeCompare(str2, undefined, {sensitivity: 'base'}) === 0;
}
