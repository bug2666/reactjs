import { useEffect, useState } from 'react';
import { Search, ShoppingCart, Heart, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';



export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setErrorMsg('');

                const res = await fetch(`${process.env.REACT_APP_API_URL}/products/getProducts`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.message || 'Không lấy được danh sách sản phẩm');
                }

                setProducts(data);
            } catch (error) {
                setErrorMsg(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = [];
    products.forEach((product) => {
        if (!categories.includes(product.categoryName)) {
            categories.push(product.categoryName);
        }
    });

    const brands = [];
    products.forEach((product) => {
        if (!brands.includes(product.brandName)) {
            brands.push(product.brandName);
        }
    });

    const filteredProducts = products.filter((product) => {
        const productName = product.name.toLowerCase();
        const keyword = searchText.toLowerCase();

        const matchSearch = productName.includes(keyword);

        let matchCategory = true;

        if (selectedCategory !== '') {
            matchCategory = product.categoryName === selectedCategory;
        }

        let matchBrand = true;

        if (selectedBrand !== '') {
            matchBrand = product.brandName === selectedBrand;
        }

        if (matchSearch && matchCategory && matchBrand) {
            return true;
        }

        return false;
    });


    const formatPrice = (price) => {
        return Number(price).toLocaleString('vi-VN') + 'đ';
    };

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            <section className="mb-10">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    <span>Trang chủ</span>
                    <span>/</span>
                    <span className="text-gray-900">Sản phẩm</span>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                            Giày dép nổi bật
                        </h1>
                        <p className="mt-3 max-w-2xl text-base text-gray-500">
                            Khám phá các mẫu giày dép mới nhất, phù hợp cho đi học, đi làm,
                            thể thao và thời trang hằng ngày.
                        </p>
                    </div>

                    <p className="text-sm font-semibold text-gray-500">
                        Hiển thị {filteredProducts.length} sản phẩm
                    </p>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
                <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900">
                            <SlidersHorizontal size={16} />
                            Bộ lọc
                        </h2>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchText('');
                                setSelectedCategory('');
                                setSelectedBrand('');
                            }}
                            className="text-sm font-semibold text-orange-500 hover:underline"
                        >
                            Xóa lọc
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Tìm kiếm
                            </label>

                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Tìm sản phẩm..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Danh mục
                            </h3>
                            {/* render các danh mục sản phẩm để người dùng chọn */}

                            <div className="space-y-2">
                                {categories.map((category) => { /* duyệt từng cate trong mảng */
                                    const isChecked = selectedCategory === category;

                                    return (
                                        <label key={category}>
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={isChecked}
                                                onChange={() => {
                                                    setSelectedCategory(category);
                                                }}
                                            />
                                            {category}
                                        </label>
                                    );
                                })}

                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Thương hiệu
                            </h3>
                                {/* render thương hiệu */}
                            <div className="space-y-2">
                                {brands.map((brand) => {
                                    let isChecked = false;

                                    if (selectedBrand === brand) {
                                        isChecked = true;
                                    }

                                    const handleSelectBrand = () => {
                                        setSelectedBrand(brand);
                                    };

                                    return (
                                        <label
                                            key={brand}
                                            className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 hover:text-gray-900"
                                        >
                                            <input
                                                type="radio"
                                                name="brand"
                                                checked={isChecked}
                                                onChange={handleSelectBrand}
                                                className="h-4 w-4"
                                            />
                                            {brand}
                                        </label>
                                    );
                                })}

                            </div>
                        </div>
                    </div>
                </aside>

                <section>
                    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Danh sách sản phẩm
                            </p>
                            <p className="text-sm text-gray-500">
                                Chọn sản phẩm để xem chi tiết hoặc thêm vào giỏ hàng.
                            </p>
                        </div>

                        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black">
                            <option>Mới nhất</option>
                            <option>Giá thấp đến cao</option>
                            <option>Giá cao đến thấp</option>
                        </select>
                    </div>

                    {loading && (
                        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-500">
                            Đang tải sản phẩm...
                        </div>
                    )}

                    {errorMsg && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {errorMsg}
                        </div>
                    )}

                    {!loading && !errorMsg && filteredProducts.length === 0 && (
                        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-500">
                            Không có sản phẩm phù hợp.
                        </div>
                    )}

                    {!loading && !errorMsg && filteredProducts.length > 0 && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <article
                                    key={product.id}
                                    className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="relative flex aspect-square items-center justify-center bg-gray-50 p-8">
                                        <Link to={`/products/${product.id}`} className="h-full w-full">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                                            />
                                        </Link>

                                        <button
                                            type="button"
                                            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-400 shadow-sm transition hover:text-red-500"
                                        >
                                            <Heart size={18} />
                                        </button>

                                        {product.isActive === 1 && (
                                            <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-bold uppercase text-white">
                                                Còn bán
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex min-h-[190px] flex-col p-5">
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            {product.brandName}
                                        </p>

                                        <h3 className="mb-2 text-lg font-bold text-gray-900">
                                            {product.name}
                                        </h3>

                                        <p className="line-clamp-2 text-sm text-gray-500">
                                            {product.description}
                                        </p>

                                        <p className="mt-2 text-xs font-medium text-gray-400">
                                            {product.categoryName}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-5">
                                            <span className="text-lg font-bold text-gray-900">
                                                {formatPrice(product.basePrice)}
                                            </span>

                                            <button
                                                type="button"
                                                className="flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-orange-600 active:scale-95"
                                            >
                                                <ShoppingCart size={17} />
                                                Thêm
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}
