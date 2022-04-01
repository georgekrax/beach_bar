import Icons from "@/components/Icons";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import { useAuth } from "@/utils/hooks";
import { Button } from "@hashtag-design-system/components";
import {useRouter} from "next/router";
import TypeWriter from "typewriter-effect";

const BENEFITS_ARR: { header: string; description: string }[] = [
  {
    header: "Be part of the biggest beach network",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt excepturi alias praesentium explicabo repudiandae eligendi! Cupiditate ducimus quo animi illum.",
  },
  {
    header: "Continuous support",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt excepturi alias praesentium explicabo repudiandae eligendi! Cupiditate ducimus quo animi illum.",
  },
  {
    header: "Free listing for any type of property",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt excepturi alias praesentium explicabo repudiandae eligendi! Cupiditate ducimus quo animi illum.",
  },
  {
    header: "Customize your business's rules",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt excepturi alias praesentium explicabo repudiandae eligendi! Cupiditate ducimus quo animi illum.",
  },
];

const FEATURES_ARR: string[] = [
  "Detailed and accessible <span className='bold'>dashboard</span>",
  "Set <span className='bold'>multiple owners</span> for one property",
  "<span className='bold'>Safe and secure transcations</span> on each step",
  "Customized consulting services, to <span className='bold'>grow your online presence</span>",
];

const PartnersPage: React.FC = () => {
  const router = useRouter();
  const { isAuthed, handleLogin } = useAuth();

  const handleClick = () => {
    console.log("hey");
    handleLogin();
    if (isAuthed) router.push("/dashboard/new");
  };

  return (
    <Layout>
      <div className="partners flex-column-center-flex-start">
        <h2 className="partners__header text--white">
          List your&nbsp;
          <span className="text--secondary">
            <TypeWriter
              options={{ loop: true, autoStart: true, strings: ["bar", "hotel", "camping", "swimming pool"] }}
            />
          </span>
          <span className="d--block">on #beach_bar</span>
        </h2>
        <Button variant="primary" className="bold" onClick={() => handleClick()}>
          Get started
        </Button>
      </div>
      <h4>Exclusive benefits</h4>
      <div className="partners__benefits flex-column-flex-start-flex-start flex--wrap">
        {BENEFITS_ARR.map(({ header, description }, i) => (
          <div key={i}>
            <div className="header-6 semibold">{header}</div>
            <div>{description}</div>
          </div>
        ))}
      </div>
      <h4>Specialised features for your business&apos;s needs</h4>
      <div className="partners__features">
        <ul>
          {FEATURES_ARR.map((val, i) => (
            <li key={i} className="flex-row-flex-start-center">
              <Icons.Checkmark.Circle.Colored style={{ flexShrink: 0 }} />
              <div dangerouslySetInnerHTML={{ __html: val.replace("className", "class") }} />
            </li>
          ))}
        </ul>
      </div>
      <h4>Frequently asked questions (FAQs)</h4>
      <div className="partners__faq flex-column-flex-start-flex-start">
        <div>
          <Next.FAQ question="What is the pricing fee?" />
          <Next.FAQ question="What is the pricing fee?" />
          <Next.FAQ question="What is the pricing fee?" />
        </div>
        <div>
          <Next.FAQ question="What is the pricing fee?" />
          <Next.FAQ question="What is the pricing fee?" />
        </div>
      </div>
      <div className="partners__footer text--white flex-column-space-around-flex-start">
        <h2>
          Let&apos;s revolutionalize
          <span className="d--block">
            tourism, <span className="text--secondary">together</span>
          </span>
        </h2>
        <div className="d--none" />
        <div>
          <span>
            Join us. We&apos;ll help you <span className="d--block" /> on every step.
          </span>
          <Button variant="primary" onClick={() => handleClick()}>
            Let&apos;go!
          </Button>
        </div>
      </div>
    </Layout>
  );
};

PartnersPage.displayName = "PartnersPage";

export default PartnersPage;
