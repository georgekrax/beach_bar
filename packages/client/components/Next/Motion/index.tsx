import { Container } from "./Container";

type SubComponents = {
  Container: typeof Container;
}

type Props = {

}

export const Motion: React.FC<Props> & SubComponents = () => {
  return (
    <div>

    </div>
  );
};

Motion.Container = Container;

Motion.displayName = "NextMotion"