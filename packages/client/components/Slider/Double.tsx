import { useClassnames } from "@hashtag-design-system/components";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./Double.module.scss";

// With the great help of -> https://www.youtube.com/watch?v=DfSYmk_6vk8

const DATALIST_ID = "list";

type MarkType = { value: number; label: string };

type OnChangeInfo = {
  values: {
    first: number;
    second: number;
  };
  marks?: {
    first: MarkType;
    second: MarkType;
  };
};

export type Props = {
  min: number;
  max: number;
  defaultValues?: [number, number];
  step?: number;
  minGap?: number;
  marks?: MarkType[];
  onChange?: (info: OnChangeInfo, e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Double: React.FC<Props & Pick<React.ComponentPropsWithoutRef<"div">, "className">> = ({
  min,
  max,
  defaultValues,
  step,
  minGap = 0,
  marks,
  onChange,
  ...props
}) => {
  const [firstValue, setFirstValue] = useState<OnChangeInfo["values"]["first"]>(min);
  const [secondValue, setSecondValue] = useState<OnChangeInfo["values"]["second"]>(max);
  const [classNames, rest] = useClassnames(styles.container + " w100", props);

  const getPercent = useCallback(
    (val: number) => +((((val - min) * 100) / (max - min)).toFixed(2)),
    [min, max]
  );

  const { percent1, percent2 } = useMemo(
    () => ({ percent1: getPercent(firstValue) + "%", percent2: getPercent(secondValue) + "%" }),
    [firstValue, secondValue, getPercent]
  );
  const { label1, label2 } = useMemo(() => {
    return {
      label1: marks?.find(({ value }) => value === firstValue)?.label,
      label2: marks?.find(({ value }) => value === secondValue)?.label,
    };
  }, [firstValue, secondValue, marks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, input: "first" | "second") => {
    const newVal = +(e.target.value);
    const arr = marks?.map(({ value }) => value);
    let nextVal =
      (step && newVal % step === 0) || !arr
        ? newVal
        : // https://stackoverflow.com/a/34747420/13142787
          arr.reduce((prev, curr) => (Math.abs(curr - newVal) <= Math.abs(prev - newVal) ? curr : prev));
    if (input === "first") {
      if (secondValue - newVal <= minGap) nextVal = secondValue - minGap;
      setFirstValue(nextVal);
    } else {
      if (newVal - firstValue <= minGap) nextVal = firstValue + minGap;
      setSecondValue(nextVal);
    }

    if (onChange) {
      const newFirstVal = input === "first" ? nextVal : firstValue;
      const newSecondVal = input === "second" ? nextVal : secondValue;

      onChange(
        {
          values: { first: newFirstVal, second: newSecondVal },
          marks: marks && {
            first: marks.find(({ value }) => value === newFirstVal)!,
            second: marks.find(({ value }) => value === newSecondVal)!,
          },
        },
        e
      );
    }
  };


  useEffect(() => {
    if (defaultValues?.[0]) setFirstValue(defaultValues[0]);
    if (defaultValues?.[1]) setSecondValue(defaultValues[1]);
  }, [defaultValues])

  return (
    <div
      className={classNames}
      {...rest}
      style={
        {
          "--percent1": percent1,
          "--percent2": percent2,
          ...rest.style,
        } as any
      }
    >
      <div className={styles.track + " border-radius--md w--inherit"} />
      <input
        className={styles.input + " w--inherit"}
        type="range"
        list={DATALIST_ID}
        value={firstValue}
        min={min}
        max={max}
        step={step}
        onChange={e => handleChange(e, "first")}
      />
      <output
        className={styles.thumb + " body-14 border-radius--md flex-row-center-center"}
        style={{ left: percent1, transform: `translateX(-${percent1})` }}
      >
        {label1}
      </output>
      <input
        className={styles.input + " w--inherit"}
        type="range"
        list={DATALIST_ID}
        value={secondValue}
        min={min}
        max={max}
        step={step}
        onChange={e => handleChange(e, "second")}
      />
      <output
        className={styles.thumb + " body-14 border-radius--md flex-row-center-center"}
        style={{ left: percent2, transform: `translateX(-${percent2})` }}
      >
        {label2}
      </output>
      {marks && (
        <datalist id={DATALIST_ID}>
          {marks.map(({ label }, i) => (
            <option key={"double_slider_tick_" + i}>{label}</option>
          ))}
        </datalist>
      )}
    </div>
  );
};

Double.displayName = "SliderDouble";
