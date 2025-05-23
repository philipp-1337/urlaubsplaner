import React from 'react';

const SkeletonPlaceholder = ({ className = 'h-4 bg-gray-200 rounded' }) => (
  <div className={`animate-pulse ${className}`}></div>
);

const MonthlyViewSkeleton = () => {
  const numCols = 5; // Geschätzte Anzahl an Tagen für die Skeleton-Ansicht
  const numRows = 3; // Geschätzte Anzahl an Personen-Zeilen

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

        {/* Legend Skeleton */}
        <div className="mb-6">
          <div className="flex flex-wrap mb-2 gap-2 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <SkeletonPlaceholder className="w-4 h-4 mr-1 rounded bg-gray-300" />
                <SkeletonPlaceholder className="w-16 h-4 bg-gray-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Table Section Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-100">
                <th className="sticky left-0 z-10 p-2 text-left bg-gray-100 border-l border-t border-r min-w-[100px]">
                  <SkeletonPlaceholder className="w-20 h-5" />
                </th>
                {Array.from({ length: numCols }).map((_, i) => (
                  <th key={`header-skel-${i}`} className="p-1 text-center border-t border-r min-w-[50px] bg-gray-100">
                    <SkeletonPlaceholder className="w-6 h-4 mx-auto mb-1" />
                    <SkeletonPlaceholder className="w-8 h-3 mx-auto" />
                  </th>
                ))}
                {/* Sum Columns Headers */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={`sum-header-skel-${i}`} className="p-2 text-center border-t border-r min-w-[100px]">
                    <SkeletonPlaceholder className="w-16 h-5 mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numRows }).map((_, rowIndex) => (
                <tr key={`row-skel-${rowIndex}`}>
                  <td className="sticky left-0 z-10 p-2 text-left bg-white border-l border-t border-r min-w-[100px]">
                    <SkeletonPlaceholder className="w-24 h-5" />
                  </td>
                  {Array.from({ length: numCols }).map((_, colIndex) => (
                    <td key={`cell-skel-${rowIndex}-${colIndex}`} className="relative p-2 text-center border-t border-r min-w-[50px]">
                      <SkeletonPlaceholder className="w-5 h-5 mx-auto" />
                    </td>
                  ))}
                  {/* Sum Columns Cells */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <td key={`sum-cell-skel-${rowIndex}-${i}`} className="p-2 text-center border-t border-r min-w-[100px]">
                      <SkeletonPlaceholder className="w-5 h-5 mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="sticky left-0 z-10 p-2 bg-gray-100 border">
                  <SkeletonPlaceholder className="w-8 h-8 bg-gray-300" />
                </td>
                {/* Footer cells can be simpler or match structure */}
                {Array.from({ length: numCols + 6 }).map((_, i) => ( // +6 for sum columns
                  <td key={`footer-skel-${i}`} className="p-1 text-xs text-center border-t border-r border-b min-w-[50px] bg-gray-100">
                    <SkeletonPlaceholder className="w-10 h-3 mx-auto" />
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
};

export default MonthlyViewSkeleton;