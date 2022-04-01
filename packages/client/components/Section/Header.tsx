import Next from "@/components/Next";
import { Flex, Heading, MotionFlex, MotionFlexProps } from "@hashtag-design-system/components";
import Icons from "@hashtag-design-system/icons";
import { LinkProps } from "next/link";

export type Props = Pick<LinkProps, "href"> &
  MotionFlexProps & {
    link?: string;
    onLinkClick?: () => void;
  };

export const Header: React.FC<Props> = ({ link, href, onLinkClick, children, ...props }) => {
  return (
    <MotionFlex
      justify="space-between"
      align="flex-end"
      mb={4}
      py={2}
      px={1}
      borderBottom="1px solid"
      borderColor="gray.400"
      {...props}
    >
      <Heading as="h6" size="md" fontWeight="semibold" color="text.grey">
        {children}
      </Heading>
      {link && (
        <Flex justify="center" align="center" gap={1}>
          <Next.Link
            fontSize="sm"
            isA={!!!onLinkClick}
            link={onLinkClick ? (undefined as any) : { href }}
            onClick={onLinkClick}
          >
            {link}
          </Next.Link>
          <Icons.Arrow.Right color="brand.secondary" />
        </Flex>
      )}
    </MotionFlex>
  );
};

Header.displayName = "SectionHeader";
