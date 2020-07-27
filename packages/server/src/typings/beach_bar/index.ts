import { BeachBar } from "@entity/BeachBar";
import { PricingFee } from "@entity/PricingFee";
import { PricingFeeCurrency } from "@entity/PricingFeeCurrency";
import { AddType, ErrorType, UpdateType } from "@typings/.index";

export interface GetFullPricingReturnType {
  pricingFee: PricingFee;
  currencyFee: PricingFeeCurrency;
}

export interface BeachBarAvailabilityReturnType {
  hasAvailability?: boolean;
  hasCapacity?: boolean;
}

export interface GetBeachBarPaymentDetails {
  total: number;
  transferAmount: number;
  beachBarAppFee: number;
  stripeFee: number;
}

type BeachBarType = {
  beachBar: BeachBar;
};

export type AddBeachBarType = (AddType & BeachBarType) | ErrorType;

export type UpdateBeachBarType = (UpdateType & BeachBarType) | ErrorType;
