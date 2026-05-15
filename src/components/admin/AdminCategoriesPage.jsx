import { useEffect, useState } from "react";
import { FolderTree, Pencil, Plus, Trash2, X } from "lucide-react";
import axiosClient from "../../api/axiosClient";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [name, setName] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);

    const showSuccessMessage = (text) => {
        setMessageType("success");
        setMessage(text);
    };

    const showErrorMessage = (text) => {
        setMessageType("error");
        setMessage(text);
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await axiosClient.get('/admin/categories');
            setCategories(res.data);
        } catch (error) {
            showErrorMessage(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setName("");
        setEditingCategory(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setMessage("");

            const res = editingCategory
                ? await axiosClient.put(`/admin/categories/${editingCategory.id}`, { name })
                : await axiosClient.post('/admin/categories', { name });

            if (editingCategory) {
                setCategories((currentCategories) => {
                    return currentCategories.map((category) => {
                        if (category.id === editingCategory.id) {
                            return res.data;
                        }

                        return category;
                    });
                });
                showSuccessMessage("Cập nhật danh mục thành công");
            } else {
                setCategories((currentCategories) => [res.data, ...currentCategories]);
                showSuccessMessage("Thêm danh mục thành công");
            }

            resetForm();
        } catch (error) {
            showErrorMessage(error.response?.data?.message || error.message);
        }
    };

    const handleDelete = async (categoryId) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa danh mục này?");

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            await axiosClient.delete(`/admin/categories/${categoryId}`);
            setCategories((currentCategories) => currentCategories.filter((category) => category.id !== categoryId));
            showSuccessMessage("Xóa danh mục thành công");
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
                        Quản lý danh mục
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Tạo nhóm sản phẩm để khách hàng lọc và tìm kiếm nhanh hơn.
                    </p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                    {categories.length} danh mục
                </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                        <FolderTree size={20} />
                    </div>
                    <div>
                        <h2 className="font-black text-slate-950">
                            {editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
                        </h2>
                        <p className="text-sm text-slate-500">Tên danh mục sẽ được backend tạo slug.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        placeholder="Nhập tên danh mục"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
                    >
                        <Plus size={18} />
                        {editingCategory ? "Cập nhật" : "Thêm"}
                    </button>
                    {editingCategory && (
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
                    Đang tải danh mục...
                </div>
            )}

            {message && (
                <div
                    className={
                        messageType === "success"
                            ? "rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700 shadow-sm"
                            : "rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-sm"
                    }
                >
                    {message}
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
                                {categories.map((category) => (
                                    <tr key={category.id} className="transition hover:bg-orange-50/40">
                                        <td className="px-5 py-4 font-bold text-slate-500">#{category.id}</td>
                                        <td className="px-5 py-4 font-black text-slate-900">{category.name}</td>
                                        <td className="px-5 py-4 text-slate-500">{category.slug}</td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                                {category.productCount} sản phẩm
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingCategory(category);
                                                        setName(category.name);
                                                    }}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <Pencil size={15} />
                                                    Sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(category.id)}
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
