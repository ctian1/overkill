import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const { ipcRenderer } = require('electron');

function useTheme() {
  const [theme, set, remove] = useLocalStorage('theme', 'system');
  useEffect(() => {
    ipcRenderer.invoke('SET_NATIVE_THEME', theme);
  }, [theme]);
  return [theme, set, remove];
}

export default useTheme;
