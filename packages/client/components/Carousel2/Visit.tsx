import BeachBar from "@/components/BeachBar";
import Icons from "@/components/Icons";
import Next from "@/components/Next";
import { PaymentsQuery } from "@/graphql/generated";
import { useIsDevice } from "@/utils/hooks";
import { BottomSheet, DatePicker, Dialog, Select, useClassnames } from "@hashtag-design-system/components";
import { DAY_NAMES_ARR } from "@the_hashtag/common";
import dayjs, { Dayjs } from "dayjs";
import isToday from "dayjs/plugin/isToday";
import minMax from "dayjs/plugin/minMax";
import range from "lodash/range";
import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { memo, useMemo, useState } from "react";
import styles from "./Visit.module.scss";

dayjs.extend(minMax);
dayjs.extend(isToday);

type Props = {
  beachBar: Pick<PaymentsQuery["payments"][number]["beachBar"], "name" | "thumbnailUrl" | "location">;
};

export const Visit: React.FC<
  Props & Pick<PaymentsQuery["payments"][number], "visits"> & Pick<React.ComponentPropsWithoutRef<"div">, "className">
> = memo(
  ({
    visits,
    beachBar: {
      name,
      thumbnailUrl,
      location: { city, region },
    },
    ...props
  }) => {
    const router = useRouter();
    const [{ isShown, selectedDate }, setState] = useState<{ isShown: boolean | "none"; selectedDate?: Dayjs }>({
      isShown: false,
      selectedDate: undefined,
    });
    const [classNames, rest] = useClassnames(styles.container + " h--inherit flex-column-flex-start-flex-start", props);
    const { isDesktop } = useIsDevice();

    const goTo = (refCode: string) => router.push({ pathname: "trips/" + refCode });

    const filterVisits = (dateToCheck?: Dayjs) => {
      return visits.filter(({ date }) => dayjs(date).date() === dateToCheck?.date());
    };

    const { dates, uniqVisits } = useMemo(() => {
      let parsedVisits = visits.map(({ date, ...rest }) => ({ ...rest, date: dayjs(date) }));
      const maxDate = dayjs.max(parsedVisits.map(({ date }) => date));
      parsedVisits = parsedVisits.filter(
        ({ date }) => date.month() === maxDate.month() && date.year() === maxDate.year()
      );
      return {
        dates: parsedVisits.map(({ date }) => date),
        uniqVisits: uniqBy(parsedVisits, "date"),
      };
    }, [visits]);
    const { minDay, maxDay } = useMemo(() => ({ minDay: dayjs.min(dates), maxDay: dayjs.max(dates) }), [dates]);
    const betweenDates = useMemo(() => {
      const restDays = range(minDay.date(), maxDay.date()).filter(date => !dates.map(day => day.date()).includes(date));
      return restDays.map(day => dayjs().date(day).month(maxDay.month()).year(maxDay.year()));
    }, [dates, minDay, maxDay]);
    const { filteredVisits, visitsTimes } = useMemo(() => {
      const filtered = filterVisits(selectedDate);
      return {
        filteredVisits: filtered,
        visitsTimes: filtered.map(
          ({ startTime, endTime }) => startTime.value.slice(0, -3) + " - " + endTime.value.slice(0, -3)
        ),
      };
    }, [selectedDate]);

    const hasSameRefCodes = (arr: typeof visits) => {
      const refCodes = uniq(arr.map(({ payment }) => payment.refCode));
      return { bool: refCodes.length <= 1, refCode: refCodes[0] };
    };

    const handleDateSelect = (selectedDate: Dayjs) => {
      const { bool, refCode } = hasSameRefCodes(filterVisits(selectedDate));
      setState(prev => ({ ...prev, selectedDate }));
      if (bool) goTo(refCode);
      else setState(prev => ({ ...prev, isShown: isDesktop ? "none" : true }));
    };

    const handleDetailsClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const { bool, refCode } = hasSameRefCodes(visits);
      // if (minDay.date() !== maxDay.date() && bool) return;
      if (minDay.date() !== maxDay.date()) return;
      e.preventDefault();
      setState(prev => ({ ...prev, selectedDate: minDay }));
      if (filterVisits(minDay).length <= 1 || bool) goTo(refCode);
      else setState(prev => ({ ...prev, isShown: true }));
    };

    return (
      <div className={classNames} {...rest}>
        <div className={styles.imgContainer + " w100"}>
          <Image src={thumbnailUrl} width={240} height={160} objectFit="cover" objectPosition="center" layout="fixed" />
        </div>
        <div className={styles.content + " w100 h100 flex-column-space-between-flex-start"}>
          <BeachBar.NameAndLocation
            showLocationIcon={false}
            name={name}
            city={city.name}
            region={region?.name}
            formattedLocation=""
          />
          <div className="flex-column-center-flex-start" style={{ alignSelf: "flex-end" }}>
            <DatePicker
              className={styles.datePicker}
              allowedModes={{ calendar: true, months: false, years: false }}
              disabledDays={{ days: betweenDates, from: { date: minDay }, till: { date: maxDay } }}
              defaultDates={dates.some(date => date.isToday()) ? undefined : []}
              defaultCalendarDate={maxDay}
              selectBtn={
                <Select.Button onClick={e => handleDetailsClick(e)} style={{ width: "auto" }}>
                  Details
                </Select.Button>
              }
              onClick={({ selectedDate }) => handleDateSelect(selectedDate)}
            />
            <Select
              mobileView={false}
              className={styles.select}
              open={isShown === true}
              onDismiss={() => isDesktop && setState(prev => ({ ...prev, isShown: isShown === "none" }))}
              onSelect={() => setState(prev => ({ ...prev, isShown: false }))}
            >
              <Select.Button className="id--none" />
              {isDesktop ? (
                <Select.Modal>
                  <Next.TimePicker
                    arr={visitsTimes}
                    btn={{
                      onClick: () => {
                        setState(prev => ({ ...prev, isShown: false }));
                        goTo(hasSameRefCodes(filteredVisits).refCode);
                      },
                    }}
                  />
                </Select.Modal>
              ) : (
                <BottomSheet
                  hugContentsHeight
                  isShown={isShown === true}
                  className={styles.select__bottomSheet}
                  onDismiss={() => setState(prev => ({ ...prev, isShown: false }))}
                >
                  {({ dismiss }) => (
                    <div>
                      <BottomSheet.ScrollBar />
                      <Dialog.Content>
                        <Next.TimePicker
                          arr={visitsTimes}
                          btn={{
                            onClick: async () => {
                              await dismiss();
                              goTo(hasSameRefCodes(filteredVisits).refCode);
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
        <div className={styles.dates + " w100"}>
          <ul className="scrollbar">
            {uniqVisits.map(({ date, isUpcoming, isRefunded }) => (
              <li key={"visit_" + date} className={styles.dateItem + " flex-row-space-between-center"}>
                <div className="flex-row-flex-start-center">
                  <Icons.Chevron.Right width={8} height={8} />
                  <span className="semibold">
                    {DAY_NAMES_ARR[date.day()].name} {date.date()}
                  </span>
                </div>
                {isRefunded ? (
                  <span className="body-12 semibold ierror">Cancelled</span>
                ) : isUpcoming ? (
                  <span className="body-12 semibold">Upcoming</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
);
