"use client";

import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Si ya está logueado → Dashboard
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) router.push("/dashboard");
        };
        checkSession();
    }, [router]);

    const togglePassword = () => setShowPassword((prev) => !prev);

    // 🔥 AQUI RECIBES LOS DATOS CORRECTAMENTE
    const onSubmit = async (values) => {
        try {
            setLoading(true);

            const { error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) {
                toast.error("Credenciales inválidas");
                return;
            }

            toast.success("Accediendo...");
            router.push("/dashboard");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 shadow-xl rounded-2xl w-96 space-y-6 animate-fadeIn"
            >
                <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>

                {/* EMAIL INPUT */}
                <div>
                    <input
                        {...register("email", {
                            required: "El email es obligatorio",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Formato de email inválido",
                            }
                        })}
                        type="email"
                        className={`w-full px-4 py-3 border rounded-xl outline-none text-[15px] 
                            ${errors.email ? "border-red-400" : "focus:ring-2 focus:ring-blue-500"}`}
                        placeholder="Correo electrónico"
                        autoComplete="email"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* PASSWORD INPUT */}
                <div className="relative">
                    <input
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 4,
                                message: "Debe tener al menos 4 caracteres",
                            }
                        })}
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-4 py-3 border rounded-xl outline-none text-[15px] 
                            ${errors.password ? "border-red-400" : "focus:ring-2 focus:ring-blue-500"}`}
                        placeholder="Contraseña"
                        autoComplete="current-password"
                    />

                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                        {showPassword ? (
                            <FiEyeOff className="w-5 h-5 text-gray-500" />
                        ) : (
                            <FiEye className="w-5 h-5 text-gray-500" />
                        )}
                    </button>

                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-70"
                >
                    {loading ? "Entrando…" : "Ingresar"}
                </button>
            </form>
        </div>
    );
}