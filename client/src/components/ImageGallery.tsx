import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  mainImage?: string;
}

export default function ImageGallery({ images, mainImage }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const allImages = mainImage ? [mainImage, ...images] : images;

  const next = () => setCurrentIndex((i) => (i + 1) % allImages.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + allImages.length) % allImages.length);

  if (allImages.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-4 aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer" onClick={() => setOpen(true)}>
          <img src={allImages[0]} alt="Main" className="w-full h-full object-cover" />
        </div>
        {allImages.slice(1, 5).map((img, i) => (
          <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer" onClick={() => { setCurrentIndex(i + 1); setOpen(true); }}>
            <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <img src={allImages[currentIndex]} alt="Gallery" className="w-full h-auto" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prev}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={next}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {allImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
