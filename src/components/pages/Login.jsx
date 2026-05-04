import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (email.trim() === '' || password.trim() === '') {
            setErrorMsg('Vui lòng nhập tài khoản và mật khẩu!');
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || 'Đăng nhập thất bại');
            }

            // nếu backend trả token/user:
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            // chờ 1 chút để bắt kết quả từ api
            setTimeout(() => {
                window.location.href = '/';
            }, 800);
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="flex justify-center px-4 py-16">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                {/* 1) Title block */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Đăng nhập</h1>
                    <p className="mt-2 text-sm text-gray-500">Chào mừng bạn quay lại</p>
                </div>

                {/* 2) Field block */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Mật khẩu
                            </label>
                            <Link to="/forgot-password" className="text-xs font-semibold text-orange-600 hover:underline">
                                Quên mật khẩu?
                            </Link>

                        </div>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="*********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 outline-none focus:border-black"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* 3) Option block */}
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                        Ghi nhớ đăng nhập
                    </label>

                    {/* 4) Action block */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-orange-500 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-orange-600"
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}

                    </button>

                    {errorMsg && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            {errorMsg}
                        </div>
                    )}
                </form>

                {/* 5) Extra block */}
                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs uppercase text-gray-400">Hoặc tiếp tục với</span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="rounded-lg border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50">
                        Google
                    </button>
                    <button className="rounded-lg border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50">
                        Facebook
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="font-semibold text-black hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </section>
    );
}
