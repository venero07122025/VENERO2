// app/api/venta-forzada/crear/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const amount = Number(body?.amount);
        const currencyRequested = (body?.currency || "").toLowerCase() || undefined;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Leer configuración desde settings_venero_2 (fila id = 1)
        const { data: config, error: configError } = await supabase
            .from("settings_venero_2")
            .select("*")
            .eq("id", 1)
            .maybeSingle();

        if (configError) {
            console.error("Error leyendo settings_venero_2:", configError);
            return NextResponse.json({ error: "Error leyendo configuración" }, { status: 500 });
        }

        if (!config?.stripe_sk) {
            return NextResponse.json({ error: "Stripe no configurado" }, { status: 500 });
        }

        // Inicializa Stripe con la secret key desde la DB
        const stripe = new Stripe(config.stripe_sk);

        // Decide moneda: prioridad -> body.currency -> config.default_currency -> "usd"
        const currency = currencyRequested || (config.default_currency || "usd");

        const orderId = `ORD-${Date.now()}`;

        // Guarda la orden (incluyendo currency)
        await supabase.from("orders").insert({
            external_id: orderId,
            amount,
            currency,
            status: "pending",
        });

        // Nota: usamos Math.round(amount * 100) que funciona para monedas con 2 decimales.
        // Si trabajas con JPY u otras sin decimales, ajusta según currency.
        const unitAmount = Math.round(amount * 100);

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: "auto@forzado.com",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: "Venta Forzada" },
                        unit_amount: unitAmount,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/ventas/resultado?status=Aprobada&orden=${orderId}&monto=${amount}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/ventas/resultado?status=Rechazada&orden=${orderId}&monto=${amount}`,
        });

        return NextResponse.json({ redirectUrl: session.url });
    } catch (err: any) {
        console.error("Venta forzada error:", err);
        return NextResponse.json({ error: err.message || "Error interno" }, { status: 500 });
    }
}