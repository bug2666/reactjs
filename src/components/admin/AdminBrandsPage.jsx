import { useEffect, useState } from "react";
import { Gem, Pencil, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import axiosClient from "../../api/axiosClient";

export default function AdminBrandsPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [name, setName] = useState("");
    const [editingBrand, setEditingBrand] = useState(null);

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

    const fetchBrands = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await axiosClient.get('/admin/brands');
            setBrands(res.data);
        } catch (error) {
            showErrorMessage(error.response?.data?.message || error.message);
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
                showSuccessMessage("Cập nhật thương hiệu thành công");
            } else {
                setBrands((currentBrands) => [res.data, ...currentBrands]);
                showSuccessMessage("Thêm thương hiệu thành công");
            }

            resetForm();
        } catch (error) {
            showErrorMessage(error.response?.data?.message || error.message);
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
            showSuccessMessage("Xóa thương hiệu thành công");
        } catch (error) {
            showErrorMessage(error.response?.data?.message || error.message);
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                        Catalog
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        Quản lý thương hiệu
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Quản lý các nhãn hàng và số lượng sản phẩm gắn với từng thương hiệu.
                    </p>
                </div>
                <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700">
                    {brands.length} thương hiệu
                </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-100 text-violet-600">
                        <Gem size={20} />
                    </div>
                    <div>
                        <h2 className="font-black text-slate-950">
                            {editingBrand ? "Cập nhật thương hiệu" : "Thêm thương hiệu mới"}
                        </h2>
                        <p className="text-sm text-slate-500">Tên thương hiệu sẽ được backend tạo slug.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        placeholder="Nhập tên thương hiệu"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
                    >
                        <Plus size={18} />
                        {editingBrand ? "Cập nhật" : "Thêm"}
                    </button>
                    {editingBrand && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            <X size={18} />
                            Hủy
                        </button>
                    )}
                </div>
            </form>

            {loading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                    Đang tải thương hiệu...
                </div>
            )}

            {!loading && (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">ID</th>
                                    <th className="px-5 py-4">Tên</th>
                                    <th className="px-5 py-4">Slug</th>
                                    <th className="px-5 py-4">Sản phẩm</th>
                                    <th className="px-5 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {brands.map((brand) => (
                                    <tr key={brand.id} className="transition hover:bg-orange-50/40">
                                        <td className="px-5 py-4 font-bold text-slate-500">#{brand.id}</td>
                                        <td className="px-5 py-4 font-black text-slate-900">{brand.name}</td>
                                        <td className="px-5 py-4 text-slate-500">{brand.slug}</td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                                {brand.productCount} sản phẩm
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingBrand(brand);
                                                        setName(brand.name);
                                                    }}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <Pencil size={15} />
                                                    Sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(brand.id)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 font-bold text-red-600 transition hover:bg-red-50"
                                                >
                                                    <Trash2 size={15} />
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
