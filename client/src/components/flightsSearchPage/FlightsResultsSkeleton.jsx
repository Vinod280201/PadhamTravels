export const FlightsResultsSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="animate-pulse bg-white rounded-lg shadow p-4 flex justify-between items-center"
      >
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-300 rounded" />
          <div className="h-3 w-48 bg-slate-200 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-300 rounded" />
      </div>
    ))}
  </div>
);
