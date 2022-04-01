export const getRatingColor = (rating: number, isDarked: boolean = false) => {
  let clr: string;
  rating = Math.round(rating);

  const changeClrVariant = (color: string, diff: number = 0) => {
    const [scheme, num] = color.split(".");
    return `${scheme}.${+num + diff}`;
  };

  if (rating <= 1) clr = "red.500";
  else if (rating <= 2) clr = "bronze.400";
  else if (rating <= 3) clr = "orange.500";
  else if (rating <= 4) clr = "teal.500";
  else clr = "green.400";

  if (isDarked) clr = changeClrVariant(clr, 100);
  return {
    clr,
    first: changeClrVariant(clr),
    second: changeClrVariant(clr, -200),
  };
};

/* textOverlfow() */
export const textOverlfow = (numberOfLines = 5, isKebabCase = false) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  // * If it was passed as `number`, then it would be generated as `5px` in CSS
  [isKebabCase ? "-webkit-line-clamp" : "WebkitLineClamp"]: numberOfLines.toString(), // number of lines to show
  [isKebabCase ? "-webkit-box-orient" : "WebkitBoxOrient"]: "vertical",
});

/* btnFilterChecked() */
export const btnFilterChecked = (isChecked = false) => {
  if (!isChecked) return {};
  // return { bg: "orange.100", borderColor: "orange.600" };
  return { bg: "gray.100", borderColor: "blue.600" };
};
