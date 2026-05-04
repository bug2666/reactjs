import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
    const navigate = useNavigate();

    const [shippingName, setShippingName] = useState("");
    const [shippingPhone, setShippingPhone] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!shippingName || !shippingPhone || !shippingAddress) {
            setMessage("Vui lòng nhập đủ thông tin giao hàng");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    shippingName,
                    shippingPhone,
                    shippingAddress,
                    paymentMethod
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Đặt hàng thất bại");
            }

            navigate("/orders");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900">
                Thanh toán
            </h1>

            {message && (
                <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {message}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            Người nhận
                        </label>
                        <input
                            value={shippingName}
                            onChange={(e) => setShippingName(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            Số điện thoại
                        </label>
                        <input
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            Địa chỉ giao hàng
                        </label>
                        <textarea
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            rows="4"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                            Phương thức thanh toán
                        </label>

                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        >
                            <option value="cod">Thanh toán khi nhận hàng</option>
                            <option value="bank">Chuyển khoản ngân hàng</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-lg bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
                >
                    {loading ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
                </button>
            </form>
        </main>
    );
}
