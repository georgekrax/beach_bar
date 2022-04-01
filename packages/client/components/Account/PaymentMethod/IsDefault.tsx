import { Heading, HeadingProps, Radio, RadioProps } from "@hashtag-design-system/components";

export type Props = RadioProps & {
  hasDefault?: boolean;
  header?: HeadingProps;
  text?: "default" | "selected";
};

export const IsDefault: React.FC<Props> = ({ hasDefault = true, header = {}, text = "default", ...props }) => {
  return (
    <Radio {...props}>
      <Heading
        as="h6"
        size="sm"
        transform="translateY(-1px)"
        fontWeight="normal"
        textTransform="uppercase"
        color="brand.secondary"
        opacity={hasDefault && props.isChecked ? 1 : 0}
        {...header}
      >
        {text}
      </Heading>
    </Radio>
  );
};

IsDefault.displayName = "AccountPaymentMethodIsDefault";
