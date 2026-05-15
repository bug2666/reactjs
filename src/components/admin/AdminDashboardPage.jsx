import { useEffect, useState } from "react";
import { AlertTriangle, Boxes, ClipboardList, Clock3, DollarSign, Users } from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import axiosClient from "../../api/axiosClient";

const chartColors = ["#f97316", "#2563eb", "#10b981", "#8b5cf6", "#ef4444", "#64748b"];

const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + "đ";
};

const hasChartData = (items = []) => {
    return items.some((item) => Number(item.value || item.count || item.revenue || item.orders || 0) > 0);
};

function EmptyChart({ label }) {
    return (
        <div className="grid h-[280px] place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-400">
            {label}
        </div>
    );
}

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
        { label: "Sản phẩm", value: stats.totalProducts, hint: "Đang quản lý", icon: Boxes, color: "bg-blue-500" },
        { label: "Đơn hàng", value: stats.totalOrders, hint: "Tất cả đơn", icon: ClipboardList, color: "bg-violet-500" },
        { label: "Khách hàng", value: stats.totalUsers, hint: "Tài khoản hệ thống", icon: Users, color: "bg-emerald-500" },
        { label: "Doanh thu", value: formatPrice(stats.totalRevenue), hint: "Tổng doanh thu", icon: DollarSign, color: "bg-orange-500" },
        { label: "Đơn chờ xử lý", value: stats.pendingOrders, hint: "Cần xác nhận", icon: Clock3, color: "bg-amber-500" },
        { label: "Sắp hết hàng", value: stats.lowStockVariants, hint: "Biến thể cần nhập", icon: AlertTriangle, color: "bg-rose-500" }
    ] : [];

    const revenueByMonth = stats?.revenueByMonth || [];
    const ordersByStatus = stats?.ordersByStatus || [];
    const productsByCategory = stats?.productsByCategory || [];
    const stockOverview = stats?.stockOverview || [];

    return (
        <section className="space-y-6">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-7 text-white shadow-xl shadow-slate-200">
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-200">
                        Tổng quan
                    </p>
                    <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                        Dashboard quản trị
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                        Theo dõi nhanh doanh thu, đơn hàng, sản phẩm và cảnh báo tồn kho của cửa hàng.
                    </p>
                </div>
            </div>

            {loading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
                    Đang tải thống kê...
                </div>
            )}

            {message && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {message}
                </div>
            )}

            {!loading && stats && (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {cards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-bold text-slate-500">
                                                {card.label}
                                            </p>
                                            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                                                {card.value}
                                            </p>
                                        </div>
                                        <div className={`${card.color} grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg`}>
                                            <Icon size={22} />
                                        </div>
                                    </div>
                                    <p className="mt-5 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        {card.hint}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-black text-slate-950">Doanh thu 6 tháng</h2>
                                    <p className="mt-1 text-sm text-slate-500">Chỉ tính đơn đã giao/hoàn tất.</p>
                                </div>
                                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                                    Revenue
                                </span>
                            </div>

                            {hasChartData(revenueByMonth) ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <AreaChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value) => `${Math.round(value / 1000000)}tr`} />
                                        <Tooltip formatter={(value, name) => [name === "revenue" ? formatPrice(value) : value, name === "revenue" ? "Doanh thu" : "Đơn"]} />
                                        <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fill="url(#revenueGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyChart label="Chưa có dữ liệu doanh thu" />
                            )}
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-black text-slate-950">Trạng thái đơn hàng</h2>
                                <p className="mt-1 text-sm text-slate-500">Phân bổ theo trạng thái xử lý.</p>
                            </div>

                            {hasChartData(ordersByStatus) ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={ordersByStatus} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} interval={0} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} allowDecimals={false} />
                                        <Tooltip formatter={(value) => [value, "Đơn hàng"]} />
                                        <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                                            {ordersByStatus.map((entry, index) => (
                                                <Cell key={entry.status} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyChart label="Chưa có dữ liệu đơn hàng" />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-black text-slate-950">Sản phẩm theo danh mục</h2>
                            <p className="mt-1 text-sm text-slate-500">Top danh mục có nhiều sản phẩm.</p>

                            {hasChartData(productsByCategory) ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie data={productsByCategory} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={3}>
                                            {productsByCategory.map((entry, index) => (
                                                <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [value, name]} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyChart label="Chưa có dữ liệu danh mục" />
                            )}
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-black text-slate-950">Tồn kho biến thể</h2>
                            <p className="mt-1 text-sm text-slate-500">So sánh biến thể ổn định và sắp hết hàng.</p>

                            {hasChartData(stockOverview) ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie data={stockOverview} dataKey="value" nameKey="name" outerRadius={105} label>
                                            {stockOverview.map((entry, index) => (
                                                <Cell key={entry.name} fill={index === 0 ? "#10b981" : "#ef4444"} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [value, name]} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyChart label="Chưa có dữ liệu tồn kho" />
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
