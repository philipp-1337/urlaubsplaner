import React from 'react';

const SkeletonPlaceholder = ({ className = 'h-4 bg-gray-200 rounded' }) => (
  <div className={`animate-pulse ${className}`}></div>
);

const MonthlyDetailSkeleton = () => {
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
                <th className="sticky left-0 z-10 p-3 text-left bg-gray-100 border-l border-t border-r">
                  <SkeletonPlaceholder className="w-24 h-5" />
                </th>
                {Array.from({ length: 5 }).map((_, i) => (
                  <th key={i} className="p-3 text-center border-t border-r">
                    <SkeletonPlaceholder className="w-20 h-5 mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, rowIndex) => ( // Zeige z.B. 4 Skeleton-Zeilen
                <tr key={rowIndex}>
                  <td className="sticky left-0 z-0 p-3 bg-white border-l border-t border-r">
                    <SkeletonPlaceholder className="w-20 h-5" />
                  </td>
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <td key={colIndex} className="p-3 text-center border-t border-r">
                      <SkeletonPlaceholder className="w-12 h-5 mx-auto" />
                    </td>
                  ))}
                  <td className="p-3 text-center border-t border-r">
                     <SkeletonPlaceholder className="w-8 h-8 rounded-full mx-auto bg-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td className="sticky left-0 z-10 p-3 bg-gray-100 border">
                  <SkeletonPlaceholder className="w-20 h-5" />
                </td>
                {Array.from({ length: 4 }).map((_, i) => (
                  <td key={i} className="p-3 text-center border-t border-r border-b">
                    <SkeletonPlaceholder className="w-12 h-5 mx-auto" />
                  </td>
                ))}
                <td className="p-3 text-center border-t border-r border-b">
                  {/* Empty for actions column */}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Navigation Buttons Skeleton */}
        <div className="mt-8 flex flex-row justify-between items-center gap-4">
          <div className="p-2 rounded-full border border-gray-medium flex items-center gap-1">
            <SkeletonPlaceholder className="w-8 h-8 rounded-full bg-gray-300" />
          </div>
          {/* Optional: Add more button skeletons if there are usually more */}
        </div>
      </div>
    </main>
  );
};

export default MonthlyDetailSkeleton;