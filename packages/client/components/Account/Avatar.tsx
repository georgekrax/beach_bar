import { chakra, ChakraProps, cx } from "@hashtag-design-system/components";
import { useSession } from "next-auth/react";
import Image, { ImageProps } from "next/image";

const ChakraImage = chakra(Image, {
  shouldForwardProp: prop => {
    return ["src", "width", "height", "alt", "objectFit", "objectPosition", "priority", "quality"].includes(prop);
  },
});

export const Avatar: React.FC<Partial<ImageProps> & ChakraProps> = ({ src, boxSize = 48, ...props }) => {
  const { data: session } = useSession();

  return (
    <ChakraImage
      alt="Authenticated user's account image"
      priority
      width={boxSize}
      height={boxSize}
      objectFit="cover"
      objectPosition="center"
      quality={100}
      borderRadius="regular"
      {...props}
      src={(session?.image as string | undefined | null) || src || "/user_default.jpg"}
    />
  );
};

Avatar.displayName = "AccountAvatar";

export const AccountAvatar = Avatar;
