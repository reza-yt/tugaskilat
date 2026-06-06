export default function NewTaskLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 flex-1">
            <div className="h-9 w-9 rounded-full skeleton-shimmer" />
            {i < 3 && <div className="flex-1 h-0.5 skeleton-shimmer rounded-full" />}
          </div>
        ))}
      </div>
      <div className="h-8 w-52 skeleton-shimmer rounded-lg mx-auto" />
      <div className="h-5 w-36 skeleton-shimmer rounded-lg mx-auto" />
      <div className="grid grid-cols-2 gap-3 mt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[72px] skeleton-shimmer rounded-xl" />
        ))}
      </div>
    </div>
  );
}
