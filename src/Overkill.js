import React, { useEffect, useReducer, useState } from 'react';
import Login from './components/Login';
import Store from './components/Store';
import ValorantAPI from './util/ValorantAPI';
// import logo from './logo.svg';
import './Overkill.css';
import 'bulma/css/bulma.css';
import 'bulma-prefers-dark/css/bulma-prefers-dark.css';
import SettingsModal from './components/SettingsModal';

function Overkill() {
  const [user, setUser] = useState(null);
  const [isSettingsOpen, toggleSettings] = useReducer((s) => !s, false);

  useEffect(() => {
    ValorantAPI.loadNames();
  }, []);

  return (
    <div className="window">
      <div className="window-titlebar" />
      <div className="app container">
        <div className="main-screen">
          <div className="columns">
            <div className="column">
              <h1 className="title is-3">Overkill</h1>
            </div>
            <div className="column">
              { user != null
                ? <button type="button" onClick={() => setUser(null)} className="button is-danger is-light is-pulled-right">Log out</button>
                : <button type="button" onClick={toggleSettings} className="button is-light is-pulled-right">Settings</button> }
            </div>
          </div>
          {user === null ? <Login setUser={setUser} /> : (
            ''
          )}
          { user != null ? (
            <div className="store-container">
              <Store user={user} />
            </div>
          ) : ''}
          <SettingsModal open={isSettingsOpen} toggle={toggleSettings} />
        </div>
      </div>

    </div>
  );
}

export default Overkill;
