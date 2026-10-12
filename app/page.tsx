export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-teal px-6 py-24 text-center text-cream">
      <svg
        aria-hidden="true"
        viewBox="0 0 64 80"
        className="h-20 w-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 76V32a24 24 0 0 1 48 0v44" />
        <path d="M20 76V34a12 12 0 0 1 24 0v42" />
        <path d="M2 76h60" />
      </svg>

      <h1 className="mt-8 font-serif text-5xl tracking-wide sm:text-6xl">
        Briklay
      </h1>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] sm:text-sm sm:tracking-[0.3em] text-cream-muted">
        Building Trust. Constructing Lives.
      </p>

      <div className="mt-12 h-px w-16 bg-cream/30" />

      <p className="mt-12 max-w-md text-lg leading-relaxed text-cream/90">
        Our new website is on its way.
      </p>
      <p className="mt-2 text-sm text-cream-muted">Kakinada, Andhra Pradesh</p>
    </main>
  );
}
