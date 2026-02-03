import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-kr-signature");

        console.log("==== IZIPAY IPN RECEIVED ====");
        console.log("RAW BODY:", body);
        console.log("SIGNATURE:", signature);

        const data = JSON.parse(body);

        const { data: config, error } = await supabase
            .from("settings_venero_2")
            .select("*")
            .eq("id", 1)
            .single();

        if (error || !config) {
            console.error("❌ No se pudo leer configuración Supabase");
            return NextResponse.json({ error: "Config error" }, { status: 500 });
        }

        const isTest = config.izipay_mode === "test";

        // 🔐 Validar firma solo en LIVE
        if (!isTest) {
            const password = config.izipay_password_live;
            const computedSignature = crypto
                .createHmac("sha256", password)
                .update(body)
                .digest("base64");

            if (computedSignature !== signature) {
                console.error("❌ Firma inválida IPN");
                return NextResponse.json(
                    { error: "Invalid signature" },
                    { status: 401 }
                );
            }
        } else {
            console.log("⚠️ Modo TEST: firma no validada");
        }

        console.log("✅ IPN aceptada");

        const paymentStatus = data?.answer?.orderStatus;
        const orderId = data?.answer?.orderId;
        const transactionId = data?.answer?.transactionId;

        console.log("STATUS:", paymentStatus);
        console.log("ORDER:", orderId);
        console.log("TX:", transactionId);

        // 🔄 Actualizar si existe, si no insertar
        const { data: existing } = await supabase
            .from("payments")
            .select("id")
            .eq("order_id", orderId)
            .single();

        if (existing) {
            await supabase
                .from("payments")
                .update({
                    transaction_id: transactionId,
                    status: paymentStatus,
                    raw: data,
                })
                .eq("order_id", orderId);
        } else {
            await supabase.from("payments").insert({
                order_id: orderId,
                transaction_id: transactionId,
                status: paymentStatus,
                raw: data,
            });
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("🔥 IPN ERROR:", err);
        return NextResponse.json({ error: "IPN error" }, { status: 500 });
    }
}