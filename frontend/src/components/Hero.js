import React from 'react';
import '../css/Hero.css';
import HeroImage from '../toy_images/image.jpg';
const Hero = () => {
    return (
        <div>
            <h2 className='hero-title'>Welcome to Toy Land</h2>
            <h2 className='hero-title'> Find the perfect Toy for your Joy</h2>
            <img src={HeroImage} alt="Random" className='hero-photo' />
            <h2 className='hero-title-h'>Explore the Categories</h2>
        </div>
    );
};

export default Hero;