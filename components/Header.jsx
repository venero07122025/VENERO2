"use client";
import { useCart } from "@/components/CartContext";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function Header() {
    const { items, total } = useCart();
    const router = useRouter();

    const menu = [
        { title: "Inicio", href: "/#inicio" },
        { title: "Filosofía", href: "/#filosofia" },
        { title: "Servicios", href: "/#servicios" },
        { title: "Soluciones", href: "/#productos" },
    ];

    return (
        <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white border-b border-white/20 shadow-sm">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div
                    onClick={() => router.push("/#inicio")}
                    className="cursor-pointer font-bold tracking-wide text-xl text-zinc-900"
                >
                    VENERO
                    <span className="font-light text-zinc-500 ml-1">Arquitectura</span>
                </div>

                {/* Navegación */}
                <nav className="hidden md:flex gap-10 text-sm font-medium text-zinc-700">
                    {menu.map((item) => (
                        <a
                            key={item.title}
                            href={item.href}
                            className="relative hover:text-black transition after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all"
                        >
                            {item.title}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {/* Login */}
                    <button
                        onClick={() => router.push("/login")}
                        className="relative flex items-center gap-3 bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition cursor-pointer"
                    >
                        <span className="text-sm font-semibold">Login</span>
                    </button>

                    {/* Carrito */}
                    <button
                        onClick={() => router.push("/checkout")}
                        className="relative flex items-center gap-3 bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition cursor-pointer"
                    >
                        <span className="text-sm font-semibold">
                            S/. {total.toFixed(2)}
                        </span>
                        <FiShoppingCart size={18} />

                        {items.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                {items.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}