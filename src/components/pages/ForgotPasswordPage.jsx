import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsSuccess(false);

        if (!email) {
            setMessage("Vui lòng nhập email");
            setIsSuccess(false);
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Không gửi được email");
            }

            setMessage(data.message);
            setIsSuccess(true);
        } catch (error) {
            setMessage(error.message);
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex justify-center px-4 py-16">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Quên mật khẩu
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Nhập email để nhận link đặt lại mật khẩu.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Email
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-orange-500 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-orange-600"
                    >
                        {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                    </button>

                    {message && (
                        <div className={`rounded-lg px-3 py-2 text-sm ${isSuccess
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                            }`}>
                            {message}
                        </div>
                    )}
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Nhớ mật khẩu?{" "}
                    <Link to="/login" className="font-semibold text-black hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </section>
    );
}
