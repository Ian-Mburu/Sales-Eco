// components/Loader.js
import React from 'react';

const Loader = ({ size = 'medium' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex justify-center items-center ${sizes[size]}`}>
      <div className={`animate-spin rounded-full ${sizes[size]} border-t-2 border-b-2 border-blue-500`}></div>
    </div>
  );
};

export default Loader;