import { useEffect, useState } from 'react';
import { ShoppingBag, User, LogOut, Package, IdCard, Menu, X, Search } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import axiosClient from '../../api/axiosClient';


export default function Header() {
    const [user, setUser] = useState(null);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const [headerSearch, setHeaderSearch] = useState('');
    const navigate = useNavigate();

    const [openMobileMenu, setOpenMobileMenu] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogout = async () => {

        try {
            await axiosClient.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setOpenUserMenu(false);
            window.location.href = '/login';
        }
    };

    const handleHeaderSearch = (event) => {
        event.preventDefault();

        const keyword = headerSearch.trim();

        if (!keyword) {
            navigate('/ProductListPage');
            return;
        }

        navigate(`/ProductListPage?q=${encodeURIComponent(keyword)}`);
        setOpenMobileMenu(false);
    };


    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-700 bg-white/90 backdrop-blur-md">
            <nav className="flex h-20 items-center justify-between px-4 md:px-8 lg:px-20">
                {/* <div className="text-2xl uppercase font-black">Logo</div> */}
                <a href="/">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-10 w-auto"
                    />
                </a>

                <div className="hidden items-center gap-9 md:flex">

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

                <form onSubmit={handleHeaderSearch} className="relative hidden w-64 lg:block">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={headerSearch}
                        onChange={(event) => setHeaderSearch(event.target.value)}
                        placeholder="Tìm sản phẩm..."
                        className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm font-semibold outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                </form>

                <div className="hidden items-center gap-9 md:flex">
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

                <button
                    type="button"
                    onClick={() => setOpenMobileMenu(!openMobileMenu)}
                    className="md:hidden"
                >
                    {openMobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {openMobileMenu && (
                <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
                    <div className="flex flex-col gap-4">
                        <form onSubmit={handleHeaderSearch} className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={headerSearch}
                                onChange={(event) => setHeaderSearch(event.target.value)}
                                placeholder="Tìm sản phẩm..."
                                className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm font-semibold outline-none focus:border-orange-400"
                            />
                        </form>

                        <Link
                            to="/"
                            onClick={() => setOpenMobileMenu(false)}
                            className="font-bold text-gray-600 hover:text-black"
                        >
                            Home
                        </Link>

                        <Link
                            to="/ProductListPage"
                            onClick={() => setOpenMobileMenu(false)}
                            className="font-bold text-gray-600 hover:text-black"
                        >
                            Products
                        </Link>

                        <Link
                            to="/contact"
                            onClick={() => setOpenMobileMenu(false)}
                            className="font-bold text-gray-600 hover:text-black"
                        >
                            Contact
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/cart"
                                    onClick={() => setOpenMobileMenu(false)}
                                    className="font-bold text-gray-600 hover:text-black"
                                >
                                    Giỏ hàng
                                </Link>

                                <Link
                                    to="/profile"
                                    onClick={() => setOpenMobileMenu(false)}
                                    className="font-bold text-gray-600 hover:text-black"
                                >
                                    Thông tin cá nhân
                                </Link>

                                <Link
                                    to="/orders"
                                    onClick={() => setOpenMobileMenu(false)}
                                    className="font-bold text-gray-600 hover:text-black"
                                >
                                    Đơn hàng
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-left font-bold text-red-600"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setOpenMobileMenu(false)}
                                className="font-bold text-gray-600 hover:text-black"
                            >
                                Đăng nhập / Đăng ký
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
