"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { BiChevronLeft } from "react-icons/bi";
import { useRouter } from "next/navigation";

export default function UsuariosPage() {
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkRole();
        fetchUsuarios();
    }, []);

    const goBack = () => router.back();

    // -------------------------------------
    // 1. Validar si el usuario es ADMIN
    // -------------------------------------
    const checkRole = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

        if (error) {
            console.error("Error obteniendo rol:", error);
            return;
        }

        if (data?.role === "admin") {
            setIsAdmin(true);
        }
    };

    // -------------------------------------
    // 2. Obtener usuarios
    // -------------------------------------
    const fetchUsuarios = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Error al cargar usuarios");
        } else {
            setUsuarios(data);
        }

        setLoading(false);
    };

    // -------------------------------------
    // 3. Eliminar usuario
    // -------------------------------------
    const eliminarUsuario = async (id) => {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("No se pudo eliminar");
        } else {
            toast.success("Usuario eliminado");
            fetchUsuarios();
        }
    };

    if (!isAdmin) {
        return (
            <ProtectedRoute>
                <Navbar />
                <div className="p-6 text-red-500 font-bold">
                    No tienes permiso para ver esta sección.
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Navbar />

            {/* Volver */}
            <div className="p-6">
                <button
                    onClick={goBack}
                    className="mb-6 flex items-center text-gray-700 hover:text-black transition"
                >
                    <BiChevronLeft className="w-6 h-6" />
                    <span>Volver</span>
                </button>

                <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

                {loading ? (
                    <p>Cargando usuarios...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {usuarios.map((u) => (
                            <div
                                key={u.id}
                                className="border p-5 rounded-xl shadow-sm hover:shadow-md transition bg-white"
                            >
                                <h2 className="font-semibold text-lg flex flex-col">
                                    {u.full_name || "Sin nombre"}
                                </h2>

                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Email:</span> {u.email}
                                </p>

                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Rol:</span> {u.role}
                                </p>

                                <button
                                    onClick={() => eliminarUsuario(u.id)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}