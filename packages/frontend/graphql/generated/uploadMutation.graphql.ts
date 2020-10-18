/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type uploadMutationVariables = {
    filename: string;
    filetype: string;
    tableName: string;
};
export type uploadMutationResponse = {
    readonly signS3: {
        readonly signedRequest: unknown;
        readonly url: unknown;
    } | null;
};
export type uploadMutation = {
    readonly response: uploadMutationResponse;
    readonly variables: uploadMutationVariables;
};



/*
mutation uploadMutation(
  $filename: String!
  $filetype: String!
  $tableName: String!
) {
  signS3(filename: $filename, filetype: $filetype, tableName: $tableName) {
    signedRequest
    url
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filename",
    "type": "String!"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filetype",
    "type": "String!"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "tableName",
    "type": "String!"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "filename",
        "variableName": "filename"
      },
      {
        "kind": "Variable",
        "name": "filetype",
        "variableName": "filetype"
      },
      {
        "kind": "Variable",
        "name": "tableName",
        "variableName": "tableName"
      }
    ],
    "concreteType": "S3Payload",
    "kind": "LinkedField",
    "name": "signS3",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "signedRequest",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "url",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "uploadMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "uploadMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "uploadMutation",
    "operationKind": "mutation",
    "text": "mutation uploadMutation(\n  $filename: String!\n  $filetype: String!\n  $tableName: String!\n) {\n  signS3(filename: $filename, filetype: $filetype, tableName: $tableName) {\n    signedRequest\n    url\n  }\n}\n"
  }
};
})();
(node as any).hash = 'd795b98f3011d3ed8b6d9f7d1582b612';
export default node;
