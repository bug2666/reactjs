import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-100 lg:flex">
            <aside className="border-b border-gray-200 bg-white p-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
                <h1 className="text-xl font-black uppercase text-gray-900">
                    Admin
                </h1>

                <nav className="mt-6 flex flex-col gap-2">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) => {
                            if (isActive) {
                                return "rounded-lg bg-orange-500 px-4 py-3 font-bold text-white";
                            }

                            return "rounded-lg px-4 py-3 font-bold text-gray-600 hover:bg-gray-100 hover:text-black";
                        }}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) => {
                            if (isActive) {
                                return "rounded-lg bg-orange-500 px-4 py-3 font-bold text-white";
                            }

                            return "rounded-lg px-4 py-3 font-bold text-gray-600 hover:bg-gray-100 hover:text-black";
                        }}
                    >
                        Quản lý sản phẩm
                    </NavLink>

                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) => {
                            if (isActive) {
                                return "rounded-lg bg-orange-500 px-4 py-3 font-bold text-white";
                            }

                            return "rounded-lg px-4 py-3 font-bold text-gray-600 hover:bg-gray-100 hover:text-black";
                        }}
                    >
                        Quản lý đơn hàng
                    </NavLink>

                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) => {
                            if (isActive) {
                                return "rounded-lg bg-orange-500 px-4 py-3 font-bold text-white";
                            }

                            return "rounded-lg px-4 py-3 font-bold text-gray-600 hover:bg-gray-100 hover:text-black";
                        }}
                    >
                        Quản lý người dùng
                    </NavLink>

                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) => {
                            if (isActive) {
                                return "rounded-lg bg-orange-500 px-4 py-3 font-bold text-white";
                            }

                            return "rounded-lg px-4 py-3 font-bold text-gray-600 hover:bg-gray-100 hover:text-black";
                        }}
                    >
                        Quản lý danh mục
                    </NavLink>

                    <NavLink
                        to="/admin/brands"
                        className={({ isActive }) => {
                            if (isActive) {
                                return "rounded-lg bg-orange-500 px-4 py-3 font-bold text-white";
                            }

                            return "rounded-lg px-4 py-3 font-bold text-gray-600 hover:bg-gray-100 hover:text-black";
                        }}
                    >
                        Quản lý thương hiệu
                    </NavLink>
                </nav>
            </aside>

            <main className="flex-1 p-4 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
}
