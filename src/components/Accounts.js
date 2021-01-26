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
          <button type="button" className="delete remove-account" onClick={() => removeAccount(idx)}>delete</button>
        ) : ''
    ));
  }, [accountStorage, activeBlock, setAccountStorage]);

  const accountBlocks = useMemo(() => {
    async function handleBlockClick(e, idx) {
      if (e.target !== e.currentTarget) {
        return;
      }
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
    return accountStorage.map((account, idx) => (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        key={account[0]}
        role="menuitem"
        tabIndex={0}
        onMouseEnter={() => setActiveBlock(idx)}
        onMouseLeave={() => setActiveBlock(null)}
        onClick={(e) => handleBlockClick(e, idx)}
        className="panel-block is-button is-active"
      >
        {account[0]}
        {' '}
        (
        {account[2]}
        )
        {removeButtons[idx]}
      </div>
    ));
  }, [accountStorage, removeButtons, loading, setUser]);

  return (
    <div className="accounts-container">
      {accountBlocks.length > 0 ? (
        <nav className="panel" style={{ }}>
          { loading ? <div className="panel-block is-loading"><Loader className="is-centered" /></div> : accountBlocks }
          {/* <a role="menuitem" className="panel-block is-button is-active">
            pangeacake6
            <button type="button" className="button is-link is-outlined is-danger is-small">
              <FontAwesomeIcon icon={faTimes} size="xs" />
            </button>
          </a> */}
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
