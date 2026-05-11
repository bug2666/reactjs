import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const forgotPasswordSchema = Yup.object({
    email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email")
});


export default function ForgotPasswordPage() {
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (values, helpers) => {
        setMessage("");
        setIsSuccess(false);

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: values.email.trim() })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Không gửi được email");
            }

            setIsSuccess(true);
            setMessage(data.message);
            helpers.resetForm();
        } catch (error) {
            setIsSuccess(false);
            setMessage(error.message);
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
                                    <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-500" />

                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-lg bg-orange-500 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-orange-600"
                            >
                                {isSubmitting ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                            </button>

                            {message && (
                                <div className={`rounded-lg px-3 py-2 text-sm ${isSuccess
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-600"
                                    }`}>
                                    {message}
                                </div>
                            )}
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
