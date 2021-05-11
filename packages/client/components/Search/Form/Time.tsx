<<<<<<< HEAD
import { DATA } from "@/config/data";
import { useSearchContext } from "@/utils/contexts";
import { TimePicker } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import range from "lodash/range";
import { useMemo } from "react";
import { SEARCH_ACTIONS } from "../index";

const { MIN_HOUR, MAX_HOUR } = DATA;
let { HOURS } = DATA;

type Props = {};

export const Time: React.FC<Props> = () => {
  const { date, form, dispatch } = useSearchContext();

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

  const handleHourTimeChange = (idx: number) =>
    dispatch({ type: SEARCH_ACTIONS.HANDLE_HOUR_TIME_CHANGE, payload: { newHour: HOURS[idx] } });

  return (
    <TimePicker
      bottomSheetProps={{
        isShown: form.isTimePickerShown,
        allowedPositions: { expanded: false, middle: true, hidden: true, "input-focused": true },
        onDismiss: () =>
          dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { form: { ...form, isTimePickerShown: false } } }),
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
  );
};

Time.displayName = "SearchFormTime";
=======
import { DATA } from "@/config/data";
import { useSearchContext } from "@/utils/contexts";
import { TimePicker } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import range from "lodash/range";
import { useMemo } from "react";
import { SEARCH_ACTIONS } from "../index";

const { MIN_HOUR, MAX_HOUR } = DATA;
let { HOURS } = DATA;

type Props = {};

export const Time: React.FC<Props> = () => {
  const { date, form, dispatch } = useSearchContext();

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

  const handleHourTimeChange = (idx: number) =>
    dispatch({ type: SEARCH_ACTIONS.HANDLE_HOUR_TIME_CHANGE, payload: { newHour: HOURS[idx] } });

  return (
    <TimePicker
      bottomSheetProps={{
        isShown: form.isTimePickerShown,
        allowedPositions: { expanded: false, middle: true, hidden: true, "input-focused": true },
        onDismiss: () =>
          dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { form: { ...form, isTimePickerShown: false } } }),
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
  );
};

Time.displayName = "SearchFormTime";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
