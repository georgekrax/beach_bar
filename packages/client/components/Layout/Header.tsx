import { Avatar } from "@/components/Account/Avatar";
import Auth from "@/components/Auth";
import Next from "@/components/Next";
import { Box as SearchBox } from "@/components/Search/Box/Box";
import {
  Box,
  Button,
  cx,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  MotionBox,
  MotionBoxProps,
  MotionFlex,
} from "@hashtag-design-system/components";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./Header.module.scss";
import { Logo } from "./Logo";

// Ripple button -> https://www.30secondsofcode.org/react/s/ripple-button

const accountVariants = {
  hidden: { width: 0, height: 0, opacity: 0 },
  shown: { width: "100%", height: "100%", opacity: 1 },
};

type Props = MotionBoxProps & {
  auth?: boolean;
  searchBar?: boolean;
  isSticky?: boolean;
};

export const Header: React.FC<Props> = ({ auth = true, searchBar = false, isSticky = true, ...props }) => {
  const { pathname } = useRouter();
  const _className = cx(styles.container + " w100", props.className);
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    // const { left, top } = e.currentTarget.getBoundingClientRect();
    setIsOpen(prev => !prev);
  };

  const atHomePage = pathname === "/";

  return (
    <>
      <Box
        position="absolute"
        top="80px"
        transform="translate(-50%, -100%)"
        zIndex="hide"
        bg="orange.200"
        boxSize={14}
        left="50%"
        width="100%"
        maxWidth={1200}
        height="40px"
        borderRadius="full"
        borderBottomRadius={0}
        display={!isSticky ? "block" : "none"}
      />
      <MotionBox
        as="header"
        initial={atHomePage && { y: -180, opacity: 0 }}
        animate={atHomePage && { y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 1 }}
        position={isSticky ? "sticky" : "static"}
        top={0}
        left={0}
        zIndex={100}
        bg="whiteAlpha.700"
        backdropFilter="saturate(180%) blur(20px)"
        {...props}
        className={_className}
      >
        <Flex justify="space-between" align="center" className="container--padding container--mw h100">
          <Box mr={searchBar ? "auto" : undefined}>
            <Next.Link link={{ href: "/" }}>
              <Logo />
            </Next.Link>
          </Box>
          {searchBar && (
            <SearchBox
              className={styles.searchBar}
              atHeader
              margin="auto"
              width="max(28rem, 40%)"
              fontSize="75%"
              sx={{
                input: { height: "auto", fontSize: "0.875rem" },
                ".select__modal": { fontSize: "sm" },
                "& > div:not(:first-of-type) label + div": { mb: "0.25em", fontSize: "0.875em" },
              }}
            />
          )}
          {/* <Auth.LoginBtn alignSelf="center" boxShadow="none" /> */}
          {auth && (
            <>
              {session ? (
                <Menu isOpen={isOpen}>
                  <MenuButton
                    as={Button}
                    onClick={handleClick}
                    position="relative"
                    borderRadius="regular"
                    sx={{ all: "unset", _hover: { all: "unset" }, _active: { all: "unset" } }}
                    style={{
                      position: "relative",
                      padding: 1,
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    <MotionBox
                      key="border"
                      initial="hidden"
                      animate={isOpen ? "shown" : "hidden"}
                      transition={{ stiffness: 50 }}
                      variants={accountVariants}
                      position="absolute"
                      right={0}
                      bottom={0}
                      bg="orange.500"
                      zIndex="hide"
                      borderRadius="regular"
                    />
                    <MotionFlex
                      // initial={{ backgroundColor: "transparent" }}
                      // animate={{ backgroundColor: isOpen ? "#ffffff" : "transparent" }}
                      // transition={{ duration: 2 }}
                      justifyContent="center"
                      alignItems="center"
                      p={1}
                      bg="white"
                      borderRadius="regular"
                    >
                      <Box ml={2} mr={5} display={{ base: "none", md: "block" }}>
                        Hello {session.firstName}!
                      </Box>
                      <Avatar />
                    </MotionFlex>
                  </MenuButton>
                  <MenuList>
                    <MenuGroup>
                      <MenuItem>My account</MenuItem>
                      <MenuItem>Favourites</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup>
                      <MenuItem onClick={() => signOut({ redirect: false })}>Log out</MenuItem>
                    </MenuGroup>
                  </MenuList>
                </Menu>
              ) : (
                <Auth.LoginBtn alignSelf="center" boxShadow="none" />
              )}
            </>
          )}
        </Flex>
      </MotionBox>
    </>
  );
};

Header.displayName = "Header";

export type { Props as LayoutHeaderProps };
