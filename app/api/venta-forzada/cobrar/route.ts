import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, currency = "usd", customerId, paymentMethodId } = body;

        if (!amount || !customerId || !paymentMethodId) {
            return NextResponse.json(
                { error: "Datos incompletos" },
                { status: 400 }
            );
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: config } = await supabase
            .from("settings_venero_2")
            .select("*")
            .eq("id", 1)
            .maybeSingle();

        if (!config?.stripe_sk) {
            return NextResponse.json(
                { error: "Stripe no configurado" },
                { status: 500 }
            );
        }

        const stripe = new Stripe(config.stripe_sk);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100),
            currency,
            customer: customerId,
            payment_method: paymentMethodId,
            off_session: true,
            confirm: true,
            description: "Cobro POS manual",
        });

        return NextResponse.json({
            status: paymentIntent.status,
            id: paymentIntent.id,
        });
    } catch (err: any) {
        console.error("🔥 ERROR STRIPE:", err);

        // Stripe Card Errors
        if (err.type === "StripeCardError") {
            return NextResponse.json(
                {
                    error: err.message,
                    code: err.code,
                    decline_code: err.decline_code,
                },
                { status: 402 }
            );
        }

        // 3DS requerido
        if (err.code === "authentication_required") {
            return NextResponse.json(
                {
                    requiresAction: true,
                    paymentIntentId: err.raw?.payment_intent?.id,
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: "Error procesando el pago" },
            { status: 500 }
        );
    }
}