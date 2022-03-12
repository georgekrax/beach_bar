import { idArg, nullable, objectType } from "nexus";
import { Cart } from "nexus-prisma";

const customResolve = <T extends { name: "products" | "foods" | "notes" }>(field: T) => ({
  ...field,
  args: { beachBarId: nullable(idArg()) },
  async resolve(...args) {
    const { name } = field;
    const [parent, { beachBarId }, { prisma }] = args;
    const singularName = name.replace("s", "");
    const attribute = parent[name];
    let arr: any[];
    if (attribute) arr = attribute;
    else {
      const cart = await prisma.cart.findUnique({
        where: { id: parent.id },
        include: { [name]: name === "notes" ? true : { include: { [singularName]: true } } },
      });
      arr = cart?.[name] || [];
    }
    if (beachBarId) arr = arr.filter(item => String(item[singularName].beachBarId) === String(beachBarId));
    return arr;
  },
});

export const CartType = objectType({
  name: Cart.$name,
  description: "Represents a shopping cart",
  definition(t) {
    t.field(Cart.id);
    t.field(Cart.productstotal);
    t.field(Cart.foodsTotal);
    t.field(Cart.total);
    t.field(Cart.user);
    t.field(customResolve(Cart.products));
    t.field(customResolve(Cart.foods));
    t.field(customResolve(Cart.notes));
    // t.list.field("products", {
    //   type: CartProductType,
    //   description: "A list with all the cart products",
    //   args: BeachBarIdArg,
    //   resolve: (cart, { beachBarId }) => {
    //     let arr: CartProduct[] = cart.products || [];
    //     if (beachBarId) arr = arr.filter(({ product }) => String(product.beachBarId) === String(beachBarId));
    //     return arr;
    //   },
    // });
    // t.list.field("foods", {
    //   type: CartFoodType,
    //   description: "A list with all the cart foods",
    //   args: BeachBarIdArg,
    //   resolve: (cart, { beachBarId }) => {
    //     let arr: CartFood[] = cart.foods || [];
    //     if (beachBarId) arr = arr.filter(({ food }) => String(food.beachBarId) === String(beachBarId));
    //     return arr;
    //   },
    // });
    // t.list.field("notes", {
    //   type: CartNoteType,
    //   description: "An optional note for each of the shopping cart #beach_bars, provided by the user",
    //   args: BeachBarIdArg,
    //   resolve: (cart, { beachBarId }) => {
    //     let arr: CartNote[] = cart.notes || [];
    //     if (beachBarId) arr = arr.filter(note => String(note.beachBarId) === String(beachBarId));
    //     return arr;
    //   },
    // });
  },
});
