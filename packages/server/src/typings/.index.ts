export type ErrorType = {
  error?: {
    code?: string;
    message: string;
  };
};

export type ErrorListType = {
  error?: {
    code?: string;
    message: string;
  };
}[];

export type AddType = {
  added: boolean;
};

export type UpdateType = {
  updated: boolean;
};

export type DeleteType =
  | {
      deleted: boolean;
    }
  | ErrorType;

export type TDelete = {
  deleted: boolean;
};

export type SuccessType =
  | ErrorType
  | {
      success: boolean;
    };

export type SuccessObjectType = {
  success: boolean;
};

export type LoginDetailsType = {
  osId?: number;
  browserId?: number;
  countryAlpha2Code?: string;
  countryId?: number;
  city?: string;
};
