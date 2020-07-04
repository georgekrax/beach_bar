import { getConnection } from "typeorm";

export const softRemove = async (
  primaryRepo: any,
  primaryOptions: Record<string, unknown>,
  repositories?: any[],
  findOptions?: Record<string, unknown>,
): Promise<void> => {
  if (repositories && findOptions) {
    repositories.forEach(async repository => {
      await getConnection().getRepository(repository).softDelete(findOptions);
    });
  }
  if (["Product", "RestaurantFoodItem"].includes(primaryRepo.toString())) {
    await primaryRepo.update(primaryOptions, { deletedAt: Date.now() });
  } else {
    await getConnection().getRepository(primaryRepo).softDelete(primaryOptions);
  }
};
