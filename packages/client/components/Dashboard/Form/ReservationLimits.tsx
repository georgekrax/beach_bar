import Icons from "@/components/Icons";
import {
  useDeleteProductReservationLimitMutation,
  useUpdateProductReservationLimitMutation,
} from "@/graphql/generated";
import { LimitSelectedDates, ProductLimit } from "@/typings/beachBar";
import { genDatesArr } from "@/utils/data";
import { notify } from "@/utils/notify";
import { Button, Dialog, Input } from "@hashtag-design-system/components";
import { DAY_NAMES_ARR, MONTHS } from "@the_hashtag/common";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import range from "lodash/range";
import { useMemo, useState } from "react";
import styles from "./ReservationLimits.module.scss";

dayjs.extend(isBetween);

type InfoState = {
  calendarDate: Dayjs;
  isEdit: boolean;
  activeId?: string;
  deleteId?: string;
};

const MIN_ID = -1;
const MAX_ID = -100;
const DEFAULT_QUANTITY = 10;

const MIN_DATE = dayjs().startOf("date");
const MAX_DATE = MIN_DATE.month(MIN_DATE.month() + 6);

const CALENDAR_NOTES = [
  { text: "No limit", className: styles.item },
  { text: "Selected / clicked date", className: styles.item + " " + styles.isSelected },
  { text: "Assigned limit", className: styles.item + " " + styles.isAdded },
] as const;

type Props = {
  limits: ProductLimit[];
  setLimits: React.Dispatch<React.SetStateAction<ProductLimit[]>>;
  btnText: string;
};

