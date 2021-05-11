import { gql } from "@apollo/client";
import { useState } from "react";
import { FileWithPath } from "react-dropzone";
import Layout from "@/components/Layout/Layout";

const mutation = gql`
  mutation uploadMutation($filename: String!, $filetype: String!, $tableName: String!) {
    signS3(filename: $filename, filetype: $filetype, tableName: $tableName) {
      signedRequest
      url
    }
  }
`;

export const Upload: any = () => {
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const [files, setFiles] = useState([]);

  const onDrop = (me: FileWithPath[]) => {
    // setFiles(me);
    // for (let i = 0; i < files.length; i++) {
    //   const file = files[i]
    //   setLoading(true);
    //   commitMutation<uploadMutation>(environment, {
    //     mutation: mutation,
    //     variables: {
    //       filename: file.name,
    //       filetype: file.type,
    //       tableName: "user",
    //     },
    //     onCompleted: async res => {
    //       if (res !== null) {
    //         console.log(files.length)
    //         console.log(uploaded < files.length)
    //         const { signedRequest, url } = res.signS3;
    //         await fetch(signedRequest as string, {
    //           method: "PUT",
    //           body: file,
    //           headers: {
    //             "Content-Type": file.type,
    //           },
    //           mode: "cors",
    //         })
    //           .then(res => console.log(res))
    //           .catch(err => console.log(err));
    //       }
    //     },
    //   });
    //   setUploaded(uploaded + 1);
    // }
  };
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  return (
    <Layout>
      <div>@georgekrax me</div>
      {/* <input {...getInputProps()} />
      {isDragActive || (loading && uploaded < files.length) ? (
        <p>Please wait to upload file(s)</p>
      ) : (
        <>
          <p>Drag & drop some files here,or click to select files</p>
          <span>Or click to select files</span>
        </>
      )}
      {uploaded > files.length && <p>File(s) successfully have been uploaded</p>} */}
    </Layout>
  );
};

export default Upload;
