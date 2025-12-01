"use client";
import Image from "next/image";
import { useState } from "react";

export default function ImageWithFallback({ src, alt, className }: any) {
  // Если src пустой — ставим null, чтобы НЕ рендерить Image
  const [imgSrc, setImgSrc] = useState(src || null);

  const handleError = () => {
    setImgSrc("/fallback.png");
  };

  // ❗ Если нет картинки — показываем просто контейнер
  if (!imgSrc) {
    return (
      <div
        className={`relative bg-gray-200 ${className}`}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="100%"
        className="object-cover"
        onError={handleError}
      />
    </div>
  );
}
