import Search from "@/components/Search";
import { useSearchContext } from "@/utils/contexts";
import { formatHourTime, formatPeople } from "@/utils/search";
import { BottomSheet, Dialog } from "@hashtag-design-system/components";
import { memo, useMemo } from "react";
import { SEARCH_ACTIONS, SET_STATE_PAYLOAD } from "../reducer";
import { Item } from "./Item";
import { PickerAndLabel } from "./PickerAndLabel";
import styles from "./Rest.module.scss";

export const Rest: React.FC = memo(() => {
  const { form, people, hourTime, dispatch } = useSearchContext();
  const { isPeopleShown } = form;

  const formattedPeople = useMemo(() => formatPeople(people), [people]);

  const setState = (newForm: Partial<SET_STATE_PAYLOAD["form"]>) =>
    dispatch({ type: SEARCH_ACTIONS.SET_STATE, payload: { form: { ...form, ...newForm } } });

  return (
    <>
      <Item
        before={
          <PickerAndLabel label="Date">
            <Search.Form.Date />
          </PickerAndLabel>
        }
        picker={{
          label: "Time",
          className: styles.time + (!hourTime ? " " + styles.grey : ""),
          content: formatHourTime(hourTime),
          onClick: () => setState({ isTimePickerShown: true }),
        }}
      >
        <Search.Form.Time />
      </Item>
      <Item picker={{ label: "People", content: formattedPeople, onClick: () => setState({ isPeopleShown: true }) }}>
        <BottomSheet isShown={isPeopleShown} onDismiss={() => setState({ isPeopleShown: false })}>
          {({ dismiss }) => (
            <div className="flex-column-center-flex-start">
              <div className={styles.peopleHeader + " dialog__content w100 flex-row-space-between-center"}>
                <div>People</div>
                <div className="link header-6" onClick={async () => await dismiss()}>
                  Done
                </div>
              </div>
              <Dialog.Content className="w100 flex-column-center-stretch">
                <Search.Form.People />
              </Dialog.Content>
            </div>
          )}
        </BottomSheet>
      </Item>
    </>
  );
});
