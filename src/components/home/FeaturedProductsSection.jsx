import ProductCard from "./ProductCard";


export default function FeaturedProductsSection({ products, loading, errorMsg }) {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">Sản phẩm nổi bật</h2>
                        <p className="text-gray-500 mt-2">Những mẫu thiết kế mới nhất và được yêu thích nhất mùa này.</p>
                    </div>

                    <a
                        href="/ProductListPage"
                        className="text-sm font-bold uppercase border-b-2 border-black pb-1 hover:text-orange-500 hover:border-orange-500 transition-all"
                    >
                        Xem tất cả
                    </a>
                </div>

                {loading && (
                    <p className="text-gray-500">Đang tải sản phẩm...</p>
                )}

                {errorMsg && (
                    <p className="text-red-500">{errorMsg}</p>
                )}

                {!loading && !errorMsg && products.length === 0 && (
                    <p className="text-gray-500">Chưa có sản phẩm nổi bật.</p>
                )}

                {!loading && !errorMsg && products.length > 0 && (
                    <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
                        {products.map((product) => (
                            <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                                <ProductCard
                                    name={product.name}
                                    price={Number(product.basePrice).toLocaleString("vi-VN")}
                                    category={product.categoryName}
                                    image={product.imageUrl}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
