export function SceneImage({
  url,
  isLoading,
}: {
  url: string | null
  isLoading: boolean
}) {
  return (
    <div className="relative h-[40%] w-full overflow-hidden bg-noir-surface">
      {url ? (
        <img src={url} alt="Current scene" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full animate-pulse bg-linear-to-b from-noir-surface via-noir-border/40 to-noir-surface" />
      )}
      {isLoading && url && (
        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-noir-bg/70 backdrop-blur-sm">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-noir-amber/30 border-t-noir-amber" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-noir-bg" />
    </div>
  )
}
