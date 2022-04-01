import Next from "@/components/Next";
import Search from "@/components/Search";
import { BeachBar, useAvailableHoursQuery } from "@/graphql/generated";
import { useSearchContext } from "@/utils/contexts";
import { Button, Flex } from "@hashtag-design-system/components";
import { useRouter } from "next/router";
import { useMemo, useRef } from "react";

// const PEOPLE_ICON_SIZES = { width: 20, height: 20 };

type Props = {
  bg?: "blue" | "white";
  beachBarId: BeachBar["id"];
};

export const SearchInfo: React.FC<Props> = ({ beachBarId }) => {
  const { pathname, ...router } = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    _query: { date, time },
  } = useSearchContext();

  const { data } = useAvailableHoursQuery({
    skip: !date,
    variables: { beachBarId, date: date?.toString() || "" },
  });

  // TODO: Revisit | Does not work as expected
  const groupedTimes = useMemo(() => {
    const diff = time.end - time.start;
    const arr = data?.availableHours?.map(({ value }) => +value) || [];

    // https://stackoverflow.com/a/47906920/13142787
    return arr.reduce((r, n) => {
      const lastSubArr = r[r.length - 1];
      const diffBetweenNums = lastSubArr && n - lastSubArr[lastSubArr.length - 1] > 1;
      const isMoreThanDiff = n - (lastSubArr?.[0] || n) > diff;

      if (!lastSubArr || diffBetweenNums || isMoreThanDiff) {
        r.push(isMoreThanDiff && !diffBetweenNums ? [n - 1] : []);
      }
      r[r.length - 1].push(n);
      return r;
    }, [] as number[][]);
  }, [data?.availableHours.length, data?.availableHours[0]?.id, time.start, time.end]);

  return (
    <Flex align="flex-start" gap={6} mt={12} mb={6}>
      <Search.Box
        atBeach
        input={false}
        width="auto"
        minWidth="45%"
        height={68}
        flexShrink={1}
        borderRadius="regular"
        bg="teal.50"
        boxShadow="0 2px 6px 1px rgb(0 0 0 / 8%)"
      />
      <Flex gap={3} wrap="wrap" ref={containerRef} maxWidth={{ xl: "40%" }}>
        {groupedTimes.map((arr, i) => {
          const { start, end } = { start: arr[0], end: arr.length === 1 ? arr[0] + 1 : arr[arr.length - 1] };
          const isSelected = time && start >= time.start && end <= time.end;
          return (
            <Next.Link
              key={i}
              display="flex"
              _hover={{ opacity: 1 }}
              link={{
                replace: true,
                shallow: true,
                prefetch: false,
                href: { pathname, query: { ...router.query, time: start + "_" + end } },
              }}
            >
              <Button
                py={2}
                px={3}
                boxShadow="none"
                border="1px solid"
                borderColor="gray.200"
                bg={isSelected ? "gray.200" : "transparent"}
                color="text.grey"
                borderRadius="full"
                fontSize="xs"
                _hover={{ bg: "gray.200" }}
              >
                {start.toString().padStart(2, "0")}:00 &ndash; {end.toString().padEnd(2, "0")}:00
              </Button>
            </Next.Link>
          );
        })}
      </Flex>
    </Flex>
    // <div className={styles.header + " " + (bg === "white" ? styles.white : styles.blue) + " text--grey"}>
    //   {true ? (
    //     <div className="flex-row-flex-start-center">
    //       {/* <div>{formattedSearchDate}</div> */}
    //       <div>{formatDateShort(dayjs())}</div>
    //       {/* {hourTime && ( */}
    //       <>
    //         <div className={styles.bull}>&bull;</div>
    //         <div>{formatHourTime(13)}</div>
    //       </>
    //       {/* )} */}
    //       {/* {totalPeople > 0 && ( */}
    //       <>
    //         <div className={styles.bull}>&bull;</div>
    //         <div className="flex-row-center-center">
    //           <div>{totalPeople || 5}</div>
    //           {totalPeople > 1 ? (
    //             <Icons.People.Filled {...PEOPLE_ICON_SIZES} />
    //           ) : (
    //             <Icons.UserAvatar {...PEOPLE_ICON_SIZES} style={{ x: "-15%" }} />
    //           )}
    //         </div>
    //       </>
    //       {/* )} */}
    //     </div>
    //   ) : (
    //     <Search.Box />
    //   )}
    // </div>
  );
};

SearchInfo.displayName = "BeachBarSearchInfo";
