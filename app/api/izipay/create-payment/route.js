import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
    try {
        console.log("==== IZIPAY CREATE PAYMENT START ====");

        const body = await req.json();
        console.log("BODY RECIBIDO:", body);

        const { amount, customer } = body;

        const {
            email,
            firstName,
            lastName,
            address,
            city,
            phoneNumber,
        } = customer || {};

        const { data: config, error } = await supabase
            .from("settings_venero_2")
            .select("*")
            .eq("id", 1)
            .single();

        console.log("SUPABASE ERROR:", error);
        console.log("CONFIG OBTENIDA:", config);

        if (error || !config) {
            console.error("❌ No se pudo leer configuración de Supabase");
            return NextResponse.json(
                { error: "No se pudo leer configuración" },
                { status: 500 }
            );
        }

        const {
            izipay_mode,
            izipay_username_test,
            izipay_password_test,
            izipay_public_key_test,
            izipay_username_live,
            izipay_password_live,
            izipay_public_key_live,
        } = config;

        let izipay_username;
        let izipay_password;
        let izipay_public_key;

        if (izipay_mode === "test") {
            izipay_username = izipay_username_test;
            izipay_password = izipay_password_test;
            izipay_public_key = izipay_public_key_test;
        } else {
            izipay_username = izipay_username_live;
            izipay_password = izipay_password_live;
            izipay_public_key = izipay_public_key_live;
        }

        console.log("MODO REAL USADO:", izipay_mode);
        console.log("USERNAME:", izipay_username);
        console.log("PASSWORD:", izipay_password ? "OK" : "VACÍO");
        console.log("PUBLIC KEY:", izipay_public_key);

        if (!izipay_public_key) {
            console.error("❌ PUBLIC KEY VACÍA EN BASE DE DATOS");
            return NextResponse.json(
                { error: "Public Key no configurada en la base de datos" },
                { status: 500 }
            );
        }

        const endpoint =
            "https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment";

        const payload = {
            amount: Math.round(Number(amount) * 100),
            currency: "PEN",
            orderId: "ORD-" + Date.now(),
            formAction: "PAYMENT",

            customer: {
                email: email || "venero-cliente@gmail.com",

                billingDetails: {
                    firstName: firstName || "Jose",
                    lastName: lastName || "Perez",
                    identityType: "DNI_PER",
                    identityCode: "70707070",
                    address: address || "Av. Siempre Viva 742",
                    city: city || "Lima",
                    country: "PE",
                    phoneNumber: phoneNumber || "999999999",
                    category: "PRIVATE"
                }
            },

            metadata: {
                cybersource_mdd_12: email || "venero-cliente@gmail.com",
                cybersource_mdd_13: phoneNumber || "999999999",
                cybersource_mdd_14: "01-70707070", // 01 = DNI
                cybersource_mdd_17: "NO",          // cliente frecuente
                cybersource_mdd_22: "01",          // invitado
                cybersource_mdd_24: "BAJO"         // riesgo declarado
            },

            strongAuthentication: "DISABLED"
        };

        console.log("PAYLOAD A IZIPAY:", payload);

        const auth = Buffer.from(
            `${izipay_username}:${izipay_password}`
        ).toString("base64");

        console.log("AUTH BASIC:", auth);

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify(payload),
        });

        console.log("HTTP STATUS IZIPAY:", response.status);

        const result = await response.json();
        console.log("RESPUESTA IZIPAY RAW:", result);

        if (!result?.answer?.formToken) {
            console.error("❌ IZIPAY NO DEVOLVIÓ FORM TOKEN");
            return NextResponse.json(
                { error: "Izipay no devolvió formToken", raw: result },
                { status: 500 }
            );
        }

        // registrar el pago como pending
        const { error: insertError } = await supabase.from("payments").insert({
            order_id: orderId,
            status: "PENDING",
            raw: result,
        });

        if (insertError) {
            console.error("❌ Error guardando payment:", insertError);
            toast.error("Error guardando payment");
        } else {
            console.log("✅ Payment registrado como PENDING");
            toast.success("Payment registrado como Pendiente");
        }

        console.log("FORM TOKEN OK:", result.answer.formToken);

        console.log("ENVIANDO AL FRONT:");
        console.log({
            formToken: result.answer.formToken,
            publicKey: izipay_public_key,
        });

        return NextResponse.json({
            formToken: result.answer.formToken,
            publicKey: izipay_public_key,
            orderId,
        });

    } catch (err) {
        console.error("🔥 ERROR GENERAL:", err);
        return NextResponse.json(
            {
                error: "Error interno",
                detail: err.message,
            },
            { status: 500 }
        );
    }
}