const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`bg-neutral-100 animate-pulse ${className}`} />
)

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white" aria-busy="true" aria-label="Loading product">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SkeletonBlock className="h-3 w-40 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16">
          <SkeletonBlock className="h-[55vh] min-h-[420px] lg:col-span-7 lg:h-[620px]" />
          <div className="lg:col-span-5 space-y-5 py-2">
            <SkeletonBlock className="h-9 w-3/4" />
            <SkeletonBlock className="h-5 w-28" />
            <SkeletonBlock className="h-8 w-36" />
            <SkeletonBlock className="h-px w-full" />
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-20 w-full" />
            <SkeletonBlock className="h-12 w-full" />
            <SkeletonBlock className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
