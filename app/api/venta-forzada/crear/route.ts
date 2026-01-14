import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const AMEX_SAFE_CURRENCIES = ["usd", "eur"];

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: config, error: configError } = await supabase
            .from("settings_venero_2")
            .select("stripe_sk")
            .eq("id", 1)
            .single();

        if (configError || !config?.stripe_sk) {
            return NextResponse.json(
                { error: "Stripe no configurado" },
                { status: 500 }
            );
        }

        const stripe = new Stripe(config.stripe_sk);

        const country =
            req.headers.get("x-vercel-ip-country") ||
            req.headers.get("cf-ipcountry") ||
            "US";

        let currency = getCurrencyByCountry(country);

        if (!AMEX_SAFE_CURRENCIES.includes(currency)) {
            currency = "usd";
        }

        const orderId = `ORD-${Date.now()}`;

        await supabase.from("orders").insert({
            external_id: orderId,
            amount,
            currency,
            country,
            status: "pending",
        });

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: "auto@forzado.com",
            billing_address_collection: "auto",
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: "Venta Forzada",
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/ventas/resultado?status=Aprobada&orden=${orderId}&monto=${amount}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/ventas/resultado?status=Rechazada&orden=${orderId}&monto=${amount}`,
        });

        return NextResponse.json({
            redirectUrl: session.url,
        });

    } catch (err: any) {
        console.error("Venta forzada error:", err);
        return NextResponse.json(
            { error: err.message || "Error interno" },
            { status: 500 }
        );
    }
}

function getCurrencyByCountry(country: string): string {
    const map: Record<string, string> = {
        US: "usd",
        MX: "mxn",
        PE: "pen",
        CO: "cop",
        CL: "clp",
        AR: "ars",
        BR: "brl",
        EC: "usd",
    };

    return map[country] || "usd";
}