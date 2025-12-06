"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { BiChevronLeft } from "react-icons/bi";
import { useRouter } from "next/navigation";

// XLSX
import * as XLSX from "xlsx";

// React Calendar
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Transacciones() {
    const [list, setList] = useState([]);
    const [date, setDate] = useState(null);
    const [pdfMake, setPdfMake] = useState(null);
    const router = useRouter();

    // ==========================================================
    // CARGAR PDFMAKE DINÁMICAMENTE (compatible con Next.js)
    // ==========================================================
    useEffect(() => {
        const loadPdfmake = async () => {
            try {
                const pdfMakeModule = await import("pdfmake/build/pdfmake.js");
                const pdfFontsModule = await import("pdfmake/build/vfs_fonts.js");

                const pdf = pdfMakeModule.default || pdfMakeModule;
                const pdfFonts = pdfFontsModule.default || pdfFontsModule;

                pdf.vfs =
                    pdfFonts.pdfMake?.vfs ||
                    pdfFonts.vfs ||
                    pdfFonts.pdfmake?.vfs;

                setPdfMake(pdf);
            } catch (err) {
                console.error("Error cargando pdfmake:", err);
                toast.error("No se pudo cargar PDFMake");
            }
        };

        loadPdfmake();
    }, []);

    // ==========================================================
    // CARGAR TRANSACCIONES
    // ==========================================================
    const fetchData = async () => {
        let query = supabase
            .from("transactions")
            .select("*, users(full_name)");

        if (date) {
            const iso = new Date(date).toISOString().split("T")[0];
            query = query
                .gte("created_at", `${iso} 00:00:00`)
                .lte("created_at", `${iso} 23:59:59`);
        }

        const { data, error } = await query.order("created_at", {
            ascending: false,
        });

        if (error) toast.error("Error cargando transacciones");
        else setList(data || []);
    };

    useEffect(() => {
        fetchData();
    }, [date]);

    // ==========================================================
    // EXPORTAR CSV
    // ==========================================================
    const exportCSV = () => {
        const rows = list.map((t) => ({
            fecha: t.created_at,
            monto: t.amount,
            estado: t.status,
            operador: t.users?.full_name || "—",
            tarjeta: t.card_last4,
        }));

        const csv =
            "data:text/csv;charset=utf-8," +
            ["fecha,monto,estado,operador,tarjeta"]
                .concat(rows.map((r) => Object.values(r).join(",")))
                .join("\n");

        const link = document.createElement("a");
        link.href = csv;
        link.download = "transacciones.csv";
        link.click();
    };

    // ==========================================================
    // EXPORTAR XLSX
    // ==========================================================
    const exportXLSX = () => {
        const rows = list.map((t) => ({
            Fecha: t.created_at,
            Monto: t.amount,
            Estado: t.status,
            Operador: t.users?.full_name || "—",
            Tarjeta: t.card_last4,
        }));

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transacciones");

        XLSX.writeFile(wb, "transacciones.xlsx");
    };

    // ==========================================================
    // EXPORTAR PDF
    // ==========================================================
    const exportPDF = () => {
        if (!pdfMake) return toast.error("Cargando PDF...");

        const body = [
            ["Fecha", "Monto", "Estado", "Operador", "Tarjeta"],
            ...list.map((t) => [
                new Date(t.created_at).toLocaleString(),
                `S/ ${t.amount}`,
                t.status,
                t.users?.full_name || "—",
                `**** ${t.card_last4}`,
            ]),
        ];

        const doc = {
            pageSize: "A4",
            pageMargins: [20, 30, 20, 30],
            content: [
                { text: "Historial de Transacciones", style: "header" },
                {
                    table: {
                        headerRows: 1,
                        widths: ["*", "auto", "auto", "*", "auto"],
                        body,
                    },
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 12],
                },
            },
        };

        pdfMake.createPdf(doc).download("transacciones.pdf");
    };

    const goBack = () => {
        router.back();
    };

    // ==========================================================
    // RENDER
    // ==========================================================
    return (
        <ProtectedRoute>
            <Navbar />

            <div className="container mx-auto p-6">
                <button
                    onClick={goBack}
                    className="mb-6 flex items-center text-gray-700 hover:text-black transition cursor-pointer"
                >
                    <BiChevronLeft className="w-6 h-6" />
                    <span>Volver</span>
                </button>

                <h1 className="text-3xl font-bold mb-6">Historial de Transacciones</h1>

                {/* CALENDARIO */}
                <div className="bg-white rounded-xl shadow p-4 inline-block mb-6">
                    <p className="font-semibold mb-2">Filtrar por fecha:</p>
                    <Calendar
                        onChange={setDate}
                        value={date}
                        className="rounded-lg"
                    />
                </div>

                {/* BOTONES */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={exportCSV}
                        className="px-4 py-2 bg-gray-700 text-white rounded"
                    >
                        CSV
                    </button>

                    <button
                        onClick={exportXLSX}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        XLSX
                    </button>

                    <button
                        onClick={exportPDF}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        PDF
                    </button>
                </div>

                {/* TABLA */}
                <Table
                    columns={[
                        "Fecha",
                        "Monto",
                        "Estado",
                        "Tarjeta",
                        "Operador",
                        "Comprobante",
                    ]}
                    data={list.map((t) => ({
                        fecha: new Date(t.created_at).toLocaleString(),
                        monto: `S/ ${t.amount}`,
                        estado: t.status,
                        tarjeta: `**** ${t.card_last4}`,
                        operador: t.users?.full_name || "—",
                        comprobante: (
                            <a
                                href={`/comprobante/${t.id}`}
                                className="text-blue-600 underline"
                            >
                                Ver
                            </a>
                        ),
                    }))}
                />
            </div>
        </ProtectedRoute>
    );
}