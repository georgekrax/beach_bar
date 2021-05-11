<<<<<<< HEAD
export const halfOrWholeNum = (num: number, decimalLimit = 0.5) => {
  const truncated = Math.trunc(num);
  const decimal = num - truncated;
  return decimal <= decimalLimit ? truncated : truncated + 0.5;
};

export const genBarThumbnailAlt = (name: string) => name + " thumbnail image";

export const genReviewRating = (rating: number) => ({
  floored: Math.floor(rating),
  val: rating % 1 === 0 ? rating : rating.toFixed(1),
});
=======
export const halfOrWholeNum = (num: number, decimalLimit = 0.5) => {
  const truncated = Math.trunc(num);
  const decimal = num - truncated;
  return decimal <= decimalLimit ? truncated : truncated + 0.5;
};

export const genBarThumbnailAlt = (name: string) => name + " thumbnail image";

export const genReviewRating = (rating: number) => ({
  floored: Math.floor(rating),
  val: rating % 1 === 0 ? rating : rating.toFixed(1),
});
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
