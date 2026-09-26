import React from "react";

export const TourCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col animate-pulse">
      {/* Image Banner Skeleton */}
      <div className="w-full aspect-[16/10] bg-slate-200" />

      {/* Card Content Skeleton */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Rating & Review Placeholder */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-200 rounded" />
            <div className="w-20 h-3 bg-slate-200 rounded" />
          </div>

          {/* Title Placeholder */}
          <div className="w-3/4 h-5 bg-slate-200 rounded-md" />

          {/* Destination & Duration Placeholders */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-24 h-3 bg-slate-200 rounded" />
            <div className="w-20 h-3 bg-slate-200 rounded" />
          </div>

          {/* Highlight Tags Placeholders */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            <div className="w-16 h-5 bg-slate-100 rounded-full" />
            <div className="w-20 h-5 bg-slate-100 rounded-full" />
            <div className="w-14 h-5 bg-slate-100 rounded-full" />
          </div>
        </div>

        {/* Price & Action Button Skeleton */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-12 h-2.5 bg-slate-200 rounded" />
            <div className="w-24 h-5 bg-slate-200 rounded-md" />
          </div>
          <div className="w-24 h-9 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default TourCardSkeleton;
