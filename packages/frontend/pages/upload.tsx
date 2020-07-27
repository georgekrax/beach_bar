import { useDropzone } from "react-dropzone";
import { commitMutation, graphql } from "react-relay";
import { initEnvironment } from "../lib/createEnvironment";

const mutation = graphql`
  mutation uploadMutation($file: Upload!) {
    uploadSingleFile(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;

export const Upload: any = ({ environment }) => {
  const onDrop = ([file]) => {
    console.log(file);
    const res = commitMutation(environment, {
      mutation: mutation,
      variables: {
        file,
      },
      uploadables: {
        file,
      },
      onCompleted: res => console.log(res),
    });
    console.log(res);
    console.log("success");
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Please wait to upload file(s)</p>
      ) : (
        <>
          <p>Drag & drop some files here,or click to select files</p>
          <span>Or click to select files</span>
        </>
      )}
    </div>
  );
};

export async function getStaticProps() {
  const { environment } = initEnvironment();

  const records = environment.getStore().getSource().toJSON();

  return { props: { records } };
}

export default Upload;
