import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const { nativeTheme } = window.require('electron').remote;

function useTheme() {
  const [theme, set, remove] = useLocalStorage('theme', 'system');
  useEffect(() => {
    nativeTheme.themeSource = theme;
  }, [theme]);
  return [theme, set, remove];
}

export default useTheme;
