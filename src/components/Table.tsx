import React, { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({ 
  headers, 
  children, 
  className = '',
  isEmpty = false,
  emptyMessage = 'No data available'
}) => {
  return (
    <div className={`overflow-hidden border border-gray-100 rounded-xl shadow-lg backdrop-blur-lg bg-white bg-opacity-90 ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isEmpty ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;