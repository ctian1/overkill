import useLocalStorage from './useLocalStorage';

// class AccountStorage {
//   static getAccounts() {
//     return JSON.parse(localStorage.getItem('accounts'));
//   }

//   static getAccount(idx) {
//     return AccountStorage.getAccounts()[idx];
//   }

//   static deleteAccount(idx) {
//     localStorage.setItem('accounts',
//       JSON.stringify(AccountStorage.getAccounts().splice(idx, 1)));
//   }

//   static addAccount(user, pass) {
//     localStorage.setItem('accounts',
//       JSON.stringify(AccountStorage.getAccounts().splice(-1, 0, [user, pass])));
//   }
// }

function useAccountStorage() {
  return useLocalStorage('accounts', []);
}

export default useAccountStorage;
