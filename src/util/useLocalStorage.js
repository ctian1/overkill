// https://github.com/streamich/react-use/blob/master/src/useLocalStorage.ts
import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const localValue = localStorage.getItem(key);
      if (localValue == null) {
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      return JSON.parse(localValue);
    } catch {
      return initialValue;
    }
  });

  const set = (valOrFunc) => {
    try {
      const newState = typeof valOrFunc === 'function' ? (valOrFunc)(state) : valOrFunc;
      if (typeof newState === 'undefined') return;

      const value = JSON.stringify(newState);

      localStorage.setItem(key, value);
      setState(newState);
    } catch {
      //
    }
  };

  const remove = () => {
    localStorage.removeItem(key);
    setState(undefined);
  };

  return [state, set, remove];
}

export default useLocalStorage;
