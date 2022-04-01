import dayjs, { Dayjs } from "dayjs";

export const halfOrWholeNum = (num: number, decimalLimit = 0.5) => {
  const truncated = Math.trunc(num);
  const decimal = num - truncated;
  return decimal <= decimalLimit ? truncated : truncated + 0.5;
};

export const genBarThumbnailAlt = (name: string) => name + " thumbnail image";

export const removeSameYear = (day: Dayjs) => day.format(`MM/DD${day.year() === dayjs().year() ? "" : "/YYYY"}`);

export const formatPeople = (people: number, inclX: boolean = false) =>
  people + " " + (inclX ? "x" : "") + " " + (people === 1 ? "person" : "people");

export const genReviewRating = (rating: number) => ({
  floored: Math.floor(rating),
  val: rating % 1 === 0 ? rating : rating.toFixed(1),
});

export const parseHour = (hour: number) => hour.toString().padStart(2, "0") + ":00";