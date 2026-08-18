import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl">We could not find that page</h1>
        <p className="mt-4 text-sm text-ink-700">
          The product may have been sold or the link may be incorrect.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/sarees" className="btn-primary">
            Browse Sarees
          </Link>
          <Link href="/one-gram-gold" className="btn-outline">
            Browse Jewellery
          </Link>
        </div>
      </div>
    </div>
  );
}
