import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosClient from "../../api/axiosClient";


const profileSchema = Yup.object({
    name: Yup.string()
        .trim()
        .required("Họ tên không được để trống"),

    phone: Yup.string()
        .trim()
        .matches(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ")
        .required("Số điện thoại không được để trống")
});

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosClient.get('/users/profile');
                const data = res.data;

                setProfile(data);
            } catch (error) {
                setMessage(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (values, helpers) => {
        setMessage("");

        try {

            const res = await axiosClient.put('/users/updateMyProfile', {
                fullName: values.fullName,
                phone: values.phone,
                address: values.address
            });

            const data = res.data;

            setProfile(data.user);

            const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...savedUser,
                    name: data.user.name,
                    phone: data.user.phone
                })
            );

            setMessage("Cập nhật thông tin thành công");
        } catch (error) {
            setMessage(error.response?.data?.message || error.message);
        } finally {
            helpers.setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-500">
                Đang tải thông tin...
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-900">
                Thông tin cá nhân
            </h1>

            {message && (
                <div className="mt-5 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700">
                    {message}
                </div>
            )}

            {profile && (
                <Formik
                    initialValues={{
                        name: profile.name || "",
                        phone: profile.phone || ""
                    }}
                    validationSchema={profileSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting }) => (
                        <Form className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Họ tên
                                    </label>

                                    <Field
                                        name="name"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    />

                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="mt-1 text-sm text-red-600"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Email
                                    </label>

                                    <input
                                        value={profile.email || ""}
                                        disabled
                                        className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Số điện thoại
                                    </label>

                                    <Field
                                        name="phone"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                    />

                                    <ErrorMessage
                                        name="phone"
                                        component="div"
                                        className="mt-1 text-sm text-red-600"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Vai trò
                                    </label>

                                    <input
                                        value={profile.role || ""}
                                        disabled
                                        className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60"
                            >
                                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </main>
    );
}