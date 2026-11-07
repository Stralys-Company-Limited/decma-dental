/** Suspense fallback shaped like PageHeader, shown only during client navigations. */
export function PageSkeleton() {
  return (
    <div aria-hidden className="border-b-4 border-teal bg-navy">
      <div className="container-page space-y-5 py-14">
        <div className="h-3 w-32 bg-white/20" />
        <div className="h-10 w-2/3 bg-white/20" />
        <div className="h-4 w-1/2 bg-white/10" />
      </div>
    </div>
  );
}
