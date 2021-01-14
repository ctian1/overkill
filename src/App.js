import React from 'react';
import Login from './components/Login';
// import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.css';
import valorant from './util/ValorantClientAPI';

function App() {
  return (
    <div className="window">
      <div className="window-titlebar" />
      <div className="app container">
        <div className="main-screen">
          <h1 className="title is-3">Overkill</h1>
          <Login />

        </div>
      </div>

    </div>
  );
}

export default App;
