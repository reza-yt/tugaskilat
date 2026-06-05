export default function NewTaskLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 h-px bg-border" />
          </div>
        ))}
      </div>
      <div className="h-8 w-48 bg-muted animate-pulse rounded mx-auto" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
