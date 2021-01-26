import React from 'react';
import PropTypes from 'prop-types';
import './Loader.css';

function Loader(props) {
  const { className } = props;
  const newProps = { ...props, className: `loader overkill-loader ${className}` };
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <div {...newProps} />;
}

Loader.propTypes = {
  className: PropTypes.string,
};

Loader.defaultProps = {
  className: '',
};

export default Loader;
