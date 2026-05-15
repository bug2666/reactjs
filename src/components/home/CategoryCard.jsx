const CATEGORY_PLACEHOLDER_IMAGE = "/images/product-placeholder.png";

export default function CategoryCard({ title, image, count }) {
    const getImageSrc = (imageUrl) => {
        if (!imageUrl) {
            return CATEGORY_PLACEHOLDER_IMAGE;
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${process.env.REACT_APP_API_URL.replace('/api', '')}${imageUrl}`;
    };

    return (
        <div className="group relative h-80 cursor-pointer overflow-hidden rounded-2xl">
            <img
                src={getImageSrc(image)}
                alt={title}
                onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = CATEGORY_PLACEHOLDER_IMAGE;
                }}
                className="h-full w-full object-cover duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/50"></div>

            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold uppercase">{title}</h3>
                <p className="text-sm text-gray-200">{count}</p>
                <div className="h-1 w-0 bg-orange-500 transition-all duration-500 group-hover:w-full"></div>
            </div>
        </div>
    );
}
