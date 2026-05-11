import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosClient from "../../api/axiosClient";

const resetPasswordSchema = Yup.object({
    password: Yup.string()
        .min(6, "Mật khẩu tối thiểu 6 ký tự")
        .required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng xác nhận mật khẩu")
});



export default function ResetPasswordPage() {
    const { token } = useParams();

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (values, helpers) => {
        setMessage("");
        setSuccess(false);

        try {
            const res = await axiosClient.post(`/auth/reset-password/${token}`, {
                password: values.password
            });

            const data = res.data;

            setSuccess(true);
            setMessage(data.message);
            helpers.resetForm();
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
            setSuccess(false);
        } finally {
            helpers.setSubmitting(false);
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


                <Formik
                    initialValues={{
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={resetPasswordSchema}
                    onSubmit={handleSubmit}
                >

                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Mật khẩu mới
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="********"
                                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                                    />
                                    <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-500" />
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

                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="********"
                                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-black"
                                    />
                                    <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-500" />

                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || success}
                                className="w-full rounded-lg bg-orange-500 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-orange-600"
                            >
                                {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                            </button>

                            {message && (
                                <div className={`rounded-lg px-3 py-2 text-sm ${success
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-600"
                                    }`}>
                                    {message}
                                </div>
                            )}
                        </Form>
                    )}


                </Formik>

                {success && (
                    <p className="mt-6 text-center text-sm text-gray-500">
                        <Link to="/login" className="font-semibold text-black hover:underline">
                            Quay lại đăng nhập
                        </Link>
                    </p>
                )}
            </div>
        </section >
    );
}
