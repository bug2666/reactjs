import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import HeroSection from "../home/HeroSection";
import CategorySection from "../home/CategorySection";
import FeaturedProductsSection from "../home/FeaturedProductsSection";
import axiosClient from "../../api/axiosClient";


export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductError("");

        const res = await axiosClient.get('/products/getProducts?page=1&limit=8');
        const data = res.data.products;

        setFeaturedProducts(data);


        const categoryList = [];
        data.forEach((product) => {
          const existingCategory = categoryList.find((category) => {
            return category.name === product.categoryName;
          });

          if (existingCategory) {
            existingCategory.count += 1;
          } else {
            categoryList.push({
              name: product.categoryName,
              imageUrl: product.imageUrl,
              count: 1
            });
          }
        });
        setCategories(categoryList);



      } catch (error) {
        const message = error.response?.data?.message || error.message;
        setProductError(message);
        toast.error(`Tải sản phẩm thất bại: ${message}`);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <CategorySection categories={categories} />
      <FeaturedProductsSection
        products={featuredProducts}
        loading={loadingProducts}
        errorMsg={productError}
      />
    </div>
  );
}
