import React from 'react'

export default function ProductSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-square shimmer" />
          <div className="p-3.5 space-y-2.5">
            <div className="shimmer h-3 w-16 rounded-full" />
            <div className="shimmer h-4 w-full rounded-lg" />
            <div className="shimmer h-4 w-3/4 rounded-lg" />
            <div className="shimmer h-3 w-20 rounded-full" />
            <div className="shimmer h-5 w-24 rounded-lg" />
            <div className="shimmer h-9 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </>
  )
}
