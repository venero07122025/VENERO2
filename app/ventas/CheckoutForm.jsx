"use client";

import { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        setLoading(true);

        const result = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
            confirmParams: {
                return_url: `${window.location.origin}/ventas?success=true`,
            },
        });

        if (result.error) {
            const err = result.error;

            // 🔴 Errores reales
            if (err.type === "card_error") {
                if (err.decline_code === "fraudulent") {
                    toast.error("El banco bloqueó la transacción por seguridad.");
                } else if (err.decline_code === "insufficient_funds") {
                    toast.error("Fondos insuficientes.");
                } else {
                    toast.error(err.message);
                }
            } else {
                toast.error("Error inesperado al procesar el pago.");
            }

            setLoading(false);
            return;
        }

        const paymentIntent = result.paymentIntent;

        // ✅ Pago completado
        if (paymentIntent.status === "succeeded") {
            toast.success("Pago realizado con éxito 🎉");
            return;
        }

        // 🔐 Stripe lanzó 3DS (esto es OK)
        if (paymentIntent.status === "requires_action") {
            // Stripe manejará el challenge automáticamente
            setLoading(false);
            return;
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement
                options={{
                    fields: {
                        billingDetails: "auto",
                    },
                }}
            />

            <button
                type="submit"
                disabled={!stripe || loading}
                className={`mt-4 w-full py-3 rounded flex items-center justify-center gap-2
                    ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-black cursor-pointer"}
                    text-white transition`}
            >
                {loading ? (
                    <>
                        <FaSpinner className="animate-spin" />
                        Procesando pago...
                    </>
                ) : (
                    "Pagar"
                )}
            </button>
        </form>
    );
}