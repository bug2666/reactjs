import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

// Tạo Context để chia sẻ dữ liệu giỏ hàng cho toàn app
const CartContext = createContext(null);

// Component này bọc quanh App, cung cấp dữ liệu giỏ hàng cho mọi component con
export function CartProvider(props) {
    const children = props.children;

    // State chứa dữ liệu giỏ hàng (null khi chưa đăng nhập hoặc chưa load)
    const [cart, setCart] = useState(null);

    // State báo đang gọi API để lấy giỏ hàng
    const [loading, setLoading] = useState(false);

    // Hàm gọi API lấy giỏ hàng từ server
    const fetchCart = async function () {
        const token = localStorage.getItem("token");

        // Nếu user chưa đăng nhập thì không gọi API, set giỏ về null
        if (!token) {
            setCart(null);
            return;
        }

        try {
            setLoading(true);
            const response = await axiosClient.get("/cart");
            const cartData = response.data;
            setCart(cartData);
        } catch (error) {
            // Khi lỗi (token hết hạn, server down...) thì set giỏ về null
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    // Khi component mount lần đầu thì tự động fetch giỏ hàng
    useEffect(function () {
        fetchCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Hàm thêm sản phẩm vào giỏ
    const addToCart = async function (data) {
        const productId = data.productId;
        const variantId = data.variantId;
        const quantity = data.quantity;

        const response = await axiosClient.post("/cart/items", {
            productId: productId,
            variantId: variantId,
            quantity: quantity,
        });

        const newCart = response.data;
        setCart(newCart);
        return newCart;
    };

    // Hàm cập nhật số lượng sản phẩm trong giỏ
    const updateQuantity = async function (variantId, quantity) {
        const response = await axiosClient.put(
            "/cart/items/" + variantId,
            { quantity: quantity }
        );

        const newCart = response.data;
        setCart(newCart);
        return newCart;
    };

    // Hàm xóa 1 sản phẩm khỏi giỏ
    const deleteItem = async function (variantId) {
        const response = await axiosClient.delete("/cart/items/" + variantId);

        const newCart = response.data;
        setCart(newCart);
        return newCart;
    };

    // Tính tổng số lượng sản phẩm trong giỏ để hiển thị badge trên Header
    let cartCount = 0;
    if (cart !== null && cart.items) {
        for (let i = 0; i < cart.items.length; i = i + 1) {
            const item = cart.items[i];
            cartCount = cartCount + item.quantity;
        }
    }

    // Đóng gói tất cả state và hàm vào 1 object để truyền xuống context
    const value = {
        cart: cart,
        loading: loading,
        cartCount: cartCount,
        fetchCart: fetchCart,
        addToCart: addToCart,
        updateQuantity: updateQuantity,
        deleteItem: deleteItem,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook để các component khác dùng giỏ hàng dễ dàng
// Thay vì viết: const { cart } = useContext(CartContext)
// Chỉ cần viết: const { cart } = useCart()
export function useCart() {
    const context = useContext(CartContext);

    if (context === null) {
        throw new Error("useCart phải được dùng bên trong CartProvider");
    }

    return context;
}
