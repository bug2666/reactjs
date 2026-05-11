import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + "đ";
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setMessage("");

                const res = await axiosClient.get('/admin/dashboard/stats');
                setStats(res.data);
            } catch (error) {
                setMessage(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = stats ? [
        { label: "Sản phẩm", value: stats.totalProducts },
        { label: "Đơn hàng", value: stats.totalOrders },
        { label: "Khách hàng", value: stats.totalUsers },
        { label: "Doanh thu", value: formatPrice(stats.totalRevenue) },
        { label: "Đơn chờ xử lý", value: stats.pendingOrders },
        { label: "Biến thể sắp hết hàng", value: stats.lowStockVariants }
    ] : [];

    return (
        <section>
            <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
                Thống kê tổng quan hệ thống.
            </p>

            {loading && (
                <div className="mt-6 rounded-xl bg-white p-6 text-gray-500 shadow-sm">
                    Đang tải thống kê...
                </div>
            )}

            {message && (
                <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                    {message}
                </div>
            )}

            {!loading && stats && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {cards.map((card) => (
                        <div key={card.label} className="rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-sm font-semibold text-gray-500">
                                {card.label}
                            </p>
                            <p className="mt-3 text-3xl font-black text-gray-900">
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
