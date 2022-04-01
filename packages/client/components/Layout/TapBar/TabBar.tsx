import { useHasMounted } from "@hashtag-design-system/components";
import { animate, motion, useAnimation, useMotionValue } from "framer-motion";
import range from "lodash/range";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CONFIG } from "@/config/index";
import Icons, { TapBarIndicatorIconPath } from "@/components/Icons";
import { MenuItem } from "./MenuItem";
import styles from "./TapBar.module.scss";

const CLIP_PATH_VALUES = {
  "0%": "circle(0% at 50% 100%)",
  "100%": "circle(100% at 50% 100%)",
};

export type TapBarPage = keyof typeof CONFIG.TapBarPageIdx;

export type Props = {
  active?: 1 | 2 | 3 | 4;
};

const TabBar: React.FC<Props> = React.memo(({ active, children }) => {
  const indicatorAnimation = useAnimation();
  const svgAnimation = useAnimation();
  const ballAnimation = useAnimation();
  const overlayAnimation = range(0, 4).map(() => useAnimation());
  const ref = useRef<HTMLLIElement[] | null[]>([]);
  const [left, setLeft] = useState(0);
  const { pathname, push } = useRouter();
  const currentId = useMemo(() => (active ? active - 1 : CONFIG.TapBarPageIdx["/" + pathname.split("/")[1]]), [
    active,
    pathname,
  ]);

  const opacity = useMotionValue(1);
  const [hasMounted] = useHasMounted();
  const pagesArr: { pathname: TapBarPage; children: React.ReactNode }[] = useMemo(
    () => [
      {
        pathname: "/",
        children: (
          <>
            <Icons.Search large />
            <Icons.Search.Filled
              large
              initial={{ clipPath: CLIP_PATH_VALUES["0%"] }}
              animate={overlayAnimation[CONFIG.TapBarPageIdx["/"]]}
            />
          </>
        ),
      },
      {
        pathname: "/map",
        children: (
          <>
            <Icons.Map large />
            <Icons.Map.Filled
              large
              initial={{ clipPath: CLIP_PATH_VALUES["0%"] }}
              animate={overlayAnimation[CONFIG.TapBarPageIdx["/map"]]}
            />
          </>
        ),
      },
      {
        pathname: "/shopping_cart",
        children: (
          <>
            <Icons.ShoppingCart large />
            <Icons.ShoppingCart.Filled
              large
              initial={{ clipPath: CLIP_PATH_VALUES["0%"] }}
              animate={overlayAnimation[CONFIG.TapBarPageIdx["/shopping_cart"]]}
            />
          </>
        ),
      },
      {
        pathname: "/account",
        children: (
          <>
            <Icons.UserAvatar large />
            <Icons.UserAvatar.Filled
              large
              initial={{ clipPath: CLIP_PATH_VALUES["0%"] }}
              animate={overlayAnimation[CONFIG.TapBarPageIdx["/account"]]}
            />
          </>
        ),
      },
    ],
    []
  );

  const handleClick = async (e: React.MouseEvent<HTMLLIElement>, nextId: number) => {
    const { currentTarget } = e;
    const newLeft = currentTarget.getBoundingClientRect().left;
    // Animation
    // * Specific animation duration is important here
    // By iterating on all animations, we check / ensure that all are hidden
    overlayAnimation.forEach(animation => animation.start({ clipPath: CLIP_PATH_VALUES["0%"] }, { duration: 0.35 }));
    animate(opacity, 0);
    if (nextId > currentId) svgAnimation.start({ d: TapBarIndicatorIconPath.fluid.right });
    else if (nextId < currentId) svgAnimation.start({ d: TapBarIndicatorIconPath.fluid.left });
    else svgAnimation.start({ d: TapBarIndicatorIconPath.fluid.middle });
    await indicatorAnimation.start({ left: newLeft }, { type: "tween", duration: 0.2 });
    svgAnimation.start({ d: TapBarIndicatorIconPath.default });
    animate(opacity, 1);

    await ballAnimation.start({ bottom: nextId === 3 ? "40%" : "50%" }, { type: "tween", ease: "easeInOut" });
    push({ pathname: pagesArr[nextId].pathname });

    if (hasMounted) {
      ballAnimation.set({ visibility: "hidden" });
      overlayAnimation[nextId].start({ clipPath: CLIP_PATH_VALUES["100%"] });
      ballAnimation.set({ bottom: "-50%" });
      ballAnimation.set({ visibility: "visible" });
    }
  };

  useLayoutEffect(() => {
    async function promiseFunc() {
      const activeLeft = ref.current[currentId || 0]?.getBoundingClientRect().left;
      if (activeLeft) setLeft(activeLeft);
    }
    promiseFunc();
  }, []);

  useEffect(() => {
    ballAnimation.set({ bottom: "-50%" });
    overlayAnimation[currentId || 0].set({ clipPath: CLIP_PATH_VALUES["100%"] });
  }, []);

  return (
    <>
      <nav className={styles.container + " w100 flex-column-center-center"}>
        <ul className={styles.list + " w100 flex-row-space-around-center"}>
          {pagesArr.map(({ pathname: pagePathname, children }) => {
            const id = CONFIG.TapBarPageIdx[pagePathname];
            return (
              <MenuItem key={id} id={id} ref={el => (ref.current[id] = el)} handleClick={handleClick}>
                {children}
              </MenuItem>
            );
          })}
        </ul>
        <motion.div className={styles.gooey__container} style={{ left }} animate={indicatorAnimation}>
          <div className={styles.gooey__container___effect + " flex-column-flex-end-center"}>
            <motion.div className={styles.gooeyBall} animate={ballAnimation} />
            <Icons.TapBarIndicator
              style={{ opacity }}
              transition={{ duration: 2 }}
              className={styles.indicator}
            />
          </div>
          <Icons.TapBarIndicator
            animate={svgAnimation}
            className={styles.indicator+ " " + styles.overlap}
          />
        </motion.div>
      </nav>
      {children}
    </>
  );
});

export default TabBar;
