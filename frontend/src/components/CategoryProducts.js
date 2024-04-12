import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../css/CategoryProducts.css'; // Import CSS file for styling

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products?category=${categoryId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const addToCart = async (product) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      setCart([...cart, product]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToWishlist = async (product) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error('Failed to add to wishlist');
      }
      setWishlist([...wishlist, product]);
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
              <Card.Img variant="top" src={`http://localhost:5000/images/${product.image_id}`} className="product-img" />
              <Card.Body>
                <Card.Title>
                  <span className="card-text-bold">Toy Name:</span> {product.name}
                </Card.Title>
                <Card.Text>
                  <span className="card-text-bold">Description:</span>{' '}
                  <span className="description">{product.description}</span>
                </Card.Text>
                <Card.Text>
                  <span className="card-text-bold">Price:</span> ${product.price}
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
