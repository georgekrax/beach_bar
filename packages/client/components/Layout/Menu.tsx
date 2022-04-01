import Next from "@/components/Next";
import { useConfig, useIsDevice } from "@/utils/hooks";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Menu.module.scss";

type SelectedState = { itemIdx: number; linkIdx: number; openIdxs: number[] };

export type DefaultSelected<Pages extends Props["pages"]> = {
  defaultSelected: NonNullable<Pages[number]["link"]> | NonNullable<Pages[number]["sublinks"]>[number]["link"];
};

export type Props = {
  pages: readonly Readonly<{
    link?: string;
    header: string;
    sublinks?: readonly Required<Pick<Props["pages"][number], "header" | "link">>[];
  }>[];
  defaultSelected: Props["pages"][number]["link"];
};

export const Menu: React.FC<Props> = memo(({ defaultSelected, pages }) => {
  const allLinks = useMemo(() => {
    return pages
      .map(({ sublinks, ...params }) => {
        const sublinksArr = sublinks?.map((vals, i) => ({
          ...vals,
          isSublink: true,
          isLast: i === sublinks.length - 1,
        }));
        return [{ ...params, isSublink: false, isLast: false }].concat(sublinksArr || []);
      })
      .flat()
      .sort((a, b) => +a.isSublink - +b.isSublink);
  }, [pages]);

  const findIndexes = (valToCheck: typeof defaultSelected) => {
    const linkIdx = allLinks.findIndex(({ link }) => link === valToCheck);
    return {
      linkIdx,
      itemIdx: pages.findIndex(
        ({ link, sublinks }) => link === valToCheck || sublinks?.some(sublink => sublink.link === valToCheck)
      ),
    };
  };

  const { pathname } = useRouter();
  const [selected, setSelected] = useState<SelectedState>({ ...findIndexes(defaultSelected), openIdxs: [] });
  const [current, setCurrent] = useState<HTMLAnchorElement | null>(null);
  const refs = useRef<HTMLAnchorElement[] | null[]>([]);
  const { isMobile } = useIsDevice();

  const pathnameIndexes = useMemo(() => findIndexes(pathname), [pathname]);
  const selectedIsLink = useMemo(() => pages[selected.itemIdx].link, [pages, selected]);

  // const {
  //   variables: { primary },
  // } = useConfig();
  // const controls = useAnimation();

  const handleClick = ({ linkIdx, itemIdx }: Pick<SelectedState, "itemIdx" | "linkIdx">) => {
    // if (!selectedIsLink && linkIdx === selected.linkIdx) setSelected(pathnameIndexes);
    // else setSelected({ linkIdx, ...params });
    if (!selectedIsLink) {
      setSelected(({ openIdxs }) => ({
        ...pathnameIndexes,
        openIdxs: openIdxs.includes(itemIdx) ? openIdxs : [...openIdxs, itemIdx],
      }));
    } else setSelected(prev => ({ ...prev, linkIdx, itemIdx }));
    const cur = refs.current[linkIdx];
    // if (itemIdx === linkIdx) { console.log(cur?.nextSibling) }
    if (!cur) return;
    cur.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
    setCurrent(cur);
  };

  // const handleScroll = () => {
  //   if (!isMobile) return;
  //   controls.set({
  //     x: (refs.current[selected]?.getBoundingClientRect().left || 0) - 24,
  //     transition: { duration: 0 },
  //   });
  // };

  useEffect(() => {
    const idxs = findIndexes(pathname);
    if (Object.values(idxs).every(idx => idx !== -1) && refs.current[idxs.linkIdx]) handleClick(idxs);
  }, [pathname]);

  return (
    <div className={styles.outerContainer}>
      <div
        className={styles.container + " w100 no-scrollbar flex-row-flex-start-center"}
        // onScroll={() => handleScroll()}
      >
        {pages.map(({ sublinks, ...link }, i) => {
          return (
            <div key={"link_" + i} className={styles.item + " text--nowrap"}>
              <Link
                isSelected={!selectedIsLink ? pathnameIndexes.linkIdx === i : i === selected.linkIdx}
                ref={el => (refs.current[i] = el)}
                onClick={() => handleClick({ itemIdx: i, linkIdx: i })}
                {...link}
              />
              {sublinks && (
                <motion.div
                  className={styles.sublinks}
                  initial={{ height: 0, margin: 0 }}
                  // animate={i === selected.itemIdx ? { height: "auto", margin: "" } : "initial"}
                  animate={selected.openIdxs.includes(i) ? { height: "auto", margin: "" } : "initial"}
                  transition={{ duration: 0.4 }}
                >
                  {sublinks?.map((sublink, j) => {
                    const { linkIdx: idx } = findIndexes(sublink.link);
                    return (
                      <Link
                        key={"sublink_" + j}
                        ref={el => (refs.current[idx] = el)}
                        isSublink
                        isSelected={idx === selected.linkIdx}
                        onClick={() => handleClick({ itemIdx: i, linkIdx: idx })}
                        {...sublink}
                      />
                    );
                  })}
                </motion.div>
              )}
              {/* {i === selected.linkIdx && (
                <motion.div
                  className={styles.underline + " border-radius--md"}
                  layout
                  layoutId="underline"
                  initial={{ y: current?.offsetTop }}
                  transition={{ duration: 0.35 }}
                  style={{ width: 3, height: 24, position: "absolute", right: 0 }}
                />
              )} */}
            </div>
          );
        })}
      </div>
      <motion.div
        className={styles.underline + " border-radius--md"}
        initial={isMobile && { x: 0 }}
        animate={
          isMobile
            ? {
                x: (current?.getBoundingClientRect().left || 24) - 24,
                width: (current?.clientWidth || 0) * 0.5,
                height: 3.5,
              }
            : { y: current?.offsetTop, height: current?.clientHeight, width: 3 }
        }
        transition={{ duration: 0.6 }}
      />
    </div>
  );
});

type LinkProps = {
  isSelected: boolean;
  isSublink?: boolean;
  onClick: React.MouseEventHandler<HTMLAnchorElement | HTMLDivElement>;
} & Pick<Props["pages"][number], "link" | "header">;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ link, header, isSelected, isSublink = false, onClick }, ref) => {
    const {
      variables: { primary },
    } = useConfig();

    const animate = { color: isSelected ? primary : undefined };
    const className = (isSelected ? "bold " : "") + "d--block";
    const children = isSublink ? (
      <motion.div animate={animate}>{header}</motion.div>
    ) : (
      <motion.h6 animate={animate}>{header}</motion.h6>
    );

    return link ? (
      <Next.Link href={link} ref={ref} className={className} onClick={onClick}>
        {children}
      </Next.Link>
    ) : (
      <div className={className + " cursor--pointer"} onClick={onClick}>
        {children}
      </div>
    );
  }
);
