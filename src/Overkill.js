import React, { useEffect, useState } from 'react';
import Login from './components/Login';
// import logo from './logo.svg';
import './Overkill.css';
import 'bulma/css/bulma.css';
import Store from './components/Store';
import ValorantAPI from './util/ValorantAPI';

function Overkill() {
  const [user, setUser] = useState(null);
  console.log('user', user);

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
              {user === null ? <Login setUser={setUser} /> : (
                ''
              )}
            </div>
            <div className="column">
              { user != null ? <button type="button" onClick={() => setUser(null)} className="button is-danger is-light logout">Log out</button> : '' }

            </div>
          </div>
          { user != null ? (
            <div className="store-container">
              <Store user={user} />
            </div>
          ) : ''}
        </div>
      </div>

    </div>
  );
}

export default Overkill;
