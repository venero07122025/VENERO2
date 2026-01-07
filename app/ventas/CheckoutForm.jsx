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

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/ventas?success=true`,
            },
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />

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