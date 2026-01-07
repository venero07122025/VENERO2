import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
    try {
        console.log("🚀 POST /api/checkout");

        const { amount } = await req.json();
        console.log("💰 Amount:", amount);

        if (!amount || Number(amount) <= 0) {
            return NextResponse.json(
                { error: "Monto inválido" },
                { status: 400 }
            );
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data: settings_venero_2 } = await supabase
            .from("settings_venero_2")
            .select("*")
            .eq("id", 1)
            .single();

        if (!settings_venero_2?.stripe_sk || !settings_venero_2?.stripe_pk) {
            return NextResponse.json(
                { error: "Stripe no configurado" },
                { status: 400 }
            );
        }

        const stripe = new Stripe(settings_venero_2.stripe_sk);

        console.log("⚡ Creando PaymentIntent...");

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100),
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            payment_method_options: {
                card: {
                    request_three_d_secure: "automatic",
                },
            },
        });

        console.log("✅ PaymentIntent:", paymentIntent.id);

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            publishableKey: settings_venero_2.stripe_pk,
        });

    } catch (err) {
        console.error("🔥 ERROR /api/checkout:", err);
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}