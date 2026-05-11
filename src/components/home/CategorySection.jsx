import CategoryCard from "./CategoryCard";

export default function CategorySection({ categories }) {
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="mb-10">
                <h2 className="text-3xl font-bold uppercase tracking-tight">
                    Danh mục nổi bật
                </h2>
                <div className="w-20 h-1 bg-orange-500 mt-2"></div>
            </div>

            {categories.length === 0 && (
                <p className="text-gray-500">Chưa có danh mục.</p>
            )}

            {categories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.name}
                            title={category.name}
                            image={category.imageUrl}
                            count={`${category.count} sản phẩm`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
