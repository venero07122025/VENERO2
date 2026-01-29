"use client";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    const addToCart = (product) => {
        setItems((prev) => [...prev, product]);
        toast.success(`🛒 ${product.name} agregado`);
    };

    const removeFromCart = (id) => {
        setItems((prev) => prev.filter((p) => p.id !== id));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((acc, p) => acc + p.price, 0);

    return (
        <CartContext.Provider
            value={{ items, addToCart, removeFromCart, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);