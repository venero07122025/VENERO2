"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        async function fetchRole() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data } = await supabase
                .from("users")
                .select("role")
                .eq("id", session.user.id)
                .single();

            setRole(data?.role || "operador");
        }

        fetchRole();
    }, []);

    return (
        <ProtectedRoute>
            <Navbar />

            {/* TARJETAS SUPERIORES */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Ventas Hoy">
                    <p className="text-2xl font-bold">S/ 0.00</p>
                </Card>

                <Card title="Transacciones">
                    <p className="text-2xl font-bold">0</p>
                </Card>

                <Card title="Estado del Operador">
                    <p className="text-2xl font-bold">Activo</p>
                </Card>
            </div>

            {/* SECCIÓN SOLO PARA ADMINISTRADORES */}
            {role === "admin" && (
                <div className="p-6 mt-6">
                    <h2 className="text-2xl font-bold mb-4">Administración</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <Link href="/usuarios">
                            <div className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition">
                                <h3 className="text-xl font-bold mb-2">Gestión de Usuarios</h3>
                                <p className="text-gray-600">Crear, editar o eliminar usuarios del sistema.</p>
                            </div>
                        </Link>

                        <Link href="/configuracion">
                            <div className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition">
                                <h3 className="text-xl font-bold mb-2">Configuración del Sistema</h3>
                                <p className="text-gray-600">Ajustes generales del POS.</p>
                            </div>
                        </Link>

                    </div>
                </div>
            )}

        </ProtectedRoute>
    );
}