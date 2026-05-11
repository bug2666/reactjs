import { useEffect, useState } from "react";
import axiosClient from '../../api/axiosClient';

const orderStatuses = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "shipping", label: "Đang giao" },
    { value: "delivered", label: "Đã giao" },
    { value: "completed", label: "Hoàn tất" },
    { value: "cancelled", label: "Đã hủy" }
];

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
        <section>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Quản lý đơn hàng
                </h1>

                <p className="mt-2 text-gray-500">
                    Theo dõi và cập nhật trạng thái đơn hàng.
                </p>
            </div>

            {loading && (
                <div className="mt-6 rounded-xl bg-white p-6 text-gray-500 shadow-sm">
                    Đang tải đơn hàng...
                </div>
            )}

            {message && (
                <div className="mt-6 rounded-xl bg-gray-100 p-4 text-sm text-gray-700">
                    {message}
                </div>
            )}

            {!loading && orders.length === 0 && (
                <div className="mt-6 rounded-xl bg-white p-6 text-gray-500 shadow-sm">
                    Chưa có đơn hàng.
                </div>
            )}

            {!loading && orders.length > 0 && (
                <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left text-sm">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Khách hàng</th>
                                    <th className="px-4 py-3">Người nhận</th>
                                    <th className="px-4 py-3">SĐT</th>
                                    <th className="px-4 py-3">Tổng tiền</th>
                                    <th className="px-4 py-3">Thanh toán</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                    <th className="px-4 py-3">Ngày tạo</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-4 py-3 font-semibold text-gray-700">
                                            #{order.id}
                                        </td>

                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-gray-900">
                                                {order.customerName || "Không rõ"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.customerEmail || ""}
                                            </p>
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {order.shippingName}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {order.shippingPhone}
                                        </td>

                                        <td className="px-4 py-3 font-bold text-gray-900">
                                            {formatPrice(order.totalAmount)}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {order.paymentMethod}
                                        </td>

                                        <td className="px-4 py-3">
                                            <select
                                                value={order.status}
                                                onChange={(event) => handleUpdateStatus(order.id, event.target.value)}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                                            >
                                                {orderStatuses.map((status) => (
                                                    <option key={status.value} value={status.value}>
                                                        {status.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className="px-4 py-3 text-gray-500">
                                            {formatDate(order.createdAt)}
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
