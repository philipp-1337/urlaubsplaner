import React from 'react';
import { Loader2 } from 'lucide-react';

const SkeletonPlaceholder = ({ className = 'h-4 bg-gray-200 rounded' }) => (
  <div className={`animate-pulse ${className}`}></div>
);

const SettingsPageSkeleton = () => {
  const numTabs = 4;

  return (
    <main className="container px-4 py-8 mx-auto">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <SkeletonPlaceholder className="w-48 h-8 bg-gray-300" />
      </div>

      {/* Tab Navigation Skeleton */}
      <div className="flex mb-6 border-b border-gray-200 overflow-x-auto">
        {Array.from({ length: numTabs }).map((_, i) => (
          <div key={i} className="flex-shrink-0 px-4 py-2 mr-2">
            <SkeletonPlaceholder className="w-24 h-5 bg-gray-300" />
          </div>
        ))}
      </div>

      {/* Tab Content Skeleton - General Loading Area */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center h-64"> {/* Feste Höhe für den Ladebereich */}
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-gray-600">Einstellungen werden geladen...</p>
        </div>
        {/* Alternativ könnten hier spezifischere Skeleton-Elemente für einen Default-Tab stehen */}
        {/* Beispiel:
        <SkeletonPlaceholder className="w-1/2 h-6 mb-4 bg-gray-300" />
        <SkeletonPlaceholder className="w-full h-4 mb-2 bg-gray-300" />
        <SkeletonPlaceholder className="w-full h-4 mb-2 bg-gray-300" />
        <SkeletonPlaceholder className="w-3/4 h-4 bg-gray-300" />
        */}
      </div>
    </main>
  );
};

export default SettingsPageSkeleton;