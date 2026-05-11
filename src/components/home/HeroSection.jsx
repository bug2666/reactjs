import { useEffect, useState } from "react";

const banners = [
    {
        id: 1,
        badge: "New Collection 2026",
        title: "BƯỚC ĐI",
        highlight: "BỨT PHÁ",
        description: "Khám phá sự kết hợp hoàn hảo giữa công nghệ hiện đại và phong cách thời thượng. Sẵn sàng cho mọi thử thách.",
        imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        badge: "Summer Sale",
        title: "ƯU ĐÃI",
        highlight: "MÙA HÈ",
        description: "Săn ngay những mẫu giày nổi bật với mức giá hấp dẫn trong mùa hè này.",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        badge: "Best Seller",
        title: "PHONG CÁCH",
        highlight: "DẪN ĐẦU",
        description: "Khám phá các sản phẩm được yêu thích nhất bởi cộng đồng yêu giày.",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
    }
];

export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentBanner = banners[currentIndex];
    const lastIndex = banners.length - 1;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((current) => {
                const isLastBanner = current === lastIndex;

                if (isLastBanner) {
                    return 0;
                }

                return current + 1;
            });
        }, 4000);

        return () => {
            clearInterval(timer);
        };
    }, [lastIndex]);

    return (
        <section className="relative h-[500px] w-full overflow-hidden">
            <div className="relative h-full w-full">
                <img
                    src={currentBanner.imageUrl}
                    alt={currentBanner.badge}
                    className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            <div className="absolute inset-0 z-10 flex items-center">
                <div className="mx-auto w-full max-w-[1280px] px-8">
                    <div className="max-w-[672px] space-y-6">
                        <span className="inline-block rounded-full bg-orange-500 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                            {currentBanner.badge}
                        </span>

                        <h1 className="text-5xl font-black uppercase leading-tight text-white md:text-7xl ">
                            {currentBanner.title} <br />
                            <span className="text-orange-500 block mt-4">
                                {currentBanner.highlight}
                            </span>
                        </h1>

                        <p className="max-w-lg text-lg text-white ">
                            {currentBanner.description}
                        </p>

                        <div className="flex gap-4 pt-4">
                            <button className="rounded-lg bg-white px-8 py-4 text-sm font-bold uppercase text-black hover:bg-orange-600 hover:text-white">
                                Mua ngay
                            </button>

                            <button className="rounded-lg border-2 border-white px-8 py-4 text-sm font-bold uppercase text-white hover:bg-white hover:text-black">
                                Tìm hiểu thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
