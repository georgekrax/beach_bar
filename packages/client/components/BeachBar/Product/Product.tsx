import { SEARCH_ACTIONS } from "@/components/Search";
import {
  AddCartProductMutation,
  BeachBarQuery,
  CartDocument,
  CartQuery,
  ProductsDocument,
  UpdateCartProductMutation,
  useAddCartProductMutation,
  useCartQuery,
  useDeleteCartProductMutation,
  useDeleteProductMutation,
  useUpdateCartProductMutation,
} from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { notify } from "@/utils/notify";
import { dayjsFormat } from "@beach_bar/common";
import {
  Box,
  Button,
  Flex,
  FlexProps,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import { GraphQLError } from "graphql";
import router from "next/router";
import { useMemo } from "react";
import { Info } from "./Info";
import { MainPage } from "./MainPage";

const PADDING = 4;

type SubComponents = {
  MainPage: typeof MainPage;
};

export type Props = NonNullable<BeachBarQuery["beachBar"]>["products"][number] &
  FlexProps & {
    defaultCurrencySymbol: string;
    hasComponents?: boolean;
    hasExtraDetails?: boolean;
    hasAddToCart?: boolean;
    atDashboard?: boolean;
    isAvailable?: boolean;
  };

export const Product: React.FC<Props> & SubComponents = ({
  __typename,
  id,
  name,
  description,
  imgUrl,
  price,
  minFoodSpending,
  defaultCurrencySymbol,
  hasComponents = true,
  category,
  maxPeople,
  hasExtraDetails = false,
  hasAddToCart = true,
  atDashboard = false,
  isAvailable = true,
  ...props
}) => {
  const { isOpen: isDeleteShown, onOpen, onClose } = useDisclosure();
  const { data } = useCartQuery();

  const [deleteProduct] = useDeleteProductMutation();
  const [addCartProduct] = useAddCartProductMutation();
  const [updateCartProduct] = useUpdateCartProductMutation();
  const [deleteCartProduct] = useDeleteCartProductMutation();

  const { _query, dispatch } = useSearchContext();

  const { isAlreadyInCart } = useMemo(
    () => ({ isAlreadyInCart: data?.cart.products?.find(({ product }) => product.id === id) }),
    [id, data?.cart.products.length, data?.cart.products[0]?.id]
  );

  const handleBtnClick = async () => {
    if (atDashboard) {
      router.push("/dashboard/products/" + id);
      return;
    }
    if (!data?.cart) return notify("error", "");
    if (!_query.date) return notify("error", "Please select your visit date", { somethingWentWrong: false });
    if (!_query.time.start || !_query.time.end) {
      return notify("error", "Please specify your arrival and departure time", { somethingWentWrong: false });
    }
    const totalPeople = _query.adults + (_query.children || 0);

    let res: AddCartProductMutation | UpdateCartProductMutation | null | undefined = undefined;
    let errors: readonly GraphQLError[] | undefined = undefined;

    if (isAlreadyInCart) {
      const { id, quantity } = isAlreadyInCart;
      const { data: updateRes, errors: updateErrors } = await updateCartProduct({
        variables: { id: id.toString(), quantity: quantity + 1 },
      });
      (res = updateRes), (errors = updateErrors);
    } else {
      const { data: addRes, errors: addErrors } = await addCartProduct({
        variables: {
          cartId: data.cart.id.toString(),
          productId: id,
          quantity: 1,
          date: _query.date.format(dayjsFormat.ISO_STRING),
          people: totalPeople > maxPeople ? maxPeople : totalPeople,
          startTimeId: _query.time.start.toString(),
          endTimeId: _query.time.end.toString(),
        },
      });
      (res = addRes), (errors = addErrors);
    }
    if (!res && errors) errors.forEach(({ message }) => notify("error", message, { somethingWentWrong: false }));
    else if (!isAlreadyInCart) dispatch({ type: SEARCH_ACTIONS.TOGGLE_CART, payload: { bool: true } });
  };

  const handleDelete = async () => {
    if (atDashboard) return onOpen();
    if (!isAlreadyInCart) return notify("error", "Product is not in the shopping cart.", { somethingWentWrong: false });
    const { data: res, errors } = await deleteCartProduct({
      variables: { id: isAlreadyInCart.id.toString() },
      update: cache => {
        const cacheData = cache.readQuery<CartQuery>({ query: CartDocument });
        if (!cacheData || !cacheData.cart) return;
        const newData = cacheData.cart.products?.filter(({ id }) => String(id) !== String(isAlreadyInCart.id));
        cache.writeQuery<CartQuery>({
          query: CartDocument,
          data: { __typename: "Query", cart: { ...cacheData.cart, products: newData } },
        });
      },
    });
    if (!res && errors) errors.forEach(({ message }) => notify("error", message, { somethingWentWrong: false }));
  };

  return (
    <Flex
      flexDir={{ base: "column", md: "row" }}
      justify="space-between"
      align="stretch"
      minHeight="8.75rem"
      position="relative"
      bg="white"
      borderRadius="regular"
      color="black"
      mb={4}
      p={PADDING}
      pb={{ base: hasAddToCart ? 0 : undefined, md: PADDING }}
      border="1px solid"
      borderColor="gray.300"
      boxShadow="0px 1px 8px rgba(113 128 150 / 80%)"
      {...props}
      _last={{ md: { mb: 0 } }}
    >
      <Info
        name={name}
        imgUrl={imgUrl}
        description={description}
        category={category}
        hasAddToCart={hasAddToCart}
        hasComponents={hasComponents}
        hasExtraDetails={hasExtraDetails}
        isAlreadyInCart={isAlreadyInCart}
      />
      <Flex
        flexDir={{ md: "column" }}
        justify="space-between"
        align="flex-end"
        alignSelf={{ base: "center", md: "stretch" }}
        position="relative"
        minW={{ md: 40 }}
        ml={{ md: 6 }}
        p={{ md: 0 }}
        py={3}
        px={PADDING}
        pl={{ md: 12 }}
        borderTop={{ base: "2px solid", md: "none" }}
        borderLeft={{ md: "2px solid" }}
        borderColor={{ base: "gray.200", md: "gray.200" }} // ! Keep it like this
        // _last={{ overflow: "hidden", gap: 3 }}
        _last={{ gap: 3 }}
      >
        <Flex flexDir="column" justify="center" align="flex-end" opacity={isAvailable ? 1 : 0.5}>
          <Flex
            justify="inherit"
            align="inherit"
            borderRadius="full"
            pt={1}
            px="0.65em"
            pb="0.35em"
            flex="0 0 auto"
            bg="gray.700"
            color="white"
            userSelect="none"
            whiteSpace="nowrap"
          >
            {price > 0 ? defaultCurrencySymbol + " " + price.toFixed(2) : "Free"}
          </Flex>
          {minFoodSpending && minFoodSpending > 0 && (
            <Box fontSize="xs" mt={2} mb={5} textAlign="right" fontStyle="italic">
              <span>Min. spending on food &amp; beverages:&nbsp;</span>
              <Text as="span" fontWeight="semibold">
                {defaultCurrencySymbol}
                {(5).toFixed(2)}
              </Text>
            </Box>
          )}
        </Flex>
        {(hasAddToCart || atDashboard) && (
          <Flex justify="flex-end">
            <Flex overflow="hidden">
              <Button
                size="sm"
                p={2}
                initial={{ y: "200%" }}
                animate={{ y: isAlreadyInCart || atDashboard ? 0 : "200%" }}
                transition={{ duration: 0.05 }}
                boxShadow="none"
                alignSelf="flex-end"
                onClick={async () => await handleDelete()}
              >
                <Icon.TrashBin.HandleFilled boxSize="1rem" color="gray.600" />
              </Button>
            </Flex>
            <Button
              colorScheme="orange"
              py={2}
              px={4}
              ml={3}
              boxShadow="none"
              isDisabled={!isAvailable}
              onClick={async () => await handleBtnClick()}
            >
              {atDashboard ? "Edit" : isAlreadyInCart && isAvailable ? "Add more" : "Add"}
            </Button>
          </Flex>
        )}
      </Flex>
      <Modal isOpen={isDeleteShown} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Are you sure you want to delete this product?</ModalHeader>
          <ModalFooter justifyContent="center">
            <Button variant="ghost" mr={4} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={async () => {
                const { data, errors } = await deleteProduct({
                  variables: { productId: id },
                  refetchQueries: [ProductsDocument],
                });
                if (!data && errors) errors.forEach(({ message }) => notify("error", message));
                else notify("success", "Product was deleted.");
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

Product.MainPage = MainPage;
