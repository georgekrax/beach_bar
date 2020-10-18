export type LoginPlatformType = {
  id: number;
  name: string;
  urlHostname: string;
};

export const hey = Object.freeze({
  hey: {
    id: 1,
    name: "",
    urlHostname: "",
  },
});

const names = {
  BEACH_BAR: <LoginPlatformType>{
    id: 1,
    name: "#beach_bar",
    urlHostname: "www.beach_bar.com",
  },
  GOOGLE: {
    id: 2,
    name: "Google",
    urlHostname: "www.google.com",
  },
  FACEBOOK: {
    id: 3,
    name: "Facebook",
    urlHostname: "www.facebook.com",
  },
  INSTAGRAM: {
    id: 4,
    name: "Instagram",
    urlHostname: "www.instagram.com",
  },
} as const;

export default names;
