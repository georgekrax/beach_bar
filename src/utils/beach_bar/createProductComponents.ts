import { getRepository } from "typeorm";
import { BundleProductComponent } from "../../entity/BundleProductComponent";
import { Product } from "../../entity/Product";
import { ProductCategory } from "../../entity/ProductCategory";

export const createProductComponents = async (product: Product, category: ProductCategory, update: boolean): Promise<void> => {
  if (update) {
    const bundleProducts = await BundleProductComponent.find({ product });
    await getRepository(BundleProductComponent).softRemove(bundleProducts);
  }

  category.productComponents.forEach(async productComponent => {
    await BundleProductComponent.create({ product, component: productComponent, deletedAt: undefined }).save();
  });
};
