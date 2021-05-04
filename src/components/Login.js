import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ValorantAPI from '../util/ValorantAPI';
import Accounts from './Accounts';
import './Login.css';
import useAccountStorage from '../util/useAccountStorage';

function Login(props) {
  const { setUser } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('NA');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [savePass, setSavePass] = useState(false);
  const [accountStorage, setAccountStorage] = useAccountStorage();
  // console.log(`rendering ${username} ${password} ${region}`);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      const user = await ValorantAPI.login(username, password, region);
      if (savePass) {
        setAccountStorage([...accountStorage, [username, password, region]]);
      }
      setUser(user);
    } catch (err) {
      setError('Username or password is incorrect');
      setSubmitting(false);
    }
  }

  return (
    <div className="login">
      <div className="level">
        <div className="level-left">
          <h4 className="title is-4">Riot Login</h4>

        </div>
        <div className="level-right">
          <h4 className="title is-4">Saved Accounts</h4>

        </div>

      </div>
      <div className="login-main columns">
        <div className="column">
          <form className="login-container box" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="inputUsername" className="label">
                Username
                <input type="text" className={`input${error !== '' ? ' is-danger' : ''}`} value={username} required onChange={(e) => setUsername(e.currentTarget.value)} id="inputUsername" />

              </label>
            </div>

            <div className="field">
              <label htmlFor="inputPassword" className="label">
                Password
                <input type="password" className={`input${error !== '' ? ' is-danger' : ''}`} value={password} required onChange={(e) => setPassword(e.currentTarget.value)} id="inputPassword" />
                <p className="help is-danger">{error}</p>
              </label>
            </div>

            <label htmlFor="inputRegion" className="label">
              Region
              <div className="select">
                <select id="inputRegion" value={region} onChange={(e) => setRegion(e.currentTarget.value)}>
                  <option>NA</option>
                  <option>EU</option>
                  <option>AP</option>
                  <option>KR</option>
                </select>
              </div>
            </label>

            <div className="field">
              <div className="control">
                <label htmlFor="inputSave" className="checkbox">
                  <input id="inputSave" value={savePass} onChange={(e) => setSavePass(e.currentTarget.value)} type="checkbox" />
                  <span style={{ marginLeft: '4px' }}>Save account</span>
                </label>
              </div>
            </div>

            <div className="control buttons">
              <button type="submit" onClick={handleSubmit} className={`button is-primary${submitting ? ' is-loading' : ''}`}>Login</button>
            </div>
          </form>
        </div>

        <div className="column accounts">
          <Accounts
            accountStorage={accountStorage}
            setAccountStorage={setAccountStorage}
            setUser={setUser}
          />

        </div>

      </div>

    </div>
  );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;
