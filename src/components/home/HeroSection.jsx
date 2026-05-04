export default function HeroSection() {
    return (
        <section className="relative w-full h-[500px]">
            {/* quản lý ảnh */}
            <div className="relative w-full h-full">
                <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop"
                    alt="HeroBanner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40">

                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* khối 2 */}
            <div className="absolute inset-0 flex items-center z-10">
                <div className="max-w-[1280px] mx-auto px-8 w-full">
                    <div className="max-w-[672px] space-y-[24px]">
                        <span className="inline-block px-4 py-1 bg-orange-500 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                            New Collection 2026
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase">
                            BƯỚC ĐI <br />
                            <span className="text-orange-500">BỨT PHÁ</span>
                        </h1>

                        {/* Mô tả */}
                        <p className="text-lg text-gray-200 max-w-lg">
                            Khám phá sự kết hợp hoàn hảo giữa công nghệ hiện đại và phong cách thời thượng. Sẵn sàng cho mọi thử thách.
                        </p>

                        {/* Nút bấm */}
                        <div className="flex gap-4 pt-4">
                            <button className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-orange-600 hover:text-white uppercase text-sm">
                                Mua ngay
                            </button>
                            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-black uppercase text-sm">
                                Tìm hiểu thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}