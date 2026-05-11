import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";


export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await axiosClient.get(`/products/getProductById/${id}`);
        const data = res.data;

        setProduct(data);

        /* lấy ảnh đầu tiên của sản phẩm để làm ảnh chính */
        let firstImage;
        if (data.images && data.images.length > 0) {
          firstImage = data.images[0].imageUrl;
        } else {
          firstImage = data.imageUrl;
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
    if (!product) {
      return [];
    }

    if (!product.variants) {
      return [];
    }

    const variantColors = product.variants.map((variant) => {
      return variant.color;
    });

    const uniqueColors = new Set(variantColors); /* loại bỏ trùng lặp */

    const colorList = [...uniqueColors];

    return colorList;
  }, [product]);


  const sizes = useMemo(() => {
    if (!product) {
      return [];
    }

    if (!product.variants) {
      return [];
    }

    const variantSizes = product.variants.map((variant) => {
      return variant.size;
    });

    const uniqueSizes = new Set(variantSizes);

    const sizeList = [...uniqueSizes];

    return sizeList;
  }, [product]); /* chỉ chạy lại hàm này khi product có sự thay đổi */


  const selectedColor = selectedVariant?.color;
  const selectedSize = selectedVariant?.size;

  const displayPrice = selectedVariant?.price || product?.basePrice;

  const handleSelectColor = (color) => {
    const variant =
      product.variants.find(
        (item) => item.color === color && item.size === selectedSize
      ) ||
      product.variants.find((item) => item.color === color);

    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleSelectSize = (size) => {
    const variant =
      product.variants.find(
        (item) => item.size === size && item.color === selectedColor
      ) ||
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
      const res = await axiosClient.post('/cart/items', {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity
      });

      const data = await res.data;

      setMessage("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-500">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="mb-4 text-gray-600">
          Không tìm thấy sản phẩm.
        </p>

        <Link
          to="/products"
          className="font-semibold text-black underline"
        >
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 text-sm text-gray-500">
          <Link to="/" className="hover:text-black">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-black">
            Sản phẩm
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {product.images?.length > 0 && (
              <div className="mt-5 grid grid-cols-4 gap-4 sm:grid-cols-5">
                {product.images.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setSelectedImage(image.imageUrl)}
                    className={`overflow-hidden rounded-xl border bg-white p-2 transition ${selectedImage === image.imageUrl
                      ? "border-black"
                      : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={product.name}
                      className="aspect-square w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {product.brandName}
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Còn hàng
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-950">
                {product.name}
              </h1>

              <p className="mt-4 leading-7 text-gray-600">
                {product.description}
              </p>

              <div className="mt-6 border-y border-gray-100 py-6">
                <p className="text-sm text-gray-500">Giá sản phẩm</p>

                <div className="mt-2 flex items-end gap-3">
                  <span className="text-3xl font-bold text-gray-950">
                    {Number(displayPrice).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              {colors.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-950">
                      Màu sắc
                    </h2>
                    <span className="text-sm text-gray-500">
                      {selectedColor}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleSelectColor(color)}
                        className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                          }`}
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
                    <h2 className="font-semibold text-gray-950">
                      Kích cỡ
                    </h2>
                    <span className="text-sm text-gray-500">
                      Size {selectedSize}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {sizes.map((size) => {
                      const variant = product.variants.find(
                        (item) =>
                          item.size === size &&
                          (!selectedColor || item.color === selectedColor)
                      );

                      const disabled = !variant || variant.stock <= 0;

                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={disabled}
                          onClick={() => handleSelectSize(size)}
                          className={`rounded-xl border py-3 text-sm font-semibold transition ${selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                            } ${disabled
                              ? "cursor-not-allowed opacity-40"
                              : ""
                            }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h2 className="mb-3 font-semibold text-gray-950">
                  Số lượng
                </h2>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-gray-200 bg-white">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="px-5 py-3 text-lg font-bold"
                    >
                      -
                    </button>

                    <span className="min-w-10 text-center font-semibold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      className="px-5 py-3 text-lg font-bold"
                    >
                      +
                    </button>
                  </div>

                  {selectedVariant && (
                    <span className="text-sm text-gray-500">
                      Còn {selectedVariant.stock} sản phẩm
                    </span>
                  )}
                </div>
              </div>

              {message && (
                <p className="mt-5 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700">
                  {message}
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="rounded-full border border-black px-6 py-4 font-bold text-black transition hover:bg-black hover:text-white"
                >
                  Thêm vào giỏ
                </button>

                <button
                  type="button"
                  className="rounded-full bg-black px-6 py-4 font-bold text-white transition hover:bg-gray-800"
                >
                  Mua ngay
                </button>
              </div>

              <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100" />
                  <div>
                    <h3 className="font-semibold text-gray-950">
                      Giao hàng nhanh
                    </h3>
                    <p className="text-sm text-gray-500">
                      Nhận hàng trong 2-5 ngày tùy khu vực.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100" />
                  <div>
                    <h3 className="font-semibold text-gray-950">
                      Đổi trả dễ dàng
                    </h3>
                    <p className="text-sm text-gray-500">
                      Hỗ trợ đổi size nếu sản phẩm còn nguyên trạng.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100" />
                  <div>
                    <h3 className="font-semibold text-gray-950">
                      Sản phẩm chính hãng
                    </h3>
                    <p className="text-sm text-gray-500">
                      Cam kết sản phẩm đúng thương hiệu và mô tả.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-950">
            Chi tiết sản phẩm
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-4">
              <span className="text-gray-500">Thương hiệu</span>
              <p className="mt-1 font-semibold text-gray-950">
                {product.brandName}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <span className="text-gray-500">Danh mục</span>
              <p className="mt-1 font-semibold text-gray-950">
                {product.categoryName}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <span className="text-gray-500">Mã sản phẩm</span>
              <p className="mt-1 font-semibold text-gray-950">
                #{product.id}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <span className="text-gray-500">SKU</span>
              <p className="mt-1 font-semibold text-gray-950">
                {selectedVariant?.sku || "Đang cập nhật"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
