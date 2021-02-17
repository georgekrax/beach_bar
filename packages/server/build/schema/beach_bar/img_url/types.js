"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarImgUrlResult = exports.UpdateBeachBarImgUrlType = exports.AddBeachBarImgUrlResult = exports.AddBeachBarImgUrlType = exports.BeachBarImgUrlType = void 0;
const graphql_1 = require("@the_hashtag/common/dist/graphql");
const nexus_1 = require("nexus");
const types_1 = require("../types");
exports.BeachBarImgUrlType = nexus_1.objectType({
    name: "BeachBarImgUrl",
    description: "Represents a #beach_bar's image (URL value)",
    definition(t) {
        t.id("id");
        t.field("imgUrl", { type: graphql_1.UrlScalar });
        t.nullable.string("description", {
            description: "A short description about what the image represents. The characters of the description should not exceed the number 175",
        });
        t.field("beachBar", { type: types_1.BeachBarType, resolve: o => o.beachBar });
    },
});
exports.AddBeachBarImgUrlType = nexus_1.objectType({
    name: "AddBeachBarImgUrl",
    description: "Info to be returned when an image (URL) is added to a #beach_bar",
    definition(t) {
        t.field("imgUrl", {
            type: exports.BeachBarImgUrlType,
            description: "The image that is added",
            resolve: o => o.imgUrl,
        });
        t.boolean("added", { description: "Indicates if the image (URL) has been successfully been added to the #beach_bar" });
    },
});
exports.AddBeachBarImgUrlResult = nexus_1.unionType({
    name: "AddBeachBarImgUrlResult",
    definition(t) {
        t.members("AddBeachBarImgUrl", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "AddBeachBarImgUrl";
        }
    },
});
exports.UpdateBeachBarImgUrlType = nexus_1.objectType({
    name: "UpdateBeachBarImgUrl",
    description: "Info to be returned when the details of #beach_bar's image, are updated",
    definition(t) {
        t.field("imgUrl", {
            type: exports.BeachBarImgUrlType,
            description: "The image that is updated",
            resolve: o => o.imgUrl,
        });
        t.boolean("updated", { description: "Indicates if the image details have been successfully updated" });
    },
});
exports.UpdateBeachBarImgUrlResult = nexus_1.unionType({
    name: "UpdateBeachBarImgUrlResult",
    definition(t) {
        t.members("UpdateBeachBarImgUrl", "Error");
    },
    resolveType: item => {
        if (item.name === "Error") {
            return "Error";
        }
        else {
            return "UpdateBeachBarImgUrl";
        }
    },
});
