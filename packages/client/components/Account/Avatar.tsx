import { useAuth } from "@/utils/hooks";
import { useClassnames } from "@hashtag-design-system/components";
import Image, { ImageProps } from "next/image";
import styles from "./Avatar.module.scss";

export const Avatar: React.FC<Partial<ImageProps>> = ({ src, ...props }) => {
  const [classNames, rest] = useClassnames(styles.avatar, props);
  const { data } = useAuth();

  return (
    <>
      <Image
        className={classNames}
        src={data?.me?.account.imgUrl || src || "/user_default.jpg"}
        alt="Authenticated user's account image"
        width={48}
        height={48}
        objectFit="cover"
        objectPosition="center"
        priority
        quality={100}
        {...rest}
      />
    </>
  );
};

Avatar.displayName = "AccountAvatar";
