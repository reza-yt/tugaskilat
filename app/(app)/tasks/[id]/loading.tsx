export default function TaskDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-muted animate-pulse rounded" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="h-px bg-border" />
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
