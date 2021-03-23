import Next from "@/components/Next";
import { Payment, Visit as VisitGraphQL } from "@/graphql/generated";
import {
  BottomSheet,
  DatePicker,
  Dialog,
  Select,
  useClassnames,
  useHasMounted,
  useIsMobile,
} from "@hashtag-design-system/components";
import { DAY_NAMES_ARR } from "@the_hashtag/common";
import dayjs, { Dayjs } from "dayjs";
import isToday from "dayjs/plugin/isToday";
import minMax from "dayjs/plugin/minMax";
import { HTMLMotionProps, motion } from "framer-motion";
import range from "lodash/range";
import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { useCarouselItem } from "../../utils/hooks";
import BeachBar from "../BeachBar";
import Icons from "../Icons";
import { CarouselItemProps } from "./index";
import styles from "./Visit.module.scss";

dayjs.extend(minMax);
dayjs.extend(isToday);

type Options = {
  beachBar: { id: string; name: string; city: string; region?: string };
  showBookmark?: boolean;
};

type Props = {
  active?: boolean;
  visits: (Pick<VisitGraphQL, "date" | "isUpcoming" | "isRefunded"> & { payment: Pick<Payment, "refCode"> } & {
    hour: VisitGraphQL["time"]["value"];
  })[];
} & Options;

type FProps = Props & Omit<CarouselItemProps, "beachBar" | "id"> & Omit<HTMLMotionProps<"div">, "id">;

export const Visit = React.forwardRef<HTMLDivElement, FProps>(
  (
    {
      idx,
      visits,
      active = false,
      imgProps,
      beachBar: { id, name, city, region },
      showFavourite: showBookmark = true,
      ...props
    },
    ref
  ) => {
    const [isShown, setIsShown] = useState<boolean | "none">(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs>();

    const [classNames, rest] = useClassnames(styles.container, props);
    const [hasMounted] = useHasMounted();
    const { isMobile } = useIsMobile();
    const [scale] = useCarouselItem({ active });
    const router = useRouter();

    // const dates = useMemo(() => [...visits.map(({ date }) => dayjs(date)), dayjs("2021-02-28")], [visits]);
    const dates = useMemo(() => visits.map(({ date }) => dayjs(date)), [visits]);
    const minDay = useMemo(() => dayjs.min(dates), [dates]);
    const maxDay = useMemo(() => dayjs.max(dates), [dates]);
    const betweenDates = useMemo(() => {
      const restDays = range(minDay.date(), maxDay.date()).filter(date => !dates.map(day => day.date()).includes(date));
      return restDays.map(day => dayjs().date(day).month(maxDay.month()).year(maxDay.year()));
    }, [dates, minDay, maxDay]);

    const goTo = (refCode: string) => router.push({ pathname: `trips/${refCode}` });

    const genParsed = (dateToCheck?: Dayjs) => visits.filter(({ date }) => dayjs(date).date() === dateToCheck?.date());

    const hasSameRefCodes = (arr: typeof visits) => {
      const refCodes = uniq(arr.map(({ payment }) => payment.refCode));
      return { bool: refCodes.length <= 1, refCode: refCodes[0] };
    };

    const handleDaySelect = (dayInCalendar: Dayjs) => {
      const { bool, refCode } = hasSameRefCodes(genParsed(dayInCalendar));
      setSelectedDate(dayInCalendar);
      if (bool) goTo(refCode);
      else setTimeout(() => setIsShown(!isMobile ? "none" : true), isMobile ? 500 : 0);
    };

    const handleDetailsClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const { bool, refCode } = hasSameRefCodes(visits);
      // if (minDay.date() !== maxDay.date() && bool) return;
      if (minDay.date() !== maxDay.date()) return;
      e.preventDefault();
      setSelectedDate(minDay);
      if (genParsed(minDay).length <= 1 || bool) goTo(refCode);
      else setTimeout(() => setIsShown(true), 250);
    };

    const parsed = genParsed(selectedDate);
    const timesParsed = genParsed(selectedDate).map(({ hour }) => hour);

    return (
      <motion.div
        className={classNames}
        key={"beach_bar_visit_" + id}
        animate={{ scale }}
        transition={{ duration: hasMounted ? 0.2 : 0.6, ease: "easeOut" }}
        ref={ref}
        data-id={idx}
        {...rest}
      >
        <div className={styles.imgContainer}>
          <Image width={240} height={160} objectFit="cover" objectPosition="center" {...imgProps} layout="fixed" />
        </div>
        <div className={styles.content + " w-100 flex-column-flex-start-flex-start"}>
          <BeachBar.NameAndLocation name={name} city={city} region={region} />
          <div className="flex-column-center-flex-start" style={{ alignSelf: "flex-end" }}>
            <DatePicker
              className="account__date-picker"
              allowedModes={{ calendar: true, months: false, years: false }}
              disabledDays={{
                days: betweenDates,
                from: { date: minDay },
                till: { date: maxDay },
              }}
              defaultDates={dates.some(date => date.isToday()) ? undefined : []}
              defaultCalendarDate={maxDay}
              selectBtn={
                <Select.Button onClick={e => handleDetailsClick(e)} style={{ width: "auto" }}>
                  Details
                </Select.Button>
              }
              onClick={({ dayInCalendar }) => handleDaySelect(dayInCalendar)}
            />
            <Select
              mobileView={false}
              className="account__select-container"
              open={isShown}
              onDismiss={() => !isMobile && setIsShown(isShown === "none")}
              onSelect={() => setIsShown(false)}
              data-ismobile={isMobile}
              {...rest}
            >
              <Select.Button className="id--none" />
              {!isMobile ? (
                <Select.Modal>
                  <Next.TimePicker
                    arr={timesParsed}
                    btn={{
                      onClick: () => {
                        setIsShown(false);
                        goTo(hasSameRefCodes(parsed).refCode);
                      },
                    }}
                  />
                </Select.Modal>
              ) : (
                <BottomSheet
                  className="account__select-container--bottom-sheet"
                  hugContentsHeight
                  isShown={isShown === true}
                  onDismiss={() => setIsShown(false)}
                >
                  {({ dismiss }) => (
                    <div>
                      <BottomSheet.ScrollBar />
                      <Dialog.Content>
                        <Next.TimePicker
                          arr={timesParsed}
                          btn={{
                            onClick: async () => {
                              await dismiss();
                              goTo(hasSameRefCodes(parsed).refCode);
                            },
                          }}
                        />
                      </Dialog.Content>
                    </div>
                  )}
                </BottomSheet>
              )}
            </Select>
          </div>
        </div>
        <div className={styles.datesContainer + " w-100"}>
          <ul className="scrollbar">
            {uniqBy(visits, "date").map(({ date, isUpcoming, isRefunded }) => (
              <li key={"visit_" + date} className={styles.date + " flex-row-space-between-center"}>
                <div className="flex-row-flex-start-center">
                  <Icons.Chevron.Right width={8} height={8} />
                  <span className="semibold">
                    {DAY_NAMES_ARR[dayjs(date).day()].name} {dayjs(date).date()}
                  </span>
                </div>
                {isRefunded ? (
                  <span className="body-12 ierror">Cancelled</span>
                ) : (
                  isUpcoming && <span className="body-12">Upcoming</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  }
);

Visit.displayName = "CarouselVisit";
