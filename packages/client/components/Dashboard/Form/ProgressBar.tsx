import { DashboardItemProps } from "@/components/Dashboard";
import { CONFIG } from "@/config/animation";
import { DASHBOARD_NEW_STEPS_ARR } from "@/config/pages";
import { useConfig } from "@/utils/hooks";
import { Button } from "@hashtag-design-system/components";
import { motion } from "framer-motion";
import styles from "./ProgressBar.module.scss";

const LAST_PROGRESS = DASHBOARD_NEW_STEPS_ARR[DASHBOARD_NEW_STEPS_ARR.length - 1];

export type Props = {
  disabled?: { prev: boolean; next: boolean };
  onNext?: () => void;
  onPrev?: () => void;
} & Pick<DashboardItemProps, "step" | "progress">;

export const ProgressBar: React.FC<Props> = ({ disabled, step, progress, onPrev, onNext }) => {
  const { colors } = useConfig();

  const width = step === 1 ? 20 : (progress + 1) * 20;

  return (
    <div className={styles.container + " flex-row-space-between-center"}>
      <div className={styles.bar + " border-radius--md"}>
        <motion.div
          className={styles.progress + " h100"}
          animate={{ width: width + "%", backgroundColor: width === 100 ? colors.green["600"] : undefined }}
          transition={{ delay: CONFIG.newListingDuration - 0.2, duration: CONFIG.newListingDuration }}
        />
      </div>
      <div className={styles.btns + " flex-row-flex-end-center"}>
        {!disabled?.prev && (
          <Button type="button" variant="secondary" className={styles.prev} onClick={onPrev}>
            Previous
          </Button>
        )}
        <Button type="button" disabled={disabled?.next} onClick={onNext}>
          {step === DASHBOARD_NEW_STEPS_ARR.length && progress === LAST_PROGRESS[LAST_PROGRESS.length - 1]
            ? "Finished!"
            : "Next"}
        </Button>
      </div>
    </div>
  );
};

ProgressBar.displayName = "DashboardFormProgressBar";
