import { BeachBar } from "entity/BeachBar";
import { PricingFee } from "entity/PricingFee";
import { PricingFeeCurrency } from "entity/PricingFeeCurrency";
import { AddType, UpdateType } from "typings/.index";

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

export type TAddBeachBar = AddType & BeachBarType;

export type TUpdateBeachBar = UpdateType & BeachBarType;