export const ReservationLimits: React.FC<Props> = ({ limits, setLimits, btnText }) => {
  const [{ calendarDate, isEdit, activeId, deleteId }, setInfo] = useState<InfoState>({
    calendarDate: MIN_DATE,
    isEdit: false,
  });
  const [{ from, to }, setSelectedDates] = useState<LimitSelectedDates>({});
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY);
  const [isDialogShown, setIsDialogShown] = useState(false);

  const datesArr = useMemo(
    () => range(-calendarDate.startOf("month").day() + 1, calendarDate.daysInMonth() + 1),
    [calendarDate]
  );
  const sortedLimits = useMemo(
    () =>
      limits
        .filter(({ to }) => dayjs(to).isAfter(dayjs().add(1, "day").startOf("date")))
        .sort((a, b) => (a.from.isBefore(b.from) ? -1 : 1)),
    [limits]
  );
  const limitsDates = useMemo(() => limits.map(({ from, to }) => genDatesArr(from, to)).flat(), [limits]);

  const [updateReservationLimit] = useUpdateProductReservationLimitMutation();
  const [deleteReservationLimit] = useDeleteProductReservationLimitMutation();

  const parseDate = (date: Dayjs) => date.date() + " " + MONTHS[date.month()].substring(0, 3) + " " + date.year();

  const activeLimit = useMemo(() => limits.find(limit => limit.id === activeId), [limits, activeId]);
  const { formattedFrom, formattedTo } = useMemo(
    () => ({
      formattedFrom: from ? parseDate(from) : activeLimit && parseDate(activeLimit?.from),
      formattedTo: to ? parseDate(to) : activeLimit && parseDate(activeLimit?.to),
    }),
    [from, to, activeLimit]
  );

  const handleMonthChange = (type: "add" | "subtract") => {
    setInfo(({ calendarDate, ...rest }) => {
      const curMonth = calendarDate.month();
      return { ...rest, calendarDate: calendarDate.month(curMonth + (type === "add" ? 1 : -1)) };
    });
  };

  const handleBtnClick = async (newId: number | string) => {
    if (isEdit) {
      const selectedLimit = limits.find(limit => limit.id === activeId);
      if (!activeId || !selectedLimit) return notify("error", "");
      const newArr = limits.map(limit => (limit.id === activeId ? { ...limit, quantity } : limit));
      setLimits(newArr);
      setInfo(prev => ({ ...prev, activeId: undefined, isEdit: false }));
      if (selectedLimit.isNew) return;
      const { data, errors } = await updateReservationLimit({
        variables: { reservationLimitId: activeId, limit: quantity },
      });
      if (!data && errors) errors.forEach(({ message }) => notify("error", message));
    } else if (from && to && quantity) {
      setLimits(prev => [...prev, { id: newId.toString(), from, to, quantity, isNew: true }]);
    }
  };

  const handleEditClick = (limit: Pick<ProductLimit, "id" | "from">) => {
    setInfo({ calendarDate: limit.from, activeId: limit.id, isEdit: true });
    // Both from & to, because "selectedDate" state requires
    // setSelectedDates(limit);
  };

  const handleRemove = async (id: string) => {
    setIsDialogShown(true);
    setInfo(prev => ({ ...prev, deleteId: id }));
  };

  const handleClick = (date: Dayjs) => {
    const hasFirstDate = from !== undefined;
    const hasLastDate = to !== undefined;
    setSelectedDates(prev =>
      hasLastDate && hasFirstDate
        ? { from: undefined, to: undefined }
        : hasFirstDate
        ? { ...prev, to: date }
        : { from: date, to: undefined }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.month + " flex-row-space-between-center"}>
        <h6 className="semibold">
          {MONTHS[calendarDate.month()]}&nbsp;{calendarDate.year()}
        </h6>
        <div className="flex-row-center-center">
          <Button
            variant="secondary"
            disabled={calendarDate.isBefore(MIN_DATE.month(MIN_DATE.month() + 1), "month")}
            onClick={() => handleMonthChange("subtract")}
          >
            <Icons.Chevron.Down width={16} height={16} style={{ transform: "rotate(180deg)" }} />
          </Button>
          <Button
            variant="secondary"
            disabled={calendarDate.isAfter(MAX_DATE.month(MAX_DATE.month() - 1), "month")}
            onClick={() => handleMonthChange("add")}
          >
            <Icons.Chevron.Down width={16} height={16} />
          </Button>
        </div>
      </div>
      <div className={styles.dates + " text--grey text--center flex-row-space-between-center"}>
        {DAY_NAMES_ARR.map(({ id, long_abbreviation }) => (
          <div key={"week_day_" + id}>{long_abbreviation}</div>
        ))}
      </div>
      <div className={styles.availability + " flex-row-flex-start-flex-start flex--wrap"}>
        {datesArr.map(dateNum => {
          const date = calendarDate.date(dateNum);

          return (
            <div
              key={"date_" + dateNum}
              className={
                styles.item +
                ((from && to && date.isBetween(from, to, undefined, "[]")) || from?.isSame(date) || to?.isSame(date)
                  ? " text--white " + styles.isSelected
                  : "") +
                (limitsDates.some(limitDate => date.isSame(limitDate)) ? " text--white " + styles.isAdded : "") +
                " cursor--pointer flex-row-center-center"
              }
              onClick={() => handleClick(date)}
              style={{ visibility: dateNum >= 1 && dateNum <= calendarDate.daysInMonth() ? "visible" : "hidden" }}
            >
              {dateNum}
              {/* {date >= 1 && date <= dayjs().month(month).daysInMonth() ? date : dayjs().month(month - 1).daysInMonth() + date} */}
            </div>
          );
        })}
      </div>
      <div className={styles.calendarNote + " body-14 flex-row-flex-end-center"}>
        {CALENDAR_NOTES.map(({ text, className }, i) => (
          <div key={"note_" + i} className="flex-row-flex-start-inherit">
            <div className={className}></div>
            <div>=</div>
            <div>{text}</div>
          </div>
        ))}
      </div>
      {(activeId || (from && to)) && (
        <div className={styles.info} style={{ border: !from || !to ? "none" : undefined }}>
          <div className=" flex-row-space-between-center">
            <div className="flex-inherit-flex-start-flex-end">
              <div>
                From
                <div className="semibold">{formattedFrom}</div>
              </div>
              <span className="text--grey">&mdash;</span>
              <div>
                To
                <div className="semibold">{formattedTo}</div>
              </div>
            </div>
            <Input.Number
              label="Quantity"
              min={1}
              defaultValue={limits.find(({ id }) => id === activeId)?.quantity || DEFAULT_QUANTITY}
              onValue={newVal => setQuantity(newVal)}
            />
          </div>
          <div className={styles.confirm + " body-14"}>
            <div>
              You have <span className="semibold">{quantity}x</span> available products, for every day (from:{" "}
              {(activeLimit?.from || from)?.format("MM/DD/YYYY")}, to: {(activeLimit?.from || to)?.format("MM/DD/YYYY")}
              ), and every hour (from: 13:00, to: 15:00) of these days.
            </div>
            <Button
              variant="secondary"
              onClick={async () => await handleBtnClick(Math.floor(Math.random() * (MAX_ID - MIN_ID + 1) + MIN_ID))}
            >
              {isEdit ? (
                "Edit"
              ) : (
                <>
                  <Icons.Add width={16} height={16} /> {btnText}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      <div className={styles.limitsList}>
        {sortedLimits.map(({ id, from, to, quantity }) => (
          <div key={"limit_" + id} className={styles.limitItem + " flex-row-space-between-center"}>
            <div className="flex-inherit-flex-start-inherit">
              <span className="text--grey semibold">{quantity}x products</span>
              <div>{parseDate(from)}</div>
              &mdash;
              <div>{parseDate(to)}</div>
            </div>
            <div className={styles.editBtns + " flex-inherit-flex-start-inherit"}>
              <Button variant="secondary" onClick={() => handleEditClick({ id, from })}>
                <Icons.Edit width={14} height={14} />
              </Button>
              <Button variant="secondary" onClick={() => handleRemove(id)}>
                <Icons.Close width={14} height={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        isShown={isDialogShown}
        onDismiss={async (_, { cancel }) => {
          setInfo(prev => ({ ...prev, deleteId: undefined }));
          if (cancel) return setIsDialogShown(false);
          const selectedLimit = limits.find(({ id }) => id === deleteId);
          if (!deleteId || !selectedLimit) return notify("error", "");
          setLimits(prev => prev.filter(({ id }) => id !== deleteId));
          setInfo(prev => ({ ...prev, activeId: undefined, isEdit: false }));
          setIsDialogShown(false);
          if (selectedLimit.isNew) return;
          const { data, errors } = await deleteReservationLimit({ variables: { reservationLimitId: deleteId } });
          if (!data && errors) errors.forEach(({ message }) => notify("error", message));
          else notify("success", "Reservation limit has been removed.");
        }}
      >
        <Dialog.Content style={{ textAlign: "center" }}>
          <Dialog.Title>Are you sure you want to remove this reservation limit from the product?</Dialog.Title>
        </Dialog.Content>
        <Dialog.Btn.Group>
          <Dialog.Btn>Cancel</Dialog.Btn>
          <Dialog.Btn confirm>Delete</Dialog.Btn>
        </Dialog.Btn.Group>
      </Dialog>
    </div>
  );
};
