import React, { useState } from "react";
import { Link } from "react-router-dom";
import useCategories from "../../components/pages/Categories";
import '../../styles/pages/categories.css';
import { motion } from 'framer-motion';

const CategoriesList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { categories, loading, error, totalPages } = useCategories(currentPage);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-pulse">Loading categories...</div>
    </div>
  );

  if (error) return (
    <motion.div 
      className="error-message"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
    >
      ⚠️ Error: {error}
    </motion.div>
  );

  return (
    <>
    <div>
      
      <motion.div 
        className="categories"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h2 className="cate-headers">Explore Categories</h2>
        
        <motion.ul 
          className="cate-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.li 
              className="cate-card"
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link className="cate-content" to={`/categories/${category.slug}`}>
                <span className="cate-name">{category.name}</span>
                <span className="cate-count">{category.post_count} posts</span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* Pagination Controls */}
        <motion.div 
          className="pagination"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </motion.div>
      </motion.div>
      
    </div>
    </>
  );
};

export default CategoriesList;