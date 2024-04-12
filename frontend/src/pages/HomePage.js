import React from 'react';
import Categories from '../components/Categories';
import Hero from '../components/Hero';
import ViewAll from '../components/viewAll';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <ViewAll />
    </div>
  );
};

export default HomePage;
