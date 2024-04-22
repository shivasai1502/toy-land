import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
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

  const handleProductClick = (product) => {
    navigate(`/view-individual-product/${product._id}`, { state: { product } });
  };

  return (
    <Container>
      <Row className="product-row">
        {products.map((product) => (
          <Col key={product._id} md={6} lg={4} xl={3}>
            <Card className="product-card">
              <Card.Img
                variant="top"
                src={`http://localhost:5000/api/products/images/${product.image_id}`}
                className="product-img"
              />
              <Card.Body>
                <Card.Title>
                  <a href="#" className="name-link" onClick={(e) => { e.preventDefault(); handleProductClick(product); }}>
                    {product.name}
                  </a>
                </Card.Title>
                <Card.Text>
                  <span className="card-price">Price:</span> ${product.price}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoryProducts;