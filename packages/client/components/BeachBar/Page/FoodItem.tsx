import ShoppingCart, { ShoppingCartItemPriceProps } from "@/components/ShoppingCart";
import {
  AddCartFoodMutation,
  BeachBarQuery,
  CartDocument,
  CartQuery,
  FoodsDocument,
  FoodsQuery,
  UpdateCartFoodMutation,
  useAddCartFoodMutation,
  useCartQuery,
  useDeleteCartFoodMutation,
  useDeleteFoodMutation,
  useUpdateCartFoodMutation,
} from "@/graphql/generated";
import { useDashboard } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  MotionFlex,
  useDisclosure,
} from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import { GraphQLError } from "graphql";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BeachBarPageFoodProps } from "./index";

const SIZE = 20 / 16;
const FIRST_MARGIN_RIGHT = 8 / 16;
const SECOND_MARGIN_RIGHT = 12 / 16;
const BTN = {
  FIRST_WIDTH: -(SIZE + FIRST_MARGIN_RIGHT),
  SECOND_WIDTH: -(SIZE + SECOND_MARGIN_RIGHT),
};
const BTN_STYLES = {
  variant: "ghost",
  boxSize: 5,
  minWidth: 5,
  p: 0,
  borderRadius: "0.375rem",
  boxShadow: "none",
  alignSelf: "center",
  color: "gray.400",
  border: "1.5px solid",
  borderColor: "currentColor",
};

type Props = Pick<BeachBarPageFoodProps, "edit" | "atDashboard"> &
  NonNullable<BeachBarQuery["beachBar"]>["foods"][number] &
  Pick<ShoppingCartItemPriceProps, "currencySymbol">;

