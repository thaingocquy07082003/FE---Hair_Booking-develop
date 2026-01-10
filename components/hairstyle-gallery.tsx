import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getHaiStyleList } from "@/services/service/get-branchs-list.api";

interface HairstyleImage {
  id: string;
  imageUrl: string;
  textPrompt: string;
  name: string;
}

interface HairstyleGalleryProps {
  onSelect: (textPrompt: string) => void;
  selectedPrompt?: string;
}

export function HairstyleGallery({
  onSelect,
  selectedPrompt,
}: HairstyleGalleryProps) {
  const [hairstyleImages, setHairstyleImages] = useState<HairstyleImage[]>([]);

  useEffect(() => {
    getHaiStyleList().then(setHairstyleImages);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {hairstyleImages.map((hairstyle, index) => (
        <div
          key={hairstyle.id}
          className={cn(
            "relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all",
            selectedPrompt === hairstyle.textPrompt
              ? "border-green-500"
              : "border-transparent hover:border-gray-300"
          )}
          onClick={() => onSelect(hairstyle.textPrompt)}
        >
          <Image
            src={hairstyle.imageUrl}
            alt={hairstyle.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-sm text-white font-medium">
              {hairstyle.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
