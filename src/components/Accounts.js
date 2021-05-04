import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './Accounts.css';
import Loader from './Loader';
import ValorantAPI from '../util/ValorantAPI';

function Accounts(props) {
  const { accountStorage, setAccountStorage, setUser } = props;
  const [activeBlock, setActiveBlock] = useState(null);
  const [loading, setLoading] = useState(false);

  const removeButtons = useMemo(() => {
    const removeAccount = (idx) => {
      const newAccountStorage = accountStorage.slice();
      newAccountStorage.splice(idx, 1);
      setAccountStorage(newAccountStorage);
    };
    return accountStorage.map((_, idx) => (
      activeBlock === idx
        ? (
          <button
            type="button"
            className="delete remove-account"
            onClick={() => removeAccount(idx)}
          >
            delete
          </button>
        ) : ''
    ));
  }, [accountStorage, activeBlock, setAccountStorage]);

  document.setAccountStorage = setAccountStorage;
  document.accountStorage = accountStorage;

  async function login(idx) {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const [username, password, region] = accountStorage[idx];
      const user = await ValorantAPI.login(username, password, region);
      setUser(user);
    } catch (err) {
      setLoading(false);
    }
  }

  function handleBlockClick(e, idx) {
    if (e.target !== e.currentTarget) {
      return;
    }
    login(idx);
  }

  function handleBlockKeyPress(e, idx) {
    if (e.target !== e.currentTarget) {
      return;
    }
    const enterOrSpace = e.key === 'Enter'
      || e.key === ' '
      || e.key === 'Spacebar'
      || e.which === 13
      || e.which === 32;
    if (enterOrSpace) {
      e.preventDefault();
      login(idx);
    }
  }

  function handleContainerFocus(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setActiveBlock(null);
    }
  }

  const accountBlocks = useMemo(() => accountStorage.map((account, idx) => (
    <div
      key={account[0]}
      role="menuitem"
      tabIndex={0}
      onMouseEnter={() => setActiveBlock(idx)}
      onMouseLeave={() => setActiveBlock(null)}
      onFocus={() => setActiveBlock(idx)}
      onClick={(e) => handleBlockClick(e, idx)}
      onKeyPress={(e) => handleBlockKeyPress(e, idx)}
      className="panel-block is-button"
    >
      {account[0]}
      {' '}
      (
      {account[2]}
      )
      {removeButtons[idx]}
    </div>
  )), [accountStorage, removeButtons, loading, setUser]);

  return (
    <div className="accounts-container" onBlur={handleContainerFocus}>
      {accountBlocks.length > 0 ? (
        <nav className="panel" style={{ }}>
          { loading ? <div className="panel-block is-loading"><Loader className="is-centered" /></div> : accountBlocks }
        </nav>
      ) : ''}
    </div>
  );
}

Accounts.propTypes = {
  accountStorage: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  setAccountStorage: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Accounts;
