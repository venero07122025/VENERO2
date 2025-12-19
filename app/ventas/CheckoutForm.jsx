"use client";

import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/ventas?success=true`,
            },
        });

        if (error) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button
                type="submit"
                className="mt-4 w-full bg-black text-white py-3 rounded"
            >
                Pagar
            </button>
        </form>
    );
}