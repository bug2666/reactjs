import { Fragment, useCallback, useEffect, useState } from "react";
import { Boxes, ChevronDown, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
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

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [editingVariant, setEditingVariant] = useState(null);
    const [variantValues, setVariantValues] = useState(variantInitialValues);
    const [page, setPage] = useState(1);
    const [editingProductId, setEditingProductId] = useState(null);

    const [uploadFile, setUploadFile] = useState(null);


    const PRODUCT_PLACEHOLDER_IMAGE = "/images/product-placeholder.png";

    const getImageSrc = (imageUrl) => {
        if (!imageUrl) {
            return PRODUCT_PLACEHOLDER_IMAGE;
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${process.env.REACT_APP_API_URL.replace('/api', '')}${imageUrl}`;
    };



    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1
    });

    const showSuccessMessage = (text) => {
        setMessageType("success");
        setMessage(text);
        toast.success(text);
    };

    const showErrorMessage = (text) => {
        setMessageType("error");
        setMessage(text);
        toast.error(text);
    };

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
            showErrorMessage(error.response?.data?.message || error.message);
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

            const res = await axiosClient.delete(`/products/deleteProduct/${productId}`);

            if (res.data.action === 'hidden') {
                setProducts((currentProducts) => {
                    return currentProducts.map((product) => {
                        if (product.id === productId) {
                            return {
                                ...product,
                                isActive: 0
                            };
                        }

                        return product;
                    });
                });

                showSuccessMessage(res.data.message);
                return;
            }

            setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
            showSuccessMessage(res.data.message);

        } catch (error) {
            const data = error.response?.data;

            if (data?.blockers) {
                showErrorMessage(`${data.message}: ${data.blockers.join(" ")}`);
            } else {
                showErrorMessage(data?.message || error.message);
            }
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
                showSuccessMessage("Cập nhật sản phẩm thành công");
            } else {
                await fetchInitialData();
                showSuccessMessage("Thêm sản phẩm thành công");
            }

            setShowCreateForm(false);
            setEditingProduct(null);
            setEditingProductId(null);
            helpers.resetForm();
        } catch (error) {
            showErrorMessage(error.response?.data?.message || error.message);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    const resetVariantValues = () => {
        setEditingVariant(null);
        setVariantValues(variantInitialValues);
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
            resetVariantValues();
            showSuccessMessage(editingVariant ? "Cập nhật biến thể thành công" : "Thêm biến thể thành công");
        } catch (error) {
            showErrorMessage(error.response?.data?.message || error.message);
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
            showSuccessMessage("Xóa biến thể thành công");
        } catch (error) {
            const data = error.response?.data;

            if (data?.product) {
                updateProductInState(data.product);
            }

            showErrorMessage(data?.message || error.message);
        }

    };

    const handleUploadImage = async (event, productId) => {
        event.preventDefault();

        if (!uploadFile) {
            showErrorMessage("Vui lòng chọn ảnh");
            return;
        }

        try {
            setMessage("");

            const product = products.find((item) => item.id === productId);
            const existingImages = product?.images || [];
            const maxSortOrder = existingImages.reduce(
                (max, image) => Math.max(max, Number(image.sortOrder) || 0),
                -1
            );
            const nextSortOrder = maxSortOrder + 1;

            const formData = new FormData();
            formData.append("sortOrder", String(nextSortOrder));
            formData.append("image", uploadFile);

            const res = await axiosClient.post(`/products/${productId}/images/upload`, formData);

            updateProductInState(res.data);
            setUploadFile(null);
            showSuccessMessage("Upload ảnh thành công");
        } catch (error) {
            showErrorMessage(error.response?.data?.message || error.message);
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
            showSuccessMessage("Xóa ảnh thành công");
        } catch (error) {
            showErrorMessage(error.response?.data?.message || error.message);
        }
    };

    function ProductsSummary({ currentCount, totalCount }) {
        return (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                <Boxes size={18} />
                Hiển thị {currentCount} / {totalCount} sản phẩm
            </div>
        );
    }


    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                        Products
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        Quản lý sản phẩm
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Danh sách, thêm, sửa, xóa sản phẩm, biến thể và ảnh.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setEditingProduct(null);
                        setShowCreateForm(true);

                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
                >
                    <Plus size={18} />
                    Thêm sản phẩm
                </button>
            </div>

            {showCreateForm && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
                                    <Field name="name" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
                                    <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Giá</label>
                                    <Field name="basePrice" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
                                    <ErrorMessage name="basePrice" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Danh mục</label>
                                    <Field as="select" name="categoryId" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="categoryId" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Thương hiệu</label>
                                    <Field as="select" name="brandId" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
                                        <option value="">Chọn thương hiệu</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="brandId" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Trạng thái</label>
                                    <Field as="select" name="isActive" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
                                        <option value="1">Đang bán</option>
                                        <option value="0">Ẩn</option>
                                    </Field>
                                    <ErrorMessage name="isActive" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-bold text-gray-700">Mô tả</label>
                                    <Field as="textarea" name="description" rows="4" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
                                    <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div className="md:col-span-2">
                                    <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:opacity-60">
                                        {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {loading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">Đang tải sản phẩm...</div>
            )}

            {!loading && products.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">Chưa có sản phẩm.</div>
            )}

            {!loading && products.length > 0 && (
                <div className="space-y-4">

                    <ProductsSummary
                        currentCount={products.length}
                        totalCount={pagination.totalItems}
                    />
                    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto rounded-3xl">
                            <table className="w-full min-w-[1192px] table-fixed text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="w-14 px-4 py-3">ID</th>
                                        <th className="w-24 px-4 py-3">Ảnh</th>
                                        <th className="w-52 px-4 py-3">Tên</th>
                                        <th className="w-36 px-4 py-3">Danh mục</th>
                                        <th className="w-32 px-4 py-3">Thương hiệu</th>
                                        <th className="w-28 px-4 py-3">Giá</th>
                                        <th className="w-25 px-4 py-3">Trạng thái</th>
                                        <th className="w-[340px] px-4 py-3 text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.map((product) => (
                                        <Fragment key={product.id}>
                                            <tr className="transition hover:bg-orange-50/40">
                                                <td className="px-4 py-4 font-bold text-slate-500">#{product.id}</td>
                                                <td className="px-4 py-4">
                                                    <img
                                                        src={getImageSrc(product.imageUrl)}
                                                        alt={product.name}
                                                        onError={(event) => {
                                                            event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                                                        }}
                                                        className="h-16 w-16 rounded-2xl border border-slate-100 bg-slate-50 object-contain p-1"
                                                    />

                                                </td>
                                                <td className="px-4 py-4 font-black text-slate-900">
                                                    <p className="max-w-[170px] truncate" title={product.name}>{product.name}</p>
                                                </td>
                                                <td className="px-4 py-4"><span className="inline-flex max-w-[110px] truncate rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600" title={product.categoryName}>{product.categoryName}</span></td>
                                                <td className="px-4 py-4 text-slate-600"><span className="block max-w-[100px] truncate" title={product.brandName}>{product.brandName}</span></td>
                                                <td className="px-4 py-4 font-black text-slate-950">{Number(product.basePrice).toLocaleString("vi-VN")}đ</td>
                                                <td className="px-4 py-4">
                                                    {product.isActive === 1 ? (
                                                        <span className="inline-flex whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Đang bán</span>
                                                    ) : (
                                                        <span className="inline-flex whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">Ẩn</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-nowrap justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                setEditingProduct(null);
                                                                setEditingProductId(null);

                                                                if (expandedProductId === product.id) {
                                                                    setExpandedProductId(null);
                                                                    return;
                                                                }

                                                                const res = await axiosClient.get(`/products/getProductById/${product.id}`);
                                                                updateProductInState(res.data);
                                                                setExpandedProductId(product.id);
                                                                resetVariantValues();
                                                            }}
                                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-700 transition hover:bg-slate-50"
                                                        >
                                                            <ChevronDown size={15} />
                                                            Chi tiết
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                if (editingProductId === product.id) {
                                                                    setEditingProduct(null);
                                                                    setEditingProductId(null);
                                                                    return;
                                                                }

                                                                const res = await axiosClient.get(`/products/getProductById/${product.id}`);
                                                                updateProductInState(res.data);
                                                                setEditingProduct(res.data);
                                                                setEditingProductId(product.id);
                                                                setExpandedProductId(null);
                                                                resetVariantValues();
                                                                setShowCreateForm(false);
                                                            }}

                                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-700 transition hover:bg-slate-50"
                                                        >
                                                            <Pencil size={15} />
                                                            Sửa
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 font-bold text-red-600 transition hover:bg-red-50"
                                                        >
                                                            <Trash2 size={15} />
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {editingProductId === product.id && (
                                                <tr>
                                                    <td colSpan="8" className="border-t border-gray-100 bg-gray-50 p-5">
                                                        <div className="mb-5 flex items-center justify-between">
                                                            <h3 className="text-lg font-bold text-gray-900">Sửa sản phẩm #{product.id}</h3>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingProduct(null);
                                                                    setEditingProductId(null);
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
                                                                        <Field name="name" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
                                                                        <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-500" />
                                                                    </div>

                                                                    <div>
                                                                        <label className="mb-2 block text-sm font-bold text-gray-700">Giá</label>
                                                                        <Field name="basePrice" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
                                                                        <ErrorMessage name="basePrice" component="p" className="mt-1 text-sm text-red-500" />
                                                                    </div>

                                                                    <div>
                                                                        <label className="mb-2 block text-sm font-bold text-gray-700">Danh mục</label>
                                                                        <Field as="select" name="categoryId" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
                                                                            <option value="">Chọn danh mục</option>
                                                                            {categories.map((category) => (
                                                                                <option key={category.id} value={category.id}>{category.name}</option>
                                                                            ))}
                                                                        </Field>
                                                                        <ErrorMessage name="categoryId" component="p" className="mt-1 text-sm text-red-500" />
                                                                    </div>

                                                                    <div>
                                                                        <label className="mb-2 block text-sm font-bold text-gray-700">Thương hiệu</label>
                                                                        <Field as="select" name="brandId" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
                                                                            <option value="">Chọn thương hiệu</option>
                                                                            {brands.map((brand) => (
                                                                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                                                                            ))}
                                                                        </Field>
                                                                        <ErrorMessage name="brandId" component="p" className="mt-1 text-sm text-red-500" />
                                                                    </div>

                                                                    <div>
                                                                        <label className="mb-2 block text-sm font-bold text-gray-700">Trạng thái</label>
                                                                        <Field as="select" name="isActive" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100">
                                                                            <option value="1">Đang bán</option>
                                                                            <option value="0">Ẩn</option>
                                                                        </Field>
                                                                        <ErrorMessage name="isActive" component="p" className="mt-1 text-sm text-red-500" />
                                                                    </div>

                                                                    <div className="md:col-span-2">
                                                                        <label className="mb-2 block text-sm font-bold text-gray-700">Mô tả</label>
                                                                        <Field as="textarea" name="description" rows="4" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
                                                                        <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-500" />
                                                                    </div>

                                                                    <div className="md:col-span-2 flex gap-3">
                                                                        <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:opacity-60">
                                                                            {isSubmitting ? "Đang lưu..." : "Cập nhật sản phẩm"}
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setEditingProduct(null);
                                                                                setEditingProductId(null);
                                                                            }}
                                                                            className="rounded-lg border border-gray-200 px-5 py-3 font-bold text-gray-700 hover:bg-gray-50"
                                                                        >
                                                                            Hủy
                                                                        </button>
                                                                    </div>
                                                                </Form>
                                                            )}
                                                        </Formik>
                                                    </td>
                                                </tr>
                                            )}

                                            {expandedProductId === product.id && (
                                                <tr>
                                                    <td colSpan="8" className="border-t border-slate-100 bg-slate-50/70 p-5">
                                                        <div className="grid gap-6 lg:grid-cols-2">
                                                            <div>
                                                                <h3 className="text-lg font-black text-slate-900">Biến thể</h3>
                                                                <form onSubmit={(event) => handleSubmitVariant(event, product.id)} className="mt-4 space-y-3">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <label className="space-y-1">
                                                                            <span className="text-sm font-semibold text-gray-600">Size</span>
                                                                            <input
                                                                                value={variantValues.size}
                                                                                onChange={(event) => setVariantValues({ ...variantValues, size: event.target.value })}
                                                                                placeholder="Size"
                                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                                                            />
                                                                        </label>

                                                                        <label className="space-y-1">
                                                                            <span className="text-sm font-semibold text-gray-600">Màu</span>
                                                                            <input
                                                                                value={variantValues.color}
                                                                                onChange={(event) => setVariantValues({ ...variantValues, color: event.target.value })}
                                                                                placeholder="Màu"
                                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                                                            />
                                                                        </label>

                                                                        <label className="space-y-1">
                                                                            <span className="text-sm font-semibold text-gray-600">Tồn kho</span>
                                                                            <input
                                                                                type="number"
                                                                                value={variantValues.stock}
                                                                                onChange={(event) => setVariantValues({ ...variantValues, stock: event.target.value })}
                                                                                placeholder="Tồn kho"
                                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                                                            />
                                                                        </label>

                                                                        <label className="space-y-1">
                                                                            <span className="text-sm font-semibold text-gray-600">Giá</span>
                                                                            <input
                                                                                type="number"
                                                                                value={variantValues.price}
                                                                                onChange={(event) => setVariantValues({ ...variantValues, price: event.target.value })}
                                                                                placeholder="Giá"
                                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                                                            />
                                                                        </label>

                                                                        <label className="col-span-2 space-y-1">
                                                                            <span className="text-sm font-semibold text-gray-600">SKU</span>
                                                                            <input
                                                                                value={variantValues.sku}
                                                                                onChange={(event) => setVariantValues({ ...variantValues, sku: event.target.value })}
                                                                                placeholder="SKU"
                                                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                                                            />
                                                                        </label>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <button type="submit" className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                                                                            {editingVariant ? "Cập nhật biến thể" : "Thêm biến thể"}
                                                                        </button>
                                                                        {editingVariant && (
                                                                            <button type="button" onClick={resetVariantValues} className="rounded-lg border border-gray-200 px-4 py-2 font-bold text-gray-700 hover:bg-gray-50">Hủy</button>
                                                                        )}
                                                                    </div>
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
                                                                <h3 className="flex items-center gap-2 text-lg font-black text-slate-900"><ImagePlus size={20} />Ảnh sản phẩm</h3>
                                                                <form onSubmit={(event) => handleUploadImage(event, product.id)} className="mt-4 grid grid-cols-4 gap-3">
                                                                    <input
                                                                        type="file"
                                                                        accept="image/png,image/jpeg,image/webp"
                                                                        onChange={(event) => setUploadFile(event.target.files[0])}
                                                                        className="col-span-2 rounded-lg border border-gray-300 px-3 py-2"
                                                                    />
                                                                    <button
                                                                        type="submit"
                                                                        className="rounded-lg bg-black px-4 py-2 font-bold text-white hover:bg-gray-800"
                                                                    >
                                                                        Upload ảnh
                                                                    </button>
                                                                </form>

                                                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                                    {(product.images || []).map((image) => (
                                                                        <div key={image.id} className="rounded-lg border border-gray-100 p-3 text-sm">
                                                                            <img
                                                                                src={getImageSrc(image.imageUrl)}
                                                                                alt={product.name}
                                                                                onError={(event) => {
                                                                                    event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                                                                                }}
                                                                                className="h-28 w-full rounded-lg bg-gray-100 object-contain"
                                                                            />

                                                                            <p className="mt-2 text-gray-500">Thứ tự: {image.sortOrder}</p>
                                                                            <div className="mt-2 flex gap-3">
                                                                                <button type="button" onClick={() => handleDeleteImage(image.id)} className="font-bold text-red-600">Xóa</button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
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
