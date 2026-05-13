"use client";

import { useState } from "react";

export function ImageWithFallback({
  src,
  fallback = "/images/product-yarn.svg",
  alt,
  className
}: {
  src?: string | null;
  fallback?: string;
  alt: string;
  className?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallback);
  return <img src={currentSrc} alt={alt} className={className} onError={() => setCurrentSrc(fallback)} />;
}
