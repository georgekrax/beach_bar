import { Error } from "./Error";
import { Success } from "./Success";

type SubComponents = {
  Error: typeof Error;
  Success: typeof Success;
};

type Props = {};

const Feedback: React.FC<Props> & SubComponents = () => {
  return <div></div>;
};

Feedback.Error = Error;
Feedback.Success = Success;

Feedback.displayName = "Feedback";

export default Feedback;
