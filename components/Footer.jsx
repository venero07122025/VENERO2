"use client";
import { FiInstagram, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="bg-zinc-900 text-zinc-300 px-6 pt-20 pb-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Marca */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                        VENERO <span className="font-light text-zinc-400">Arquitectura</span>
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                        Diseñamos espacios que se sienten, se viven y se recuerdan.
                        Arquitectura sensorial para una nueva forma de habitar.
                    </p>
                </div>

                {/* Navegación */}
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest mb-4 text-white">
                        Navegación
                    </h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="/#inicio" className="hover:text-white transition">Inicio</a></li>
                        <li><a href="/#filosofia" className="hover:text-white transition">Filosofía</a></li>
                        <li><a href="/#servicios" className="hover:text-white transition">Servicios</a></li>
                        <li><a href="/#productos" className="hover:text-white transition">Soluciones</a></li>
                    </ul>
                </div>

                {/* Contacto */}
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest mb-4 text-white">
                        Contacto
                    </h4>
                    <ul className="space-y-3 text-sm text-zinc-400">
                        <li>Lima, Perú</li>
                        <li>contacto@veneroperu.com</li>
                        <li>+51 983 502 342</li>
                    </ul>
                </div>

                {/* Redes */}
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest mb-4 text-white">
                        Síguenos
                    </h4>
                    <div className="flex gap-4">
                        <a className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer">
                            <FiInstagram size={18} />
                        </a>
                        <a className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer">
                            <FiLinkedin size={18} />
                        </a>
                        <a className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer">
                            <FiMail size={18} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mt-16 pt-6 text-center text-xs text-zinc-500">
                © {new Date().getFullYear()} Venero Arquitectura. Todos los derechos reservados.
            </div>
        </footer>
    );
}