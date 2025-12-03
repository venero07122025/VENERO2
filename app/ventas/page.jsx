"use client";

import { useForm } from "react-hook-form";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function Ventas() {
    const { register, handleSubmit } = useForm();

    const onSubmit = async (values) => {
        try {
            toast.loading("Procesando pago...");

            // 1. obtener configs
            const { data: settings } = await supabase
                .from("settings")
                .select("*")
                .eq("id", 1)
                .single();

            if (!settings.stripe_sk) {
                toast.dismiss();
                return toast.error("Configurar Stripe primero");
            }

            // 2. llamar a ruta API interna
            const res = await fetch("/api/payment", {
                method: "POST",
                body: JSON.stringify(values),
            });

            const json = await res.json();
            toast.dismiss();

            if (!res.ok) return toast.error(json.error);

            toast.success("Pago aprobado");
        } catch (e) {
            toast.dismiss();
            toast.error("Error procesando pago");
        }
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Venta Forzada</h1>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        {...register("amount")}
                        className="w-full border p-3 rounded"
                        type="number"
                        placeholder="Monto (S/)"
                    />

                    <input
                        {...register("card_number")}
                        className="w-full border p-3 rounded"
                        placeholder="Número de tarjeta"
                    />

                    <div className="flex gap-3">
                        <input
                            {...register("exp")}
                            className="w-1/2 border p-3 rounded"
                            placeholder="MM/YY"
                        />
                        <input
                            {...register("cvc")}
                            className="w-1/2 border p-3 rounded"
                            placeholder="CVC"
                        />
                    </div>

                    <input
                        {...register("zip")}
                        className="w-full border p-3 rounded"
                        placeholder="ZIP"
                    />

                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl">
                        Procesar Pago
                    </button>
                </form>
            </div>
        </ProtectedRoute>
    );
}