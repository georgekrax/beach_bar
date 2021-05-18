import Layout from "@/components/Layout/Layout";

type Props = {};

const Hey: React.FC<Props> = () => {
  return (
    <Layout>
      <div>Hey from @me!</div>
      {/* <Button>Click @hey</Button> */}
      {/* <Button>Click @georgekrax</Button> */}
    </Layout>
    // <Layout>
    // </Layout>
  );
};

Hey.displayName = "Hey";

export default Hey;
