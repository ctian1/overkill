import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ValorantAPI from '../util/ValorantAPI';
import Item from './Item';

function Store(props) {
  const { user } = props;
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState(null);
  const [items, setItems] = useState(null);

  useEffect(() => {
    const key = `${user.region}#${user.username}`;

    function parseData(data) {
      setBundle({
        id: data.FeaturedBundle.Bundle.ID,
        items: data.FeaturedBundle.Items,
      });
      setItems(data.SkinsPanelLayout.SingleItemOffers);
    }

    async function getShop() {
      const authHeaders = {
        Authorization: `Bearer ${user.accessToken}`,
        'X-Riot-Entitlements-JWT': user.entitlementsToken,
      };

      const res = await ValorantAPI.request(key, 'GET', ValorantAPI.url('storefront', user.region, user.userId), authHeaders);
      console.log('loaded shop', res.data);
      parseData(res.data);
      setLoading(false);
    }
    getShop();
  }, []);

  return (
    <div>
      { loading ? <div>Loading</div> : (
        items.map((item) => <Item id={item} />)
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
    userId: PropTypes.string.isRequired,
  }).isRequired,
};

export default Store;
