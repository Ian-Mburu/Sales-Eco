import React from "react";
import { Link } from "react-router-dom";
import useCategories from "../../components/pages/Categories";

const CategoriesList = () => {
  const { categories, loading, error } = useCategories();

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Product Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link to={`/categories/${category.slug}`}>
              {category.name} ({category.post_count})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;
