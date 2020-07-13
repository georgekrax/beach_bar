import { extendType } from "@nexus/schema";
import { SearchInputValue } from "../../entity/SearchInputValue";
import { FormattedSearchInputValueReturnType } from "./returnTypes";
import { FormattedSearchInputValueType } from "./types";

export const SearchQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("getSearchInputValues", {
      type: FormattedSearchInputValueType,
      description: "Returns a list of formatted search input values",
      nullable: false,
      resolve: async (): Promise<FormattedSearchInputValueReturnType[]> => {
        const inputValues = await SearchInputValue.find({ relations: ["country", "city", "region", "beachBar"] });
        const res: FormattedSearchInputValueReturnType[] = [];
        inputValues.forEach(value => {
          res.push({
            inputValue: value,
            formattedValue: value.format(),
          });
        });
        return res;
      },
    });
  },
});
