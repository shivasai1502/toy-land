import React from 'react';
import '../css/Hero.css';
import HeroImage from '../toy_images/image.jpg';
const Hero = () => {
    return (
        <div>
            <h1 className='hero-title'>Welcome to Toy Land</h1>
            <h1 className='hero-title'> Find the perfect Toy for your Joy</h1>
            <img src={HeroImage} alt="Random" className='hero-photo' />
            <h2 className='hero-title-h'>"Toys for Every Age and Interest"</h2>
        </div>
    );
};

export default Hero;