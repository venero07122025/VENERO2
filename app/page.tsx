"use client";

import Header from "@/components/Header";
import { useCart } from "@/components/CartContext";
import { handleSendMessage } from "@/components/WhatsAppWidget";
import Footer from "@/components/Footer";
import Image from "next/image";

const products = [
    {
        id: 1,
        name: "Diseño Arquitectónico Residencial",
        description: "Proyecto integral de vivienda unifamiliar personalizada.",
        price: 350,
        image: "/producto-1.webp",
    },
    {
        id: 2,
        name: "Remodelación Sensorial de Interiores",
        description: "Transformación de espacios basada en los 5 sentidos.",
        price: 280,
        image: "/producto-2.webp",
    },
    {
        id: 3,
        name: "Consultoría de Espacios Comerciales",
        description: "Optimización arquitectónica para experiencias de marca.",
        price: 420,
        image: "/producto-3.webp",
    },
];

export default function Home() {
    const { addToCart } = useCart();

    return (
        <>
            <Header />

            {/* ================= HERO ================= */}
            <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-neutral-900 via-zinc-800 to-stone-900 text-white px-6" id="inicio">
                <div className="absolute inset-0 bg-[url('/hero-venero.webp')] bg-cover bg-center opacity-20" />
                <div className="relative z-10 max-w-5xl text-center">
                    <p className="uppercase tracking-widest text-sm text-zinc-300 mb-4">
                        VENERO Arquitectura
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                        Siente la arquitectura, <br /> vive la revolución
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-200 max-w-3xl mx-auto mb-10">
                        Descubre tus sentidos. Diseñamos espacios que se ven, se tocan, se
                        escuchan, se respiran y se sienten. Arquitectura que conecta con tu
                        esencia.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#productos"
                            className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition"
                        >
                            Cotizar ahora
                        </a>
                        <a
                            href="#filosofia"
                            className="px-8 py-4 rounded-full border border-white/40 text-white hover:bg-white/10 transition"
                        >
                            Conoce nuestra filosofía
                        </a>
                    </div>
                </div>
            </section>

            {/* ================= FILOSOFÍA ================= */}
            <section
                id="filosofia"
                className="py-20 px-6 bg-white text-zinc-900"
            >
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Arquitectura que se vive, no solo se observa
                    </h2>
                    <p className="text-lg text-zinc-600 leading-relaxed max-w-4xl mx-auto">
                        VENERO Arquitectura está revolucionando la arquitectura,
                        convirtiéndola en una inmersión sensorial. Somos un equipo innovador
                        que redefine los espacios, poniendo énfasis en los cinco sentidos
                        para crear ambientes profundamente personalizados.
                        <br />
                        <br />
                        Cada textura, cada color, cada sonido y cada atmósfera se convierten
                        en una extensión de tu identidad. No diseñamos edificios. Diseñamos
                        experiencias.
                    </p>
                </div>
            </section>

            {/* ================= SERVICIOS ================= */}
            <section className="py-20 px-6 bg-zinc-50" id="servicios">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Nuestros servicios sensoriales
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Arquitectura Residencial",
                                text: "Diseñamos hogares que se sienten como extensiones de tu ser.",
                            },
                            {
                                title: "Espacios Comerciales",
                                text: "Ambientes que conectan emocionalmente con tus clientes.",
                            },
                            {
                                title: "Interiorismo Sensorial",
                                text: "Texturas, luz, sonido y aroma integrados al diseño.",
                            },
                        ].map((s, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-8 shadow hover:shadow-lg transition"
                            >
                                <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                                <p className="text-zinc-600">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= PRODUCTOS ================= */}
            <section
                id="productos"
                className="py-20 px-6 bg-white"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Soluciones arquitectónicas
                        </h2>
                        <p className="text-zinc-600 text-lg">
                            Elige tu experiencia arquitectónica y comienza tu transformación.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {products.map((p) => (
                            <div
                                key={p.id}
                                className="group border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition bg-white flex flex-col"
                            >
                                <div className="h-48 bg-gradient-to-br from-zinc-200 to-zinc-100 flex items-center justify-center text-zinc-400 text-sm">
                                    <Image
                                        src={p.image}
                                        alt={p.name}
                                        width={500}
                                        height={500}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
                                    <p className="text-zinc-600 text-sm mb-4 flex-1">
                                        {p.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold">
                                            S/. {p.price.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => addToCart(p)}
                                            className="px-4 py-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition cursor-pointer"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA FINAL ================= */}
            <section className="py-24 px-6 bg-gradient-to-br from-zinc-900 via-neutral-800 to-stone-900 text-white text-center" id="contacto">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Creemos que la verdadera arquitectura <br /> no solo se ve, se vive
                    </h2>
                    <p className="text-lg text-zinc-300 mb-10">
                        Inicia hoy tu experiencia sensorial y transforma tu espacio en una
                        extensión auténtica de ti.
                    </p>

                    <button
                        onClick={handleSendMessage}
                        className="inline-block px-10 py-4 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition cursor-pointer"
                    >
                        Cotizar ahora
                    </button>
                </div>
            </section>

            <Footer />
        </>
    );
}