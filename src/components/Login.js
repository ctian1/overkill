import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ValorantAPI from '../util/ValorantAPI';
import './Login.css';

function Login(props) {
  const { setUser } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('NA');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  // console.log(`rendering ${username} ${password} ${region}`);

  // const [set]

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      const user = await ValorantAPI.login(username, password, region);
      console.log('setting user', user);
      setUser(user);
    } catch (e) {
      console.log(e);
      setError('Username or password is incorrect');
    }
    setSubmitting(false);
  }

  return (
    <form className="login-container" onSubmit={handleSubmit}>
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

      <div className="control">
        <button type="submit" onClick={handleSubmit} className={`button is-primary${submitting ? ' is-loading' : ''}`}>Login</button>
      </div>
    </form>
  );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;
