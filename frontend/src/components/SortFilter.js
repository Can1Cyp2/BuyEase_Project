const SortFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortOrder,
  onSortOrderChange,
}) => {
  return (
    <div className="sort-filter-section">
      <select
        className="sort-filter"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        className="sort-filter"
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value)}
      >
        <option value="">Sort By</option>
        <option value="low-to-high">Price: Low to High</option>
        <option value="high-to-low">Price: High to Low</option>
      </select>
    </div>
  );
};

export default SortFilter;
