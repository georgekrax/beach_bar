import { extendType } from "nexus";

export const UserContactDetailsCrudMutation = extendType({
  type: "Mutation",
  definition() {
    // t.field("addUserContactDetails", {
    //   type: AddUserContactDetailsResult,
    //   description: "Add contact details to a user",
    //   args: {
    //     countryId: nullable(intArg({ description: "The ID value of the country of the contact details" })),
    //     secondaryEmail: nullable(
    //       arg({
    //         type: EmailScalar,
    //         description: "A secondary email address for the user",
    //       })
    //     ),
    //     phoneNumber: nullable(stringArg({ description: "A phone number to call the user" })),
    //   },
    //   resolve: async (_, { countryId, secondaryEmail, phoneNumber }, { payload }: MyContext): Promise<AddUserContactDetailsType> => {
    //     if (!payload) {
    //       return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
    //     }
    //     if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope))) {
    //       return {
    //         error: {
    //           code: errors.UNAUTHORIZED_CODE,
    //           message: errors.SOMETHING_WENT_WRONG,
    //         },
    //       };
    //     }
    //     if (countryId && countryId === ("" || " ")) {
    //       return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid country" } };
    //     }
    //     if (phoneNumber && phoneNumber === ("" || " ")) {
    //       return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid phone number" } };
    //     }
    //     if (secondaryEmail && secondaryEmail === ("" || " ")) {
    //       return { error: { code: errors.INVALID_ARGUMENTS, message: errors.INVALID_EMAIL_ADDRESS } };
    //     }
    //     if (!countryId && !secondaryEmail && !phoneNumber) {
    //       return { error: { code: errors.INVALID_ARGUMENTS, message: errors.EMPTY_VALUES } };
    //     }
    //     const user = await User.findOne({
    //       where: { id: payload.sub },
    //       relations: ["account", "account.contactDetails"],
    //     });
    //     if (!user) {
    //       return { error: { code: errors.NOT_FOUND, message: errors.USER_NOT_FOUND_MESSAGE } };
    //     }
    //     const userContactDetails = await UserContactDetails.findOne({ account: user.account, phoneNumber, secondaryEmail });
    //     if (userContactDetails) {
    //       return {
    //         error: {
    //           code: errors.CONFLICT,
    //           message: `Contact details with the phone number of '${phoneNumber}' & secondary email address of '${secondaryEmail}' already exist`,
    //         },
    //       };
    //     }
    //     const country = await Country.findOne({ where: { id: countryId } });
    //     if (!country) {
    //       return { error: { code: errors.NOT_FOUND, message: `Country with ID of ${countryId} does not exist` } };
    //     }
    //     const newContactDetails = UserContactDetails.create({
    //       account: user.account,
    //       country,
    //       secondaryEmail,
    //       phoneNumber,
    //     });
    //     try {
    //       await newContactDetails.save();
    //     } catch (err) {
    //       if (err.message === 'duplicate key value violates unique constraint "contact_details_phone_number_key"') {
    //         return {
    //           error: {
    //             code: errors.CONFLICT,
    //             message: `Contact details with phone number of '${phoneNumber.toString()}', without a secondary email, already exist`,
    //           },
    //         };
    //       } else if (err.message === 'duplicate key value violates unique constraint "contact_details_secondary_email_key"') {
    //         return {
    //           error: {
    //             code: errors.CONFLICT,
    //             message: `Contact details with secondary email of '${secondaryEmail}', without a phone number, already exist`,
    //           },
    //         };
    //       } else {
    //         return { error: { message: `Something went wrong: ${err.message}` } };
    //       }
    //     }
    //     newContactDetails.account.user = user;
    //     return {
    //       contactDetails: newContactDetails,
    //       added: true,
    //     };
    //   },
    // });
    // t.field("updateUserContactDetails", {
    //   type: UpdateUserContactDetailsResult,
    //   description: "Update specific contact details of a user",
    //   args: {
    //     id: intArg(),
    //     secondaryEmail: nullable(arg({ type: EmailScalar })),
    //     phoneNumber: nullable(stringArg()),
    //   },
    //   resolve: async (_, { id, secondaryEmail, phoneNumber }, { payload }: MyContext): Promise<UpdateUserContactDetailsType> => {
    //     if (!payload) {
    //       return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
    //     }
    //     if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope))) {
    //       return {
    //         error: {
    //           code: errors.UNAUTHORIZED_CODE,
    //           message: errors.SOMETHING_WENT_WRONG,
    //         },
    //       };
    //     }
    //     if (secondaryEmail && secondaryEmail === ("" || " ")) {
    //       return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid secondary email address" } };
    //     }
    //     if (phoneNumber && phoneNumber === ("" || " ")) {
    //       return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid phone number" } };
    //     }
    //     if (!secondaryEmail && !phoneNumber) {
    //       return {
    //         error: { code: errors.INVALID_ARGUMENTS, message: "Please provide either a new phone number or a secondary email" },
    //       };
    //     }
    //     const user = await User.findOne({
    //       where: { id: payload.sub },
    //       relations: ["account", "account.contactDetails"],
    //     });
    //     if (!user) {
    //       return { error: { code: errors.NOT_FOUND, message: errors.SOMETHING_WENT_WRONG } };
    //     }
    //     const contactDetails = await UserContactDetails.findOne({
    //       where: { id },
    //       relations: ["account", "country", "account.user", "account.contactDetails", "country.cities"],
    //     });
    //     if (!contactDetails) {
    //       return { error: { code: errors.NOT_FOUND, message: errors.SOMETHING_WENT_WRONG } };
    //     }
    //     if (phoneNumber) {
    //       contactDetails.phoneNumber = phoneNumber;
    //     }
    //     if (secondaryEmail) {
    //       contactDetails.secondaryEmail = secondaryEmail;
    //     }
    //     try {
    //       await contactDetails.save();
    //     } catch (err) {
    //       if (err.message === 'duplicate key value violates unique constraint "contact_details_phone_number_key"') {
    //         return {
    //           error: {
    //             code: errors.CONFLICT,
    //             message: `Contact details with phone number of '${phoneNumber.toString()}', without a secondary email, already exist`,
    //           },
    //         };
    //       } else if (err.message === 'duplicate key value violates unique constraint "contact_details_secondary_email_key"') {
    //         return {
    //           error: {
    //             code: errors.CONFLICT,
    //             message: `Contact details with secondary email of '${secondaryEmail}', without a phone number, already exist`,
    //           },
    //         };
    //       } else {
    //         return { error: { message: `Something went wrong: ${err.message}` } };
    //       }
    //     }
    //     return {
    //       contactDetails,
    //       updated: true,
    //     };
    //   },
    // });
    // t.field("deleteContactDetails", {
    //   type: DeleteResult,
    //   description: "Delete (remove) specific contact details from user",
    //   args: {
    //     id: nullable(intArg()),
    //   },
    //   resolve: async (_, { id }, { payload }: MyContext): Promise<DeleteType> => {
    //     if (!payload) {
    //       return { error: { code: errors.NOT_AUTHENTICATED_CODE, message: errors.NOT_AUTHENTICATED_MESSAGE } };
    //     }
    //     if (!payload.scope.some(scope => ["beach_bar@crud:user"].includes(scope))) {
    //       return {
    //         error: {
    //           code: errors.UNAUTHORIZED_CODE,
    //           message: errors.SOMETHING_WENT_WRONG,
    //         },
    //       };
    //     }
    //     if (!id || id === ("" || " ")) {
    //       return { error: { code: errors.INVALID_ARGUMENTS, message: "Please provide a valid contact details ID" } };
    //     }
    //     const user = await User.findOne({
    //       where: { id: payload.sub },
    //       relations: ["account", "account.contactDetails"],
    //     });
    //     if (!user || !user.account || !user.account.contactDetails) {
    //       return { error: { code: errors.NOT_FOUND, message: errors.SOMETHING_WENT_WRONG } };
    //     }
    //     const contactDetails = user.account.contactDetails.find(contactDetails => contactDetails.id === id);
    //     if (!contactDetails) {
    //       return { error: { code: errors.NOT_FOUND, message: errors.SOMETHING_WENT_WRONG } };
    //     }
    //     try {
    //       await getConnection().getRepository(UserContactDetails).softDelete(contactDetails.id);
    //     } catch (err) {
    //       return { error: { message: `Something went wrong: ${err}` } };
    //     }
    //     return {
    //       deleted: true,
    //     };
    //   },
    // });
  },
});
