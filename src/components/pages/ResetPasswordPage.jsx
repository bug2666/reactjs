import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Lock } from "lucide-react";

export default function ResetPasswordPage() {
    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!password || !confirmPassword) {
            setMessage("Vui lòng nhập đủ mật khẩu");
            return;
        }

        if (password.length < 6) {
            setMessage("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password,
                    confirmPassword
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Không đặt lại được mật khẩu");
            }

            setSuccess(true);
            setMessage(data.message);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex justify-center px-4 py-16">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Đặt lại mật khẩu
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Nhập mật khẩu mới cho tài khoản của bạn.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Mật khẩu mới
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Xác nhận mật khẩu
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="password"
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full rounded-lg bg-orange-500 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-orange-600"
                    >
                        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                    </button>

                    {message && (
                        <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">
                            {message}
                        </div>
                    )}
                </form>

                {success && (
                    <p className="mt-6 text-center text-sm text-gray-500">
                        <Link to="/login" className="font-semibold text-black hover:underline">
                            Quay lại đăng nhập
                        </Link>
                    </p>
                )}
            </div>
        </section>
    );
}
