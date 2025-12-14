export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      {/* Table Header Skeleton */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`header-${i}`} className="h-10 bg-gray-200 rounded-md animate-pulse" />
        ))}
      </div>
      
      {/* Table Rows Skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4 mb-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={`cell-${rowIndex}-${colIndex}`} 
              className="h-12 bg-gray-100 rounded-md animate-pulse"
              style={{ animationDelay: `${(rowIndex * 100) + (colIndex * 50)}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`card-${i}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-8 bg-gray-300 rounded w-16 animate-pulse" />
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`list-${i}`} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-32 animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
