import Icons from "@/components/Icons";
import { useSearchContext } from "@/utils/contexts";
import { useIsDevice } from "@/utils/hooks";
import { Box, Flex, Text } from "@hashtag-design-system/components";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SEARCH_ACTIONS } from "./reducer";
import styles from "./ShowInMap.module.scss";

const IMG_SIZE = 60;

type Props = {
  formattedInputVal?: string;
};

export const ShowInMap: React.FC<Props> = ({ formattedInputVal }) => {
  const router = useRouter();
  const [imgUrl, setImgUrl] = useState("");
  const { isDesktop } = useIsDevice();

  const {
    results: { filtered },
    coordinates: { latitude, longitude },
    dispatch,
  } = useSearchContext();

  const handleClick = () => {
    console.log("hey");
    if (isDesktop) dispatch({ type: SEARCH_ACTIONS.TOGGLE_MAP_DIALOG, payload: { bool: true } });
    else router.push({ pathname: "/map" });
  };

  useEffect(() => {
    if (latitude && longitude) {
      const newImgUrl = `https://api.mapbox.com/styles/v1/georgekrax/ckmqrvq6w1e6417pd1piwrgwm/static/${longitude},${latitude},7.8,0/${IMG_SIZE}x95?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
      setImgUrl(newImgUrl);
    }
  }, [latitude, longitude]);

  return (
    <Box
      position="relative"
      height="fit-content"
      maxWidth="25em"
      p={3}
      mt={{ base: 6, md: 0 }}
      mb={{ base: 16, md: 20 }}
      borderRadius="regular"
      bgGradient="linear(116deg, gray.50 40%, gray.200)"
      cursor="pointer"
      _active={{ bg: "gray.200" }}
    >
      <Flex justify="space-betweem" align="center" onClick={handleClick}>
        <Flex justify="center" align="inherit">
          <Box
            width={IMG_SIZE + "px"}
            height={IMG_SIZE + "px"}
            borderRadius="regular"
            overflow="hidden"
            mr={3}
            flexShrink={0}
          >
            {imgUrl && (
              <Image
                src={imgUrl}
                width={IMG_SIZE}
                height={IMG_SIZE}
                alt={formattedInputVal + " in map"}
                objectFit="cover"
                objectPosition="center"
              />
            )}
          </Box>
          <Flex flexDir="column" justify="center" color="gray.900" className={styles.content}>
            {formattedInputVal && (
              <>
                <Box mb={1} fontWeight="semibold">
                  Show {formattedInputVal} in Map
                </Box>
                <Text as="span" color="text.grey" fontSize="xs">
                  {filtered.length === 0 ? (
                    <>We didn't find any #beach_bars</>
                  ) : (
                    <>
                      We found&nbsp;
                      <Text as="strong" color="gray.900" fontWeight="bold">
                        {filtered.length}
                      </Text>
                      &nbsp;#beach_bar{filtered.length > 1 ? "s" : ""}
                    </>
                  )}
                </Text>
              </>
            )}
          </Flex>
        </Flex>
        <Icons.Chevron.Right />
      </Flex>
      <Box
        position="absolute"
        top="100%"
        left="7.5%"
        py={1}
        px="inherit"
        bg="gray.100"
        // bgGradient="linear(to top, white, gray.200 50%)"
        fontSize="xs"
        borderBottomRadius="10px"
        sx={{ a: { color: "text.grey" } }}
      >
        ©&nbsp;
        <a href="https://www.mapbox.com/about/maps/" rel="noopener" target="_blank">
          Mapbox
        </a>
        &nbsp;&nbsp;©&nbsp;
        <a href="http://www.openstreetmap.org/copyright" rel="noopener" target="_blank">
          OpenStreetMap
        </a>
      </Box>
    </Box>
  );
};
