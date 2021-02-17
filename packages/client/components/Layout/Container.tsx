const Container: React.FC = ({ children }) => {
  return <div className="wrapper">{children}</div>;
};

Container.displayName = "LayoutContainer";

export default Container;
