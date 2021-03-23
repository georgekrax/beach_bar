export const uploadToS3 = async (file: File, signedRequest: string) => {
  const options: RequestInit = {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
    mode: "cors",
  };
  const res = await fetch(signedRequest, options)
  if (res.ok) return res;
  return false;
};