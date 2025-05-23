import React from 'react';

const SkeletonPlaceholder = ({ className = 'h-4 bg-gray-200 rounded' }) => (
  <div className={`animate-pulse ${className}`}></div>
);

const YearlyOverviewSkeleton = () => {
  const numRows = 3; // Geschätzte Anzahl an Personen-Zeilen
  const numCols = 9; // Anzahl der Daten-Spalten + Aktionsspalte

  return (
    <main className="container px-4 py-8 mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        {/* Header Section Skeleton */}
        <div className="relative mb-6 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <SkeletonPlaceholder className="w-8 h-8 rounded-full bg-gray-300" />
          </div>
          <div className="flex items-center flex-1 justify-center space-x-2">
            <SkeletonPlaceholder className="w-40 h-6 bg-gray-300" />
          </div>
          <div className="relative">
            <SkeletonPlaceholder className="w-8 h-8 bg-gray-300" />
          </div>
        </div>

        {/* Table Section Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-100">
                <th rowSpan="2" className="sticky left-0 z-10 p-3 text-left bg-gray-100 border-t border-l border-r">
                  <SkeletonPlaceholder className="w-20 h-5" />
                </th>
                <th colSpan="5" className="p-3 text-center border-t">
                  <SkeletonPlaceholder className="w-24 h-5 mx-auto" />
                </th>
                <th colSpan="3" className="p-3 text-center border-t border-l">
                  <SkeletonPlaceholder className="w-24 h-5 mx-auto" />
                </th>
                <th rowSpan="2" className="left-0 z-10 p-3 text-left bg-gray-100 border-t border-l border-r text-center">
                  <SkeletonPlaceholder className="w-16 h-5 mx-auto" />
                </th>
              </tr>
              <tr className="bg-gray-100">
                {Array.from({ length: 8 }).map((_, i) => ( // 5 Urlaub + 3 Sonstiges
                  <th key={`sub-header-skel-${i}`} className="p-3 text-center border-t border-l">
                    <SkeletonPlaceholder className="w-16 h-4 mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numRows }).map((_, rowIndex) => (
                <tr key={`row-skel-${rowIndex}`}>
                  <td className="sticky left-0 z-10 p-3 bg-white border-t border-l border-r">
                    <SkeletonPlaceholder className="w-24 h-5" />
                  </td>
                  {Array.from({ length: numCols -1 }).map((_, colIndex) => ( // numCols - 1 because first col is person name
                    <td key={`cell-skel-${rowIndex}-${colIndex}`} className="p-3 text-center border-t border-l">
                      <SkeletonPlaceholder className="w-10 h-5 mx-auto" />
                    </td>
                  ))}
                   <td className="p-3 text-center border-t border-l border-r">
                     <SkeletonPlaceholder className="w-8 h-8 rounded-full mx-auto bg-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Footer kann hier optional sein oder eine einfache Skeleton-Zeile haben */}
          </table>
        </div>
        {/* Navigation Buttons Skeleton */}
        <div className="mt-8 flex flex-row justify-between items-center gap-4">
          <SkeletonPlaceholder className="w-10 h-10 rounded-full bg-gray-300" />
        </div>
      </div>
    </main>
  );
};

export default YearlyOverviewSkeleton;