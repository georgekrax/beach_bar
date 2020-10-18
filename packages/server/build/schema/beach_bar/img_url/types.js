"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBeachBarImgUrlResult = exports.UpdateBeachBarImgUrlType = exports.AddBeachBarImgUrlResult = exports.AddBeachBarImgUrlType = exports.BeachBarImgUrlType = void 0;
const common_1 = require("@georgekrax-hashtag/common");
const schema_1 = require("@nexus/schema");
const types_1 = require("../types");
exports.BeachBarImgUrlType = schema_1.objectType({
    name: "BeachBarImgUrl",
    description: "Represents a #beach_bar's image (URL value)",
    definition(t) {
        t.id("id", { nullable: false });
        t.field("imgUrl", { type: common_1.UrlScalar, nullable: false });
        t.string("description", {
            nullable: true,
            description: "A short description about what the image represents. The characters of the description should not exceed the number 175",
        });
        t.field("beachBar", { type: types_1.BeachBarType, nullable: false, resolve: o => o.beachBar });
    },
});
exports.AddBeachBarImgUrlType = schema_1.objectType({
    name: "AddBeachBarImgUrl",
    description: "Info to be returned when an image (URL) is added to a #beach_bar",
    definition(t) {
        t.field("imgUrl", {
            type: exports.BeachBarImgUrlType,
            description: "The image that is added",
            nullable: false,
            resolve: o => o.imgUrl,
        });
        t.boolean("added", {
            nullable: false,
            description: "Indicates if the image (URL) has been successfully been added to the #beach_bar",
        });
    },
});
exports.AddBeachBarImgUrlResult = schema_1.unionType({
    name: "AddBeachBarImgUrlResult",
    definition(t) {
        t.members("AddBeachBarImgUrl", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "AddBeachBarImgUrl";
            }
        });
    },
});
exports.UpdateBeachBarImgUrlType = schema_1.objectType({
    name: "UpdateBeachBarImgUrl",
    description: "Info to be returned when the details of #beach_bar's image, are updated",
    definition(t) {
        t.field("imgUrl", {
            type: exports.BeachBarImgUrlType,
            description: "The image that is updated",
            nullable: false,
            resolve: o => o.imgUrl,
        });
        t.boolean("updated", {
            nullable: false,
            description: "Indicates if the image details have been successfully updated",
        });
    },
});
exports.UpdateBeachBarImgUrlResult = schema_1.unionType({
    name: "UpdateBeachBarImgUrlResult",
    definition(t) {
        t.members("UpdateBeachBarImgUrl", "Error");
        t.resolveType(item => {
            if (item.error) {
                return "Error";
            }
            else {
                return "UpdateBeachBarImgUrl";
            }
        });
    },
});
//# sourceMappingURL=types.js.map