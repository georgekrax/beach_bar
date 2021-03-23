import { DATA } from "@/config/data";
import { useSearchContext } from "@/utils/contexts";
import { checkSearchDate } from "@/utils/search";
import { BottomSheet, DatePicker, Dialog, Input, TimePicker } from "@hashtag-design-system/components";
import { DAY_NAMES_ARR, MONTHS } from "@the_hashtag/common";
import dayjs, { Dayjs } from "dayjs";
import range from "lodash/range";
import { memo, useMemo } from "react";
import { SEARCH_ACTIONS, HANDLE_PEOPLE_CHANGE_PAYLOAD, SET_STATE_PAYLOAD } from "../reducer";
import { Item } from "./Item";
import { PickerAndLabel } from "./PickerAndLabel";
import styles from "./Rest.module.scss";

const { MIN_HOUR, MAX_HOUR } = DATA;
let { HOURS } = DATA;

export const Rest: React.FC = memo(() => {
  const { date, form, people, hourTime, dispatch } = useSearchContext();
  const { isTimePickerShown, isPeopleShown } = form;

  const timeInfo = useMemo(() => {
    const day = dayjs();
    const isSelectedToday = date?.isToday();
    let res = {
      minHour: MIN_HOUR,
      hour: HOURS.findIndex(hour => hour === day.hour(day.hour() + 1).hour()),
    };
    if (res.hour > HOURS.length - 1 || res.hour === -1) res = { ...res, hour: 0, minHour: MIN_HOUR };
    if (!isSelectedToday) return { ...res, hour: HOURS.findIndex(hour => hour === MIN_HOUR + 3) };
    else {
      HOURS = range(day.hour(), MAX_HOUR + 1);
      res = { ...res, minHour: day.hour() };
      const initialHourSlide = HOURS.findIndex(num => num === res.minHour + 1);
      if (initialHourSlide !== -1) res = { ...res, hour: initialHourSlide };
      return res;
    }
  }, [date]);
  const formattedPeople = useMemo(() => {
    if (people) {
      const { adults, children } = people;
      return (
        `${adults} ` +
        (adults === 1 ? "Adult" : "Adults") +
        (children ? `, ${children} ` + (children === 1 ? "Child" : "Children") : "")
      );
    } else return "1 Adult";
  }, [people]);
  const defaultDate = useMemo(() => (date ? checkSearchDate(date) : checkSearchDate(dayjs())), [date]);

  const setState = (newForm: Partial<SET_STATE_PAYLOAD["form"]>) =>
    dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { form: { ...form, ...newForm } } });

  const handleDateSelect = (newDate: Dayjs) => dispatch({ type: SEARCH_ACTIONS.HANDLE_DATE_SELECT, payload: { newDate } });

  const handlePeopleChange = (name: keyof HANDLE_PEOPLE_CHANGE_PAYLOAD, newVal: number) => {
    if ((name === "adults" && newVal !== people?.adults) || (name === "children" && newVal !== people?.children)) {
      dispatch({ type: SEARCH_ACTIONS.HANDLE_PEOPLE_CHANGE, payload: { [name]: newVal } });
    }
  };

  const handleHourTimeChange = (idx: number) =>
    dispatch({ type: SEARCH_ACTIONS.HANDLE_HOUR_TIME_CHANGE, payload: { newHour: HOURS[idx] } });

  return (
    <>
      <Item
        before={
          <PickerAndLabel label="Date">
            <DatePicker
              selectBtn={({ selectedDate }) => {
                const selected = selectedDate[0];
                const month = useMemo(() => MONTHS[selected.month()], [selected]);
                const dayObj = useMemo(() => DAY_NAMES_ARR[selected.day()], [selected]);
                return (
                  <summary className="header-6">
                    {dayObj.name.substr(0, 3) + " " + selected.date() + ", " + month.substr(0, 3)}
                  </summary>
                );
              }}
              onChange={({ selectedDate }) => {
                const newDate = selectedDate[0];
                if (!newDate.isSame(defaultDate)) handleDateSelect(newDate);
              }}
              disabledDays={{ days: [], from: { date: checkSearchDate(dayjs()).startOf("day") } }}
              defaultDates={[defaultDate]}
            />
          </PickerAndLabel>
        }
        picker={{
          label: "Time",
          className: styles.time + (!hourTime ? " " + styles.grey : ""),
          content: hourTime ? `${hourTime?.toString().padStart(2, "0")}:00` : "Optional",
          onClick: () => setState({ isTimePickerShown: true }),
        }}
      >
        <TimePicker
          bottomSheetProps={{
            isShown: isTimePickerShown,
            allowedPositions: { expanded: false, middle: true, hidden: true, "input-focused": true },
            onDismiss: () => setState({ isTimePickerShown: false }),
          }}
        >
          <TimePicker.Content showLabels={{ hasHours: true, hasMinutes: false, hasSeconds: false }}>
            <TimePicker.Hours
              min={timeInfo.minHour}
              max={MAX_HOUR + 1}
              loop={false}
              initialSlide={timeInfo.hour}
              onSlideChange={swiper => handleHourTimeChange(swiper.realIndex)}
            />
          </TimePicker.Content>
        </TimePicker>
      </Item>
      <Item picker={{ label: "People", content: formattedPeople, onClick: () => setState({ isPeopleShown: true }) }}>
        <BottomSheet isShown={isPeopleShown} onDismiss={() => setState({ isPeopleShown: false })}>
          {({ dismiss }) => (
            <div className="flex-column-center-flex-start">
              <div className={styles.peopleHeader + " dialog__content w-100 flex-row-space-between-center"}>
                <div>People</div>
                <div className="link header-6" onClick={async () => await dismiss()}>
                  Done
                </div>
              </div>
              <Dialog.Content className="w-100 flex-column-center-stretch">
                <div className={styles.peopleFrame + " flex-row-space-between-center"}>
                  <div className="flex-row-center-center">
                    <span className="header-5 semibold">{people?.adults || 1}</span>
                    <div className="flex-column-center-flex-start">
                      <div>{true ? "Adults" : "Adult"}</div>
                      <span className="d--ib">12 years old &amp; more</span>
                    </div>
                  </div>
                  <Input.IncrDcr defaultValue={1} min={1} max={12} onValue={val => handlePeopleChange("adults", val)} />
                </div>
                <div className={styles.peopleFrame + " flex-row-space-between-center"}>
                  <div className="flex-row-center-center">
                    <span className="header-5 semibold">{people?.children ?? 0}</span>
                    <div className="flex-column-center-flex-start">
                      <div>{true ? "Children" : "Child"}</div>
                      <span className="d--ib">Less than 12 years old</span>
                    </div>
                  </div>
                  <Input.IncrDcr
                    defaultValue={0}
                    min={0}
                    max={8}
                    onValue={val => handlePeopleChange("children", val)}
                  />
                </div>
              </Dialog.Content>
            </div>
          )}
        </BottomSheet>
      </Item>
    </>
  );
});
