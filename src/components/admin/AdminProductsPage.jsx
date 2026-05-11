import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


const productSchema = Yup.object({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập tên sản phẩm"),
    description: Yup.string()
        .trim()
        .required("Vui lòng nhập mô tả"),
    categoryId: Yup.string()
        .required("Vui lòng chọn danh mục"),
    brandId: Yup.string()
        .required("Vui lòng chọn thương hiệu"),
    basePrice: Yup.number()
        .typeError("Giá phải là số")
        .min(0, "Giá không được âm")
        .required("Vui lòng nhập giá"),
    isActive: Yup.string()
        .required("Vui lòng chọn trạng thái")
});




export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setMessage("");

                const token = localStorage.getItem("token");

                const res = await fetch(`${process.env.REACT_APP_API_URL}/products/getProducts`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Không lấy được danh sách sản phẩm");
                }

                setProducts(data);
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);


    const handleDeleteProduct = async (productId) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            const token = localStorage.getItem("token");

            const res = await fetch(`${process.env.REACT_APP_API_URL}/products/deleteProduct/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Không xóa được sản phẩm");
            }

            setProducts((currentProducts) => {
                return currentProducts.filter((product) => {
                    return product.id !== productId;
                });
            });
            setMessage("Xóa sản phẩm thành công");
        } catch (error) {
            setMessage(error.message);
        }
    };


    const categories = [];

    products.forEach((product) => {
        const existingCategory = categories.find((category) => {
            return category.id === product.categoryId;
        });

        if (!existingCategory) {
            categories.push({
                id: product.categoryId,
                name: product.categoryName
            });
        }
    });

    const brands = [];

    products.forEach((product) => {
        const existingBrand = brands.find((brand) => {
            return brand.id === product.brandId;
        });

        if (!existingBrand) {
            brands.push({
                id: product.brandId,
                name: product.brandName
            });
        }
    });


    const handleSubmitProduct = async (values, helpers) => {
        try {
            setMessage("");

            const token = localStorage.getItem("token");
            const isEditing = Boolean(editingProduct);

            let url = `${process.env.REACT_APP_API_URL}/products/createProduct`;
            let method = "POST";

            if (isEditing) {
                url = `${process.env.REACT_APP_API_URL}/products/updateProduct/${editingProduct.id}`;
                method = "PUT";
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: values.name.trim(),
                    description: values.description.trim(),
                    categoryId: Number(values.categoryId),
                    brandId: Number(values.brandId),
                    basePrice: Number(values.basePrice),
                    isActive: Number(values.isActive)
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Không lưu được sản phẩm");
            }

            if (isEditing) {
                setProducts((currentProducts) => {
                    return currentProducts.map((product) => {
                        if (product.id === editingProduct.id) {
                            return data;
                        }

                        return product;
                    });
                });

                setMessage("Cập nhật sản phẩm thành công");
            } else {
                setProducts((currentProducts) => {
                    return [data, ...currentProducts];
                });

                setMessage("Thêm sản phẩm thành công");
            }

            setShowCreateForm(false);
            setEditingProduct(null);
            helpers.resetForm();
        } catch (error) {
            setMessage(error.message);
        } finally {
            helpers.setSubmitting(false);
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
                        Danh sách, thêm, sửa và xóa sản phẩm.
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
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Tên sản phẩm
                                    </label>
                                    <Field
                                        name="name"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    />
                                    <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Giá
                                    </label>
                                    <Field
                                        name="basePrice"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    />
                                    <ErrorMessage name="basePrice" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Danh mục
                                    </label>
                                    <Field
                                        as="select"
                                        name="categoryId"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="categoryId" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Thương hiệu
                                    </label>
                                    <Field
                                        as="select"
                                        name="brandId"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    >
                                        <option value="">Chọn thương hiệu</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="brandId" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Trạng thái
                                    </label>
                                    <Field
                                        as="select"
                                        name="isActive"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    >
                                        <option value="1">Đang bán</option>
                                        <option value="0">Ẩn</option>
                                    </Field>
                                    <ErrorMessage name="isActive" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Mô tả
                                    </label>
                                    <Field
                                        as="textarea"
                                        name="description"
                                        rows="4"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    />
                                    <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-500" />
                                </div>

                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="rounded-lg bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60"
                                    >
                                        {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {loading && (
                <div className="mt-6 rounded-xl bg-white p-6 text-gray-500 shadow-sm">
                    Đang tải sản phẩm...
                </div>
            )}

            {message && (
                <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    {message}
                </div>
            )}

            {!loading && products.length === 0 && (
                <div className="mt-6 rounded-xl bg-white p-6 text-gray-500 shadow-sm">
                    Chưa có sản phẩm.
                </div>
            )}

            {!loading && products.length > 0 && (
                <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Ảnh</th>
                                    <th className="px-4 py-3">Tên sản phẩm</th>
                                    <th className="px-4 py-3">Danh mục</th>
                                    <th className="px-4 py-3">Thương hiệu</th>
                                    <th className="px-4 py-3">Giá</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                    <th className="px-4 py-3 text-right">Thao tác</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-4 py-3 font-semibold text-gray-700">
                                            #{product.id}
                                        </td>

                                        <td className="px-4 py-3">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="h-14 w-14 rounded-lg bg-gray-100 object-contain"
                                            />
                                        </td>

                                        <td className="px-4 py-3 font-semibold text-gray-900">
                                            {product.name}
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {product.categoryName}
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {product.brandName}
                                        </td>

                                        <td className="px-4 py-3 font-bold text-gray-900">
                                            {Number(product.basePrice).toLocaleString("vi-VN")}đ
                                        </td>

                                        <td className="px-4 py-3">
                                            {product.isActive === 1 ? (
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                                    Đang bán
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                                                    Ẩn
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}



        </section>
    );
}
