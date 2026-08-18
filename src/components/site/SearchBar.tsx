"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { SearchIcon } from "@/components/ui/icons";

export default function SearchBar({
  initialValue = "",
  placeholder = "Search sarees, jewellery, product ID…",
  onSubmitted,
}: {
  initialValue?: string;
  placeholder?: string;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = value.trim();
    if (!term) return;
    onSubmitted?.();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full">
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="input pr-11"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-ink-700 hover:text-gold-500"
      >
        <SearchIcon />
      </button>
    </form>
  );
}
