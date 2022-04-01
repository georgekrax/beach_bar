import Carousel from "@/components/Carousel";
import { useHelloMutation, useLoginMutation } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { Box, Button, Checkbox, Input, VStack } from "@hashtag-design-system/components";
import { GetServerSidePropsContext } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

type Props = {};

const Hey: React.FC<Props> = () => {
  const { data: session } = useSession();
  const [mutate] = useHelloMutation();
  const [login] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ example: string }>();

  const onSubmit = data => console.log(data);
  const { handleSearch } = useSearchContext();

  return (
    <Box height="200vh">
      <Box zIndex="md" color="brand.secondary">
        Hey from @!
      </Box>
      <Box zIndex="md" color="brand.georgekrax">
        Hey from @!
      </Box>
      <Button bg="brand.georgekrax" onClick={async () => await handleSearch()}>
        Hey from click
      </Button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Placeholder"
          {...register("example", {
            minLength: { value: 10, message: "You should provide a value with length greater than 10" },
          })}
        />
        {errors.example?.message}
        <br />
        <button type="submit">Submit</button>
      </form>
      <div>
        {session?.email} | {session?.id}
      </div>
      <Carousel.Context>
        <Carousel.ControlBtn dir="prev" />
        <Carousel.ControlBtn dir="next" />
        <Carousel mt={12} mb={20}>
          {[0, 1, 2, 3].map(i => (
            <Carousel.Item key={i} idx={i}>
              <Carousel.BeachBar
                name="Beach bar"
                slug="beach_bar"
                location={{ formattedLocation: "Athens, Greece" }}
                thumbnailUrl="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JlZWNlfGVufDB8fDB8&ixlib=rb-1.2.1&q=100"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Carousel.Context>
      <Checkbox size="md" />
      <Button
        onClick={async () => {
          // const { data } = await mutate({ variables: { name: "George" } });
          const { data } = await mutate();
          console.log(data?.hello);
        }}
      >
        Mutate
      </Button>
      <Button
        onClick={async () => {
          const { data, errors } = await login({
            variables: { userCredentials: { email: "georgekraxt@gmail.com", password: "george2016" } },
          });
          console.log(data?.login, errors);
        }}
      >
        Login from GraphQL
      </Button>
      <VStack spacing={25}>
        <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        <Button onClick={() => signIn("facebook")}>Sign in with Facebook</Button>
        <Button onClick={() => signIn("instagram")}>Sign in with Instagram</Button>
        <Button onClick={() => signIn()}>Sign in with Credentials (redirect)</Button>
      </VStack>
      <Button
        onClick={() => {
          signIn("credentials", {
            redirect: false,
            email: "georgekraxt@gmail.com",
            password: "george2016",
            // hey: JSON.stringify(userIpAddr()),
          });
        }}
      >
        Sign in with Credentials
      </Button>
      <Button mb={16} onClick={() => signOut({ redirect: false })}>
        Log out
      </Button>
      {/* <Box display="flex" justifyContent="center" mx="auto" maxWidth="25rem">
        <motion.div
          ref={trackRef}
          style={{ background: "gray", position: "relative", overflow: "hidden" }}
          // drag="x"
          dragConstraints={{
            left: 0,
            // right: windowDimensions.width - (trackDimensions?.borderBox.width || 0),
            right: trackDimensions?.borderBox.width || 0,
            // left: windowDimensions.width - (trackDimensions?.borderBox.width || 0) - (trackDimensions?.borderBox.x || 0),
            // right: trackDimensions?.borderBox.x || 0,
          }}
        >
          <Box
            display="flex"
            overflowX="scroll"
            className="no-scrollbar"
            sx={{ scrollSnapType: "x mandatory", "& > *": { scrollSnapAlign: "center", flex: "0 0 auto" } }}
          >
            {[0, 1, 2, 3, 4, 5].map(i => (
              <Box
                key={i}
                display="inline-block"
                mx={3}
                _first={{ pl: 0 }}
                _last={{ pr: 0 }}
                _hover={{ transform: "scale(1.2)", marginX: 10 }}
                transition="0.2s all ease-out"
                flexShrink={0}
                width="25%"
                height={32}
              >
                <Box bg="lightcoral" width="100%" height="100%"></Box>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Box> */}
      {/* Full-bleed carousel */}

      {/* <Box maxWidth="100vw">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0 }}
          style={{ display: "flex", background: "lightBlue", whiteSpace: "nowrap" }}
        >
          {[0, 1, 2, 3, 4, 5].map(i => (
            <Box
              key={i}
              display="inline-block"
              mx={3}
              _first={{ ml: 0 }}
              _last={{ mr: 0 }}
              _hover={{ transform: "scale(1.2)", marginX: 10 }}
              transition="0.2s all ease-out"
              flexShrink={0}
              width="25%"
              height={32}
            >
              <Box bg="lightcoral" width="100%" height="100%"></Box>
            </Box>
          ))}
        </motion.div>
      </Box> */}
      {/* <Carousel.Context>
        <div className="w100 flex-row-space-between-center">
          <h4>Discover</h4>
          <Carousel.ControlBtns />
        </div>
        <Carousel className="h100">
          {[0, 1, 2].map(i => (
            <Carousel.Item idx={i} className="h100" overflowPadding={{ className: "h100" }}>
              <Carousel.BeachBar
                key={i}
                formattedLocation="Athens, Greece"
                name="Beach bar"
                slug="beach_bar"
                thumbnailUrl="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JlZWNlfGVufDB8fDB8&ixlib=rb-1.2.1&q=100"
                className="ih100"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Carousel.Context> */}
    </Box>
  );
};

Hey.displayName = "Hey";

export default Hey;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);
  return { props: { session } };
}
