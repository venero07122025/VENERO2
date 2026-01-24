"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            router.replace("/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen container">
                Cargando…
            </div>
        );
    }

    return children;
}