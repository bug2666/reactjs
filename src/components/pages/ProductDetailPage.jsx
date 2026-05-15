import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Truck, RotateCcw, ShieldCheck, Minus, Plus } from "lucide-react";
import axiosClient from "../../api/axiosClient";

const PRODUCT_PLACEHOLDER_IMAGE = "/images/product-placeholder.png";

const HIGHLIGHTS = [
  "Thiết kế dễ phối đồ, phù hợp sử dụng hằng ngày",
  "Form sản phẩm ổn định, hỗ trợ vận động thoải mái",
  "Chất liệu được chọn lọc để tăng độ bền khi sử dụng",
  "Phù hợp đi học, đi làm, dạo phố hoặc luyện tập nhẹ"
];

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState("desc");

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
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setMessage("");

        const res = await axiosClient.get(`/products/getProductById/${id}`);
        const data = res.data;

        setProduct(data);

        let firstImage;
        if (data.images && data.images.length > 0) {
          firstImage = data.images[0].imageUrl;
        } else if (data.imageUrl) {
          firstImage = data.imageUrl;
        } else {
          firstImage = PRODUCT_PLACEHOLDER_IMAGE;
        }

        setSelectedImage(firstImage);

        if (data.variants?.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const colors = useMemo(() => {
    if (!product?.variants) {
      return [];
    }

    const variantColors = product.variants.map((variant) => variant.color).filter(Boolean);
    return [...new Set(variantColors)];
  }, [product]);

  const sizes = useMemo(() => {
    if (!product?.variants) {
      return [];
    }

    const variantSizes = product.variants.map((variant) => variant.size).filter(Boolean);
    return [...new Set(variantSizes)];
  }, [product]);

  const selectedColor = selectedVariant?.color;
  const selectedSize = selectedVariant?.size;
  const displayPrice = selectedVariant?.price || product?.basePrice;
  const isInStock = selectedVariant ? selectedVariant.stock > 0 : product?.isActive === 1;

  const handleSelectColor = (color) => {
    const variant =
      product.variants.find((item) => item.color === color && item.size === selectedSize) ||
      product.variants.find((item) => item.color === color);

    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleSelectSize = (size) => {
    const variant =
      product.variants.find((item) => item.size === size && item.color === selectedColor) ||
      product.variants.find((item) => item.size === size);

    setSelectedVariant(variant);
    setQuantity(1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    const maxStock = selectedVariant?.stock || 1;
    setQuantity((current) => Math.min(maxStock, current + 1));
  };

  const handleAddToCart = async () => {
    setMessage("");

    if (!selectedVariant) {
      setMessage("Vui lòng chọn size và màu");
      return;
    }

    try {
      await axiosClient.post('/cart/items', {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity
      });

      setMessage("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center text-slate-500">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-3xl font-black text-slate-950">Không tìm thấy sản phẩm</h1>
        <Link to="/ProductListPage" className="mt-6 inline-block font-bold text-orange-500 underline">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const detailRows = [
    { label: "Thương hiệu", value: product.brandName || "Đang cập nhật" },
    { label: "Danh mục", value: product.categoryName || "Đang cập nhật" },
    { label: "Mã sản phẩm", value: `#${product.id}` },
    { label: "SKU", value: selectedVariant?.sku || "Đang cập nhật" }
  ];

  const specRows = [
    ["Thương hiệu", product.brandName || "Đang cập nhật"],
    ["Danh mục", product.categoryName || "Đang cập nhật"],
    ["Màu đang chọn", selectedColor || "Đang cập nhật"],
    ["Size đang chọn", selectedSize || "Đang cập nhật"],
    ["Tồn kho", selectedVariant ? `${selectedVariant.stock} sản phẩm` : "Đang cập nhật"],
    ["SKU", selectedVariant?.sku || "Đang cập nhật"]
  ];

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <Link to="/" className="hover:text-slate-950">Trang chủ</Link>
          <span>/</span>
          <Link to="/ProductListPage" className="hover:text-slate-950">Sản phẩm</Link>
          <span>/</span>
          <span className="text-slate-950">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={getImageSrc(selectedImage)}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                  }}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {(product.images?.length > 0 ? product.images : [{ id: "placeholder", imageUrl: selectedImage }]).map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(image.imageUrl)}
                    className={
                      selectedImage === image.imageUrl
                        ? "overflow-hidden rounded-xl bg-slate-100 p-2 ring-2 ring-orange-500 ring-offset-2"
                        : "overflow-hidden rounded-xl bg-slate-100 p-2 opacity-70 transition hover:opacity-100"
                    }
                  >
                    <img
                      src={getImageSrc(image.imageUrl)}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                      }}
                      className="aspect-square w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                  {product.brandName}
                </span>
                <span
                  className={
                    isInStock
                      ? "rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700"
                      : "rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500"
                  }
                >
                  {isInStock ? "Còn hàng" : "Hết hàng"}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
                {product.name}
              </h1>
              <p className="mt-4 leading-7 text-slate-500">
                {product.description}
              </p>

              <div className="mt-6 border-y border-slate-100 py-6">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Giá sản phẩm
                </p>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {Number(displayPrice).toLocaleString("vi-VN")}₫
                </p>
              </div>

              {colors.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Màu sắc</h2>
                    <span className="text-sm font-semibold text-slate-500">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleSelectColor(color)}
                        className={
                          selectedColor === color
                            ? "rounded-full border border-slate-950 bg-slate-950 px-5 py-2 text-sm font-bold text-white"
                            : "rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                        }
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Kích cỡ</h2>
                    <span className="text-sm font-semibold text-slate-500">Size {selectedSize}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {sizes.map((size) => {
                      const variant = product.variants.find(
                        (item) => item.size === size && (!selectedColor || item.color === selectedColor)
                      );
                      const disabled = !variant || variant.stock <= 0;

                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={disabled}
                          onClick={() => handleSelectSize(size)}
                          className={`rounded-xl border py-3 text-sm font-bold transition ${selectedSize === size
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                            } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Số lượng</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="px-4 py-2.5 text-slate-500 transition hover:text-orange-500"
                      aria-label="Giảm"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-10 text-center font-bold text-slate-950">{quantity}</span>
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      className="px-4 py-2.5 text-slate-500 transition hover:text-orange-500"
                      aria-label="Tăng"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {selectedVariant && (
                    <span className="text-sm font-semibold text-slate-500">
                      Còn {selectedVariant.stock} sản phẩm
                    </span>
                  )}
                </div>
              </div>

              {message && (
                <p className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                  {message}
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="rounded-full border border-slate-950 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-950 hover:text-white"
                >
                  Thêm vào giỏ
                </button>
                <button
                  type="button"
                  className="rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-orange-500"
                >
                  Mua ngay
                </button>
              </div>

              <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
                {[
                  { Icon: Truck, title: "Giao hàng nhanh", description: "Nhận hàng trong 2-5 ngày tùy khu vực." },
                  { Icon: RotateCcw, title: "Đổi trả dễ dàng", description: "Hỗ trợ đổi size nếu sản phẩm còn nguyên trạng." },
                  { Icon: ShieldCheck, title: "Sản phẩm chính hãng", description: "Cam kết sản phẩm đúng thương hiệu và mô tả." }
                ].map(({ Icon, title, description }) => (
                  <div key={title} className="flex gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-500">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-950">{title}</h3>
                      <p className="text-sm text-slate-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Chi tiết sản phẩm</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            {detailRows.map((row) => (
              <div key={row.label} className="rounded-2xl bg-slate-50 p-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{row.label}</span>
                <p className="mt-1 font-bold text-slate-950">{row.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-wrap gap-2 border-b border-slate-100">
            {[
              { key: "desc", label: "Mô tả sản phẩm" },
              { key: "specs", label: "Thông số kỹ thuật" },
              { key: "shipping", label: "Vận chuyển & Đổi trả" }
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={
                  tab === item.key
                    ? "-mb-px border-b-2 border-orange-500 px-4 py-3 text-sm font-bold text-slate-950"
                    : "-mb-px border-b-2 border-transparent px-4 py-3 text-sm font-bold text-slate-400 transition hover:text-slate-950"
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6 leading-7 text-slate-600">
            {tab === "desc" && (
              <div className="space-y-5">
                <p>
                  {product.name} từ {product.brandName} là lựa chọn phù hợp cho nhu cầu sử dụng hằng ngày. {product.description}
                </p>
                <div>
                  <h3 className="mb-3 font-bold text-slate-950">Điểm nổi bật</h3>
                  <ul className="space-y-2">
                    {HIGHLIGHTS.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === "specs" && (
              <div className="overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full text-sm">
                  <tbody>
                    {specRows.map(([label, value], index) => (
                      <tr key={label} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                        <td className="w-1/3 px-5 py-3 font-bold text-slate-950">{label}</td>
                        <td className="px-5 py-3 text-slate-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "shipping" && (
              <div className="space-y-4">
                <p><strong className="text-slate-950">Giao hàng:</strong> Thời gian giao hàng dự kiến 2-5 ngày tùy khu vực.</p>
                <p><strong className="text-slate-950">Đổi trả:</strong> Hỗ trợ đổi size trong vòng 7 ngày nếu sản phẩm còn nguyên trạng.</p>
                <p><strong className="text-slate-950">Bảo hành:</strong> Hỗ trợ xử lý các lỗi từ nhà sản xuất theo chính sách cửa hàng.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
