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

        const { data: config } = await supabase
            .from("settings_venero_2")
            .select("*")
            .eq("id", 1)
            .single();

        const password =
            config.izipay_mode === "test"
                ? config.izipay_password_test
                : config.izipay_password_live;

        const computedSignature = crypto
            .createHmac("sha256", password)
            .update(body)
            .digest("base64");

        if (computedSignature !== signature) {
            console.error("❌ Firma inválida IPN");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        console.log("✅ IPN válida");

        const paymentStatus = data?.answer?.orderStatus;
        const orderId = data?.answer?.orderId;
        const transactionId = data?.answer?.transactionId;

        console.log("STATUS:", paymentStatus);
        console.log("ORDER:", orderId);

        await supabase.from("payments").insert({
            order_id: orderId,
            transaction_id: transactionId,
            status: paymentStatus,
            raw: data,
        });

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("🔥 IPN ERROR:", err);
        return NextResponse.json({ error: "IPN error" }, { status: 500 });
    }
}