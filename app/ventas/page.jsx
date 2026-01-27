"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Ventas() {
  const [formToken, setFormToken] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [amount, setAmount] = useState("0.00");

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(null);

  const MAX_AMOUNT = 10000;

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
      resetPago();

      toast.success("🎉 Pago realizado con éxito");
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

  const pagar = async () => {
    const monto = Number(amount);

    if (!amount || monto <= 0) {
      toast.error("Debes ingresar un monto válido mayor a 0");
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
    setAmount("1.00");
  };

  return (
    <div className="p-6 flex flex-col gap-4 items-center justify-center h-screen">
      <div>
        <label>Monto a pagar (PEN)</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => {
            let value = e.target.value.replace(",", ".");

            if (!/^\d*\.?\d{0,2}$/.test(value)) return;

            if (Number(value) > MAX_AMOUNT) {
              toast.error(`El monto máximo permitido es S/. ${MAX_AMOUNT.toFixed(2)}`);
              return;
            }

            setAmount(value);
          }}
          onBlur={() => {
            if (!amount || Number(amount) <= 0) {
              setAmount("0.00");
              return;
            }

            if (Number(amount) > MAX_AMOUNT) {
              toast.error(`El monto máximo permitido es S/. ${MAX_AMOUNT.toFixed(2)}`);
              setAmount(MAX_AMOUNT.toFixed(2));
              return;
            }

            setAmount(Number(amount).toFixed(2));
          }}
          placeholder="0.00"
          className="border p-2 w-full mt-2 outline-none"
        />
      </div>

      <button
        onClick={pagar}
        disabled={loading}
        className={`px-4 py-2 rounded text-white cursor-pointer ${loading ? "bg-gray-500" : "bg-green-600"
          }`}
      >
        {loading ? "Generando pago..." : "Generar pago"}
      </button>

      {status === "success" && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          ✅ Pago realizado con éxito. Puedes generar otro pago.
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          ❌ Hubo un problema con el pago. Inténtalo nuevamente.
        </div>
      )}

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

            <h3 className="text-lg font-bold mb-4 w-full">Pago con tarjeta</h3>
            <div
              className="kr-smart-form"
              kr-card-form-expanded="true"
              kr-form-token={formToken}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}