import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
    try {
        const body = await req.json();

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data: settings } = await supabase
            .from("settings")
            .select("*")
            .eq("id", 1)
            .single();

        if (!settings || !settings.stripe_sk) {
            return NextResponse.json(
                { error: "Stripe no está configurado" },
                { status: 400 }
            );
        }

        const stripe = new Stripe(settings.stripe_sk);

        const [exp_month, exp_year_raw] = body.exp.split("/");
        const exp_year = exp_year_raw.length === 2 ? `20${exp_year_raw}` : exp_year_raw;

        const payment = await stripe.paymentIntents.create({
            amount: Number(body.amount), // monto en centavos
            currency: "usd",
            payment_method_data: {
                type: "card",
                card: {
                    number: body.card_number,
                    exp_month,
                    exp_year,
                    cvc: body.cvc,
                },
            },
            confirm: true,
        });

        await supabase.from("transactions").insert({
            amount: body.amount,
            operator_id: settings.current_operator_id || null,
            status: payment.status,
            stripe_id: payment.id
        });

        return NextResponse.json({ ok: true, payment });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}