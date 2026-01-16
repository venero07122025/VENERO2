"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

function FormPago() {
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const mostrarErrorPago = (data) => {
        if (data?.decline_code === "fraudulent") {
            toast.error("El banco rechazó el pago por posible fraude.");
            return;
        }

        if (data?.code === "card_declined") {
            toast.error("La tarjeta fue rechazada por el banco.");
            return;
        }

        if (data?.code === "insufficient_funds") {
            toast.error("Fondos insuficientes en la tarjeta.");
            return;
        }

        if (data?.requiresAction) {
            toast("El banco requiere verificación adicional (3DS).", {
                icon: "⚠️",
            });
            return;
        }

        toast.error(data?.error || "Pago rechazado");
    };

    const registrarYcobrar = async () => {
        if (!stripe || !elements) return;

        if (!email || !amount) {
            toast.error("Email y monto requeridos");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            toast.error("No se pudo leer la tarjeta");
            return;
        }

        setLoading(true);

        try {
            toast.loading("Registrando tarjeta...");

            const res = await fetch("/api/stripe/setup-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const setupData = await res.json();
            toast.dismiss();

            if (!setupData?.clientSecret) {
                toast.error(setupData?.error || "No se pudo registrar la tarjeta");
                return;
            }

            const result = await stripe.confirmCardSetup(
                setupData.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: { email },
                    },
                }
            );

            if (result.error) {
                toast.error(result.error.message || "Error validando tarjeta");
                return;
            }

            toast.loading("Procesando cobro...");

            const cobro = await fetch("/api/venta-forzada/cobrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Number(amount),
                    customerId: setupData.customerId,
                    paymentMethodId: result.setupIntent.payment_method,
                }),
            });

            const cobroData = await cobro.json();
            toast.dismiss();

            if (cobroData?.status === "succeeded") {
                toast.success("Pago aprobado correctamente ✅");
            } else {
                mostrarErrorPago(cobroData);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error inesperado procesando el pago");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 border rounded">
            <h1 className="text-xl font-bold mb-4">Pago manual</h1>

            <input
                className="w-full border p-2 mb-3"
                placeholder="Email del cliente"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="w-full border p-2 mb-3"
                placeholder="Monto"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <div className="border p-3 mb-4 rounded">
                <CardElement />
            </div>

            <button
                onClick={registrarYcobrar}
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded"
            >
                {loading ? "Procesando..." : "Cobrar"}
            </button>
        </div>
    );
}

export default FormPago;