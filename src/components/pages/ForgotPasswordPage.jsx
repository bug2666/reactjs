import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axiosClient from "../../api/axiosClient";


const forgotPasswordSchema = Yup.object({
    email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email")
});


export default function ForgotPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (values, helpers) => {
        setIsSuccess(false);

        try {
            const res = await axiosClient.post('/auth/forgot-password', {
                email: values.email
            });

            const data = res.data;

            setIsSuccess(true);
            toast.success(data.message || 'Đã gửi link đặt lại mật khẩu vào email');
            helpers.resetForm();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            setIsSuccess(false);
            toast.error(message);
        } finally {
            helpers.setSubmitting(false);
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

                <Formik
                    initialValues={{ email: '' }}
                    onSubmit={handleSubmit}
                    validationSchema={forgotPasswordSchema}
                >

                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Email
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="example@gmail.com"
                                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                                    />
                                </div>
                                <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-500" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-lg bg-orange-500 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-orange-600"
                            >
                                {isSubmitting ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                            </button>
                        </Form>
                    )}

                </Formik>

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
