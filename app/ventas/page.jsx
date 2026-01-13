// "use client";

// import { useState } from "react";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import Navbar from "@/components/Navbar";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./CheckoutForm";
// import toast from "react-hot-toast";

// export default function Ventas() {
//     const [amount, setAmount] = useState("");
//     const [clientSecret, setClientSecret] = useState(null);
//     const [stripePromise, setStripePromise] = useState(null);
//     const [amountError, setAmountError] = useState("");

//     const createCheckout = async () => {
//         setAmountError("");

//         const numericAmount = Number(amount);

//         if (!numericAmount || numericAmount < 2) {
//             const msg = "El monto mínimo es S/. 2.00";
//             setAmountError(msg);
//             toast.error(msg);
//             return;
//         }

//         toast.loading("Creando pago...");

//         try {
//             const res = await fetch("/api/checkout", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ amount: numericAmount }),
//             });

//             const text = await res.text();
//             toast.dismiss();

//             if (!text) {
//                 toast.error("Respuesta vacía del servidor");
//                 return;
//             }

//             const data = JSON.parse(text);

//             if (!res.ok) {
//                 toast.error(data.error || "Error creando checkout");
//                 return;
//             }

//             setClientSecret(data.clientSecret);
//             setStripePromise(loadStripe(data.publishableKey));

//         } catch (err) {
//             toast.dismiss();
//             console.error(err);
//             toast.error("Error inesperado");
//         }
//     };

//     return (
//         <ProtectedRoute>
//             <Navbar />

//             <div className="p-6 max-w-md mx-auto">
//                 <h1 className="text-3xl font-bold mb-6">Venta Diaria</h1>

//                 {!clientSecret && (
//                     <>
//                         <input
//                             type="number"
//                             min="2"
//                             step="0.01"
//                             placeholder="Monto (S/)"
//                             value={amount}
//                             onChange={(e) => {
//                                 setAmount(e.target.value);
//                                 setAmountError("");
//                             }}
//                             className={`w-full border p-3 rounded mb-1 ${amountError ? "border-red-500" : ""
//                                 }`}
//                         />

//                         {amountError && (
//                             <p className="text-sm text-red-600 mb-4">
//                                 {amountError}
//                             </p>
//                         )}

//                         <button
//                             onClick={createCheckout}
//                             className="w-full bg-blue-600 text-white py-3 rounded cursor-pointer"
//                         >
//                             Continuar
//                         </button>
//                     </>
//                 )}

//                 {clientSecret && stripePromise && (
//                     <Elements
//                         stripe={stripePromise}
//                         options={{ clientSecret }}
//                     >
//                         <CheckoutForm />
//                     </Elements>
//                 )}
//             </div>
//         </ProtectedRoute>
//     );
// }

"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function Ventas() {
    const [amount, setAmount] = useState("");

    const iniciarPago = async () => {
        try {
            const res = await fetch("/api/venta-forzada/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount), userId: "demo" })
            });

            if (!res.ok) {
                const err = await res.text();
                console.error("API error:", err);
                toast.error("Error iniciando el pago");
                return;
            }

            const data = await res.json();

            if (!data.redirectUrl) {
                console.error("Respuesta inválida:", data);
                toast.error("Respuesta inválida del servidor");
                return;
            }

            window.location.href = data.redirectUrl;

        } catch (e) {
            console.error(e);
            toast.error("Error inesperado");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-3 mb-4"
                placeholder="Monto"
            />

            <button
                onClick={iniciarPago}
                className="w-full bg-black text-white py-3"
            >
                Continuar
            </button>
        </div>
    );
}