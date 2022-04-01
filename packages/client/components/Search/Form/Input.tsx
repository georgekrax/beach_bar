import { NAMES } from "@/config/index";
import { useSearchContext, useSearchFormContext } from "@/utils/contexts";
import { genBarThumbnailAlt } from "@/utils/format";
import { Autosuggest, Flex, Select, Text } from "@hashtag-design-system/components";
import Image from "next/image";
import { memo, useMemo } from "react";
import { SearchBoxProps } from "../Box";
import { Label } from "../Box/Label";

export const Input: React.FC<Pick<SearchBoxProps, "input">> = memo(({ input }) => {
  const {
    form: { suggestions },
    formatInputValue,
  } = useSearchContext();
  const { searchValue, autosuggestRef, handleChange, handleSelect } = useSearchFormContext();

  const options = useMemo(() => {
    return suggestions.sliced.map(({ id, beachBar, ...rest }) => {
      const { primary, secondary } = formatInputValue({ beachBar, ...rest });
      return (
        <Select.Item
          as={Flex}
          key={id}
          id={id.toString()}
          // allowHighlight={false}
          valueToFilter={primary}
          onClick={() => handleSelect(id)}
          px={3}
          gap={3}
        >
          {beachBar?.thumbnailUrl && (
            <Flex
              justify="center"
              align="center"
              // mr={3}
              // gridRow="1 / 3"
              borderRadius="regular"
              overflow="hidden"
            >
              <Image
                src={beachBar.thumbnailUrl}
                alt={genBarThumbnailAlt(beachBar.name)}
                width={40}
                height={40}
                objectFit="cover"
                objectPosition="center bottom"
              />
            </Flex>
          )}
          <Flex flexDir="column">
            <Text as="span" fontWeight="semibold">{primary}</Text>
            <Text as="span" fontSize="xs" color="gray.600">{secondary}</Text>
          </Flex>
        </Select.Item>
      );
    });
  }, [suggestions.sliced[0]?.id, suggestions.sliced.length]);

  return input === false ? null : (
    <Autosuggest width="100%">
      <Label label="Destination">
        <Autosuggest.Input
          placeholder={NAMES.SEARCH_BOX_PLACEHOLDER}
          hasFloatingPlaceholder={false}
          defaultValue={searchValue}
          height={32 / 16 + "rem"}
          p={0}
          borderRadius={0}
          border="none !important"
          boxShadow="none !important"
          {...input}
          ref={autosuggestRef}
          onChange={e => handleChange(e.target.value)}
        />
      </Label>
      <Autosuggest.Modal>
        {suggestions.error ? (
          "Error"
        ) : suggestions.loading || suggestions.data?.length === 0 ? (
          "Loading"
        ) : (
          <Select.Options minWidth={280}>{options}</Select.Options>
        )}
      </Autosuggest.Modal>
    </Autosuggest>
  );

  // return input === false ? null : (
  //   <Autosuggest
  //     className={"body-14" + (input?.className ? " " + input.className : "")}
  //     label="Destination"
  //     placeholder={NAMES.SEARCH_BOX_PLACEHOLDER}
  //     defaultValue={searchValue}
  //     floatingplaceholder={false}
  //     forwardref={ref}
  //     onChange={(val, e) => handleChange(e?.target.value || val)}
  //     {...input}
  //   >
  //     {searchInputValues.error ? (
  //       "Error"
  //     ) : (
  //       <>
  //         {searchInputValues.sliced.map(({ id, beachBar, ...rest }) => {
  //           const { primary, secondary } = formatInputValue({ beachBar, ...rest });
  //           return (
  //             <Select.Item
  //               key={id}
  //               id={id}
  //               content={primary}
  //               className={styles.item}
  //               onClick={() => handleSelect(id)}
  //               htmlContent={{
  //                 before: beachBar && (
  //                   <div className={styles.item__img + " flex-row-center-center"}>
  //                     <Image
  //                       src={beachBar.thumbnailUrl}
  //                       alt={genBarThumbnailAlt(beachBar.name)}
  //                       width={40}
  //                       height={40}
  //                       objectFit="cover"
  //                       objectPosition="center bottom"
  //                     />
  //                   </div>
  //                 ),
  //                 after: <div className="body-14">{secondary}</div>,
  //               }}
  //             />
  //           );
  //         })}
  //       </>
  //     )}
  //   </Autosuggest>
  // );
});

Input.displayName = "SearchFormInput";
