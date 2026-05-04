export default function CategoryCard({ title, image, count }) {
    return (
        /* Thêm class 'group' ở thẻ cha để khi hover vào cha, con sẽ thay đổi */
        <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover  duration-500 group-hover:scale-110"
            />
            {/* 2. Lớp phủ đen mờ */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>

            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold uppercase">{title}</h3>
                <p className="text-sm text-gray-200">{count}</p>
                {/* Một cái gạch chân hiện ra khi hover */}
                <div className="w-0 group-hover:w-full h-1 bg-orange-500 transition-all duration-500"></div>
            </div>
        </div>
    );
}
