import { useSignS3Mutation } from "@/graphql/generated";
import { uploadToS3 } from "@/lib/aws";
import { notify } from "@/utils/notify";
import { errors as COMMON_ERRORS } from "@beach_bar/common";
import { Button, ButtonProps, Input, InputProps } from "@hashtag-design-system/components";
import React, { useRef, useState } from "react";
import styles from "./UploadBtn.module.scss";

type OnChangeParams = { file: File; e: React.ChangeEvent<HTMLInputElement>; s3Url?: string };

export type Props = {
  s3Bucket?: string;
  onChange?: (params: OnChangeParams) => void;
};

export const UploadBtn: React.FC<Props & Pick<InputProps, "label"> & Pick<ButtonProps, "variant">> = ({
  label,
  s3Bucket,
  variant = "secondary",
  children = "Upload image",
  onChange,
}) => {
  const [fileName, setFileName] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const [signS3] = useSignS3Mutation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (ref?.current) ref.current.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    const { name, type } = file;
    if (!type.includes("image")) notify("error", "Please provide a valid image.");

    let s3Url: string | undefined = undefined;
    if (s3Bucket) {
      const { data, errors } = await signS3({ variables: { filename: name, filetype: type, s3Bucket } });
      if (errors) errors.forEach(({ message }) => notify("error", message));
      if (!data || !data.signS3) return notify("error", COMMON_ERRORS.SOMETHING_WENT_WRONG);
      const { url, signedRequest } = data.signS3;
      await uploadToS3(file, signedRequest);
      setFileName(name);
      s3Url = url;
    }

    if (onChange) onChange({ file, e, s3Url });
  };

  return (
    <div className={styles.container}>
      <Input
        type="file"
        label={label}
        accept="image/*"
        hidden
        aria-hidden="true"
        forwardref={ref}
        onChange={async e => await handleChange(e)}
      />
      <Button type="button" variant={variant} className="d--ib body-14" onClick={e => handleClick(e)}>
        {children}
      </Button>
      <span className="font--italic">{fileName}</span>
    </div>
  );
};

UploadBtn.displayName = "NextUploadBtn";
