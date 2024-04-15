import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/CategoryProducts.css';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/category?category=${categoryId}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:5000/api/cart/insert', product, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToWishlist = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:5000/api/wishlist/insert', product, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <Container>
      <Row className="product-row">
        {products.map((product) => (
          <Col key={product._id} md={6} lg={4} xl={3}>
            <Card className="product-card">
              <Card.Img variant="top" src={`http://localhost:5000/api/products/images/${product.image_id}`} className="product-img" />
              <Card.Body>
                <Card.Title>
                  <span className="card-text-bold">Toy Name:</span> {product.name}
                </Card.Title>
                <Card.Text>
                  <span className="card-text-bold">Description:</span>{' '}
                  <span className="description">{product.description}</span>
                </Card.Text>
                <Card.Text>
                  <span className="card-price">Price:</span> ${product.price}
                </Card.Text>
                <div className="button-container">
                  <div>
                    <Button variant="primary" onClick={() => addToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                  <div>
                    <Button variant="secondary" onClick={() => addToWishlist(product)}>
                      Add to Wishlist
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoryProducts;