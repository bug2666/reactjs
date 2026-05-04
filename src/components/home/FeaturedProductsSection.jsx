import ProductCard from './ProductCard';

export default function FeaturedProductsSection() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* 1. Phần tiêu đề và nút View All */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">Sản phẩm nổi bật</h2>
                        <p className="text-gray-500 mt-2">Những mẫu thiết kế mới nhất và được yêu thích nhất mùa này.</p>
                    </div>
                    <button className="text-sm font-bold uppercase border-b-2 border-black pb-1 hover:text-orange-500 hover:border-orange-500 transition-all">
                        Xem tất cả
                    </button>
                </div>

                {/* 2. Lưới sản phẩm */}
                <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
                    <div className="min-w-[280px] md:min-w-[320px] snap-start">
                        <ProductCard
                            name="Velocity Air Max"
                            price="1,200,000"
                            category="Running"
                            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"
                        />
                    </div>

                    <div className="min-w-[280px] md:min-w-[320px] snap-start">
                        <ProductCard
                            name="Velocity Air Max"
                            price="1,200,000"
                            category="Running"
                            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"
                        />
                    </div>
                    <div className="min-w-[280px] md:min-w-[320px] snap-start">
                        <ProductCard
                            name="Velocity Air Max"
                            price="1,200,000"
                            category="Running"
                            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"
                        />
                    </div>
                    <div className="min-w-[280px] md:min-w-[320px] snap-start">
                        <ProductCard
                            name="Velocity Air Max"
                            price="1,200,000"
                            category="Running"
                            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"
                        />
                    </div>
                    <div className="min-w-[280px] md:min-w-[320px] snap-start">
                        <ProductCard
                            name="Velocity Air Max"
                            price="1,200,000"
                            category="Running"
                            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
