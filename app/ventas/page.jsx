"use client";
import { useEffect, useState } from "react";

export default function Ventas() {
  const [formToken, setFormToken] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    if (!formToken || !publicKey) return;

    // Evitar doble carga
    if (document.getElementById("krypton-script")) return;

    const script = document.createElement("script");
    script.id = "krypton-script";
    script.src =
      "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js";
    script.async = true;
    document.body.appendChild(script);

    const css = document.createElement("link");
    css.id = "krypton-css";
    css.rel = "stylesheet";
    css.href =
      "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.css";
    document.head.appendChild(css);

    return () => {
      document.getElementById("krypton-script")?.remove();
      document.getElementById("krypton-css")?.remove();
    };
  }, [formToken, publicKey]);

  const pagar = async () => {
    const res = await fetch("/api/izipay/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1 }),
    });

    const data = await res.json();
    setFormToken(data.formToken);
    setPublicKey(data.publicKey);
  };

  return (
    <div className="p-6">
      <button
        onClick={pagar}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Pagar con Izipay
      </button>

      {formToken && publicKey && (
        <div
          className="kr-embedded mt-6"
          kr-form-token={formToken}
          kr-public-key={publicKey}
        ></div>
      )}
    </div>
  );
}