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
  await getConnection().getRepository(primaryRepo).softDelete(primaryOptions);
};
