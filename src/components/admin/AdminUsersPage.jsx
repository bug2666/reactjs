import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

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

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await axiosClient.get(`/admin/users?page=${page}&limit=10`);
            setUsers(res.data.users);
            setPagination(res.data.pagination);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

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
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
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
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    return (
        <section>
            <h1 className="text-3xl font-bold text-gray-900">
                Quản lý người dùng
            </h1>

            <p className="mt-2 text-gray-500">
                Danh sách, phân quyền và xóa tài khoản.
            </p>

            {loading && (
                <div className="mt-6 rounded-xl bg-white p-6 text-gray-500 shadow-sm">
                    Đang tải người dùng...
                </div>
            )}

            {message && (
                <div className="mt-6 rounded-xl bg-gray-100 p-4 text-sm text-gray-700">
                    {message}
                </div>
            )}

            {!loading && (
                <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">
                        Hiển thị {users.length} / {pagination.totalItems} người dùng
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left text-sm">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Tên</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">SĐT</th>
                                    <th className="px-4 py-3">Vai trò</th>
                                    <th className="px-4 py-3 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-3 font-semibold">#{user.id}</td>
                                        <td className="px-4 py-3">{user.name}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">{user.phone || "-"}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={user.role}
                                                onChange={(event) => handleUpdateRole(user.id, event.target.value)}
                                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 border-t border-gray-100 p-4">
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
