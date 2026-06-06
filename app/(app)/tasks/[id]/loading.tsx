export default function TaskDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start gap-4">
        <div className="h-9 w-9 skeleton-shimmer rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-7 w-72 skeleton-shimmer rounded-lg" />
          <div className="flex gap-2">
            <div className="h-5 w-20 skeleton-shimmer rounded-full" />
            <div className="h-5 w-16 skeleton-shimmer rounded-full" />
          </div>
        </div>
      </div>
      <div className="h-px skeleton-shimmer" />
      <div className="h-[500px] skeleton-shimmer rounded-xl" />
    </div>
  );
}
