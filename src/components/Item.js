import React from 'react';
import PropTypes from 'prop-types';

function Item(props) {
  const { id } = props;
  return (
    <div><img src={`https://media.valorant-api.com/weaponskinlevels/${id}/displayicon.png`} alt="weapon skin" /></div>
  );
}

Item.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Item;
