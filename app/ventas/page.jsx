"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import FormPago from "./FormPago";

export default function Ventas() {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const cargarStripe = async () => {
      const res = await fetch("/api/stripe/public-key");
      const data = await res.json();

      if (data?.stripe_pk) {
        setStripePromise(loadStripe(data.stripe_pk));
      }
    };

    cargarStripe();
  }, []);

  if (!stripePromise) {
    return <div className="p-6">Cargando Stripe…</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <FormPago />
    </Elements>
  );
}