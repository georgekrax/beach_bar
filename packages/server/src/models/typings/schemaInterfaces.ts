import { Document, Schema } from "mongoose";

export interface IClientBrowser extends Document {
  name: string;
}

export type IClientOs = IClientBrowser;

export interface ILoginDetails extends Document {
  accountId: number;
  platformId: number;
  status: string;
  osId?: Schema.Types.ObjectId;
  browserId?: Schema.Types.ObjectId;
  countryId?: number;
  cityId?: number;
  ipAddr?: string;
}

export interface IPlatform extends IClientBrowser {
  urlHostname: string;
}

export interface IUserHistory extends Document {
  activityId: Schema.Types.ObjectId;
  objectId?: number;
  userId?: number;
  ipAddr?: string;
}

export type IUserHistoryActivity = IClientBrowser;
