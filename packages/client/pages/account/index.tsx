import Account from "@/components/Account";
import Layout from "@/components/Layout";
import Next from "@/components/Next";
import { MeDocument, MeQuery, useUpdateUserMutation } from "@/graphql/generated";
import { AccountFormValues as FormValues } from "@/typings/user";
import { useAuth, useHookForm } from "@/utils/hooks";
import { notify } from "@/utils/notify";
import { dayjsFormat } from "@beach_bar/common";
import { Autosuggest, Form, Input, Select, SelectedItems, Switch } from "@hashtag-design-system/components";
import { COUNTRIES, COUNTRIES_ARR } from "@the_hashtag/common";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";

const AccountPage: React.FC = () => {
  const { data, loading, error, handleLogin } = useAuth({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const [updateUser] = useUpdateUserMutation();

  const dataToForm = (data: MeQuery["me"]): Partial<FormValues> => {
    if (!data) return {};
    const { account, ...me } = data;
    const { address, birthday: accBirthday } = account;
    const birthday = accBirthday ? dayjs(accBirthday) : undefined;

    return {
      ...me,
      ...account,
      addressLine: address,
      countryId: account.country?.id,
      telCountryId: account.telCountry?.id,
      birthdayDate: birthday ? birthday.date() : undefined,
      birthdayMonth: birthday ? birthday.month() : undefined,
      birthdayYear: birthday ? birthday.year() : undefined,
    };
  };

  const defaultValues: Partial<FormValues> = useMemo(() => dataToForm(data?.me), [data]);

  const {
    setValue,
    handleSubmit,
    formState: { errors: formErrors },
    ...form
  } = useForm<FormValues>({ mode: "onBlur", defaultValues });
  const { handleChange } = useHookForm<FormValues, ReturnType<typeof dataToForm>>({
    ...form,
    setValue,
    data: dataToForm(data?.me),
  });

  const handleUserAvatarUpload = async (s3Url: string) => {
    setValue("imgUrl", s3Url);
    await handleComponentUnmount();
  };

  const handleSelect = async (values: SelectedItems[], name: keyof FormValues) => {
    let selected = values.find(val => val.selected);
    if (!selected) return;
    let newVal = selected.content;
    if (newVal?.toLowerCase() === "none") newVal = newVal.toLowerCase();
    else if (name === "countryId") newVal = COUNTRIES[newVal.toUpperCase()].id;
    else if (name === "telCountryId") newVal = COUNTRIES[selected.id.toUpperCase()].id;
    if (newVal) setValue(name, newVal);
  };

  const handleComponentUnmount = async () =>
    handleSubmit(async ({ birthdayDate, birthdayMonth, birthdayYear, addressLine, trackHistory, ...newData }) => {
      const newBirthday =
        !!birthdayDate && !!birthdayMonth && !!birthdayYear
          ? dayjs(birthdayYear + "-" + birthdayMonth + "-" + birthdayDate)
          : undefined;

      const { data, errors } = await updateUser({
        variables: {
          ...newData,
          address: addressLine,
          trackHistory,
          birthday: newBirthday && newBirthday.isValid() ? newBirthday.format(dayjsFormat.ISO_STRING) : "none",
        },
        update: (cache, { data }) => {
          const cachedData = cache.readQuery<MeQuery>({ query: MeDocument });
          if (!data || !cachedData) return;
          cache.writeQuery({
            query: MeDocument,
            data: {
              me: {
                ...cachedData.me,
                ...data.updateUser,
                account: { ...data.updateUser.account, trackHistory },
              },
            },
          });
        },
      });
      if (!data && errors) errors.forEach(({ message }) => notify("error", message));
    })();

  useEffect(() => {
    window.addEventListener("beforeunload", handleComponentUnmount);

    return () => {
      window.removeEventListener("beforeunload", handleComponentUnmount);
      handleComponentUnmount();
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    handleLogin();
  }, [loading, data?.me]);

  return (
    <Layout hasToaster>
      <Account.Dashboard className="account__container" defaultSelected="/account">
        {loading ? (
          <h2>Loading...</h2>
        ) : error || !data?.me ? (
          <h2>Error</h2>
        ) : (
          <Next.MotionContainer>
            <Account.Trips.Recent />
            <form className="account__form flex-row-flex-start-flex-start">
              <Form.Group as="div" className="account__group">
                <Account.BasicInfo defaultValues={defaultValues} handleChange={handleChange} errors={formErrors} />
                <Form.Header id="details">Details</Form.Header>
                <Input.Tel
                  // TODO: Revisit after you create bucket in AWS
                  withFlags={false}
                  defaultCountry={data.me.account.telCountry?.name.toUpperCase() as any}
                  selectProps={{ onSelect: items => handleSelect(items, "telCountryId") }}
                  inputProps={{
                    onChange: e => handleChange("phoneNumber", e.target.value),
                    placeholder: "Phone number",
                    defaultValue: defaultValues.phoneNumber,
                  }}
                />
                <Autosuggest
                  placeholder="Honorific title"
                  name="honorificTitle"
                  defaultValue={defaultValues.honorificTitle}
                  onSelect={values => handleSelect(values, "honorificTitle")}
                >
                  {["None", "Mr", "Mrs", "Ms", "Miss", "Lady", "Sr", "Dr"].map((val, i) => (
                    <Select.Item key={"honorific_title_" + i} id={val} content={val} />
                  ))}
                </Autosuggest>
                <Account.BirthdayField defaultValues={defaultValues} handleChange={handleChange} />
                <Autosuggest
                  placeholder="Country"
                  autoComplete="off"
                  name="country"
                  defaultValue={COUNTRIES_ARR[+(defaultValues.countryId || "1") - 1].name}
                  onSelect={values => handleSelect(values, "countryId")}
                >
                  <Select.Item id="none" content="None" />
                  {/* TODO: Revisit after you create bucket in AWS */}
                  <Select.Countries withFlags={false} />
                </Autosuggest>
                <Account.LocationDetails defaultValues={defaultValues} handleChange={handleChange} />
              </Form.Group>
              <Form.Group as="div" className="account__group">
                <div className="w100">
                  <Form.Header id="preferences" style={{ marginTop: 0, marginBottom: "0.5em" }}>
                    Preferences
                  </Form.Header>
                  <Switch
                    defaultChecked={defaultValues.trackHistory}
                    label={{ value: "Track search history", position: "right" }}
                    onChange={e => handleChange("trackHistory", e.currentTarget.value === "true" ? false : true)}
                  />
                </div>
                <Next.UploadBtn
                  label="Account image"
                  s3Bucket="user-account-images"
                  onChange={async ({ s3Url }) => {
                    if (s3Url) await handleUserAvatarUpload(s3Url);
                  }}
                />
              </Form.Group>
            </form>
          </Next.MotionContainer>
        )}
      </Account.Dashboard>
    </Layout>
  );
};

AccountPage.displayName = "AccountPage";

// export const getStaticProps: GetStaticProps = async () => {
//   const apolloClient = initializeApollo();

//   await getAuth({ apolloClient });
//   await apolloClient.query({ query: PaymentsDocument });

//   return { props: { [INITIAL_APOLLO_STATE]: apolloClient.cache.extract() }, revalidate: 10 };
// };

export default AccountPage;
