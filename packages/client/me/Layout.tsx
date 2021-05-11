// import Auth from "@/components/Auth/Auth";
// import { Footer } from "@/components/Layout/Footer/Footer";
// import { LoginDialog } from "@/components/Layout/LoginDialog";
// import { MapDialog } from "@/components/Search/MapDialog";
import { AnimatePresence } from "framer-motion";
// import { Header } from "./Header";

export const Me: React.FC = ({ children }) => {
  return (
    <>
      {/* <LoginDialog>
        <Auth />
      </LoginDialog>
      <MapDialog /> */}
      {/* <Header /> */}
      <div>
        <AnimatePresence exitBeforeEnter>
          {/* <Wrapper key="wrapper" {...wrapper}> */}
          <main>
            <div className="wrapper">{children}</div>
          </main>
          {/* </Wrapper> */}
        </AnimatePresence>
        {/* <Footer /> */}
      </div>
    </>
  );
};
