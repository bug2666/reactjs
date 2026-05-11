import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function AdminBrandsPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [editingBrand, setEditingBrand] = useState(null);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await axiosClient.get('/admin/brands');
            setBrands(res.data);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const resetForm = () => {
        setName("");
        setEditingBrand(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setMessage("");

            const res = editingBrand
                ? await axiosClient.put(`/admin/brands/${editingBrand.id}`, { name })
                : await axiosClient.post('/admin/brands', { name });

            if (editingBrand) {
                setBrands((currentBrands) => {
                    return currentBrands.map((brand) => {
                        if (brand.id === editingBrand.id) {
                            return res.data;
                        }

                        return brand;
                    });
                });
                setMessage("Cập nhật thương hiệu thành công");
            } else {
                setBrands((currentBrands) => [res.data, ...currentBrands]);
                setMessage("Thêm thương hiệu thành công");
            }

            resetForm();
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    const handleDelete = async (brandId) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa thương hiệu này?");

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            await axiosClient.delete(`/admin/brands/${brandId}`);
            setBrands((currentBrands) => currentBrands.filter((brand) => brand.id !== brandId));
            setMessage("Xóa thương hiệu thành công");
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    return (
        <section>
            <h1 className="text-3xl font-bold text-gray-900">
                Quản lý thương hiệu
            </h1>

            <p className="mt-2 text-gray-500">
                Thêm, sửa và xóa thương hiệu sản phẩm.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                    Tên thương hiệu
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        placeholder="Nhập tên thương hiệu"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
                    >
                        {editingBrand ? "Cập nhật" : "Thêm"}
                    </button>
                    {editingBrand && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-lg border border-gray-200 px-5 py-3 font-bold text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </form>

            {loading && (
                <div className="mt-6 rounded-xl bg-white p-6 text-gray-500 shadow-sm">
                    Đang tải thương hiệu...
                </div>
            )}

            {message && (
                <div className="mt-6 rounded-xl bg-gray-100 p-4 text-sm text-gray-700">
                    {message}
                </div>
            )}

            {!loading && (
                <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Tên</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Sản phẩm</th>
                                <th className="px-4 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {brands.map((brand) => (
                                <tr key={brand.id}>
                                    <td className="px-4 py-3 font-semibold">#{brand.id}</td>
                                    <td className="px-4 py-3">{brand.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{brand.slug}</td>
                                    <td className="px-4 py-3">{brand.productCount}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingBrand(brand);
                                                    setName(brand.name);
                                                }}
                                                className="rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(brand.id)}
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
            )}
        </section>
    );
}
