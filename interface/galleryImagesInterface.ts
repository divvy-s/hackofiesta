export type GalleryImageSize = "small" | "medium" | "large";

export interface GalleryImages {
  id: string;
  src: string;
  alt: string;
  size: GalleryImageSize;
}