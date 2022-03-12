// const STRIPE_PROCCESSING_FEES = {
//   EUR: {
//     id: 1,
//     percentageValue: 1.4,
//     fixedFeed: 0.25,
//     isEu: true,
//     currencyId: 1,
//   },
//   NON_EUR: {
//     id: 2,
//     percentageValue: 2.9,
//     fixedFeed: 0.25,
//     isEu: false,
//     currencyId: 1,
//   },
// };

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

export const DATA = {
  BEACH_BAR: {
    PRICING_FEES: BEACH_BAR_PRICING_FEES,
  },
};