export const FoodItem: React.FC<Props> = ({ id, name, ingredients, edit = true, atDashboard, ...props }) => {
  const router = useRouter();
  const [{ hover, quantity }, setBtnControl] = useState({ hover: false, quantity: 0 });
  const { isOpen: isDeleteShown, onOpen, onClose } = useDisclosure();

  const { beachBarId } = useDashboard();

  const { data } = useCartQuery();
  const [deleteFood] = useDeleteFoodMutation();
  const [addCartFood] = useAddCartFoodMutation();
  const [updateCartFood] = useUpdateCartFoodMutation();
  const [deleteCartFood] = useDeleteCartFoodMutation();

  const { hasQuantity, isAlreadyInCart } = useMemo(
    () => ({
      hasQuantity: quantity > 0,
      isAlreadyInCart: data?.cart.foods?.find(({ food }) => food.id === id),
    }),
    [quantity, data?.cart.foods.length, data?.cart.foods[0]?.id]
  );
  const x = useMemo(() => {
    if (!edit || atDashboard || (hover && hasQuantity)) return 0;
    else return BTN.FIRST_WIDTH + (hover || hasQuantity ? 0 : BTN.SECOND_WIDTH) + "rem";
  }, [hover, hasQuantity]);

  const handleHover = (type: "enter" | "leave") => setBtnControl(prev => ({ ...prev, hover: type === "enter" }));

  const handleAdd = async () => {
    if (atDashboard) return router.push("/dashboard/foods/" + id);
    if (!data?.cart) return notify("error", "");
    const newQuantity = quantity + 1;

    let res: AddCartFoodMutation | UpdateCartFoodMutation | null | undefined = undefined;
    let errors: readonly GraphQLError[] | undefined = undefined;
    if (isAlreadyInCart) {
      const { data: updateRes, errors: updateErrors } = await updateCartFood({
        variables: { id: isAlreadyInCart.id.toString(), quantity: newQuantity },
        update: (cache, { data }) => {
          const cacheData = cache.readQuery<CartQuery>({ query: CartDocument });
          if (!cacheData || !cacheData.cart || !data) return;
          cache.writeQuery<CartQuery>({
            query: CartDocument,
            data: {
              __typename: "Query",
              cart: {
                ...cacheData.cart,
                foods: Array.from(cacheData.cart.foods || [])
                  .flat()
                  .map(item => {
                    if (item.id === id) return { ...item, quantity: data.updateCartFood.quantity };
                    return item;
                  }),
              },
            },
          });
        },
      });
      (res = updateRes), (errors = updateErrors);
    } else {
      const { data: addRes, errors: addErrors } = await addCartFood({
        variables: { cartId: data.cart.id.toString(), foodId: id.toString(), quantity: 1 },
        update: (cache, { data }) => {
          const cacheData = cache.readQuery<CartQuery>({ query: CartDocument });
          if (!cacheData || !cacheData.cart || !data) return;
          cache.writeQuery<CartQuery>({
            query: CartDocument,
            data: {
              __typename: "Query",
              cart: {
                ...cacheData.cart,
                foods: [...Array.from(cacheData.cart.foods || []).flat(), { ...data.addCartFood }],
              },
            },
          });
        },
      });
      (res = addRes), (errors = addErrors);
    }
    if (!res && errors) errors.forEach(({ message }) => notify("error", message, { somethingWentWrong: false }));
    else setBtnControl(prev => ({ ...prev, quantity: newQuantity }));
  };

  const handleDelete = async () => {
    if (atDashboard) return onOpen();
    if (!isAlreadyInCart) return notify("error", "Food is not in the shopping cart", { somethingWentWrong: false });
    const { data: res, errors } = await deleteCartFood({
      variables: { id: isAlreadyInCart.id.toString() },
      update: cache => {
        const cacheData = cache.readQuery<CartQuery>({ query: CartDocument });
        if (!cacheData || !cacheData.cart) return;
        const newData = cacheData.cart.foods?.filter(({ id }) => String(id) !== String(isAlreadyInCart.id));
        cache.writeQuery<CartQuery>({
          query: CartDocument,
          data: { __typename: "Query", cart: { ...cacheData.cart, foods: newData } },
        });
      },
    });
    if (!res && errors) errors.forEach(({ message }) => notify("error", message, { somethingWentWrong: false }));
    else setBtnControl(prev => ({ ...prev, quantity: 0 }));
  };

  useEffect(() => {
    setBtnControl(prev => ({ ...prev, quantity: isAlreadyInCart?.quantity || 0 }));
  }, [isAlreadyInCart?.quantity]);

  return (
    <Flex
      as="li"
      justify="space-between"
      align="flex-end"
      gap={2}
      mb={0.5}
      p={1}
      borderRadius="6px"
      _hover={{ bg: "gray.100" }}
      transitionProperty="common"
      transitionDuration="normal"
      onMouseEnter={() => handleHover("enter")}
      onMouseLeave={() => handleHover("leave")}
    >
      <Flex justify="inherit" align="inherit" gap="inherit" className="w100">
        <MotionFlex
          justify="flex-start"
          align="center"
          initial={{ x: BTN.FIRST_WIDTH + "rem" }}
          animate={{ x }}
          transition={{ stiffness: 0 }}
        >
          {edit && (
            <>
              <Button
                {...BTN_STYLES}
                mr={2}
                _hover={!atDashboard ? { bg: "error", color: "white" } : undefined}
                onClick={async () => await handleDelete()}
              >
                <Icon.Close boxSize={2.5} />
              </Button>
              <Button
                {...BTN_STYLES}
                mr={3}
                _hover={!atDashboard ? { bg: "orange.500", color: "white" } : undefined}
                onClick={async () => await handleAdd()}
              >
                {atDashboard ? <Icon.Edit boxSize={3} /> : <Icon.Math.Add boxSize={3} />}
              </Button>
            </>
          )}
          <div>
            <div>{name}</div>
            {ingredients && (
              <Box fontSize="xs" fontStyle="italic">
                {ingredients}
              </Box>
            )}
          </div>
        </MotionFlex>
        <ShoppingCart.Quantity quantity={quantity} />
      </Flex>
      <ShoppingCart.ItemPrice {...props} />
      <Modal isOpen={isDeleteShown} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Are you sure you want to delete this food?</ModalHeader>
          <ModalFooter justifyContent="center">
            <Button variant="ghost" mr={4} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={async () => {
                const { data, errors } = await deleteFood({
                  variables: { foodId: id.toString() },
                  update: cache => {
                    const variables = { beachBarId: beachBarId?.toString() };
                    const cachedData = cache.readQuery<FoodsQuery>({ query: FoodsDocument, variables });
                    cache.writeQuery<FoodsQuery>({
                      query: FoodsDocument,
                      variables,
                      data: { __typename: "Query", foods: cachedData?.foods.filter(food => food.id !== id) || [] },
                    });
                  },
                });
                if (!data && errors) errors.forEach(({ message }) => notify("error", message));
                else notify("success", "Food has been deleted.");
                onClose();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

FoodItem.displayName = "BeachBarPageFoodItem";
