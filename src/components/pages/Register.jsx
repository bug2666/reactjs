import { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        console.log({ name, email, phone, password, confirmPassword });

        if (!name.trim() || !email.trim() || !password.trim()) {
            setErrorMsg('Vui lòng nhập đầy đủ họ tên, email và mật khẩu');
            return;
        }

        if (password.length < 6) {
            setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone })
            });

            console.log('status:', res.status);

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || 'Đăng ký thất bại');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            //console.log(data.token);

            window.location.href = '/';
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex justify-center px-4 py-16">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Đăng ký</h1>
                    <p className="mt-2 text-sm text-gray-500">Tạo tài khoản để mua sắm dễ dàng hơn</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Họ tên
                        </label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Nguyễn Văn A"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                            />
                        </div>
                    </div>

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
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Số điện thoại
                        </label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="0901234567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 outline-none focus:border-black"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (showPassword === true) {
                                            setShowPassword(false);
                                        } else {
                                            setShowPassword(true);
                                        }
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>

                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="********"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 outline-none focus:border-black"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (showConfirmPassword === true) {
                                            setShowConfirmPassword(false);
                                        } else {
                                            setShowConfirmPassword(true);
                                        }
                                    }}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>

                            </div>
                        </div>
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-orange-500 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-orange-600 disabled:opacity-60"
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>

                    {errorMsg && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            {errorMsg}
                        </div>
                    )}
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="font-semibold text-black hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </section>
    );
}
