import { Flex, Heading, Text } from "@hashtag-design-system/components";

type SubComponents = {
  Contact: typeof Contact;
};

type Props = {
  header?: string;
};

export const Section: React.FC<Props> & SubComponents = ({ header, children }) => (
  <div>
    {header && (
      <Heading as="h6" size="md" mb={3} color="text.grey">
        {header}
      </Heading>
    )}
    {children}
  </div>
);

type ContactProps = {
  info: string;
  val: string;
};

export const Contact: React.FC<ContactProps> = ({ info, val }) => (
  <Flex justify="space-between" align="center" gap={2} mb={3}>
    <div>{info}:</div>
    <Text as="span" fontWeight="semibold">
      {val}
    </Text>
  </Flex>
);

Section.Contact = Contact;

Section.displayName = "BeachBarSection";
Contact.displayName = "BeachBarSectionContact";
