"use client";

import { useSearchParams } from "next/navigation";

export default function Resultado() {
    const params = useSearchParams();

    const status = params.get("status");
    const orden = params.get("orden");
    const monto = params.get("monto");

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded text-center">
            <h1 className="text-2xl font-bold mb-4">
                {status === "Aprobada" ? "Pago aprobado 🎉" : "Pago rechazado ❌"}
            </h1>

            <p>Orden: {orden}</p>
            <p>Monto: ${monto}</p>

            <a
                href="/ventas"
                className="inline-block mt-6 bg-black text-white px-6 py-2"
            >
                Volver
            </a>
        </div>
    );
}