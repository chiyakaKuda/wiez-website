"use client";

import Image from "next/image";

export default function PhotoGallery({
  photos,
}: {
  photos: { src: string; caption: string }[];
}) {
  return (
    <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {photos.map((photo, i) => (
        <div
          key={photo.src + i}
          className="group relative aspect-[4/3] w-64 shrink-0 overflow-hidden rounded-2xl sm:w-72"
        >
          <Image
            src={photo.src}
            alt={photo.caption}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(min-width: 640px) 288px, 256px"
          />
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-navy/85 px-4 py-3 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
            <p className="font-nav text-sm font-semibold text-white">
              {photo.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
