export default function Table({ columns, data }) {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col} className="border-b py-2 text-left font-medium">
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 && (
                    <tr>
                        <td className="py-4 text-center text-gray-500" colSpan={columns.length}>
                            No hay registros.
                        </td>
                    </tr>
                )}

                {data.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                        {Object.values(row).map((val, j) => (
                            <td key={j} className="py-2">
                                {val}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}