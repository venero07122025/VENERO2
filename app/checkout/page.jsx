"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BiChevronLeft } from "react-icons/bi";
import { useCart } from "@/components/CartContext";
import Image from "next/image";

export default function Checkout() {
    const router = useRouter();
    const { items, total, clearCart } = useCart();

    const [formToken, setFormToken] = useState(null);
    const [publicKey, setPublicKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState(null);

    const MAX_AMOUNT = 10000;

    // ==================== IZIPAY INIT ====================
    useEffect(() => {
        if (!publicKey) return;

        if (!document.getElementById("krypton-css")) {
            const css = document.createElement("link");
            css.id = "krypton-css";
            css.rel = "stylesheet";
            css.href =
                "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.css";
            document.head.appendChild(css);
        }

        if (!document.getElementById("krypton-neon-css")) {
            const neonCss = document.createElement("link");
            neonCss.id = "krypton-neon-css";
            neonCss.rel = "stylesheet";
            neonCss.href =
                "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/neon-reset.min.css";
            document.head.appendChild(neonCss);
        }

        if (!document.getElementById("krypton-neon-js")) {
            const neonJs = document.createElement("script");
            neonJs.id = "krypton-neon-js";
            neonJs.src =
                "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/neon.js";
            neonJs.async = true;
            document.body.appendChild(neonJs);
        }

        if (!document.getElementById("krypton-script")) {
            const script = document.createElement("script");
            script.id = "krypton-script";
            script.src =
                "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js";
            script.setAttribute("kr-public-key", publicKey);
            script.async = true;
            document.body.appendChild(script);
        }

        const successHandler = (e) => {
            console.log("✅ Pago exitoso:", e.detail);
            setStatus("success");
            setShowModal(false);
            clearCart();
            toast.success("🎉 Pago realizado con éxito");
            resetPago();
        };

        const errorHandler = (e) => {
            console.error("❌ Error en el pago:", e.detail);
            setStatus("error");
            toast.error("❌ El pago fue rechazado o cancelado");
        };

        window.addEventListener("kr-payment-success", successHandler);
        window.addEventListener("kr-payment-error", errorHandler);

        return () => {
            window.removeEventListener("kr-payment-success", successHandler);
            window.removeEventListener("kr-payment-error", errorHandler);
        };
    }, [publicKey]);

    // ==================== PAGAR ====================
    const pagar = async () => {
        const monto = Number(total);

        if (!items.length || monto <= 0) {
            toast.error("El carrito está vacío");
            return;
        }

        if (monto > MAX_AMOUNT) {
            toast.error(`El monto máximo permitido es S/. ${MAX_AMOUNT.toFixed(2)}`);
            return;
        }

        setLoading(true);
        setStatus(null);
        toast.loading("Generando pago...", { id: "pago" });

        try {
            const res = await fetch("/api/izipay/create-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: monto.toFixed(2) }),
            });

            const data = await res.json();
            if (!data.formToken || !data.publicKey) {
                throw new Error("No se pudo generar el pago");
            }

            setFormToken(data.formToken);
            setPublicKey(data.publicKey);
            setShowModal(true);
            toast.success("Formulario de pago listo", { id: "pago" });
        } catch (err) {
            console.error(err);
            toast.error("Error al generar el pago", { id: "pago" });
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    const resetPago = () => {
        setFormToken(null);
        setPublicKey(null);
    };

    const goBack = () => router.push("/");

    // ==================== UI ====================
    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-xl p-8 relative">
                <button
                    onClick={goBack}
                    className="mb-6 flex items-center text-gray-600 hover:text-black transition cursor-pointer"
                >
                    <BiChevronLeft className="w-6 h-6" />
                    <span>Volver</span>
                </button>

                <h1 className="text-2xl font-bold mb-6">Checkout</h1>

                {/* ==================== RESUMEN ==================== */}
                <div className="bg-zinc-50 border rounded-2xl p-4 mb-6 shadow-inner">

                    {/* Lista con scroll */}
                    <div className="max-h-72 overflow-y-auto pr-2 space-y-3 custom-scroll">
                        {items.map((p, i) => (
                            <div
                                key={`${p.id}-${i}`}
                                className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition"
                            >
                                <Image
                                    src={p.image}
                                    alt={p.name}
                                    width={56}
                                    height={56}
                                    className="w-14 h-14 object-cover rounded-lg"
                                />

                                <div className="flex flex-col flex-1">
                                    <span className="font-medium text-sm text-zinc-900">{p.name}</span>
                                    <span className="text-xs text-zinc-500">Servicio arquitectónico</span>
                                </div>

                                <span className="text-sm font-semibold bg-zinc-900 text-white px-3 py-1 rounded-full">
                                    S/. {p.price.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total fijo */}
                    <div className="flex justify-between items-center font-bold text-lg pt-4 mt-4 border-t">
                        <span>Total</span>
                        <span className="text-zinc-900">S/. {total.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={pagar}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-semibold transition cursor-pointer ${loading ? "bg-gray-500" : "bg-black hover:bg-black/80"
                        }`}
                >
                    {loading ? "Generando pago..." : "Pagar con tarjeta"}
                </button>

                {status === "success" && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
                        ✅ Pago realizado con éxito.
                    </div>
                )}

                {status === "error" && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                        ❌ Hubo un problema con el pago.
                    </div>
                )}

                {/* ==================== MODAL IZIPAY ==================== */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetPago();
                                }}
                                className="absolute top-2 right-2 text-gray-500"
                            >
                                ✖
                            </button>

                            <h3 className="text-lg font-bold mb-4 w-full">
                                Pago con tarjeta
                            </h3>

                            <div
                                className="kr-smart-form"
                                kr-card-form-expanded="true"
                                kr-form-token={formToken}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}