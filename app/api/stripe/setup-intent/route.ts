import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email requerido" },
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
            throw new Error("Stripe no configurado");
        }

        const stripe = new Stripe(config.stripe_sk);

        // Crear customer REAL
        const customer = await stripe.customers.create({
            email,
        });

        // SetupIntent (NO COBRA)
        const setupIntent = await stripe.setupIntents.create({
            customer: customer.id,
            payment_method_types: ["card"],
            usage: "off_session",
        });

        return NextResponse.json({
            clientSecret: setupIntent.client_secret,
            customerId: customer.id,
        });
    } catch (err: any) {
        console.error("SETUP INTENT ERROR:", err);
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}