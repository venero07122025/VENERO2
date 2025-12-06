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

    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 6;

    const router = useRouter();

    useEffect(() => {
        checkRole();
    }, []);

    useEffect(() => {
        fetchUsuarios();
    }, [page, search]);

    // -------------------------------------
    // 1. Validar si es admin
    // -------------------------------------
    const checkRole = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

        if (data?.role === "admin") setIsAdmin(true);
    };

    // -------------------------------------
    // 2. Obtener usuarios con paginación
    // -------------------------------------
    const fetchUsuarios = async () => {
        setLoading(true);

        let query = supabase
            .from("users")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range((page - 1) * LIMIT, page * LIMIT - 1);

        if (search.trim()) {
            query = query.ilike("full_name", `%${search}%`);
        }

        const { data, error, count } = await query;

        if (error) toast.error("Error al cargar usuarios");
        else {
            setUsuarios(data);
            setTotal(count);
        }

        setLoading(false);
    };

    // -------------------------------------
    // 3. Solo editar usuario (NO crear)
    // -------------------------------------
    const guardarUsuario = async (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const full_name = form.get("full_name");
        const role = form.get("role");

        const { error } = await supabase
            .from("users")
            .update({ full_name, role })
            .eq("id", editingUser.id);

        if (error) toast.error("No se pudo actualizar");
        else {
            toast.success("Usuario actualizado");
            setModalOpen(false);
            setEditingUser(null);
            fetchUsuarios();
        }
    };

    // -------------------------------------
    // 4. Eliminar usuario
    // -------------------------------------
    const eliminarUsuario = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

        const { error } = await supabase.from("users").delete().eq("id", id);

        if (error) toast.error("No se pudo eliminar");
        else {
            toast.success("Usuario eliminado");
            fetchUsuarios();
        }
    };

    const goBack = () => router.back();

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

            <div className="p-6 container">
                <button
                    onClick={goBack}
                    className="mb-6 flex items-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                    <BiChevronLeft className="w-6 h-6" />
                    <span>Volver</span>
                </button>

                <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

                {/* Buscador */}
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="border p-2 rounded mb-6 w-full"
                />

                {/* Lista */}
                {loading ? (
                    <p>Cargando usuarios...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {usuarios.map((u) => (
                                <div
                                    key={u.id}
                                    className="border p-5 rounded-xl shadow-sm hover:shadow-md transition bg-white"
                                >
                                    <h2 className="font-semibold text-lg">
                                        {u.full_name || "Sin nombre"}
                                    </h2>

                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Email:</span> {u.email}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Rol:</span> {u.role}
                                    </p>

                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => {
                                                setEditingUser(u);
                                                setModalOpen(true);
                                            }}
                                            className="bg-black text-white px-3 py-2 rounded hover:bg-black/70 cursor-pointer transition"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => eliminarUsuario(u.id)}
                                            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Paginación */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-3 py-2 border rounded disabled:opacity-40"
                            >
                                Anterior
                            </button>

                            <button
                                disabled={page * LIMIT >= total}
                                onClick={() => setPage(page + 1)}
                                className="px-3 py-2 border rounded disabled:opacity-40"
                            >
                                Siguiente
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Modal EDITAR */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <form
                        onSubmit={guardarUsuario}
                        className="bg-white p-6 rounded-lg w-96 shadow-lg"
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Editar Usuario
                        </h2>

                        {/* Nombre editable */}
                        <input
                            name="full_name"
                            defaultValue={editingUser?.full_name}
                            placeholder="Nombre completo"
                            required
                            className="border p-2 rounded w-full mb-3"
                        />

                        {/* Email NO editable */}
                        <input
                            disabled
                            value={editingUser?.email}
                            className="border p-2 rounded w-full mb-3 bg-gray-200 cursor-not-allowed"
                        />

                        {/* Rol editable */}
                        <select
                            name="role"
                            defaultValue={editingUser?.role}
                            className="border p-2 rounded w-full mb-4 cursor-pointer"
                        >
                            <option value="admin">Admin</option>
                            <option value="operador">Operador</option>
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="px-3 py-2 bg-gray-300 rounded cursor-pointer"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </ProtectedRoute>
    );
}