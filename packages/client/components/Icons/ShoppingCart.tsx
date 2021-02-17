import { Base, IconBaseFProps } from "./Base";

type SubComponents = {
  Filled: typeof Filled;
};

const ShoppingCart: React.FC<IconBaseFProps> & SubComponents = props => {
  return (
    <Base {...props}>
      <path
        d="M6.482 5.34h14.103a.423.423 0 01.333.167.39.39 0 01.062.362l-1.553 4.82c-.325 1.018-1.29 1.71-2.383 1.709H7.711M6.482 5.34l-.308-.806C5.97 3.358 4.929 2.498 3.708 2.5H3m3.482 2.84l1.229 7.058M18.989 15.5h-9.5c-.813.003-1.509-.57-1.64-1.354l-.138-1.748"
        strokeLinecap="round"
      />
      <circle cx={9.5} cy={20} r={1.75} strokeWidth={1.5} />
      <path d="M19.25 20a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0z" strokeWidth={1.5} />
    </Base>
  );
};

export const Filled: React.FC<IconBaseFProps> = props => {
  return (
    <Base {...props}>
      <path
        className="filled"
        d="M6.482 5.34h14.103a.423.423 0 01.333.167.39.39 0 01.062.362l-1.553 4.82c-.325 1.018-1.29 1.71-2.383 1.709H7.711L6.482 5.34z"
      />
      <path
        d="M6.482 5.34h14.103a.423.423 0 01.333.167.39.39 0 01.062.362l-1.553 4.82c-.325 1.018-1.29 1.71-2.383 1.709H7.711M6.482 5.34l-.308-.806C5.97 3.358 4.929 2.498 3.708 2.5H3m3.482 2.84l1.229 7.058M18.989 15.5h-9.5c-.813.003-1.509-.57-1.64-1.354l-.138-1.748"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle cx={9.5} cy={20} r={1.75} strokeWidth={1.5} />
      <path d="M19.25 20a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0z" strokeWidth={1.5} />
    </Base>
  );
};

ShoppingCart.displayName = "ShoppingCartIcon";
Filled.displayName = "ShoppingCartFilledIcon";

ShoppingCart.Filled = Filled;

export default ShoppingCart;