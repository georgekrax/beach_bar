import { SearchInputValue } from "entity/SearchInputValue";

export const formatInputValue = ({ beachBar, country, city, region }: SearchInputValue) => {
  let formattedString = "";
  if (beachBar) {
    formattedString = beachBar.name;
    return formattedString;
  } else {
    if (country) {
      // if (country.alpha2Code && country.alpha2Code.trim().length > 0) {
      //   formattedString = country.alpha2Code;
      // } else {
      formattedString = country.name;
      // }
    }
    if (city) {
      formattedString = city.name;
      if (country) formattedString = formattedString.concat(", " + country.name);
    }
    if (region) {
      formattedString = region.name;
      if (city && country) formattedString = formattedString.concat(", " + city.name).concat(", " + country.name);
      else if (city) formattedString = formattedString.concat(", " + city.name);
      else if (country) formattedString = formattedString.concat(", " + country.name);
    }
  }
  return formattedString;
};
