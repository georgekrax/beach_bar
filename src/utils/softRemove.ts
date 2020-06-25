import { getConnection } from "typeorm";

export const softRemove = async (
  primaryRepo: any,
  primaryOptions: object,
  repositories?: any[],
  findOptions?: object,
): Promise<void> => {
  if (repositories && findOptions) {
    repositories.forEach(async repository => {
      await getConnection().getRepository(repository).softDelete(findOptions);
    });
  }
  if (primaryRepo.toString() !== "Product") {
    await getConnection().getRepository(primaryRepo).softDelete(primaryOptions);
  } else {
    await primaryRepo.update(primaryOptions, { deletedAt: Date.now() });
  }
};
