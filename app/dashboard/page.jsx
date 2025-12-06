"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [role, setRole] = useState(null);
    const [totalHoy, setTotalHoy] = useState(0);
    const [transacciones, setTransacciones] = useState(0);

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

    useEffect(() => {
        async function loadData() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { data: trx } = await supabase
                .from("transactions")
                .select("*")
                .gte("created_at", today.toISOString())
                .eq("status", "approved");

            const totalHoy = trx?.reduce((acc, t) => acc + Number(t.amount), 0) || 0;

            setTotalHoy(totalHoy);
            setTransacciones(trx?.length || 0);
        }

        loadData();
    }, []);

    return (
        <ProtectedRoute>
            <Navbar />

            <div className="container p-2">
                {/* TARJETAS SUPERIORES */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card title="Ventas Hoy" link="/ventas">
                        <p className="text-2xl font-bold">S/ {totalHoy.toFixed(2)}</p>
                    </Card>

                    <Card title="Transacciones" link="/transacciones">
                        <p className="text-2xl font-bold">{transacciones}</p>
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
            </div>
        </ProtectedRoute>
    );
}