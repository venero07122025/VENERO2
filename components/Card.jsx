import Link from "next/link";

export default function Card({ title, children, link }) {
    const content = (
        <div
            className={`bg-white shadow-lg p-6 rounded-xl transition ${link ? "cursor-pointer hover:shadow-xl" : ""
                }`}
        >
            <h2 className="text-xl font-semibold mb-3">{title}</h2>
            {children}
        </div>
    );

    return link ? <Link href={link}>{content}</Link> : content;
}