import { dayjsFormat, errors as COMMON_ERRORS } from "@beach_bar/common";
import { Autosuggest, Button, Form, Input, Select, Switch } from "@hashtag-design-system/components";
import { SelectedItems } from "@hashtag-design-system/components/dist/esm/components/Select/Select";
import { COUNTRIES, COUNTRIES_ARR } from "@the_hashtag/common";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { GetServerSideProps } from "next";
import { useMemo, useRef, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { default as UserAccount } from "../../components/Account";
import { Visit } from "../../components/Carousel";
import Layout from "../../components/Layout";
import { IndexPage } from "../../components/pages";
import {
  GetPaymentsDatesDocument,
  GetPaymentsDocument,
  MeDocument,
  MeQuery,
  useGetPaymentsDatesQuery,
  useGetPaymentsQuery,
  useSignS3Mutation,
  useUpdateUserMutation,
} from "../../graphql/generated";
import { initializeApollo, INITIAL_APOLLO_STATE } from "../../lib/apollo";
import { getAuth } from "../../lib/auth";
import { uploadToS3 } from "../../lib/aws";
import { useAuth, useInitialRender } from "../../utils/hooks";
import { notify } from "../../utils/notify";

type Props = {};

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  addressLine: string;
  zipCode: string;
  birthdayDate: number;
  birthdayMonth: number;
  birthdayYear: number;
  trackHistory: boolean;
  phoneNumber: string;
};
const Account: React.FC<Props> = () => {
  const { register, handleSubmit, control, errors } = useForm<FormValues>({ mode: "onBlur" });
  const { data, error, loading } = useAuth();
  const {
    field: { ref: trackHistoryRef, onChange: onTrackHistoryChange, ...trackHistoryProps },
  } = useController({
    name: "trackHistory",
    control,
    defaultValue: data?.me?.account.trackHistory ?? true,
  });
  const { data: paymentsData, error: paymentsError, loading: paymentsLoading } = useGetPaymentsQuery();
  const { data: datesData, error: datesError, loading: datesLoading } = useGetPaymentsDatesQuery();

  const [extraFormValues, setExtraFormValues] = useState({
    honorificTitle: data?.me?.account.honorificTitle,
    countryId: data?.me?.account.country?.id,
    telCountryId: data?.me?.account.telCountry?.id,
    imgUrl: data?.me?.account.imgUrl,
  });
  const isInitialRender = useInitialRender();

  const [update] = useUpdateUserMutation();
  const [signS3] = useSignS3Mutation();

  const birthday = useMemo(() => dayjs(data?.me?.account.birthday), [data]);

  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleValue = async () => handleSubmit(async data => await handleChange(data))();

  const handleUserAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    const { name, type } = file;
    if (!type.includes("image")) notify("error", "Please provide an image type of file");

    const { data, errors } = await signS3({
      variables: {
        filename: name,
        filetype: type,
        s3Bucket: "user-account-images",
      },
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
    if (!data || !data.signS3) notify("error", COMMON_ERRORS.SOMETHING_WENT_WRONG);
    const newData = { ...extraFormValues, imgUrl: data?.signS3.url };
    setExtraFormValues(newData);
    await uploadToS3(file, data?.signS3.signedRequest);
    await handleChange(undefined, newData);
  };

  const handleSelect = async (values: SelectedItems[], name: keyof typeof extraFormValues) => {
    let selected = values.find(val => val.selected);
    if (!selected) return;
    let newVal = selected.content;
    if (newVal?.toLowerCase() === "none") newVal = newVal.toLowerCase();
    else if (name === "countryId") newVal = COUNTRIES[newVal.toUpperCase()].id;
    else if (name === "telCountryId") newVal = COUNTRIES[selected.id.toUpperCase()].id;
    const newData = { ...extraFormValues, [name]: newVal };
    if (newVal) {
      setExtraFormValues(newData);
      await handleChange(undefined, newData);
    }
  };

  const handleChange = debounce(async (formValues?: FormValues, extraFormData?: typeof extraFormValues) => {
    if (isInitialRender) return;
    const {
      addressLine,
      city,
      countryId,
      email,
      firstName,
      lastName,
      zipCode,
      honorificTitle,
      birthdayDate,
      birthdayMonth,
      birthdayYear,
      imgUrl,
      trackHistory,
      phoneNumber,
      telCountryId,
    } = {
      ...formValues,
      ...extraFormData,
    };
    const newBirthday =
      !!birthdayDate && !!birthdayMonth && !!birthdayYear
        ? dayjs(`${birthdayYear}-${birthdayMonth}-${birthdayDate}`)
        : undefined;

    const { errors } = await update({
      variables: {
        address: addressLine,
        city,
        countryId,
        email,
        firstName,
        lastName,
        zipCode,
        imgUrl,
        birthday: newBirthday && newBirthday.isValid() ? newBirthday.format(dayjsFormat.ISO_STRING) : "none",
        honorificTitle,
        trackHistory,
        phoneNumber,
        telCountryId,
      },
      update: (cache, { data }) => {
        const cachedData = cache.readQuery<MeQuery>({ query: MeDocument });
        if (!data || !cachedData) return;
        cache.writeQuery({ query: MeDocument, data: { ...cachedData.me, ...data.updateUser.user } });
      },
    });
    if (errors) errors.forEach(({ message }) => notify("error", message));
  }, 750);

  return (
    <Layout>
      <Toaster position="top-center" />
      <UserAccount.Header />
      {loading || paymentsLoading || datesLoading ? (
        <h2>Loading...</h2>
      ) : error ||
        !data ||
        !data.me ||
        paymentsError ||
        !paymentsData ||
        !paymentsData.getPayments ||
        datesError ||
        !datesData ? (
        <h2>Error</h2>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit="initial">
          <div className="account__container">
            <IndexPage.Header
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
              exit="initial"
              header={
                <>
                  Recent <span className="normal">trips</span>
                </>
              }
            >
              {({ position, itemsRef, handleClick }) => {
                return (paymentsData.getPayments || [])
                  .map(({ visits, beachBar: { id, name, thumbnailUrl, location: { city, region } } }) => ({
                    beachBar: { id, name, city: city?.name, region: region?.name },
                    imgProps: { src: thumbnailUrl },
                    visits: visits.map(({ time, ...rest }) => ({ ...rest, hour: time.value })),
                  }))
                  .map(({ imgProps: { src }, beachBar, visits }, i) => (
                    <Visit
                      key={beachBar.id}
                      idx={i}
                      imgProps={{ src }}
                      beachBar={beachBar}
                      visits={visits}
                      ref={el => (itemsRef.current[i] = el)}
                      active={i === position}
                      onClick={() => handleClick(i)}
                    />
                  ));
              }}
            </IndexPage.Header>
            <UserAccount.Menu defaultSelected="/" />
            <div>
              <Form.Group as="form" onChange={handleValue}>
                <Input
                  placeholder="Email"
                  name="email"
                  type="email"
                  defaultValue={data.me.email}
                  forwardref={register}
                  secondhelptext={{ error: true, value: errors.email?.message }}
                />
                <Input
                  placeholder="First name"
                  name="firstName"
                  defaultValue={data.me.firstName}
                  forwardref={register}
                  secondhelptext={{ error: true, value: errors.firstName?.message }}
                />
                <Input
                  placeholder="Last name"
                  name="lastName"
                  defaultValue={data.me.lastName}
                  forwardref={register}
                  secondhelptext={{ error: true, value: errors.lastName?.message }}
                />
                <Form.Header id="details">Details</Form.Header>
                <Input.Tel
                  defaultCountry={data.me.account.telCountry?.name.toUpperCase() as any}
                  inputProps={{
                    name: "phoneNumber",
                    placeholder: "Phone number",
                    defaultValue: data.me.account.phoneNumber,
                    forwardref: register,
                  }}
                  selectProps={{ onSelect: items => handleSelect(items, "telCountryId") }}
                />
                <Autosuggest
                  placeholder="Honorific title"
                  name="honorificTitle"
                  defaultValue={data.me.account.honorificTitle}
                  onSelect={values => handleSelect(values, "honorificTitle")}
                >
                  {["None", "Mr", "Mrs", "Ms", "Miss", "Lady", "Sr", "Dr"].map((val, i) => (
                    <Select.Item key={"honorific_title_" + i} id={val} content={val} />
                  ))}
                </Autosuggest>
                <div className="w-100 account__birthday flex-row-space-between-flex-end">
                  <Input.Number
                    min={1}
                    max={31}
                    name="birthdayDate"
                    label="Birthday"
                    placeholder="Date"
                    floatingplaceholder
                    none
                    defaultValue={birthday && birthday.date()}
                    onValue={handleValue}
                    forwardref={register}
                  />
                  <Input.Number
                    min={1}
                    max={12}
                    name="birthdayMonth"
                    placeholder="Month"
                    floatingplaceholder
                    none
                    defaultValue={birthday && birthday.month()}
                    onValue={handleValue}
                    forwardref={register}
                  />
                  <Input.Number
                    // min={1900}
                    max={dayjs().year()}
                    name="birthdayYear"
                    placeholder="Year"
                    floatingplaceholder
                    none
                    defaultValue={birthday && birthday.year()}
                    onValue={handleValue}
                    forwardref={register}
                  />
                </div>
                <Autosuggest
                  placeholder="Country"
                  autoComplete="off"
                  name="country"
                  defaultValue={COUNTRIES_ARR[parseInt(data.me.account.country?.id || "1") - 1].name}
                  onSelect={values => handleSelect(values, "countryId")}
                >
                  <Select.Item id="none" content="None" />
                  <Select.Countries />
                </Autosuggest>
                <Input placeholder="City" name="city" defaultValue={data.me.account.city} forwardref={register} />
                <Input
                  placeholder="Address lime"
                  name="addressLine"
                  defaultValue={data.me.account.address}
                  forwardref={register}
                />
                <Input
                  placeholder="Zip code"
                  name="zipCode"
                  defaultValue={data.me.account.zipCode}
                  forwardref={register}
                />
                <div className="account__upload">
                  <Input
                    type="file"
                    label="Account image"
                    accept="image/*"
                    hidden
                    aria-hidden="true"
                    onChange={async e => await handleUserAvatarUpload(e)}
                    forwardref={uploadInputRef}
                  />
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      if (uploadInputRef && uploadInputRef.current) uploadInputRef.current.click();
                    }}
                  >
                    Upload image
                  </Button>
                </div>
                <Form.Header id="preferences">Preferences</Form.Header>
                <Switch
                  defaultChecked={data.me.account.trackHistory}
                  label={{ value: "Track search history", position: "right" }}
                  ref={trackHistoryRef}
                  onChange={e => onTrackHistoryChange(e.currentTarget.value === "true" ? false : true)}
                  {...trackHistoryProps}
                />
              </Form.Group>
            </div>
          </div>
        </motion.div>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const apolloClient = initializeApollo(ctx);

  await getAuth({ apolloClient });
  await apolloClient.query({ query: GetPaymentsDocument });
  await apolloClient.query({ query: GetPaymentsDatesDocument });

  return {
    props: {
      [INITIAL_APOLLO_STATE]: apolloClient.cache.extract(),
    },
  };
};

export default Account;
