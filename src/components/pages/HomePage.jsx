import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Flame,
  Zap
} from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "../home/ProductCard";
import axiosClient from "../../api/axiosClient";
import Marquee from "react-fast-marquee";

const HERO_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80";

const STATIC_CATEGORIES = [
  { name: "Giày thể thao", desc: "Hiệu năng & tốc độ", icon: Zap },
  { name: "Sandal", desc: "Thoải mái mỗi bước", icon: Sparkles },
  { name: "Dép", desc: "Phong cách thường ngày", icon: Flame }
];

const BRAND_STRIP = ["VELOCITY", "NIKE", "ADIDAS", "PUMA", "ASICS", "NEW BALANCE"];

// Pool icon để gán cho từng category trả về từ DB (lặp lại nếu nhiều hơn pool)
const CATEGORY_ICON_POOL = [Zap, Sparkles, Flame];

const CATEGORY_DESC_POOL = [
  "Hiệu năng & tốc độ",
  "Thoải mái mỗi bước",
  "Phong cách thường ngày",
  "Bền bỉ theo thời gian",
  "Tinh tế trong từng chi tiết"
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingProducts(true);

          const res = await axiosClient.get('/products/getProducts?page=1&limit=8');
          const data = res.data.products;

          setFeaturedProducts(data);
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        toast.error(`Tải sản phẩm thất bại: ${message}`);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Fetch categories thật từ DB (kèm số sản phẩm thực tế)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosClient.get('/products/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Lỗi tải danh mục:', error);
      }
    };

    fetchCategories();
  }, []);

  /* lấy 6 sản phẩm */
  const featured = useMemo(function () {
    return featuredProducts.slice(0, 6);
  }, [featuredProducts]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute -right-32 top-0 h-[600px] w-[600px] rounded-full bg-orange-500/30 blur-[120px]" />
        <div className="absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-orange-500/20 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Bộ sưu tập 2026
            </span>

            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-tighter md:text-7xl">
              Bước đi
              <br />
              <span className="text-orange-500">bứt phá</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/70">
              Engineered cho ổn định, thiết kế cho phong cách. Khám phá những mẫu giày
              kết hợp công nghệ hiện đại và tinh thần thể thao.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/ProductListPage"
                className="group inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-slate-900"
              >
                Mua ngay
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/ProductListPage"
                className="inline-flex items-center gap-3 rounded-full border border-white/30 px-7 py-4 text-sm font-bold transition hover:bg-white/10"
              >
                Xem bộ sưu tập
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { k: "15+", v: "Mẫu mới" },
                { k: "30K", v: "Khách hàng" },
                { k: "4.9★", v: "Đánh giá" }
              ].map((stat) => (
                <div key={stat.v}>
                  <p className="text-3xl font-black">{stat.k}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
                    {stat.v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -rotate-6 rounded-3xl bg-gradient-to-br from-orange-500/40 to-transparent blur-2xl" />
            <img
              src={HERO_IMAGE}
              alt="Giày nổi bật"
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 left-6 hidden items-center gap-3 rounded-2xl bg-white p-4 text-slate-900 shadow-2xl md:flex">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 text-white">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Best seller
                </p>
                <p className="text-sm font-black">Apex Runner G1</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* BRAND STRIP - chạy ngang */}



      <section className="border-y border-slate-100 bg-white py-6">
        <Marquee speed={40} gradient={false} pauseOnHover autoFill>
          {BRAND_STRIP.map((brand) => (
            <span key={brand} className="mx-8 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
              {brand}
            </span>
          ))}
        </Marquee>
      </section>



      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
              Danh mục
            </span>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight">
              Mua theo phong cách
            </h2>
          </div>
          <Link
            to="/ProductListPage"
            className="hidden items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-orange-500 md:inline-flex"
          >
            Tất cả <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = CATEGORY_ICON_POOL[index % CATEGORY_ICON_POOL.length];
            const desc = CATEGORY_DESC_POOL[index % CATEGORY_DESC_POOL.length];
            const count = category.productCount || 0;

            return (
              <Link
                key={category.id}
                to={`/ProductListPage?categoryId=${category.id}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-8 transition hover:border-orange-500 hover:shadow-xl"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-orange-500 shadow-sm transition group-hover:bg-orange-500 group-hover:text-white">
                  <Icon size={20} />
                </div>
                <h3 className="mt-8 text-2xl font-extrabold">{category.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{desc}</p>
                <div className="mt-10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {count} sản phẩm
                  </span>
                  <ArrowRight
                    size={20}
                    className="text-slate-900 transition group-hover:translate-x-1 group-hover:text-orange-500"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                Sản phẩm nổi bật
              </span>
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight">
                Mới ra mắt mùa này
              </h2>
              <p className="mt-3 max-w-lg text-slate-500">
                Những mẫu thiết kế mới nhất, được tuyển chọn kỹ càng cho hiệu năng và phong cách.
              </p>
            </div>
            <Link
              to="/ProductListPage"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-orange-500"
            >
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>

          {loadingProducts && (
            <p className="text-center text-slate-500">Đang tải sản phẩm...</p>
          )}

          {!loadingProducts && featured.length === 0 && (
            <p className="text-center text-slate-500">Chưa có sản phẩm nổi bật.</p>
          )}

          {!loadingProducts && featured.length > 0 && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-white md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <span className="inline-block rounded-full bg-orange-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">
              Ưu đãi mùa hè
            </span>
            <h2 className="mt-6 text-4xl font-black uppercase leading-tight md:text-5xl">
              Giảm tới <span className="text-orange-500">40%</span>
              <br />
              cho bộ sưu tập hè
            </h2>
            <p className="mt-4 max-w-md text-white/70">
              Áp dụng cho các mẫu sandal &amp; sneaker chọn lọc. Số lượng có hạn — đến hết tháng.
            </p>
            <Link
              to="/ProductListPage"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-900 transition hover:bg-orange-500 hover:text-white"
            >
              Săn ngay <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* USP */}
      <section className="border-t border-slate-100 bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          {[
            { Icon: Truck, t: "Giao hàng miễn phí", d: "Cho đơn hàng từ 500.000đ trên toàn quốc." },
            { Icon: RotateCcw, t: "Đổi trả 7 ngày", d: "Miễn phí đổi size nếu sản phẩm còn nguyên trạng." },
            { Icon: ShieldCheck, t: "Chính hãng 100%", d: "Cam kết sản phẩm đúng thương hiệu và mô tả." }
          ].map(({ Icon, t, d }) => (
            <div key={t} className="flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-50 text-orange-500">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="mt-1 text-sm text-slate-500">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
