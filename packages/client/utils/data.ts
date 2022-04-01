import { GetAllBeachBarsDocument, GetAllBeachBarsQuery } from "@/graphql/generated";
import { initializeApollo } from "@/lib/apollo";
import dayjs, { Dayjs } from "dayjs";
import { BeachQueryParams } from "@/typings/beachBar";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ParsedUrlQuery } from "querystring";

dayjs.extend(isSameOrBefore);

type IsElemVisibleParams = {
  ref: HTMLElement;
  windowWidth: number;
  includeElemWidth?: boolean;
  parent: {
    closest: string;
    offset?: number;
    useClosestOffsetLeft?: boolean;
  };
};

export const getBeachBarStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query<GetAllBeachBarsQuery>({ query: GetAllBeachBarsDocument });

  return { paths: data.getAllBeachBars.map(({ slug }) => ({ params: { slug: [slug] } })), fallback: true };
};

export const isElemVisible = ({
  ref,
  windowWidth,
  includeElemWidth = true,
  parent: { closest, offset = 0, useClosestOffsetLeft = false },
}: IsElemVisibleParams) => {
  const { bottom, right, left, top, width } = ref.getBoundingClientRect();
  const parentElem = ref.closest(closest) as HTMLElement | undefined;
  if (!parentElem) throw new Error("Invalid `closest` parent");

  const parentRect = ref.closest(closest)?.getBoundingClientRect();
  const newOffset = offset ? offset : useClosestOffsetLeft ? parentElem.offsetLeft : 0;

  const leftBool = left - newOffset < windowWidth - (includeElemWidth ? width : 0);
  const rightBool = right - width >= (parentRect?.left || 0);
  const bool =
    bottom > 0 &&
    right > 0 &&
    leftBool &&
    top < (window.innerHeight || document.documentElement.clientHeight) &&
    // TODO: Change later if it does not work for carousel
    ref.offsetTop >= parentElem.scrollTop &&
    ref.offsetTop + ref.offsetHeight <= parentElem.scrollTop + parentElem.offsetHeight &&
    rightBool;

  return bool;
};

export const extractBeachQuery = (
  query: ParsedUrlQuery
): Pick<BeachQueryParams, "slug" | "secondParam" | "availability"> => {
  const secondParam = query.slug?.[1];
  const date = query.date;
  const time = query.time;
  return {
    slug: query.slug?.[0] || "",
    secondParam,
    availability:
      date && time
        ? {
            date: date.toString(),
            startTimeId: time.toString().split("_")[0],
            endTimeId: time.toString().split("_")[1],
            adults: 1,
            children: undefined,
          }
        : null,
  };
};

export const genDatesArr = (from: Dayjs, to: Dayjs): Dayjs[] => {
  const dates: typeof from[] = [];
  while (from.isSameOrBefore(to)) {
    dates.push(from);
    from = from.set("date", from.date() + 1);
  }
  return dates;
};
