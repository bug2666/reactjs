import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import axiosClient from "../../api/axiosClient";

const getInitials = (name) => {
    return (name || "U")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1
    });

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await axiosClient.get(`/admin/users?page=${page}&limit=10`);
            setUsers(res.data.users);
            setPagination(res.data.pagination);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            setMessage(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleUpdateRole = async (userId, role) => {
        try {
            setMessage("");

            const res = await axiosClient.put(`/admin/users/${userId}/role`, {
                role
            });

            setUsers((currentUsers) => {
                return currentUsers.map((user) => {
                    if (user.id === userId) {
                        return res.data;
                    }

                    return user;
                });
            });

            setMessage("Cập nhật vai trò thành công");
            toast.success("Cập nhật vai trò thành công");
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            setMessage(message);
            toast.error(message);
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa người dùng này?");

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            await axiosClient.delete(`/admin/users/${userId}`);
            setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
            setMessage("Xóa người dùng thành công");
            toast.success("Xóa người dùng thành công");
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            setMessage(message);
            toast.error(message);
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                        Accounts
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        Quản lý người dùng
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Danh sách tài khoản, phân quyền và thao tác quản trị.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
                    <Users size={18} />
                    {pagination.totalItems} người dùng
                </div>
            </div>

            {loading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                    Đang tải người dùng...
                </div>
            )}

            {!loading && (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <p className="text-sm font-bold text-slate-600">
                            Hiển thị {users.length} / {pagination.totalItems} người dùng
                        </p>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Trang {pagination.page}
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Người dùng</th>
                                    <th className="px-5 py-4">Email</th>
                                    <th className="px-5 py-4">SĐT</th>
                                    <th className="px-5 py-4">Vai trò</th>
                                    <th className="px-5 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="transition hover:bg-orange-50/40">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-sm font-black text-white">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900">{user.name}</p>
                                                    <p className="text-xs font-semibold text-slate-400">#{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-slate-600">{user.email}</td>
                                        <td className="px-5 py-4 text-slate-500">{user.phone || "-"}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.role === "admin" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                                                        <ShieldCheck size={13} />
                                                        Admin
                                                    </span>
                                                )}
                                                <select
                                                    value={user.role}
                                                    onChange={(event) => handleUpdateRole(user.id, event.target.value)}
                                                    className="rounded-xl border border-slate-200 px-3 py-2 font-bold outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 font-bold text-red-600 transition hover:bg-red-50"
                                            >
                                                <Trash2 size={15} />
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {pagination.totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 p-4">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                                                ? "rounded-xl bg-orange-500 px-3 py-2 font-black text-white shadow-lg shadow-orange-500/25"
                                                : "rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-700 transition hover:bg-slate-50"
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
                                className="rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
