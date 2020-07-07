import dayjs from "dayjs";
import { getConnection } from "typeorm";

export const softRemove = async (
  primaryRepo: any,
  primaryOptions: Record<string, unknown>,
  repositories?: any[],
  findOptions?: Record<string, unknown>,
): Promise<void> => {
  if (repositories && findOptions) {
    repositories.forEach(async repository => {
      if (["Product", "RestaurantFoodItem", "Payment", "ReservedProduct"].includes(getConnection().getMetadata(repository).name)) {
        await repository.update(findOptions, { deletedAt: dayjs().toISOString() });
      } else {
        await getConnection().getRepository(repository).softDelete(findOptions);
      }
    });
  }
  if (["Product", "RestaurantFoodItem", "ReservedProduct"].includes(getConnection().getMetadata(primaryRepo).name)) {
    await primaryRepo.update(primaryOptions, { deletedAt: dayjs().toISOString() });
  } else if (getConnection().getMetadata(primaryRepo).name === "Payment") {
    await primaryRepo.update(primaryOptions, { isRefunded: true });
  } else {
    await getConnection().getRepository(primaryRepo).softDelete(primaryOptions);
  }
};
