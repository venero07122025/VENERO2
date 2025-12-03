"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validate = async () => {
            const { data } = await supabase.auth.getSession();

            if (!data.session) {
                router.push("/login");
                return;
            }

            setLoading(false);
        };

        validate();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Cargando…
            </div>
        );
    }

    return children;
}