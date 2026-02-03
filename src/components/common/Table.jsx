import React from 'react';
import clsx from 'clsx';

export default function Table({ columns, data, keyField = 'id', actions }) {
    return (
        <div className="w-full">
            {/* Desktop View */}
            <div className="hidden sm:block overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {col.header}
                                </th>
                            ))}
                            {actions && <th className="px-6 py-3 bg-gray-50"></th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length > 0 ? (
                            data.map((row, rowIdx) => (
                                <tr key={row[keyField] || rowIdx} className="hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Stacked Cards) */}
            <div className="sm:hidden space-y-4">
                {data.length > 0 ? (
                    data.map((row, rowIdx) => (
                        <div key={row[keyField] || rowIdx} className="bg-white shadow rounded-lg p-4 border border-gray-200">
                            <div className="space-y-3">
                                {columns.map((col) => (
                                    <div key={col.key} className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-gray-500 uppercase">{col.header}</span>
                                        <span className="text-sm text-gray-900 text-right ml-4">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </span>
                                    </div>
                                ))}
                                {actions && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                                        {actions(row)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">No data available</div>
                )}
            </div>
        </div>
    );
}
