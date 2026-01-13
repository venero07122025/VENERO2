"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PagoGateway() {
    const params = useSearchParams();
    const router = useRouter();

    const order = params.get("order");
    const amount = params.get("amount");
    const [loading, setLoading] = useState(false);

    const pagar = (estatus) => {
        setLoading(true);

        setTimeout(() => {
            router.push(
                `/api/venta-forzada/confirmacion?estatus=${estatus}&orden=${order}&monto=${amount}`
            );
        }, 1500);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded">
            <h1 className="text-xl font-bold mb-4">Pago con Tarjeta</h1>

            <input placeholder="Número de tarjeta" className="w-full border p-2 mb-2" />
            <input placeholder="MM/YY" className="w-full border p-2 mb-2" />
            <input placeholder="CVV" className="w-full border p-2 mb-4" />

            <button
                disabled={loading}
                onClick={() => pagar("Aprobada")}
                className="w-full bg-green-600 text-white py-2 mb-2"
            >
                Aprobar pago ${amount}
            </button>

            <button
                disabled={loading}
                onClick={() => pagar("Rechazada")}
                className="w-full bg-red-600 text-white py-2"
            >
                Rechazar pago
            </button>
        </div>
    );
}