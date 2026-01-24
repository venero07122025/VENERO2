"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("user");

        router.replace("/login");
    };

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between">
            <div className="container flex justify-between">
                <h1 className="font-bold text-xl">POS Web</h1>

                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition cursor-pointer"
                >
                    Salir
                </button>
            </div>
        </nav>
    );
}