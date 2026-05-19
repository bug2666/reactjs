import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axiosClient from "../../api/axiosClient";


const checkoutSchema = Yup.object({
    shippingName: Yup.string()
        .required("Vui lòng nhập người nhận"),
    shippingPhone: Yup.string()
        .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
        .required("Vui lòng nhập số điện thoại"),
    shippingAddress: Yup.string()
        .required("Vui lòng nhập địa chỉ giao hàng"),
    paymentMethod: Yup.string()
        .oneOf(["cod", "bank"], "Phương thức thanh toán không hợp lệ")
        .required("Vui lòng chọn phương thức thanh toán")
});


export default function CheckoutPage() {

    const handleSubmit = async (values, helpers) => {
        try {
            await toast.promise(
                axiosClient.post('/orders', {
                    shippingName: values.shippingName,
                    shippingPhone: values.shippingPhone,
                    shippingAddress: values.shippingAddress,
                    paymentMethod: values.paymentMethod
                }),
                {
                    loading: 'Đang đặt hàng...',
                    success: 'Đặt hàng thành công!',
                    error: (err) => err.response?.data?.message || err.message
                }
            );

            window.location.href = "/orders";
        } catch (error) {
            // toast.promise đã hiển thị lỗi
        } finally {
            helpers.setSubmitting(false);
        }
    };

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900">
                Thanh toán
            </h1>

            <Formik
                initialValues={{
                    shippingName: '',
                    shippingPhone: '',
                    shippingAddress: '',
                    paymentMethod: 'cod'
                }}
                validationSchema={checkoutSchema}
                onSubmit={handleSubmit}
            >

                {({ isSubmitting }) => (
                    <Form className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    Người nhận
                                </label>
                                <Field
                                    name='shippingName'
                                    type='text'
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                />
                                <ErrorMessage name="shippingName" component="p" className="mt-1 text-sm text-red-500" />

                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    Số điện thoại
                                </label>
                                <Field
                                    name='shippingPhone'
                                    type='text'
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                />
                                <ErrorMessage name="shippingPhone" component="p" className="mt-1 text-sm text-red-500" />

                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    Địa chỉ giao hàng
                                </label>
                                <Field
                                    as='textarea'
                                    name='shippingAddress'
                                    rows="4"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                />
                                <ErrorMessage name="shippingAddress" component="p" className="mt-1 text-sm text-red-500" />

                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700">
                                    Phương thức thanh toán
                                </label>

                                <Field
                                    as="select"
                                    name="paymentMethod"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                >
                                    <option value="cod">Thanh toán khi nhận hàng</option>
                                    <option value="bank">Chuyển khoản ngân hàng</option>
                                </Field>
                                <ErrorMessage name="paymentMethod" component="p" className="mt-1 text-sm text-red-500" />


                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-6 w-full rounded-lg bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
                        >
                            {isSubmitting ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
                        </button>
                    </Form>
                )}


            </Formik>

        </main>
    );
}
