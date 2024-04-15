import React from 'react';
import Categories from '../components/Categories';
import Hero from '../components/Hero';
import ViewAll from '../components/viewAll';

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <ViewAll />
    </div>
  );
};

export default Home;
