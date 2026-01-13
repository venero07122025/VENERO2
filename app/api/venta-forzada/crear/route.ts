import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Monto inválido" },
                { status: 400 }
            );
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const externalId = "ORD-" + Date.now();

        const { error } = await supabase
            .from("orders")
            .insert({
                amount,
                status: "pending",
                external_id: externalId
            });

        if (error) {
            console.error("❌ Supabase error:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            redirectUrl: `/gateway/pago?order=${externalId}&amount=${amount}`
        });

    } catch (err: any) {
        console.error("🔥 API crash:", err);
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}