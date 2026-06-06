export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-9 w-56 skeleton-shimmer rounded-lg" />
          <div className="h-5 w-40 skeleton-shimmer rounded-lg" />
        </div>
        <div className="h-11 w-40 skeleton-shimmer rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 skeleton-shimmer rounded-xl" />
        ))}
      </div>
      <div className="h-80 skeleton-shimmer rounded-xl" />
    </div>
  );
}
