import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosClient from "../../api/axiosClient";


export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatPrice = (price) => {
        return Number(price).toLocaleString("vi-VN") + "đ";
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosClient.get('/orders/my-orders');
                const data = res.data;

                setOrders(data);
            } catch (error) {
                const message = error.response?.data?.message || error.message;
                toast.error(`Tải đơn hàng thất bại: ${message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-20 text-center text-gray-500">
                Đang tải đơn hàng...
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900">
                Đơn hàng của tôi
            </h1>

            <div className="mt-8 space-y-4">
                {orders.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500">
                        Bạn chưa có đơn hàng nào.
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-gray-900">
                                        Đơn hàng #{order.id}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Ngày tạo: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>

                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                                    {order.status}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                <span className="text-gray-500">
                                    Tổng tiền
                                </span>

                                <span className="text-lg font-bold text-gray-900">
                                    {formatPrice(order.totalAmount)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
