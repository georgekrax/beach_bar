import { createCtx } from "@hashtag-design-system/components";

export type CheckoutContextType = {
  isAuthed: boolean;
  cardId?: string;
  setCardId: React.Dispatch<React.SetStateAction<CheckoutContextType["cardId"]>>;
  goTo: (step: 1 | 2 | 3) => void;
};

const INITIAL_VALUES: CheckoutContextType = {
  isAuthed: false,
  setCardId: () => {},
  goTo: () => {},
};

export const [CheckoutContextProvider, useCheckoutContext] = createCtx<CheckoutContextType>(INITIAL_VALUES);
