import { useCallback, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosClient from '../../api/axiosClient';

const productSchema = Yup.object({
    name: Yup.string().trim().required("Vui lòng nhập tên sản phẩm"),
    description: Yup.string().trim().required("Vui lòng nhập mô tả"),
    categoryId: Yup.string().required("Vui lòng chọn danh mục"),
    brandId: Yup.string().required("Vui lòng chọn thương hiệu"),
    basePrice: Yup.number().typeError("Giá phải là số").min(0, "Giá không được âm").required("Vui lòng nhập giá"),
    isActive: Yup.string().required("Vui lòng chọn trạng thái")
});

const variantInitialValues = {
    size: "",
    color: "",
    stock: "",
    price: "",
    sku: ""
};

const imageInitialValues = {
    imageUrl: "",
    sortOrder: "0"
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [editingVariant, setEditingVariant] = useState(null);
    const [variantValues, setVariantValues] = useState(variantInitialValues);
    const [editingImage, setEditingImage] = useState(null);
    const [imageValues, setImageValues] = useState(imageInitialValues);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1
    });

    const updateProductInState = (updatedProduct) => {
        setProducts((currentProducts) => {
            return currentProducts.map((product) => {
                if (product.id === updatedProduct.id) {
                    return updatedProduct;
                }

                return product;
            });
        });
    };

    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(true);
            setMessage("");

            const [productsRes, categoriesRes, brandsRes] = await Promise.all([
                axiosClient.get(`/products/getProducts?page=${page}&limit=10`),
                axiosClient.get('/admin/categories'),
                axiosClient.get('/admin/brands')
            ]);

            setProducts(productsRes.data.products);
            setPagination(productsRes.data.pagination);
            setCategories(categoriesRes.data);
            setBrands(brandsRes.data);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleDeleteProduct = async (productId) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            await axiosClient.delete(`/products/deleteProduct/${productId}`);
            setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
            setMessage("Xóa sản phẩm thành công");
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    const handleSubmitProduct = async (values, helpers) => {
        try {
            setMessage("");
            const isEditing = Boolean(editingProduct);
            const payload = {
                name: values.name.trim(),
                description: values.description.trim(),
                categoryId: Number(values.categoryId),
                brandId: Number(values.brandId),
                basePrice: Number(values.basePrice),
                isActive: Number(values.isActive)
            };

            const res = isEditing
                ? await axiosClient.put(`/products/updateProduct/${editingProduct.id}`, payload)
                : await axiosClient.post(`/products/createProduct`, payload);

            const data = res.data;

            if (isEditing) {
                updateProductInState(data);
                setMessage("Cập nhật sản phẩm thành công");
            } else {
                setProducts((currentProducts) => [data, ...currentProducts]);
                setMessage("Thêm sản phẩm thành công");
            }

            setShowCreateForm(false);
            setEditingProduct(null);
            helpers.resetForm();
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    const resetVariantForm = () => {
        setEditingVariant(null);
        setVariantValues(variantInitialValues);
    };

    const resetImageForm = () => {
        setEditingImage(null);
        setImageValues(imageInitialValues);
    };

    const handleSubmitVariant = async (event, productId) => {
        event.preventDefault();

        try {
            setMessage("");
            const payload = {
                size: variantValues.size.trim(),
                color: variantValues.color.trim(),
                stock: Number(variantValues.stock || 0),
                price: Number(variantValues.price || 0),
                sku: variantValues.sku.trim()
            };

            const res = editingVariant
                ? await axiosClient.put(`/products/variants/${editingVariant.id}`, payload)
                : await axiosClient.post(`/products/${productId}/variants`, payload);

            updateProductInState(res.data);
            resetVariantForm();
            setMessage(editingVariant ? "Cập nhật biến thể thành công" : "Thêm biến thể thành công");
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    const handleDeleteVariant = async (variantId) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa biến thể này?");

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            const res = await axiosClient.delete(`/products/variants/${variantId}`);
            updateProductInState(res.data);
            setMessage("Xóa biến thể thành công");
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    const handleSubmitImage = async (event, productId) => {
        event.preventDefault();

        try {
            setMessage("");
            const payload = {
                imageUrl: imageValues.imageUrl.trim(),
                sortOrder: Number(imageValues.sortOrder || 0)
            };

            const res = editingImage
                ? await axiosClient.put(`/products/images/${editingImage.id}`, payload)
                : await axiosClient.post(`/products/${productId}/images`, payload);

            updateProductInState(res.data);
            resetImageForm();
            setMessage(editingImage ? "Cập nhật ảnh thành công" : "Thêm ảnh thành công");
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    const handleDeleteImage = async (imageId) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa ảnh này?");

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            const res = await axiosClient.delete(`/products/images/${imageId}`);
            updateProductInState(res.data);
            setMessage("Xóa ảnh thành công");
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    return (
        <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Quản lý sản phẩm
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Danh sách, thêm, sửa, xóa sản phẩm, biến thể và ảnh.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setEditingProduct(null);
                        setShowCreateForm(true);
                    }}
                    className="rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600"
                >
                    Thêm sản phẩm
                </button>
            </div>

            {showCreateForm && (
                <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
                        </h2>

                        <button
                            type="button"
                            onClick={() => {
                                setShowCreateForm(false);
                                setEditingProduct(null);
                            }}
                            className="font-bold text-gray-500 hover:text-black"
                        >
                            Đóng
                        </button>
                    </div>

                    <Formik
                        initialValues={{
                            name: editingProduct?.name || "",
                            description: editingProduct?.description || "",
                            categoryId: editingProduct?.categoryId || "",
                            brandId: editingProduct?.brandId || "",
                            basePrice: editingProduct?.basePrice || "",
                            isActive: String(editingProduct?.isActive ?? 1)
                        }}
                        validationSchema={productSchema}
                        onSubmit={handleSubmitProduct}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Tên sản phẩm</label>
                                    <Field name="name" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black" />
                                    <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Giá</label>
                                    <Field name="basePrice" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black" />
                                    <ErrorMessage name="basePrice" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Danh mục</label>
                                    <Field as="select" name="categoryId" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black">
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="categoryId" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Thương hiệu</label>
                                    <Field as="select" name="brandId" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black">
                                        <option value="">Chọn thương hiệu</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="brandId" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Trạng thái</label>
                                    <Field as="select" name="isActive" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black">
                                        <option value="1">Đang bán</option>
                                        <option value="0">Ẩn</option>
                                    </Field>
                                    <ErrorMessage name="isActive" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Mô tả</label>
                                    <Field as="textarea" name="description" rows="4" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black" />
                                    <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div className="md:col-span-2">
                                    <button type="submit" disabled={isSubmitting} className="rounded-lg bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60">
                                        {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {loading && (
                <div className="mt-6 rounded-xl bg-white p-6 text-gray-500 shadow-sm">Đang tải sản phẩm...</div>
            )}

            {message && (
                <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">{message}</div>
            )}

            {!loading && products.length === 0 && (
                <div className="mt-6 rounded-xl bg-white p-6 text-gray-500 shadow-sm">Chưa có sản phẩm.</div>
            )}

            {!loading && products.length > 0 && (
                <div className="mt-6 space-y-4">
                    <div className="rounded-xl bg-white p-4 text-sm font-semibold text-gray-600 shadow-sm">
                        Hiển thị {products.length} / {pagination.totalItems} sản phẩm
                    </div>

                    {products.map((product) => (
                        <div key={product.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-left text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-3 font-semibold text-gray-700">#{product.id}</td>
                                            <td className="px-4 py-3">
                                                <img src={product.imageUrl || ""} alt={product.name} className="h-14 w-14 rounded-lg bg-gray-100 object-contain" />
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-900">{product.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{product.categoryName}</td>
                                            <td className="px-4 py-3 text-gray-600">{product.brandName}</td>
                                            <td className="px-4 py-3 font-bold text-gray-900">{Number(product.basePrice).toLocaleString("vi-VN")}đ</td>
                                            <td className="px-4 py-3">
                                                {product.isActive === 1 ? (
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Đang bán</span>
                                                ) : (
                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">Ẩn</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setExpandedProductId(expandedProductId === product.id ? null : product.id);
                                                            resetVariantForm();
                                                            resetImageForm();
                                                        }}
                                                        className="rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Chi tiết
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingProduct(product);
                                                            setShowCreateForm(true);
                                                        }}
                                                        className="rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {expandedProductId === product.id && (
                                <div className="grid gap-6 border-t border-gray-100 p-5 lg:grid-cols-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Biến thể</h3>
                                        <form onSubmit={(event) => handleSubmitVariant(event, product.id)} className="mt-4 grid grid-cols-2 gap-3">
                                            <input value={variantValues.size} onChange={(event) => setVariantValues({ ...variantValues, size: event.target.value })} placeholder="Size" className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                                            <input value={variantValues.color} onChange={(event) => setVariantValues({ ...variantValues, color: event.target.value })} placeholder="Màu" className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                                            <input value={variantValues.stock} onChange={(event) => setVariantValues({ ...variantValues, stock: event.target.value })} placeholder="Tồn kho" className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                                            <input value={variantValues.price} onChange={(event) => setVariantValues({ ...variantValues, price: event.target.value })} placeholder="Giá" className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                                            <input value={variantValues.sku} onChange={(event) => setVariantValues({ ...variantValues, sku: event.target.value })} placeholder="SKU" className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                                            <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                                                {editingVariant ? "Cập nhật biến thể" : "Thêm biến thể"}
                                            </button>
                                            {editingVariant && (
                                                <button type="button" onClick={resetVariantForm} className="rounded-lg border border-gray-200 px-4 py-2 font-bold text-gray-700 hover:bg-gray-50">Hủy</button>
                                            )}
                                        </form>

                                        <div className="mt-4 space-y-2">
                                            {(product.variants || []).map((variant) => (
                                                <div key={variant.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm">
                                                    <div>
                                                        <p className="font-bold">{variant.size} / {variant.color}</p>
                                                        <p className="text-gray-500">Tồn: {variant.stock} - Giá: {Number(variant.price).toLocaleString("vi-VN")}đ - SKU: {variant.sku || "-"}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => {
                                                            setEditingVariant(variant);
                                                            setVariantValues({
                                                                size: variant.size,
                                                                color: variant.color,
                                                                stock: String(variant.stock),
                                                                price: String(variant.price),
                                                                sku: variant.sku || ""
                                                            });
                                                        }} className="font-bold text-gray-700">Sửa</button>
                                                        <button type="button" onClick={() => handleDeleteVariant(variant.id)} className="font-bold text-red-600">Xóa</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Ảnh sản phẩm</h3>
                                        <form onSubmit={(event) => handleSubmitImage(event, product.id)} className="mt-4 grid grid-cols-3 gap-3">
                                            <input value={imageValues.imageUrl} onChange={(event) => setImageValues({ ...imageValues, imageUrl: event.target.value })} placeholder="URL ảnh" className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                                            <input value={imageValues.sortOrder} onChange={(event) => setImageValues({ ...imageValues, sortOrder: event.target.value })} placeholder="Thứ tự" className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black" />
                                            <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                                                {editingImage ? "Cập nhật ảnh" : "Thêm ảnh"}
                                            </button>
                                            {editingImage && (
                                                <button type="button" onClick={resetImageForm} className="rounded-lg border border-gray-200 px-4 py-2 font-bold text-gray-700 hover:bg-gray-50">Hủy</button>
                                            )}
                                        </form>

                                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {(product.images || []).map((image) => (
                                                <div key={image.id} className="rounded-lg border border-gray-100 p-3 text-sm">
                                                    <img src={image.imageUrl} alt={product.name} className="h-28 w-full rounded-lg bg-gray-100 object-contain" />
                                                    <p className="mt-2 text-gray-500">Thứ tự: {image.sortOrder}</p>
                                                    <div className="mt-2 flex gap-3">
                                                        <button type="button" onClick={() => {
                                                            setEditingImage(image);
                                                            setImageValues({
                                                                imageUrl: image.imageUrl,
                                                                sortOrder: String(image.sortOrder)
                                                            });
                                                        }} className="font-bold text-gray-700">Sửa</button>
                                                        <button type="button" onClick={() => handleDeleteImage(image.id)} className="font-bold text-red-600">Xóa</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Trước
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
                                                ? "rounded-lg bg-orange-500 px-3 py-2 font-bold text-white"
                                                : "rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                                        }
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                disabled={page === pagination.totalPages}
                                onClick={() => setPage(page + 1)}
                                className="rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
