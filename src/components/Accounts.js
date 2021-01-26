import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './Accounts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';
import ValorantAPI from '../util/ValorantAPI';

function Accounts(props) {
  const { accountStorage, setAccountStorage, setUser } = props;
  const [activeBlock, setActiveBlock] = useState(null);
  const [loading, setLoading] = useState(false);

  const removeAccount = (idx) => {
    const newAccountStorage = accountStorage.slice();
    newAccountStorage.splice(idx, 1);
    console.log(newAccountStorage);
    console.log('removing', idx);
    setAccountStorage(newAccountStorage);
  };

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
      console.log(err);
      setLoading(false);
    }
  }

  const removeButtons = useMemo(() => (
    accountStorage.map((_, idx) => (
      activeBlock === idx
        ? (
          <button type="button" className="button is-link is-outlined is-danger is-small" onClick={() => removeAccount(idx)}>
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </button>
        ) : ''
    ))
  ), [accountStorage, activeBlock]);

  const accountBlocks = useMemo(() => (
    accountStorage.map((account, idx) => (
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
    ))
  ), [accountStorage, removeButtons]);

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
