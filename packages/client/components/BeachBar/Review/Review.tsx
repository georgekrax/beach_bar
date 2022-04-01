import Account from "@/components/Account";
import Next from "@/components/Next";
import {
  BeachBarDocument,
  ReviewDocument,
  ReviewQuery,
  ReviewsQuery,
  useUpdateReviewVoteMutation,
} from "@/graphql/generated";
import { useAuth } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { textOverlfow } from "@/utils/styles";
import { Box, Button, Flex, FlexProps, Text } from "@hashtag-design-system/components";
import Icon from "@hashtag-design-system/icons";
import dayjs from "dayjs";
import { useMemo } from "react";
import BeachBar from "../BeachBar";
import { ContentEdit } from "./ContentEdit";
import { Feedback } from "./Feedback";
import { MainPage } from "./MainPage";
import { RatingBox } from "./RatingBox";

type SubComponents = {
  Feedback: typeof Feedback;
  RatingBox: typeof RatingBox;
  MainPage: typeof MainPage;
  ContentEdit: typeof ContentEdit;
};

type Props = Omit<NonNullable<ReviewsQuery["reviews"]>[number], "answer"> & {
  atBeach?: boolean;
  atDashboard?: boolean;
  hasExpandedContent?: boolean;
  allowVoting?: boolean;
  container?: FlexProps;
};

export const Review: React.FC<Props> & SubComponents = ({
  id,
  ratingValue,
  votes,
  beachBar,
  month,
  visitType,
  payment,
  timestamp,
  hasExpandedContent = false,
  atBeach = false,
  atDashboard = false,
  allowVoting = true,
  customer,
  container = {},
  children,
  ...props
}) => {
  const { data, refetch } = useAuth();
  const [updateVote] = useUpdateReviewVoteMutation();

  const handleClick = async (action: "upvote" | "downvote") => {
    const { errors } = await updateVote({
      variables: { reviewId: id, upvote: action === "upvote", downvote: action === "downvote" },
      refetchQueries: [{ query: BeachBarDocument, variables: { slug: beachBar.slug } }],
      update: async (cache, { data }) => {
        const cachedData = cache.readQuery<ReviewQuery>({ query: ReviewDocument, variables: { reviewId: id } });
        if (!data) return;
        cache.writeQuery({
          query: ReviewDocument,
          variables: { reviewId: id },
          data: { review: { ...cachedData?.review, ...data.updateReviewVote } },
        });
        await refetch();
      },
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
  };

  const { positiveComment, negativeComment, body } = useMemo(() => {
    const { positiveComment, negativeComment, body } = props;
    let content: Pick<Props, "negativeComment" | "positiveComment" | "body"> = hasExpandedContent
      ? { positiveComment, negativeComment, body }
      : {
          positiveComment: undefined,
          negativeComment: undefined,
          body: undefined,
        };
    if (positiveComment && negativeComment) content = { ...content, positiveComment, negativeComment };
    else if (positiveComment) {
      content = { ...content, positiveComment };
      if (body) content = { ...content, body };
    } else if (negativeComment) {
      content = { ...content, negativeComment };
      if (body) content = { ...content, body };
    } else if (body) content = { ...content, body };
    return content;
  }, [props]);
  const userVote = useMemo(() => data?.me?.reviewVotes?.find(({ review }) => review.id === id), [data]);
  // const downVotes = useMemo(() => votes.filter(({ type: { value } }) => value === "downvote"), [votes]);
  const upVotes = useMemo(() => votes.filter(({ type: { value } }) => value === "upvote") || [], [votes]);
  const formattedTimestamp = useMemo(() => dayjs(timestamp).format("MM/DD/YYYY"), [timestamp]);

  const timestampComp = (
    <Text as="small" color="text.grey" fontSize="sm">
      {formattedTimestamp}
    </Text>
  );

  return (
    <Flex
      flexDir="column"
      justify="center"
      flexGrow={1}
      flexBasis={atBeach ? "unset" : undefined}
      position="relative"
      p={4}
      bg="white"
      borderRadius="regular"
      border="1.5px solid"
      borderColor="gray.300"
      overflow="hidden"
      {...container}
    >
      <Flex justify="space-between" align="flex-start">
        {atBeach || atDashboard ? (
          customer.user && (
            <Flex justify="center" gap={3}>
              <Account.Avatar src={customer.user.account?.imgUrl} />
              <Flex flexDir="column" justify="center" alignSelf="stretch">
                <Box fontWeight="semibold">{customer.user.fullName}</Box>
                {(visitType || month || atDashboard) && (
                  <Flex align="center" my="0.15em" fontSize="sm" color="gray.400">
                    <div>{visitType?.name}</div>
                    {visitType && month && <span className="bull">&bull;</span>}
                    {month && (
                      <div>
                        {month?.value} {dayjs(payment?.timestamp).year()}
                      </div>
                    )}
                    {visitType && month && atDashboard && <span className="bull">&bull;</span>}
                  </Flex>
                )}
                {atDashboard && timestampComp}
              </Flex>
            </Flex>
          )
        ) : (
          <BeachBar.Header as="h6">{beachBar.name}</BeachBar.Header>
        )}
        <RatingBox avgRating={ratingValue} />
      </Flex>
      <Flex flexDir="column" justify="center" gap={4} mt={4} mb={8} sx={{ "span:not(:only-child)": textOverlfow() }}>
        <Feedback isShown={!!positiveComment} positive>
          <span>{positiveComment}</span>
        </Feedback>
        <Feedback isShown={!!negativeComment}>
          <span>{negativeComment}</span>
        </Feedback>
        {body && <span>{body}</span>}
      </Flex>
      <Flex justify="flex-end" align="flex-end">
        {allowVoting && (
          <Flex
            align="center"
            gap={4}
            position="absolute"
            left={0}
            bottom={0}
            py={2}
            px={4}
            bg="gray.50"
            borderTopRightRadius="regular"
            boxShadow="inset -2px 2px 4px rgb(194 194 194 / 50%)"
            color="gray.400"
          >
            <Flex
              justify="center"
              align="center"
              gap={2}
              color={userVote?.type.value === "upvote" ? "brand.secondary" : undefined}
              onClick={async () => await handleClick("upvote")}
            >
              <Icon.Social.ThumbsUp.Filled boxSize="icon.lg" cursor="pointer" />
              <Text as="span" fontWeight="semibold">
                {upVotes.length}
              </Text>
            </Flex>
            <Flex
              justify="center"
              align="center"
              mt="6px"
              color={userVote?.type.value === "upvote" ? "brand.secondary" : undefined}
              onClick={async () => await handleClick("downvote")}
            >
              <Icon.Social.ThumbsDown.Filled boxSize="icon.lg" cursor="pointer" />
              {/* <span className="semibold">{downVotes.length}</span> */}
            </Flex>
          </Flex>
        )}
        {!atDashboard && (
          <>
            {atBeach ? (
              timestampComp
            ) : (
              <Next.Link link={{ href: { pathname: "/account/reviews/" + id } }}>
                <Button p={2}>Details</Button>
              </Next.Link>
            )}
          </>
        )}
      </Flex>
      {atDashboard && children}
    </Flex>
  );
};

Review.Feedback = Feedback;
Review.RatingBox = RatingBox;
Review.MainPage = MainPage;
Review.ContentEdit = ContentEdit;

Review.displayName = "BeachBarReview";
