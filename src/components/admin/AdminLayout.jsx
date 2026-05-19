import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Boxes, ClipboardList, FolderTree, Gem, Home, Shield, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../../api/axiosClient";

const navItems = [
    { to: "/admin", label: "Dashboard", icon: BarChart3, end: true },
    { to: "/admin/products", label: "Sản phẩm", icon: Boxes },
    { to: "/admin/orders", label: "Đơn hàng", icon: ClipboardList },
    { to: "/admin/users", label: "Người dùng", icon: Users },
    { to: "/admin/categories", label: "Danh mục", icon: FolderTree },
    { to: "/admin/brands", label: "Thương hiệu", icon: Gem }
];


const fetchAdminOrders = async () => {
    const res = await axiosClient.get(`/orders/admin/all`);
    return res.data;
};

export default function AdminLayout() {
    const [hasNewOrder, setHasNewOrder] = useState(false);

    const previousOrderIdsRef = useRef(new Set());
    const initializedRef = useRef(false);

    const { data: orders = [] } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: fetchAdminOrders,
        refetchInterval: 10000
    });

    useEffect(() => {

        // Lấy tất cả id hiện tại
        const currentIds = orders.map(order => order.id);

        // Nếu là lần chạy đầu tiên
        if (initializedRef.current === false) {

            previousOrderIdsRef.current = new Set(currentIds);

            initializedRef.current = true;

            return;
        }

        let foundNewOrder = false;

        // Kiểm tra từng order
        for (const id of currentIds) {

            const existedBefore =
                previousOrderIdsRef.current.has(id);

            if (!existedBefore) {
                foundNewOrder = true;
                break;
            }
        }

        if (foundNewOrder) {
            setHasNewOrder(true);
        }

        // lưu snapshot mới
        previousOrderIdsRef.current =
            new Set(currentIds);

    }, [orders]);

    return (
        <div className="min-h-screen bg-slate-50 lg:flex">
            <aside className="border-b border-slate-200 bg-slate-950 text-white lg:sticky lg:top-0 lg:min-h-screen lg:w-72 lg:border-b-0">
                <div className="flex items-center justify-between gap-4 px-5 py-5 lg:block lg:px-6 lg:py-7">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/30">
                                <Shield size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">
                                    Admin
                                </p>
                                <h1 className="text-xl font-black tracking-tight">
                                    Control Panel
                                </h1>
                            </div>
                        </div>
                        <p className="mt-5 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-300 lg:block">
                            Quản lý sản phẩm, đơn hàng và dữ liệu cửa hàng trong một giao diện tập trung.
                        </p>
                    </div>

                    <NavLink
                        to="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/10 lg:mt-5"
                    >
                        <Home size={16} />
                        Store
                    </NavLink>
                </div>

                <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible lg:px-5 lg:pb-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isOrdersLink = item.to === "/admin/orders";

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => {
                                    if (isOrdersLink) {
                                        setHasNewOrder(false);
                                    }
                                }}
                                className={({ isActive }) => {
                                    const baseClass = "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition";

                                    if (isActive) {
                                        return `${baseClass} bg-orange-500 text-white shadow-lg shadow-orange-500/25`;
                                    }

                                    return `${baseClass} text-slate-300 hover:bg-white/10 hover:text-white`;
                                }}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>

                                {isOrdersLink && hasNewOrder && (
                                    <span className="ml-auto h-2.5 w-2.5 rounded-full bg-orange-400" />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            <main className="min-w-0 flex-1">
                <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

