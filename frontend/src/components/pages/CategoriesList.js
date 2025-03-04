import React from "react";
import { Link } from "react-router-dom";
import useCategories from "../../components/pages/Categories";
import '../../styles/pages/categories.css'

const CategoriesList = () => {
  const { categories, loading, error } = useCategories();

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="categories">
      <h2 className="cate-headers">Categories</h2>
      <ul className="cate-list">
        {categories.map((category) => (
          <li className="cate-list2" key={category.id}>
            <Link className="cate-links" to={`/categories/${category.slug}`}>
              {category.name} {category.post_count}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;
