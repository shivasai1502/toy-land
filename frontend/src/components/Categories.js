import React from 'react';
import { Container, Col, Image } from 'react-bootstrap';
import '../css/Category.css';

// Import images for each category
import actionFiguresImage from '../toy_images/action_figure_toys/main_image.png';
import dollsImage from '../toy_images/doll_toys/main_image.png';
import stuffedAnimalsImage from '../toy_images/stuffed_animals_toys/main_image.png';
import buildingBlocksImage from '../toy_images/building_blocks_and_construction_toys/main_image.png';
import puzzlesImage from '../toy_images/puzzles_toys/main_image.png';
import cardGamesImage from '../toy_images/card_games_toys/main_image.png';
import educationalToysImage from '../toy_images/educational_toys/main_image.png';
import artsAndCraftsImage from '../toy_images/arts_and_crafts_toys/main_image.png';
import outdoorToysImage from '../toy_images/outdoor_toys/main_image.png';

const Categories = () => {

  return (
    <Container className="container">
      {/* Grid Items */}
      <Col className="category-item">
        <a href="/category/action-figures">
          <Image src={actionFiguresImage} className="category-image" />
          <div>Action Figures</div>
        </a>
      </Col>
      <Col className="category-item" >
        <a href="/category/dolls">
          <Image src={dollsImage} className="category-image" />
          <div>Dolls</div>
        </a>
      </Col>
      <Col className="category-item" >
        <a href="/category/stuffed-animals">
          <Image src={stuffedAnimalsImage} className="category-image" />
          <div>Stuffed Animals</div>
        </a>
      </Col>
      <Col className="category-item" >
        <a href="/category/building-blocks">
          <Image src={buildingBlocksImage} className="category-image" />
          <div>Building Blocks and Construction</div>
        </a>
      </Col>
      <Col className="category-item" >
        <a href="/category/puzzles">
          <Image src={puzzlesImage} className="category-image" />
          <div>Puzzles</div>
        </a>
      </Col>
      <Col className="category-item" >
        <a href="/category/card-games">
          <Image src={cardGamesImage} className="category-image" />
          <div>Card Games</div>
        </a>
      </Col>
      <Col className="category-item" >
        <a href="/category/educational-toys">
          <Image src={educationalToysImage} className="category-image" />
          <div>Educational Toys</div>
        </a>
      </Col>
      <Col className="category-item" >
        <a href="/category/arts-and-crafts">
          <Image src={artsAndCraftsImage} className="category-image" />
          <div>Arts and Crafts</div>
        </a>
      </Col>
      <Col className="category-item" >
        <a href="/category/outdoor-toys">
          <Image src={outdoorToysImage} className="category-image" />
          <div>Outdoor Toys</div>
        </a>
      </Col>
    </Container>
  );
};

export default Categories;