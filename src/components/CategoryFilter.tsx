interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center my-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-6 py-2 rounded-full transition-all ${
            selectedCategory === category.id
              ? "bg-primary text-white"
              : "bg-accent hover:bg-primary/10"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};