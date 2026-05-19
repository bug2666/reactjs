import { Link } from "react-router-dom";

const PRODUCT_PLACEHOLDER_IMAGE = "/images/product-placeholder.png";

const formatVnd = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + "đ";
};

const getImageSrc = (imageUrl) => {
    if (!imageUrl) {
        return PRODUCT_PLACEHOLDER_IMAGE;
    }

    if (imageUrl.startsWith("http")) {
        return imageUrl;
    }

    return `${process.env.REACT_APP_API_URL.replace('/api', '')}${imageUrl}`;
};

export default function ProductCard({ product }) {
    return (
        <article className="group cursor-pointer rounded-2xl border border-slate-200 p-4">
            <Link
                to={`/products/${product.id}`}
                className="relative mb-6 block overflow-hidden rounded-2xl bg-slate-50"
            >
                <div className="grid aspect-square w-full place-items-center bg-slate-100 p-8 transition-transform duration-700 group-hover:scale-105">
                    <img
                        src={getImageSrc(product.imageUrl)}
                        alt={product.name}
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                        }}
                        className="h-full w-full object-contain"
                    />
                </div>

                <span
                    className="absolute left-4 top-4 bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-tight text-white"
                >
                    Mới
                </span>
            </Link>

            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                    {product.brandName}
                </span>
                <Link
                    to={`/products/${product.id}`}
                    className="text-lg font-bold text-slate-900 transition hover:text-orange-500"
                >
                    {product.name}
                </Link>
                <p className="line-clamp-1 text-sm text-slate-500">
                    {product.description}
                </p>
                <p className="text-xs text-slate-400">
                    {product.categoryName}
                </p>

                <div className="mt-4 flex items-end justify-between">
                    <span className="text-xl font-black">
                        {formatVnd(product.basePrice)}
                    </span>
                </div>
            </div>
        </article>
    );
}
