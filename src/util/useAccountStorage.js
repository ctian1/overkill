import useLocalStorage from './useLocalStorage';

function useAccountStorage() {
  return useLocalStorage('accounts', []);
}

export default useAccountStorage;
