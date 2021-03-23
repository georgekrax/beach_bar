// export const UserContactDetailsType = objectType({
//   name: "UserContactDetails",
//   description: "Represents the contact details info of a user",
//   definition(t) {
//     t.id("id", { description: "The ID value of user's account contact details" });
//     t.field("account", { type: UserAccountType, description: "The account of user", resolve: o => o.account });
//     t.nullable.field("country", {
//       type: CountryType,
//       description: "The country origin of a user",
//       resolve: o => o.country,
//     });
//     t.nullable.field("secondaryEmail", { type: EmailScalar, description: "A secondary email address to contact the user" });
//     t.nullable.string("phoneNumber", { description: "User's phone number" });
//   },
// });

// export const AddUserContactDetailsType = objectType({
//   name: "AddUserContactDetails",
//   description: "Info to be returned when contact details are added (assigned) to a user",
//   definition(t) {
//     t.field("contactDetails", {
//       type: UserContactDetailsType,
//       description: "The contact details of the user",
//       resolve: o => o.contactDetails,
//     });
//     t.boolean("added", {
//       description: "A boolean that indicates if the contact details have been successfully added (assigned) to the user",
//     });
//   },
// });

// export const AddUserContactDetailsResult = unionType({
//   name: "AddUserContactDetailsResult",
//   definition(t) {
//     t.members("AddUserContactDetails", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "AddUserContactDetails";
//     }
//   },
// });

// export const UpdateUserContactDetailsType = objectType({
//   name: "UpdateUserContactDetails",
//   description: "Info to be returned when contact details of a user are updated",
//   definition(t) {
//     t.field("contactDetails", {
//       type: UserContactDetailsType,
//       description: "The contact details of the user",
//       resolve: o => o.contactDetails,
//     });
//     t.boolean("updated", {
//       description: "A boolean that indicates if the contact details of the user have been successfully updated",
//     });
//   },
// });

// export const UpdateUserContactDetailsResult = unionType({
//   name: "UpdateUserContactDetailsResult",
//   definition(t) {
//     t.members("UpdateUserContactDetails", "Error");
//   },
//   resolveType: item => {
//     if (item.error) {
//       return "Error";
//     } else {
//       return "UpdateUserContactDetails";
//     }
//   },
// });
