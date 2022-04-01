import Auth from "@/components/Auth";
import Next from "@/components/Next";
import { Box, Button, Flex, Form, Input } from "@hashtag-design-system/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useCheckoutContext } from "@/utils/contexts";

export const yupSchema = yup.object().shape({
  email: yup.string().email("Please provide a valid email address").min(1, "Please provide a valid email address"),
});

type FormData = {
  email: string;
  phoneNumber?: string;
};

export type Props = {
  onSubmit: (params: FormData & { countryId?: string }) => Promise<void>;
};

export const Customer: React.FC<Props> = ({ onSubmit }) => {
  const { isAuthed } = useCheckoutContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: isAuthed ? undefined : yupResolver(yupSchema) });

  // const [countryId, setCountryId] = useState<string | undefined>();

  // const handleSelect = (items: SelectItem[]) => {
  //   const country = COUNTRIES_ARR.find(
  //     ({ name }) => name.toLowerCase() === items.find(({ isSelected }) => isSelected)?.id.toLowerCase()
  //   );
  //   if (!country) notify("error", "");
  //   else setCountryId(country.id.toString());
  // };

  return (
    <>
      <Box mb={4}>Please enter your email address or login to your account, to continue</Box>
      <form onSubmit={handleSubmit(async args => await onSubmit(args))}>
        <Flex align="center" maxW="50vw">
          <Form.Control isInvalid={!!errors.email?.message} minW={64} isOptional>
            <Input {...register("email")} size="lg" placeholder="Email" />
            <Form.ErrorMessage position="absolute">{errors.email?.message}</Form.ErrorMessage>
          </Form.Control>
          {/* TODO: Revisit when the bucket in AWS S3 is created */}
          {/* <Input.Tel
              inputProps={{
                ...phoneNumber,
                placeholder: "Phone number",
                optional: true,
                forwardref: phoneNumber.ref,
              }}
              selectProps={{ onSelect: items => handleSelect(items) }}
            /> */}
          <Next.OrContainer text="Or" direction="column" />
          <Auth.LoginBtn px={8} />
        </Flex>
        <Button type="submit" mt={12} px={8} colorScheme="orange">
          Continue
        </Button>
      </form>
    </>
  );
};

Customer.displayName = "CheckoutCustomer";
