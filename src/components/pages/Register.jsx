import { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';


const registerSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email('Email không hợp lệ! ')
        .required('Vui lòng nhập email'),
    password: Yup.string()
        .min(6, 'Mật khẩu phải tối thiểu 6 kí tự')
        .required('Vui lòng nhập mật khẩu'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
        .required('Mật khẩu xác nhận không để trống'),
    userName: Yup.string()
        .trim()
        .required('Tên người dùng không thể để trống'),
    phoneNumber: Yup.string()
        .trim()
        .matches(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ')
        .required('Số điện thoại không để trống')
})


export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (values, helpers) => {
        try {

            const res = await axiosClient.post('/auth/register', {
                name: values.userName.trim(),
                email: values.email.trim(),
                password: values.password.trim(),
                phone: values.phoneNumber.trim()
            });
            const data = res.data;

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            //console.log(data.token);

            toast.success('Đăng ký thành công! Chào mừng bạn đến với cửa hàng');
            window.location.href = '/';
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    return (
        <section className="flex justify-center px-4 py-16">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Đăng ký</h1>
                    <p className="mt-2 text-sm text-gray-500">Tạo tài khoản để mua sắm dễ dàng hơn</p>
                </div>

                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                        userName: "",
                        phoneNumber: "",
                        confirmPassword: ""
                    }}
                    validationSchema={registerSchema}
                    onSubmit={handleSubmit}
                >
                    {
                        ({ isSubmitting }) => (
                            <Form className="space-y-5" >
                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Họ tên
                                    </label>

                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Field
                                            name="userName"
                                            type="text"
                                            placeholder="Nguyễn Văn A"
                                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                                        />
                                    </div>

                                    <ErrorMessage
                                        name="userName"
                                        component="div"
                                        className="mt-1 text-sm text-red-600"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Email
                                    </label>

                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Field
                                            name="email"
                                            type="email"
                                            placeholder="example@gmail.com"
                                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                                        />
                                    </div>

                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="mt-1 text-sm text-red-600"
                                    />

                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Số điện thoại
                                    </label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Field
                                            name="phoneNumber"
                                            type="text"
                                            placeholder="0901234567"
                                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                                        />
                                    </div>

                                    <ErrorMessage
                                        name="phoneNumber"
                                        component="div"
                                        className="mt-1 text-sm text-red-600"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Mật khẩu
                                        </label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <Field
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="********"
                                                name="password"
                                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 outline-none focus:border-black"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>

                                        </div>
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="mt-1 text-sm text-red-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Xác nhận mật khẩu
                                        </label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <Field
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="********"
                                                name="confirmPassword"
                                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 outline-none focus:border-black"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"

                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>

                                        </div>
                                        <ErrorMessage
                                            name="confirmPassword"
                                            component="div"
                                            className="mt-1 text-sm text-red-600"
                                        />

                                    </div>
                                </div>


                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg bg-orange-500 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-orange-600 disabled:opacity-60"
                                >
                                    {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                                </button>
                            </Form>
                        )
                    }

                </Formik>
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
