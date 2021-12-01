import React, {
  useEffect, useState, useRef, useReducer,
} from 'react';
import PropTypes from 'prop-types';
import ValorantAPI from '../util/ValorantAPI';
import Item from './Item';
import CurrencyIcon from './CurrencyIcon';
import Loader from './Loader';
import './Store.css';
import RiotIDText from './RiotIDText';

function Store(props) {
  const { user } = props;
  const [loading, setLoading] = useState(true);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [, setBundle] = useState(null);
  const [vp, setVP] = useState(0);
  const [rp, setRP] = useState(0);
  const [items, setItems] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [storeUpdateMarker, updateStore] = useReducer((n) => n + 1, 0);
  const refreshTime = useRef(null);
  const timer = useRef(null);

  document.refreshTime = refreshTime;
  document.setLoading = setLoading;

  useEffect(() => {
    const key = `${user.region}#${user.username}`;

    function currentTime() {
      return new Date().getTime() / 1000;
    }

    function updateTimeLeft() {
      const newTimeLeft = refreshTime.current - currentTime();
      if (newTimeLeft <= 0) {
        clearInterval(timer.current);
        timer.current = null;
        setTimeout(updateStore, 500);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }

    function parseData(data) {
      setBundle({
        id: data.FeaturedBundle.Bundle.ID,
        items: data.FeaturedBundle.Items,
      });
      setItems(data.SkinsPanelLayout.SingleItemOffers);
      const secondsLeft = data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds;
      refreshTime.current = Math.floor(currentTime() + secondsLeft);

      updateTimeLeft();

      if (timer.current !== undefined && timer.current !== null) {
        clearInterval(timer.current);
      }

      timer.current = setInterval(updateTimeLeft, 1000);
    }

    function parseWalletData(data) {
      setVP(data.Balances[ValorantAPI.CURRENCIES.VP]);
      setRP(data.Balances[ValorantAPI.CURRENCIES.RP]);
    }

    setLoading(true);
    setBundle(null);
    setItems(null);
    const authHeaders = {
      Authorization: `Bearer ${user.accessToken}`,
      'X-Riot-Entitlements-JWT': user.entitlementsToken,
    };

    async function getWallet() {
      const res = await ValorantAPI.request(key, 'GET', ValorantAPI.url('wallet', user.region, user.userID), authHeaders);
      parseWalletData(res.data);
      setLoadingWallet(false);
    }
    async function getShop() {
      const res = await ValorantAPI.request(key, 'GET', ValorantAPI.url('storefront', user.region, user.userID), authHeaders);
      parseData(res.data);
      setLoading(false);
    }
    getWallet();
    getShop();
    return () => {
      if (timer.current !== undefined && timer.current !== null) {
        clearInterval(timer.current);
      }
    };
  }, [user, storeUpdateMarker]);

  function parseTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  return (
    <div>
      { loading || loadingWallet
        ? (
          <div className="store column item card">
            <div className="item card-content">
              <Loader className="is-centered" />
            </div>
          </div>
        )
        : (
          <div>
            <div className="store top-text">
              <div>
                <span className="vertical-align-children">
                  <span>
                    {parseTime(timeLeft)}
                    {' '}
                  </span>
                  <span className="float-right vertical-align-children">
                    <CurrencyIcon id={ValorantAPI.CURRENCIES.VP} alt="VALORANT points" />
                    <span>
                      {' '}
                      {vp}
                      {' '}
                    </span>
                    <CurrencyIcon id={ValorantAPI.CURRENCIES.RP} alt="Radianite points" />
                    <span>
                      {' '}
                      {rp}
                      {' '}
                    </span>

                  </span>

                </span>

              </div>
              <div>
                <span className="vertical-align-children" />
                <RiotIDText className="store riot-id float-right">{user.riotID}</RiotIDText>

              </div>
            </div>
            {/* <div><img src={`https://media.valorant-api.com/bundles/${bundle.id}/displayicon.png`} /></div> */}
            <div className="columns">
              {items.map((item) => <Item key={item} id={item} />)}
            </div>

          </div>
        )}
    </div>
  );
}

Store.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    idToken: PropTypes.string.isRequired,
    expiresIn: PropTypes.number.isRequired,
    entitlementsToken: PropTypes.string.isRequired,
    userID: PropTypes.string.isRequired,
    riotID: PropTypes.string.isRequired,
  }).isRequired,
};

export default Store;
