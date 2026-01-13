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
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { BiChevronLeft } from "react-icons/bi";

export default function Ventas() {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const goBack = () => router.push("/");

    const iniciarPago = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("Ingresa un monto válido");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/venta-forzada/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount) }),
            });

            if (!res.ok) {
                const err = await res.text();
                console.error(err);
                toast.error("Error iniciando el pago");
                setLoading(false);
                return;
            }

            const data = await res.json();

            if (!data.redirectUrl) {
                toast.error("Respuesta inválida del servidor");
                setLoading(false);
                return;
            }

            window.location.href = data.redirectUrl;

        } catch (err) {
            console.error(err);
            toast.error("Error inesperado");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 border rounded-lg shadow">

            <button
                onClick={goBack}
                className="mb-6 flex items-center text-gray-700 hover:text-black transition cursor-pointer"
            >
                <BiChevronLeft className="w-6 h-6" />
                <span>Volver</span>
            </button>
            
            <h1 className="text-2xl font-bold mb-6 text-center">
                Venta Forzada
            </h1>

            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-3 mb-4 outline-none rounded"
                placeholder="Monto en USD"
                disabled={loading}
            />

            <button
                onClick={iniciarPago}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded text-white transition ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-black hover:bg-gray-800 cursor-pointer"
                    }`}
            >
                {loading ? (
                    <>
                        <FaSpinner className="animate-spin" />
                        Procesando pago…
                    </>
                ) : (
                    "Continuar"
                )}
            </button>
        </div>
    );
}