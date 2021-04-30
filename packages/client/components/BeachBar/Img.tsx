import { useClassnames } from "@hashtag-design-system/components";
import Image, { ImageProps } from "next/image";
import styles from "./Img.module.scss";

type Props = {
  container?: Pick<React.ComponentPropsWithoutRef<"div">, "className" | "style">;
};

export const Img: React.FC<Props & ImageProps> = ({ container = {}, children, ...props }) => {
  const [classNames, rest] = useClassnames(styles.container + " h100 flex-row-center-center", container);

  return (
    <div className={classNames} {...rest}>
      <Image objectFit="cover" objectPosition="center" {...props} />
      {children}
    </div>
  );
};

Img.displayName = "BeachBarImg";
