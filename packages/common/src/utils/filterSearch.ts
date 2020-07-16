export const filterSearch = (filterIds: string[], array: any[]) => {
  for (const filter of filterIds) {
    // ! every time a new search filter is added to the DB, add also its public_id here
    /* Exceptions
      - 913
    */
    switch (filter) {
      case "653":
        return array.filter(
          (result) => result.hasAvailability && result.hasCapacity
        );
      default:
        return array;
    }
  }
  return array;
};
