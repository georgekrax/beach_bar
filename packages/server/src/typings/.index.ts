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

export type SuccessType = ErrorType & {
  success?: boolean;
};
