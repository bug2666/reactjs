import { useEffect, useState } from "react";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setMessage("Bạn cần đăng nhập");
                    return;
                }

                const res = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Không lấy được thông tin cá nhân");
                }

                setProfile(data);
                setName(data.name || "");
                setPhone(data.phone || "");
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/updateMyProfile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, phone })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Không cập nhật được thông tin");
            }

            setProfile(data.user);

            const savedUser = JSON.parse(localStorage.getItem("user"));
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
            setMessage(error.message);
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
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                Họ tên
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                Email
                            </label>
                            <input
                                value={profile.email}
                                disabled
                                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                Số điện thoại
                            </label>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                Vai trò
                            </label>
                            <input
                                value={profile.role}
                                disabled
                                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
                    >
                        Lưu thay đổi
                    </button>
                </form>
            )}
        </main>
    );
}
