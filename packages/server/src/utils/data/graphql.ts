import { FieldResolver } from "nexus";

// @deprecated
// const field: FieldResolver<any, string> = async ({ id, ...rest }, _, { prisma }: MyContext, { fieldName, path }) => {
//   const attribute = rest[fieldName];
//   if (attribute) return attribute;
//   const key = path.prev?.key;
//   if (key) {
//     const newAttribute = await prisma[key].findUnique({ where: { id } })[fieldName]();
//     return newAttribute;
//   }
//   return null;
// };

export const resolve = <T extends { name: string; resolve: FieldResolver<any, any> }>(params: T) => ({
  ...params,
  async resolve(...args) {
    const [parent] = args;
    const { name, resolve } = params;
    const attribute = parent[name];
    if (attribute) return attribute;
    return resolve.apply(null, args);
  },
});
