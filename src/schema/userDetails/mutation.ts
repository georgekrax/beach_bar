import { extendType, intArg, stringArg } from "@nexus/schema";
import { MyContext } from "../../common/myContext";
import errors from "../../constants/errors";
import { City } from "../../entity/City";
import { Country } from "../../entity/Country";
import { User } from "../../entity/User";
import { UserContactDetails } from "../../entity/UserContactDetails";
import { ErrorType } from "../returnTypes";
import { AddUserAccountContactDetailsResult } from "./contactDetails";
import { AddAccountContactDetailsType } from "./returnTypes";

export const UserContactDetailsCrudMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addContactDetailsToUser", {
      type: AddUserAccountContactDetailsResult,
      description: "Add contact details to a user",
      nullable: false,
      args: {
        countryId: intArg({ required: true, description: "The ID value of the country of the contact details" }),
        cityId: intArg({
          required: false,
          description: "The ID value of the city of the contact details. It can be a null value",
        }),
        phoneNumber: stringArg({ required: true, description: "A phone number to call the user" }),
      },
      resolve: async (
        _,
        { countryId, cityId, phoneNumber },
        { payload }: MyContext,
      ): Promise<AddAccountContactDetailsType | ErrorType> => {
        if (!payload) {
          return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
        }
        if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope))) {
          return {
            error: {
              code: errors.UNAUTHORIZED_CODE,
              message: errors.SOMETHING_WENT_WRONG,
            },
          };
        }
        if (!countryId || countryId === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid country" } };
        }
        if (!phoneNumber || phoneNumber === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid phone number" } };
        }
        if (cityId && cityId === ("" || " ")) {
          return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid city" } };
        }

        const user = await User.findOne({
          where: { id: payload.sub },
          relatios: ["account", "account.user", "account.contactDetails"],
        });
        if (!user) {
          return { error: { code: errors.NOT_FOUND, message: errors.USER_NOT_FOUND_MESSAGE } };
        }

        const userContactDetails = await UserContactDetails.findOne({ account: user.account, phoneNumber });
        if (userContactDetails) {
          return { error: { code: errors.CONFLICT, message: "Contact details with his phone number already exist" } };
        }

        const country = await Country.findOne({ id: countryId });
        if (!country) {
          return { error: { code: errors.NOT_FOUND, message: `Country with ID of ${countryId} does not exist` } };
        }
        let city: City | undefined = undefined;
        if (cityId) {
          city = await City.findOne({ id: cityId });
          if (!city) {
            return { error: { code: errors.NOT_FOUND, message: `City with ID of ${cityId} does not exist` } };
          }
        }

        const newContactDetails = UserContactDetails.create({
          account: user.account,
          country,
          city,
          phoneNumber,
        });
        try {
          await newContactDetails.save();
        } catch (err) {
          return { error: { message: `Something went wrong: ${err.message}` } };
        }

        return {
          contactDetails: newContactDetails,
          added: true,
        };
      },
    });
  },
});
