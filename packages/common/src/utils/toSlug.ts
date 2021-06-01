export const toSlug = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "_") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "");
