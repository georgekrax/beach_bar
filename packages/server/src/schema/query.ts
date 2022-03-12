import { queryType } from "nexus";

export const Query = queryType({
  description: "Query",
  definition(t) {
    t.string("hello", {
      resolve: async (_, __, { prisma, payload }) => {
        // await prisma.cart.delete({ where: { id: 48 } });
        const me = await prisma.cart.findFirst({
          where: { id: 2317 },
          include: { products: true },
          // include: { foods: { include: { food: true }, where: { deletedAt: null, food: { deletedAt: null } } } },
        });
        console.log(me?.products);
        // const cart = await prisma.cart.create({ data: {} });
        // console.log("cart", cart);
        // const hey = await stripe.paymentIntents.retrieve("pi_3JVOkCFMzPANwdsq02I1ZyuC", {
        //   expand: ["charges.data.balance_transaction"],
        // });
        // console.log(hey.charges.data[0].balance_transaction);
        return `Hello world${payload ? ", " + payload.sub : ""}!`;
      },
    });
  },
});
