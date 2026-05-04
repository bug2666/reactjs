import CategoryCard from './CategoryCard';

export default function CategorySection() {
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            {/* Tiêu đề phần */}
            <div className="mb-10">
                <h2 className="text-3xl font-bold uppercase tracking-tight">Danh mục nổi bật</h2>
                <div className="w-20 h-1 bg-orange-500 mt-2"></div>
            </div>

            {/* Lưới danh mục */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CategoryCard title="Giày Chạy Bộ" image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070" count="120 sản phẩm" />
                <CategoryCard title="Giày Thời Trang" image="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974" count="85 sản phẩm" />
                <CategoryCard title="Giày Bóng Rổ" image="https://images.unsplash.com/photo-1541591047359-514397c7c3ff?q=80&w=2070" count="50 sản phẩm" />
                <CategoryCard title="Phụ Kiện" image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999" count="200 sản phẩm" />
            </div>
        </section>
    );
}
