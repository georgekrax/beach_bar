const STRIPE_MINUMUM_CURRENCY: { id: number; chargeAmount: number; currencyId: number }[] = [
  {
    id: 1,
    chargeAmount: 0.6,
    currencyId: 2,
  },
  {
    id: 2,
    chargeAmount: 0.5,
    currencyId: 1,
  },
];

const STRIPE_PROCCESSING_FEES = {
  EUR: {
    id: 1,
    percentageValue: 1.4,
    fixedFeed: 0.25,
    isEu: true,
    currencyId: 1,
  },
  NON_EUR: {
    id: 2,
    percentageValue: 2.9,
    fixedFeed: 0.25,
    isEu: false,
    currencyId: 1,
  },
};

const BEACH_BAR_PRICING_FEES = [
  {
    id: 1,
    percentageValue: 30,
    isDefault: true,
  },
  {
    id: 2,
    percentageValue: 20,
    isDefault: false,
  },
  {
    id: 3,
    percentageValue: 15,
    isDefault: false,
  },
];

export const PAYMENT_STATUSES = {
  CREATED: {
    id: 1,
    name: "Created",
  },
  PAID: {
    id: 2,
    name: "Paid",
  },
  REFUNDED: {
    id: 3,
    name: "Refunded",
  },
}

export const DATA = {
  STRIPE: {
    MINIMUM_CURRENCY: STRIPE_MINUMUM_CURRENCY,
    PROCCESSING_FEES: STRIPE_PROCCESSING_FEES,
  },
  BEACH_BAR: {
    PRICING_FEES: BEACH_BAR_PRICING_FEES,
  },
  PAYMENT: {
    STATUSES: PAYMENT_STATUSES,
  }
};
