import { useEffect, useState } from 'react';
import { ShoppingBag, User, LogOut, Package, IdCard } from 'lucide-react';
import { Link } from "react-router-dom";

export default function Header() {
    const [user, setUser] = useState(null);
    const [openUserMenu, setOpenUserMenu] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setOpenUserMenu(false);
            window.location.href = '/login';
        }
    };


    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-700 bg-white/90 backdrop-blur-md h-20">
            <nav className="flex items-center h-full justify-between px-20">

                <div className="text-2xl uppercase font-black">Logo</div>

                <div className="flex items-center gap-9">
                    <Link className="text-gray-600 hover:text-black font-bold" to="/">
                        Home
                    </Link>

                    <Link className="text-gray-600 hover:text-black font-bold" to="/ProductListPage">
                        Products
                    </Link>

                    <Link className="text-gray-600 hover:text-black font-bold" to="/contact">
                        Contact
                    </Link>
                </div>

                <div className="flex items-center gap-9">


                    {user ? (
                        <>
                            <Link to="/cart" className="hover:text-orange-500">
                                <ShoppingBag size={20} />
                            </Link>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setOpenUserMenu(!openUserMenu)}
                                    className="flex items-center gap-2 font-bold text-gray-700 hover:text-orange-500"
                                >
                                    <User size={20} />
                                    <span>{user.name}</span>
                                </button>

                                {openUserMenu && (
                                    <div className="absolute right-0 top-10 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                                        <div className="border-b border-gray-100 px-4 py-3">
                                            <p className="text-sm font-bold text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            onClick={() => setOpenUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                                        >
                                            <IdCard size={17} />
                                            Thông tin cá nhân
                                        </Link>

                                        <Link
                                            to="/orders"
                                            onClick={() => setOpenUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                                        >
                                            <Package size={17} />
                                            Đơn hàng
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut size={17} />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="text-gray-600 hover:text-black font-bold">
                            Đăng nhập / Đăng ký
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
