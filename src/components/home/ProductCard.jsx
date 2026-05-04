import { Heart, ShoppingCart } from 'lucide-react';

export default function ProductCard({ name, price, category, image }) {
    return (
        <div className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">

            {/* 1. Khung ảnh sản phẩm */}
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                <img
                    src={image}
                    className="w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-110"
                />

                {/* Nút yêu thích (Heart) */}
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors">
                    <Heart size={18} />
                </button>
            </div>

            {/* 2. Thông tin sản phẩm */}
            <div className="space-y-1">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{category}</span>
                <h3 className="font-bold text-gray-900 truncate">{name}</h3>

                <div className="flex items-center justify-between pt-2">
                    <span className="font-black text-lg">{price}đ</span>

                    {/* Nút thêm vào giỏ hàng nhanh */}
                    <button className="p-2 bg-black text-white rounded-lg hover:bg-orange-500 transition-colors">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
