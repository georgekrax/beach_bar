<<<<<<< HEAD
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "./Menu.module.scss";

const Pages = ["/", "/trips", "/billing", "/favourites", "/reviews", "/history"] as const;
const PageHeaders = ["Account", "Trips", "Billing", "Favourites", "Reviews", "History"] as const;

type Props = {
  defaultSelected: typeof Pages[number];
};

export const Menu: React.FC<Props> = ({ defaultSelected }) => {
  const genLink = (subpath: Props["defaultSelected"]) => "/account" + (subpath === "/" ? "" : subpath);
  const router = useRouter();

  const [selected, setSelected] = useState(Pages.findIndex(val => val === defaultSelected) ?? 0);
  const refs = useRef<HTMLHeadingElement[] | null[]>([]);
  const controls = useAnimation();

  const handleClick = async (idx: number, operation: "set" | "start") => {
    const cur = refs.current[idx];
    cur?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
    await controls[operation]({
      x: (cur?.getBoundingClientRect().left || 0) - 24,
      width: (cur?.clientWidth || 0) * 0.5,
    });
  };

  useEffect(() => {
    const idx = Pages.findIndex(val => defaultSelected === val);
    if (idx && refs && refs.current && refs.current[idx]) handleClick(idx, "set");
  }, []);

  return (
    // <AnimateSharedLayout>
    <div className={styles.outerContainer}>
      <div
        className={styles.container + " w100 no-scrollbar flex-row-flex-start-center"}
        onScroll={() =>
          controls.set({
            x: (refs.current[selected]?.getBoundingClientRect().left || 0) - 24,
            transition: { duration: 0 },
          })
        }
      >
        <div style={{ alignSelf: "stretch", width: "1.5em", flexShrink: 0 }} />
        {PageHeaders.map((val, i) => (
          <motion.h6
            key={val}
            className={styles.item + (i === selected ? " " + styles.selected : "") + " semibold upper"}
            ref={el => (refs.current[i] = el)}
            onClick={async () => {
              setSelected(i);
              await handleClick(i, "start");
              router.push(genLink(Pages[i]));
            }}
          >
            {val}
            {/* {i === selected && (
            <motion.div
              className={styles.underline + " border-radius--lg"}
              layout
              layoutId="underline"
              transition={{ duration: 0.35 }}
            />
          )} */}
          </motion.h6>
        ))}
        <div style={{ alignSelf: "stretch", width: "6em", flexShrink: 0 }} />
      </div>
      <motion.div
        className={styles.underline + " border-radius--lg"}
        initial={{ x: 0 }}
        animate={controls}
        transition={{ duration: 0.35 }}
      />
    </div>
    // </AnimateSharedLayout>
  );
};

Menu.displayName = "AccountMenu";
=======
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "./Menu.module.scss";

const Pages = ["/", "/trips", "/billing", "/favourites", "/reviews", "/history"] as const;
const PageHeaders = ["Account", "Trips", "Billing", "Favourites", "Reviews", "History"] as const;

type Props = {
  defaultSelected: typeof Pages[number];
};

export const Menu: React.FC<Props> = ({ defaultSelected }) => {
  const genLink = (subpath: Props["defaultSelected"]) => "/account" + (subpath === "/" ? "" : subpath);
  const router = useRouter();

  const [selected, setSelected] = useState(Pages.findIndex(val => val === defaultSelected) ?? 0);
  const refs = useRef<HTMLHeadingElement[] | null[]>([]);
  const controls = useAnimation();

  const handleClick = async (idx: number, operation: "set" | "start") => {
    const cur = refs.current[idx];
    cur?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
    await controls[operation]({
      x: (cur?.getBoundingClientRect().left || 0) - 24,
      width: (cur?.clientWidth || 0) * 0.5,
    });
  };

  useEffect(() => {
    const idx = Pages.findIndex(val => defaultSelected === val);
    if (idx && refs && refs.current && refs.current[idx]) handleClick(idx, "set");
  }, []);

  return (
    // <AnimateSharedLayout>
    <div className={styles.outerContainer}>
      <div
        className={styles.container + " w100 no-scrollbar flex-row-flex-start-center"}
        onScroll={() =>
          controls.set({
            x: (refs.current[selected]?.getBoundingClientRect().left || 0) - 24,
            transition: { duration: 0 },
          })
        }
      >
        <div style={{ alignSelf: "stretch", width: "1.5em", flexShrink: 0 }} />
        {PageHeaders.map((val, i) => (
          <motion.h6
            key={val}
            className={styles.item + (i === selected ? " " + styles.selected : "") + " semibold upper"}
            ref={el => (refs.current[i] = el)}
            onClick={async () => {
              setSelected(i);
              await handleClick(i, "start");
              router.push(genLink(Pages[i]));
            }}
          >
            {val}
            {/* {i === selected && (
            <motion.div
              className={styles.underline + " border-radius--lg"}
              layout
              layoutId="underline"
              transition={{ duration: 0.35 }}
            />
          )} */}
          </motion.h6>
        ))}
        <div style={{ alignSelf: "stretch", width: "6em", flexShrink: 0 }} />
      </div>
      <motion.div
        className={styles.underline + " border-radius--lg"}
        initial={{ x: 0 }}
        animate={controls}
        transition={{ duration: 0.35 }}
      />
    </div>
    // </AnimateSharedLayout>
  );
};

Menu.displayName = "AccountMenu";
>>>>>>> 3c094b84c4b6a5e6c8400166ac60b7393b7ddcff
