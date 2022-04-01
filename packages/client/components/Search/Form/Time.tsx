import { SliderDoubleProps } from "@/components/Slider";
import { DATA } from "@/config/data";
import { useSearchFormContext } from "@/utils/contexts";
import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  useRangeSliderContext,
} from "@hashtag-design-system/components";
import dayjs from "dayjs";
import range from "lodash/range";
import { useEffect, useMemo } from "react";

const { MIN_HOUR, MAX_HOUR } = DATA;

type TimeInfo = {
  min: number;
  max: number;
  defaultValues: [number, number];
  hoursRange: Required<SliderDoubleProps["marks"]>;
};

export const Time: React.FC = () => {
  const { date, time, handleTimeChange } = useSearchFormContext();

  const { min, max, defaultValues, hoursRange }: TimeInfo = useMemo(() => {
    let diff = time?.start && time.end ? time.end - time.start : 3;
    let res: TimeInfo = {
      min: MIN_HOUR,
      max: MAX_HOUR,
      defaultValues: [time?.start ?? MIN_HOUR + 2, time?.end ?? MIN_HOUR + 2 + diff],
      hoursRange: [],
    };

    if (date?.isToday()) {
      let newMin = dayjs().hour() + 1;
      if (newMin < MIN_HOUR) newMin = MIN_HOUR;
      res = { ...res, min: newMin, defaultValues: [newMin, newMin + diff] };
    }
    // if (query) {
    //   const [starting, ending] = query.time?.toString().split("_") || [];
    //   res = { ...res, defaultValues: [+starting || res.defaultValues[0], +ending || res.defaultValues[1]] };
    // }
    if (res.defaultValues[1] > MAX_HOUR) res = { ...res, defaultValues: [res.defaultValues[0], MAX_HOUR] };
    return {
      ...res,
      // + 1 due to the default functionality of lodash's range()
      hoursRange: range(res.min, res.max + 1).map(value => ({
        value,
        label: value.toString().padStart(2, "0") + ":00",
      })),
    };
  }, [date, time?.start, time?.end]);

  useEffect(() => {
    if (!time?.start || !time?.end) handleTimeChange(defaultValues);
  }, [defaultValues[0], defaultValues[1]]);

  return (
    <RangeSlider
      aria-label={["Earliest booking time", "Latest booking time"]}
      min={min}
      max={max}
      defaultValue={defaultValues}
      onChange={handleTimeChange}
      colorScheme="orange"
      maxWidth="80%"
      minHeight={28 / 16 + "rem"}
      step={1}
      minStepsBetweenThumbs={1}
    >
      <RangeSliderTrack>
        <RangeSliderFilledTrack />
      </RangeSliderTrack>
      <SliderThumb index={0} />
      <SliderThumb index={1} />
    </RangeSlider>
  );

  // return (
  //   <Slider.Double
  //     min={min}
  //     max={max}
  //     defaultValues={defaultValues}
  //     step={1}
  //     minGap={1}
  //     // className={styles.timeSlider}
  //     onChange={({ values }) => handleChange(values)}
  //     marks={hoursRange}
  //   />
  // );

  // return (
  // <TimePicker
  //   bottomSheetProps={{
  //     isShown: form.isTimePickerShown,
  //     allowedPositions: { expanded: false, middle: true, hidden: true, "input-focused": true },
  //     onDismiss: () =>
  //       dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { form: { ...form, isTimePickerShown: false } } }),
  //   }}
  // >
  //   <TimePicker.Content showLabels={{ hasHours: true, hasMinutes: false, hasSeconds: false }}>
  //     <TimePicker.Hours
  //       min={timeInfo.minHour}
  //       max={MAX_HOUR + 1}
  //       loop={false}
  //       initialSlide={timeInfo.hour}
  //       onSlideChange={swiper => handleHourTimeChange(swiper.realIndex)}
  //     />
  //   </TimePicker.Content>
  // </TimePicker>
  // );
};

Time.displayName = "SearchFormTime";

const SliderThumb: React.FC<{ index: 0 | 1 }> = ({ index }) => {
  const {
    state: { value },
  } = useRangeSliderContext();

  const isLeft = index === 1;
  const timeVal = value[isLeft ? value.length - 1 : 0];
  const formattedValue = timeVal ? timeVal.toString().padStart(2, "0") + ":00" : null;

  return (
    <RangeSliderThumb
      index={index}
      width="auto"
      height="auto"
      py={0.5}
      px={1.5}
      bg="orange.500"
      color="white"
      fontSize="sm"
      borderLeftRadius={isLeft ? 0 : undefined}
      borderRightRadius={!isLeft ? 0 : undefined}
      sx={{ transform: "translateY(-50%) !important" }}
    >
      {formattedValue}
    </RangeSliderThumb>
  );
};
