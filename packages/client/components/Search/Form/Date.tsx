import { Label } from "@/components/Search/Box/Label";
import { useSearchFormContext } from "@/utils/contexts";
import { useIsDevice } from "@/utils/hooks";
import { checkSearchDate, formatDateShort } from "@/utils/search";
import { DatePicker, Flex, Select } from "@hashtag-design-system/components";
import dayjs from "dayjs";
import { memo, useMemo } from "react";
import { Time } from "./Time";

export const Date: React.FC = memo(() => {
  const { isDesktop } = useIsDevice();
  const { date, atBeach, handleDateSelect } = useSearchFormContext();

  const maxMonth = dayjs().month(8);
  const minDate = useMemo(() => checkSearchDate().startOf("day"), []);

  return (
    <DatePicker
      allowedModes={{ calendar: true, months: true, years: false }}
      modal={{
        align: atBeach ? "left" : "center",
        sx: { ".select-options > div": { display: "flex", flexDirection: "column" } },
      }}
      selectBtn={({ selectedDate }) => {
        const formattedDate = formatDateShort(checkSearchDate(date || selectedDate[0]).startOf("day"));
        return (
          <Select.Btn sx={atBeach ? { py: "0px !important", px: "0px !important" } : undefined}>
            {isDesktop ? <Label label="Date" value={formattedDate} /> : formattedDate}
          </Select.Btn>
        );
      }}
      onClick={({ selectedDate: newDate }) => handleDateSelect(newDate)}
      disabledDays={{
        from: { date: minDate },
        till: { date: maxMonth.date(maxMonth.daysInMonth()) },
      }}
      defaultDates={date ? [date] : [minDate]}
    >
      {/* <span className={styles.divider + " d--block border-radius--md w100"} /> */}
      <Flex
        justifyContent="center"
        mx={-3}
        mt={-1}
        mb={1}
        py={3}
        px={1}
        bg="gray.50"
        order={-1}
        boxShadow="inset 0 -2px 4px 0 rgba(0 0 0 / 6%)"
      >
        <Time />
      </Flex>
    </DatePicker>
  );
});

Date.displayName = "SearchFormDate";
