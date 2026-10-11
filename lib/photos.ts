export type PhotoAlbumId = "interests" | "working";

export interface PhotoAlbum {
  id: PhotoAlbumId;
  label: string;
  folder: string;
  start: number;
  count: number;
}

export interface Photo {
  index: number;
  album: PhotoAlbumId;
  fileIndex: number;
  thumb: string;
  original: string;
}

export const PHOTO_ALBUMS: readonly PhotoAlbum[] = [
  {
    id: "interests",
    label: "Things I Like",
    folder: "interest",
    start: 0,
    count: 5,
  },
  {
    id: "working",
    label: "Snapshots of Work",
    folder: "working",
    start: 5,
    count: 57,
  },
];

function photosInAlbum(album: PhotoAlbum): Photo[] {
  return Array.from({ length: album.count }, (_, offset) => {
    const fileIndex = album.start + offset;
    return {
      index: fileIndex,
      album: album.id,
      fileIndex,
      thumb: `/assets/items/laptop/photos/small/${album.folder}/small${fileIndex}.webp`,
      original: `/assets/items/laptop/photos/original/${album.folder}/photos${fileIndex}.webp`,
    };
  });
}

export const PHOTOS: Photo[] = PHOTO_ALBUMS.flatMap(photosInAlbum);
export const INTEREST_PHOTOS = PHOTOS.filter((photo) => photo.album === "interests");
export const WORKING_PHOTOS = PHOTOS.filter((photo) => photo.album === "working");
