import Link from "next/link";

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === "page" || value === undefined) return;
      params.set(key, Array.isArray(value) ? value[0] : value);
    });
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 && (
        <Link href={hrefFor(currentPage - 1)} className="btn-outline px-4 py-2 text-xs">
          Previous
        </Link>
      )}

      {pages.map((page, index) => {
        const previous = pages[index - 1];
        return (
          <span key={page} className="flex items-center gap-2">
            {previous && page - previous > 1 && <span className="text-ink-700">…</span>}
            <Link
              href={hrefFor(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm ${
                page === currentPage
                  ? "bg-ink-900 text-cream-50"
                  : "border border-cream-300 text-ink-800 hover:border-gold-300"
              }`}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages && (
        <Link href={hrefFor(currentPage + 1)} className="btn-outline px-4 py-2 text-xs">
          Next
        </Link>
      )}
    </nav>
  );
}
