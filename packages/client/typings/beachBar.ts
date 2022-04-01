import { BeachBar, BeachBarQuery, SearchInput, BeachBarLocation } from "@/graphql/generated";
import { Dayjs } from "dayjs";

export type AvailableProductsArr = Omit<NonNullable<BeachBarQuery["beachBar"]>["products"][number], "__typename">[];

export type BeachQueryParams = {
  slug: string;
  secondParam: string | undefined;
  availability: SearchInput | null;
  isProducts: boolean;
  isReviews: boolean;
  isPhotos: boolean;
};

export type NewFormData = {
  categoryId: string;
  styleIds: string[];
  openingTimeId: string;
  closingTimeId: string;
} & Pick<
  BeachBar,
  "name" | "description" | "thumbnailUrl" | "contactPhoneNumber" | "zeroCartTotal" | "hidePhoneNumber"
>;

export type LimitSelectedDates = { from?: Dayjs; to?: Dayjs };
export type ProductLimit = Required<LimitSelectedDates> & { id: string; quantity: number; isNew: boolean };

export type LocationFormData = {
  country: string;
  countryId?: string;
  city: string;
  region: string;
} & Pick<BeachBarLocation, "address" | "zipCode" | "latitude" | "longitude">;

export type SettingsFormData = NewFormData & LocationFormData & Pick<BeachBar, "isActive" | "displayRegardlessCapacity">;

