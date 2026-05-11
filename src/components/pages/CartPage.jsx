import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import axiosClient from "../../api/axiosClient";

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const formatPrice = (price) => {
        return Number(price).toLocaleString("vi-VN") + "đ";
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            setMessage("");
            
            const res = await axiosClient.get('/cart');


            const data = res.data;

            setCart(data);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (variantId, quantity) => {
        if (quantity <= 0) return;

        try {
            const token = localStorage.getItem("token");

            const res = await axiosClient.put(`/cart/items/${variantId}`, {
                quantity
            });

            const data = res.data;

            setCart(data);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    const deleteItem = async (variantId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await axiosClient.delete(`/cart/items/${variantId}`);


            const data = res.data;

            setCart(data);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-500">
                Đang tải giỏ hàng...
            </div>
        );
    }

    if (message && !cart) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 text-center">
                <p className="mb-4 text-gray-600">{message}</p>

                <Link to="/login" className="font-bold text-orange-500 hover:underline">
                    Đăng nhập
                </Link>
            </div>
        );
    }

    /* check tb */

    let messageElement;
    if (message) {
        messageElement = (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {message}
            </div>
        );
    } else {
        messageElement = null;
    }

    /* render */

    let cartContent;

    if (!cart?.items?.length) {
        cartContent = (
            <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-10 text-center">
                <p className="text-gray-500">Giỏ hàng đang trống.</p>

                <Link
                    to="/ProductListPage"
                    className="mt-4 inline-block rounded-lg bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
                >
                    Mua sắm ngay
                </Link>
            </div>
        );
    } else {
        cartContent = (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
                <section className="space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                        >
                            <div className="h-28 w-28 rounded-xl bg-gray-100">
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="h-full w-full object-contain"
                                    />
                                )}
                            </div>

                            <div className="flex flex-1 flex-col">
                                <h2 className="font-bold text-gray-900">
                                    {item.productName}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Size {item.size} / {item.color}
                                </p>

                                <p className="mt-2 font-bold text-gray-900">
                                    {formatPrice(item.unitPrice)}
                                </p>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center rounded-lg border border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                            className="px-3 py-2"
                                        >
                                            <Minus size={16} />
                                        </button>

                                        <span className="min-w-10 text-center font-bold">
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                            className="px-3 py-2"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => deleteItem(item.variantId)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900">
                        Tóm tắt đơn hàng
                    </h2>

                    <div className="mt-5 flex justify-between text-gray-600">
                        <span>Tạm tính</span>
                        <span>{formatPrice(cart.total)}</span>
                    </div>

                    <div className="mt-3 flex justify-between text-gray-600">
                        <span>Phí vận chuyển</span>
                        <span>Miễn phí</span>
                    </div>

                    <div className="mt-5 border-t border-gray-100 pt-5">
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>Tổng cộng</span>
                            <span>{formatPrice(cart.total)}</span>
                        </div>
                    </div>

                    <Link
                        to="/checkout"
                        className="mt-6 block rounded-lg bg-orange-500 py-3 text-center font-bold text-white hover:bg-orange-600"
                    >
                        Thanh toán
                    </Link>
                </aside>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900">
                Giỏ hàng của bạn
            </h1>

            {messageElement}

            {cartContent}

        </main>
    );
}
