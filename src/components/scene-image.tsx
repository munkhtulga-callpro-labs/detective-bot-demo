export function SceneImage({
  url,
  isLoading,
}: {
  url: string | null
  isLoading: boolean
}) {
  return (
    <div className="relative h-[40%] w-full overflow-hidden bg-noir-surface">
      {url && (
        <img
          src={url}
          alt="Current scene"
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            isLoading ? "opacity-20 blur-sm" : "opacity-100"
          }`}
        />
      )}
      {!url && (
        <div className="h-full w-full animate-pulse bg-linear-to-b from-noir-surface via-noir-border/40 to-noir-surface" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-noir-bg" />
    </div>
  )
}
