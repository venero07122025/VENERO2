import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: config } = await supabase
        .from("settings_venero_2")
        .select("stripe_pk")
        .eq("id", 1)
        .maybeSingle();

    if (!config?.stripe_pk) {
        return NextResponse.json(
            { error: "Stripe PK no configurada" },
            { status: 500 }
        );
    }

    return NextResponse.json({ stripe_pk: config.stripe_pk });
}