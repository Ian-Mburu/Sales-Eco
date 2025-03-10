import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../Footer-Header/Header";
import Footer from "../Footer-Header/Footer";
import '../../styles/pages/categoriesProduct.css';

const CategoryProducts = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/categories/${categorySlug}/`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <>
      <Header />
      <div className="category-products">
        <h2 className="category-title">Products in {categorySlug.replace('-', ' ')}</h2>
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image || '/default-image.jpg'} alt={product.title} className="product-image" />
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <p className="product-price">${product.price}</p>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-products">No products available in this category.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryProducts;