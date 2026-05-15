import { useEffect, useState } from 'react';
import { Search, ShoppingCart, Heart, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';

const PRODUCT_PLACEHOLDER_IMAGE = "/images/product-placeholder.png";

export default function ProductListPage() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        totalItems: 0,
        totalPages: 1
    });
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [sort, setSort] = useState('newest');
    const [showCategories, setShowCategories] = useState(true);
    const [showBrands, setShowBrands] = useState(true);

    const getImageSrc = (imageUrl) => {
        if (!imageUrl) {
            return PRODUCT_PLACEHOLDER_IMAGE;
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${process.env.REACT_APP_API_URL.replace('/api', '')}${imageUrl}`;
    };

    useEffect(() => {
        setSearchText(searchParams.get('q') || '');
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setErrorMsg('');

                const res = await axiosClient.get(`/products/getProducts?page=${page}&limit=12`);
                const data = res.data;

                setProducts(data.products);
                setPagination(data.pagination);
            } catch (error) {
                const message = error.response?.data?.message || error.message;
                setErrorMsg(message);
                toast.error(`Tải sản phẩm thất bại: ${message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    const categories = [];
    products.forEach((product) => {
        if (product.categoryName && !categories.includes(product.categoryName)) {
            categories.push(product.categoryName);
        }
    });

    const brands = [];
    products.forEach((product) => {
        if (product.brandName && !brands.includes(product.brandName)) {
            brands.push(product.brandName);
        }
    });

    const categoryCounts = {
        'Tất cả': products.length
    };

    products.forEach((product) => {
        const categoryName = product.categoryName || 'Khác';
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    const visibleCategories = ['Tất cả', ...categories];

    const filteredProducts = products
        .filter((product) => {
            const keyword = searchText.trim().toLowerCase();
            const searchableText = `${product.name || ''} ${product.brandName || ''} ${product.description || ''}`.toLowerCase();

            const isVisibleProduct = product.isActive === 1;
            const matchSearch = !keyword || searchableText.includes(keyword);
            const matchCategory = !selectedCategory || product.categoryName === selectedCategory;
            const matchBrand = !selectedBrand || product.brandName === selectedBrand;

            return isVisibleProduct && matchSearch && matchCategory && matchBrand;
        })

        .sort((firstProduct, secondProduct) => {
            if (sort === 'price-asc') {
                return Number(firstProduct.basePrice || 0) - Number(secondProduct.basePrice || 0);
            }

            if (sort === 'price-desc') {
                return Number(secondProduct.basePrice || 0) - Number(firstProduct.basePrice || 0);
            }

            return Number(secondProduct.id || 0) - Number(firstProduct.id || 0);
        });

    const clearFilters = () => {
        setSearchText('');
        setSelectedCategory('');
        setSelectedBrand('');
        setSort('newest');
        setPage(1);
        toast.success('Đã xóa bộ lọc');
    };

    const handleAddToCart = (product) => {
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
    };

    const formatPrice = (price) => {
        return Number(price).toLocaleString('vi-VN') + 'đ';
    };

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <header className="mb-12">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Trang chủ</span>
                    <span>/</span>
                    <span className="text-slate-950">Sản phẩm</span>
                </div>

                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-slate-950">
                            Giày dép nổi bật
                        </h1>
                        <p className="mt-4 max-w-xl text-slate-500">
                            Khám phá các mẫu giày dép mới nhất, phù hợp cho đi học, đi làm, thể thao và thời trang hằng ngày.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 text-sm font-bold sm:flex-row sm:items-center">
                        <span className="text-slate-400">
                            Hiển thị {filteredProducts.length} / {pagination.totalItems} sản phẩm
                        </span>
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 outline-none transition focus:border-slate-900"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="price-asc">Giá thấp đến cao</option>
                            <option value="price-desc">Giá cao đến thấp</option>
                        </select>
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr]">
                <aside className="space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900">
                            <SlidersHorizontal size={16} />
                            Bộ lọc
                        </h2>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-xs font-bold uppercase tracking-widest text-orange-500 hover:underline"
                        >
                            Xóa lọc
                        </button>
                    </div>

                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                            Tìm kiếm nhanh
                        </h3>
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Tìm sản phẩm..."
                                value={searchText}
                                onChange={(event) => {
                                    setSearchText(event.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-slate-900"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => setShowCategories((currentValue) => !currentValue)}
                            className="mb-6 flex w-full items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400"
                        >
                            Danh mục
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${showCategories ? "rotate-180" : ""}`}
                            />
                        </button>

                        {showCategories && (
                            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                                {visibleCategories.map((category) => {
                                    const isActive = category === 'Tất cả'
                                        ? selectedCategory === ''
                                        : selectedCategory === category;

                                    return (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategory(category === 'Tất cả' ? '' : category);
                                                setPage(1);
                                            }}
                                            className={
                                                isActive
                                                    ? "flex w-full items-center justify-between rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
                                                    : "flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                            }
                                        >
                                            <span className="truncate">{category}</span>
                                            <span className={isActive ? "text-white/70" : "text-slate-400"}>
                                                {categoryCounts[category] || 0}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => setShowBrands((currentValue) => !currentValue)}
                            className="mb-6 flex w-full items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400"
                        >
                            Thương hiệu
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${showBrands ? "rotate-180" : ""}`}
                            />
                        </button>

                        {showBrands && (
                            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                                {brands.map((brand) => {
                                    const isChecked = selectedBrand === brand;

                                    return (
                                        <label
                                            key={brand}
                                            className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700"
                                        >
                                            <input
                                                type="radio"
                                                name="brand"
                                                checked={isChecked}
                                                onChange={() => {
                                                    setSelectedBrand(brand);
                                                    setPage(1);
                                                }}
                                                className="h-4 w-4 accent-orange-500"
                                            />
                                            <span className="truncate">{brand}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </aside>

                <div>
                    {loading && (
                        <div className="rounded-2xl border border-slate-100 bg-white py-20 text-center text-slate-500">
                            Đang tải sản phẩm...
                        </div>
                    )}

                    {errorMsg && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
                            {errorMsg}
                        </div>
                    )}

                    {!loading && !errorMsg && filteredProducts.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center">
                            <p className="font-bold text-slate-900">Không có sản phẩm phù hợp</p>
                            <p className="mt-2 text-sm text-slate-500">Thử bỏ bớt bộ lọc hoặc từ khóa khác.</p>
                        </div>
                    )}

                    {!loading && !errorMsg && filteredProducts.length > 0 && (
                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <article key={product.id} className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
                                    <div className="relative mb-6 overflow-hidden rounded-2xl bg-slate-100">
                                        <Link to={`/products/${product.id}`} className="grid aspect-square w-full place-items-center p-8">
                                            <img
                                                src={getImageSrc(product.imageUrl)}
                                                alt={product.name}
                                                onError={(event) => {
                                                    event.currentTarget.onerror = null;
                                                    event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                                                }}
                                                className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </Link>

                                        <span
                                            className={
                                                product.isActive === 1
                                                    ? "absolute left-4 top-4 bg-orange-500 px-3 py-1 text-[10px] font-black uppercase tracking-tight text-white"
                                                    : "absolute left-4 top-4 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-tight text-slate-900 shadow-sm"
                                            }
                                        >
                                            {product.isActive === 1 ? "Còn bán" : "Ẩn"}
                                        </span>

                                        <button
                                            type="button"
                                            aria-label="Yêu thích"
                                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 opacity-0 transition-opacity hover:text-orange-500 group-hover:opacity-100"
                                        >
                                            <Heart size={16} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                                            {product.brandName}
                                        </span>
                                        <Link to={`/products/${product.id}`} className="text-lg font-bold text-slate-950 transition hover:text-orange-500">
                                            {product.name}
                                        </Link>
                                        <p className="line-clamp-1 text-sm text-slate-500">
                                            {product.description}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {product.categoryName}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <span className="text-xl font-black text-slate-950">
                                                {formatPrice(product.basePrice)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleAddToCart(product)}
                                                className="flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2 text-xs font-bold text-white transition hover:bg-orange-500 active:scale-95"
                                            >
                                                <ShoppingCart size={14} />
                                                Thêm
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {!loading && !errorMsg && pagination.totalPages > 1 && (
                        <div className="mt-20 flex justify-center gap-3">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 font-bold transition hover:bg-slate-50 disabled:opacity-40"
                            >
                                ←
                            </button>

                            {Array.from({ length: pagination.totalPages }, (_, index) => {
                                const pageNumber = index + 1;

                                return (
                                    <button
                                        key={pageNumber}
                                        type="button"
                                        onClick={() => setPage(pageNumber)}
                                        className={
                                            page === pageNumber
                                                ? "h-10 w-10 rounded-lg bg-slate-950 font-bold text-white"
                                                : "h-10 w-10 rounded-lg border border-slate-200 font-bold transition hover:bg-slate-50"
                                        }
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                disabled={page === pagination.totalPages}
                                onClick={() => setPage((currentPage) => Math.min(pagination.totalPages, currentPage + 1))}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 font-bold transition hover:bg-slate-50 disabled:opacity-40"
                            >
                                →
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
