export default function Card({ title, children }) {
    return (
        <div className="bg-white shadow-lg p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-3">{title}</h2>
            {children}
        </div>
    );
}