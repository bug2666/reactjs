import { useEffect, useState } from "react";
import { ClipboardList, PackageCheck } from "lucide-react";
import axiosClient from '../../api/axiosClient';

const orderStatuses = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "shipping", label: "Đang giao" },
    { value: "delivered", label: "Đã giao" },
    { value: "completed", label: "Hoàn tất" },
    { value: "cancelled", label: "Đã hủy" }
];

const statusStyles = {
    pending: "bg-amber-100 text-amber-700",
    shipping: "bg-blue-100 text-blue-700",
    delivered: "bg-violet-100 text-violet-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700"
};

const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + "đ";
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setMessage("");

                const res = await axiosClient.get(`/orders/admin/all`);

                const data = res.data;

                setOrders(data);
            } catch (error) {
                setMessage(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, status) => {
        try {
            setMessage("");

            const res = await axiosClient.put(`/orders/admin/${orderId}/status`, {
                status
            });

            const data = res.data;

            setOrders((currentOrders) => {
                return currentOrders.map((order) => {
                    if (order.id === orderId) {
                        return data;
                    }

                    return order;
                });
            });

            setMessage("Cập nhật trạng thái đơn hàng thành công");
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                        Orders
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        Quản lý đơn hàng
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Theo dõi thanh toán, người nhận và cập nhật trạng thái giao hàng.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
                    <ClipboardList size={18} />
                    {orders.length} đơn hàng
                </div>
            </div>

            {loading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                    Đang tải đơn hàng...
                </div>
            )}

            {message && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm">
                    {message}
                </div>
            )}

            {!loading && orders.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                    <PackageCheck className="mx-auto mb-3 text-slate-300" size={42} />
                    Chưa có đơn hàng.
                </div>
            )}

            {!loading && orders.length > 0 && (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1080px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Đơn hàng</th>
                                    <th className="px-5 py-4">Khách hàng</th>
                                    <th className="px-5 py-4">Người nhận</th>
                                    <th className="px-5 py-4">Tổng tiền</th>
                                    <th className="px-5 py-4">Thanh toán</th>
                                    <th className="px-5 py-4">Trạng thái</th>
                                    <th className="px-5 py-4">Ngày tạo</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {orders.map((order) => {
                                    const statusLabel = orderStatuses.find((status) => status.value === order.status)?.label || order.status;

                                    return (
                                        <tr key={order.id} className="transition hover:bg-orange-50/40">
                                            <td className="px-5 py-4">
                                                <p className="font-black text-slate-900">#{order.id}</p>
                                                <p className="text-xs font-semibold text-slate-400">{formatDate(order.createdAt)}</p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-black text-slate-900">
                                                    {order.customerName || "Không rõ"}
                                                </p>
                                                <p className="text-xs font-semibold text-slate-500">
                                                    {order.customerEmail || "-"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-bold text-slate-700">{order.shippingName}</p>
                                                <p className="text-xs text-slate-500">{order.shippingPhone}</p>
                                            </td>

                                            <td className="px-5 py-4 font-black text-slate-950">
                                                {formatPrice(order.totalAmount)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
                                                    {order.paymentMethod}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`${statusStyles[order.status] || "bg-slate-100 text-slate-600"} rounded-full px-3 py-1 text-xs font-black`}>
                                                        {statusLabel}
                                                    </span>
                                                    <select
                                                        value={order.status}
                                                        onChange={(event) => handleUpdateStatus(order.id, event.target.value)}
                                                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                                    >
                                                        {orderStatuses.map((status) => (
                                                            <option key={status.value} value={status.value}>
                                                                {status.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-slate-500">
                                                {formatDate(order.createdAt)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}
