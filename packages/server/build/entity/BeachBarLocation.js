"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeachBarLocation = void 0;
const dayjs_1 = require("dayjs");
const typeorm_1 = require("typeorm");
const BeachBar_1 = require("./BeachBar");
const City_1 = require("./City");
const Country_1 = require("./Country");
const Region_1 = require("./Region");
let BeachBarLocation = class BeachBarLocation extends typeorm_1.BaseEntity {
    update({ address, zipCode, latitude, longitude, countryId, city, region, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (address && address !== this.address)
                    this.address = address;
                if (zipCode && zipCode !== this.zipCode)
                    this.zipCode = zipCode;
                if (latitude && latitude !== this.latitude)
                    this.latitude = latitude;
                if (longitude && longitude !== this.longitude)
                    this.longitude = longitude;
                if (countryId && countryId !== this.countryId) {
                    const country = yield Country_1.Country.findOne(countryId);
                    if (!country)
                        throw new Error("Invalid country");
                    this.country = country;
                }
                if (city && city.toLowerCase() !== this.city.name.toLowerCase()) {
                    let newCity = yield City_1.City.findOne({ where: `"name" ILIKE '${city}'` });
                    if (!newCity) {
                        newCity = City_1.City.create({
                            name: city,
                            countryId: this.country.id,
                            country: this.country,
                        });
                        yield newCity.save();
                    }
                    this.city = newCity;
                    yield this.save();
                }
                if (region && region.toLowerCase() !== ((_a = this.region) === null || _a === void 0 ? void 0 : _a.name.toLowerCase())) {
                    let newRegion = yield Region_1.Region.findOne({ where: `"name" ILIKE '${region}'` });
                    if (!newRegion) {
                        newRegion = Region_1.Region.create({
                            name: region,
                            countryId: this.country.id,
                            country: this.country,
                            cityId: this.city.id,
                            city: this.city,
                        });
                        yield newRegion.save();
                    }
                    this.region = newRegion;
                }
                yield this.save();
                yield this.beachBar.updateRedis();
                return this;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BeachBarLocation.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 100, name: "address" }),
    __metadata("design:type", String)
], BeachBarLocation.prototype, "address", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 12, name: "zip_code", nullable: true }),
    __metadata("design:type", String)
], BeachBarLocation.prototype, "zipCode", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 6, name: "latitude" }),
    __metadata("design:type", Number)
], BeachBarLocation.prototype, "latitude", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", precision: 10, scale: 6, name: "longitude" }),
    __metadata("design:type", Number)
], BeachBarLocation.prototype, "longitude", void 0);
__decorate([
    typeorm_1.Column({ type: "geography", name: "where_is" }),
    __metadata("design:type", Array)
], BeachBarLocation.prototype, "whereIs", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "country_id" }),
    __metadata("design:type", Number)
], BeachBarLocation.prototype, "countryId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "city_id" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], BeachBarLocation.prototype, "cityId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "region_id", nullable: true }),
    __metadata("design:type", Number)
], BeachBarLocation.prototype, "regionId", void 0);
__decorate([
    typeorm_1.Column({ type: "integer", name: "beach_bar_id", unique: true }),
    __metadata("design:type", Number)
], BeachBarLocation.prototype, "beachBarId", void 0);
__decorate([
    typeorm_1.OneToOne(() => BeachBar_1.BeachBar, beachBar => beachBar.location, { nullable: false }),
    typeorm_1.JoinColumn({ name: "beach_bar_id" }),
    __metadata("design:type", BeachBar_1.BeachBar)
], BeachBarLocation.prototype, "beachBar", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, country => country.beachBarLocations, { nullable: false }),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], BeachBarLocation.prototype, "country", void 0);
__decorate([
    typeorm_1.ManyToOne(() => City_1.City, city => city.beachBarLocations, { nullable: false }),
    typeorm_1.JoinColumn({ name: "city_id" }),
    __metadata("design:type", City_1.City)
], BeachBarLocation.prototype, "city", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Region_1.Region, region => region.beachBarLocations, { nullable: true }),
    typeorm_1.JoinColumn({ name: "region_id" }),
    __metadata("design:type", Region_1.Region)
], BeachBarLocation.prototype, "region", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarLocation.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarLocation.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true }),
    __metadata("design:type", dayjs_1.Dayjs)
], BeachBarLocation.prototype, "deletedAt", void 0);
BeachBarLocation = __decorate([
    typeorm_1.Entity({ name: "beach_bar_location", schema: "public" })
], BeachBarLocation);
exports.BeachBarLocation = BeachBarLocation;
