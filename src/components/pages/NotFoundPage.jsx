import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <main className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                    404
                </p>

                <h1 className="mt-3 text-4xl font-bold text-gray-900">
                    Không tìm thấy trang
                </h1>

                <p className="mt-3 text-gray-500">
                    Trang bạn đang tìm kiếm không tồn tại.
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
                >
                    Quay về trang chủ
                </Link>
            </div>
        </main>
    );
}
