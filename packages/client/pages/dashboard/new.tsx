import Dashboard, { DashboardItemProps } from "@/components/Dashboard";
import { Foods } from "@/components/Dashboard/Foods";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import { CONFIG } from "@/config/animation";
import { DASHBOARD_NEW_STEPS_ARR } from "@/config/pages";
import {
  useAddBeachBarMutation,
  useAddBeachBarOwnerMutation,
  useAddBeachBarStylesMutation,
  useCompleteBeachBarSignUpMutation,
  useStripeConnectUrlLazyQuery,
} from "@/graphql/generated";
import StripeBtnImg from "@/lib/slate2.png";
import { NewFormData } from "@/typings/beachBar";
import { useDashboard, useHookForm } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { motion } from "framer-motion";
import Image from "next/image";
import router, { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const STRIPE_IMG_WIDTH = 224;

const DashboardNewPage: React.FC = () => {
  const { query } = useRouter();
  // step -> form section
  // progress -> the progress made (step) in a form section
  const [{ progress, step }, setInfo] = useState<Pick<DashboardItemProps, "step" | "progress">>({
    progress: 1,
    step: 1,
  });
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [domNode, setDomNode] = useState<HTMLElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { beachBarId, setBeachBarId } = useDashboard();

  const [getConnectUrl, { data }] = useStripeConnectUrlLazyQuery();
  const [addBeachBar] = useAddBeachBarMutation();
  const [addOwner] = useAddBeachBarOwnerMutation();
  const [addStyles] = useAddBeachBarStylesMutation();
  const [completeSignUp] = useCompleteBeachBarSignUpMutation();

  const currentHTMLElement = domNode?.children[step - 1].children[1].children[progress - 1];
  const ITEM_STYLE = { overflow: isModalOpen ? "visible" : "hidden" };

  const { formState, handleSubmit, ...form } = useForm<NewFormData>({ mode: "onChange" });
  const { handleChange } = useHookForm<NewFormData>({
    ...form,
    data: { styleIds: [], zeroCartTotal: false, hidePhoneNumber: false },
    registerOptions: () => ({ required: true, minLength: 1 }),
    registeredFields: [
      "name",
      "description",
      // "thumbnailUrl",
      "categoryId",
      "contactPhoneNumber",
      // "zeroCartTotal",
      // "hidePhoneNumber",
      "openingTimeId",
      "closingTimeId",
    ],
  });

  const handleToggle = (e: React.SyntheticEvent<HTMLElement, Event>) => {
    setIsModalOpen((e.target as HTMLDetailsElement).open);
  };

  const handleStep = async (type: "prev" | "next") => {
    const elevator = type === "prev" ? -1 : 1;
    let newStep = step;
    let newProgress = DASHBOARD_NEW_STEPS_ARR[newStep - 1][progress + elevator - 1];
    if (!newProgress) {
      const step = DASHBOARD_NEW_STEPS_ARR[newStep + (type === "prev" ? -2 : 0)];
      newStep = (newStep + elevator) as typeof newStep;
      const last = DASHBOARD_NEW_STEPS_ARR[DASHBOARD_NEW_STEPS_ARR.length - 1];
      if (!step) (newProgress = last[last.length - 1]), (newStep = DASHBOARD_NEW_STEPS_ARR.length);
      else newProgress = step[type === "prev" ? step.length - 1 : 0];
    }
    if (type === "next" && newStep === 1 && newProgress === 2) {
      getConnectUrl({ variables: { phoneNumber: form.getValues("contactPhoneNumber") } });
    }
    // console.log("step & progress", newStep, newProgress);
    if (step === 2) {
      // router.replace(
      //   { pathname: router.pathname, query: { ...query, step: newStep, progress: newProgress } },
      //   undefined,
      //   {
      //     shallow: true,
      //   }
      // );
      switch (progress) {
        case 1:
          currentHTMLElement?.querySelector("form")?.requestSubmit();
          // TODO: Change later, with automatic data completion
          break;
        case 4:
          if (!beachBarId) return notify("error", "");
          const { data, errors } = await completeSignUp({ variables: { beachBarId } });
          if (!data && errors) return errors.forEach(({ message }) => notify("error", message));
          router.push("/dashboard");
          break;

        default:
          break;
      }
    }
    setInfo({ step: newStep, progress: newProgress });
  };

  const handleNew = async () => {
    setInfo({ step: 1, progress: 2 });
    const item = localStorage.getItem("new_beach_bar");
    if (!item) return notify("error", "");
    const { code, state } = query;
    const formData: NewFormData = JSON.parse(item);
    const { data, errors } = await addBeachBar({
      variables: { ...formData, code: code!.toString(), state: state!.toString() },
    });
    if (!data) return notify("error", "");
    else if (errors) {
      return errors.forEach(({ message }) =>
        notify("error", message, { somethingWentWrong: { onlyWhenUndefined: true } })
      );
    } else {
      const beachBarId = data.addBeachBar.id;
      setTimeout(() => notify("success", "New #beach_bar was created!", { duration: 4500 }), 1250);
      Object.entries(formData).forEach(([field, val]) => form.setValue(field as any, val));
      localStorage.removeItem("new_beach_bar");
      setTimeout(async () => await handleStep("next"), 5000);
      const { data: ownerData, errors: ownerErrors } = await addOwner({
        variables: { beachBarId, userId: undefined, isPrimary: true },
      });
      if (!ownerData && ownerErrors) return ownerErrors.forEach(({ message }) => notify("error", message));
      if (formData.styleIds.length > 0) {
        const { data: stylesData, errors: stylesErrors } = await addStyles({
          variables: { beachBarId, styleIds: formData.styleIds },
        });
        if (!stylesData && stylesErrors) return stylesErrors.forEach(({ message }) => notify("error", message));
      }
      setBeachBarId(beachBarId);
    }
  };

  useEffect(() => {
    if (query.step && query.progress) {
      setInfo({ step: +String(query.step) as typeof step, progress: +String(query.progress) as typeof progress });
    }
    if (query.state && query.code) handleNew();
  }, [query]);

  useEffect(() => {
    const interval = setInterval(() => setDomNode(ref.current), 2500);
    return () => clearInterval(interval);
  }, [step, progress]);

  useEffect(() => {
    let newVal = false;
    if (step !== 1) return;
    switch (progress) {
      case 1:
        newVal = formState.isValid || !!beachBarId;
        break;
      case 2:
        newVal = !!beachBarId;
        break;
    }
    newVal = !newVal;
    if (newVal !== isNextDisabled) setIsNextDisabled(newVal);
  }, [step, progress, isNextDisabled, beachBarId, formState.isValid]);

  return (
    <Layout hasToaster tapbar={false} main={{ className: "dashboard__new" }}>
      <motion.div
        ref={ref}
        className="flex-row-flex-start-flex-start"
        animate={{
          height: step === 2 && (progress === 2 || progress === 3) ? "auto" : currentHTMLElement?.clientHeight,
        }}
        transition={{ duration: CONFIG.newListingDuration }}
        style={ITEM_STYLE}
      >
        <Dashboard.Form.Item progress={progress} step={step} isStep style={ITEM_STYLE}>
          <h4>Create new listing</h4>
          <div className="flex-row-flex-start-flex-start">
            <Dashboard.Form.Item progress={progress} step={step} atStep={1} style={ITEM_STYLE}>
              <Dashboard.Form atNew handleToggle={handleToggle} handleChange={handleChange as any} />
            </Dashboard.Form.Item>
            <Dashboard.Form.Item progress={progress} step={step} atStep={1}>
              <Dashboard.Form.Step header="Billing info">
                <div>
                  <span className="semibold">#beach_bar</span> partners with&nbsp;
                  <span className="semibold">Stripe</span>, the world's biggest online payment processor, for secure
                  payments and financial services.
                </div>
                <Next.Link
                  isA={!!data?.stripeConnectUrl}
                  link={{ href: data?.stripeConnectUrl || "" }}
                  onClick={() => handleSubmit(data => localStorage.setItem("new_beach_bar", JSON.stringify(data)))()}
                >
                  <Image src={StripeBtnImg} width={STRIPE_IMG_WIDTH} height={STRIPE_IMG_WIDTH * 0.21} />
                </Next.Link>
              </Dashboard.Form.Step>
            </Dashboard.Form.Item>
          </div>
        </Dashboard.Form.Item>
        <Dashboard.Form.Item progress={progress} step={step} isStep>
          <h4>Configure your listing</h4>
          <div className="flex-row-flex-start-flex-start">
            <Dashboard.Form.Item progress={progress} step={step} atStep={2}>
              <Dashboard.Form.Step header="Add your location">
                {((step === 1 && progress === 2) || (step === 2 && (progress === 1 || progress === 2))) && (
                  <Dashboard.Location
                    beachBarId={beachBarId}
                    skip={step !== 2 && progress !== 1}
                    setIsNextDisabled={setIsNextDisabled}
                  />
                )}
              </Dashboard.Form.Step>
            </Dashboard.Form.Item>
            <Dashboard.Form.Item progress={progress} step={step} atStep={2}>
              <Dashboard.Form.Step header="Add products">
                <div>
                  Add the products and services that you offer&nbsp;
                  <span className="semibold">(exlcuding drinks, snacks and foods)</span>.
                </div>
                {step === 2 && (progress === 2 || progress === 1 || progress === 3) && <Dashboard.Products />}
              </Dashboard.Form.Step>
            </Dashboard.Form.Item>
            <Dashboard.Form.Item progress={progress} step={step} atStep={2}>
              <Dashboard.Form.Step header="Add foods & drinks">
                <div>Add foods, snacks and drinks that you offer or make.</div>
                {step === 2 && (progress === 3 || progress === 2 || progress === 4) && <Foods />}
              </Dashboard.Form.Step>
            </Dashboard.Form.Item>
            <Dashboard.Form.Item progress={progress} step={step} atStep={2}>
              <Dashboard.Form.Step header="Add features">
                <div>Add services, or facilities, which you offer to your guests, by clicking on the button.</div>
                {step === 2 && progress === 4 && <Dashboard.Features atNew />}
              </Dashboard.Form.Step>
            </Dashboard.Form.Item>
          </div>
        </Dashboard.Form.Item>
      </motion.div>
      <Dashboard.Form.ProgressBar
        step={step}
        progress={progress}
        disabled={{ prev: step * progress === 1, next: isNextDisabled }}
        onPrev={async () => await handleStep("prev")}
        onNext={async () => await handleStep("next")}
      />
    </Layout>
  );
};

DashboardNewPage.displayName = "DashboardNewPage";

export default DashboardNewPage;
