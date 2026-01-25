"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { BiChevronLeft } from "react-icons/bi";
import { useRouter } from "next/navigation";

export default function Configuracion() {
    const [settings_venero_2, setsettings_venero_2] = useState(null);
    const router = useRouter();

    const fetchsettings_venero_2 = async () => {
        const { data, error } = await supabase
            .from("settings_venero_2")
            .select("*")
            .eq("id", 1)
            .maybeSingle();

        if (error) {
            toast.error("Error cargando configuración");
            return;
        }

        if (!data) {
            setsettings_venero_2("no-config");
        } else {
            setsettings_venero_2(data);
        }
    };

    useEffect(() => {
        fetchsettings_venero_2();
    }, []);

    const goBack = () => router.back();

    const createDefault = async () => {
        const { error } = await supabase.from("settings_venero_2").insert([
            {
                id: 1,
                izipay_mode: "test",
                izipay_username_test: "",
                izipay_password_test: "",
                izipay_public_key_test: "",
                izipay_username_live: "",
                izipay_password_live: "",
                izipay_public_key_live: "",
            },
        ]);

        if (error) {
            toast.error("Error creando configuración");
        } else {
            toast.success("Configuración creada");
            fetchsettings_venero_2();
        }
    };

    const save = async () => {
        if (!settings_venero_2 || settings_venero_2 === "no-config") return;

        const payload = {
            izipay_mode: settings_venero_2.izipay_mode,

            izipay_username_test: settings_venero_2.izipay_username_test,
            izipay_password_test: settings_venero_2.izipay_password_test,
            izipay_public_key_test: settings_venero_2.izipay_public_key_test,

            izipay_username_live: settings_venero_2.izipay_username_live,
            izipay_password_live: settings_venero_2.izipay_password_live,
            izipay_public_key_live: settings_venero_2.izipay_public_key_live,

            updated_at: new Date()
        };

        const { error } = await supabase
            .from("settings_venero_2")
            .update(payload)
            .eq("id", 1);

        if (error) {
            toast.error("Error guardando");
        } else {
            toast.success("Guardado correctamente");
            fetchsettings_venero_2();
        }
    };

    if (settings_venero_2 === null) return "Cargando...";

    if (settings_venero_2 === "no-config") {
        return (
            <ProtectedRoute>
                <Navbar />

                <div className="p-6 max-w-xl mx-auto">
                    <button
                        onClick={goBack}
                        className="mb-6 flex items-center text-gray-700 hover:text-black cursor-pointer"
                    >
                        <BiChevronLeft className="w-6 h-6" /> Volver
                    </button>

                    <h1 className="text-3xl font-bold mb-4">Configuración</h1>

                    <p className="text-red-500 font-semibold mb-4">
                        No existe configuración en la base de datos.
                    </p>

                    <button
                        onClick={createDefault}
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Crear configuración por defecto
                    </button>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Navbar />

            <div className="p-6 max-w-xl mx-auto">
                <button
                    onClick={goBack}
                    className="mb-6 flex items-center text-gray-700 hover:text-black cursor-pointer"
                >
                    <BiChevronLeft className="w-6 h-6" /> Volver
                </button>

                <h1 className="text-3xl font-bold mb-6">Configuración</h1>

                <div className="space-y-4">
                    <select
                        value={settings_venero_2.izipay_mode}
                        onChange={(e) =>
                            setsettings_venero_2({
                                ...settings_venero_2,
                                izipay_mode: e.target.value,
                            })
                        }
                        className="w-full border p-3 rounded outline-none"
                    >
                        <option value="test">Modo Test</option>
                        <option value="live">Modo Live</option>
                    </select>

                    {settings_venero_2.izipay_mode === "test" && (
                        <>
                            <input
                                value={settings_venero_2.izipay_username_test || ""}
                                onChange={(e) =>
                                    setsettings_venero_2({
                                        ...settings_venero_2,
                                        izipay_username_test: e.target.value,
                                    })
                                }
                                placeholder="Usuario Izipay TEST"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                value={settings_venero_2.izipay_password_test || ""}
                                onChange={(e) =>
                                    setsettings_venero_2({
                                        ...settings_venero_2,
                                        izipay_password_test: e.target.value,
                                    })
                                }
                                placeholder="Password TEST"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                value={settings_venero_2.izipay_public_key_test || ""}
                                onChange={(e) =>
                                    setsettings_venero_2({
                                        ...settings_venero_2,
                                        izipay_public_key_test: e.target.value,
                                    })
                                }
                                placeholder="Public Key TEST"
                                className="w-full border p-3 rounded"
                            />
                        </>
                    )}

                    {settings_venero_2.izipay_mode === "live" && (
                        <>
                            <input
                                value={settings_venero_2.izipay_username_live || ""}
                                onChange={(e) =>
                                    setsettings_venero_2({
                                        ...settings_venero_2,
                                        izipay_username_live: e.target.value,
                                    })
                                }
                                placeholder="Usuario Izipay LIVE"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                value={settings_venero_2.izipay_password_live || ""}
                                onChange={(e) =>
                                    setsettings_venero_2({
                                        ...settings_venero_2,
                                        izipay_password_live: e.target.value,
                                    })
                                }
                                placeholder="Password LIVE"
                                className="w-full border p-3 rounded"
                            />

                            <input
                                value={settings_venero_2.izipay_public_key_live || ""}
                                onChange={(e) =>
                                    setsettings_venero_2({
                                        ...settings_venero_2,
                                        izipay_public_key_live: e.target.value,
                                    })
                                }
                                placeholder="Public Key LIVE"
                                className="w-full border p-3 rounded"
                            />
                        </>
                    )}

                    <button
                        onClick={save}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}