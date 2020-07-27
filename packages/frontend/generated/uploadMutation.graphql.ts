/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type uploadMutationVariables = {
    file: unknown;
};
export type uploadMutationResponse = {
    readonly uploadSingleFile: {
        readonly filename: string;
        readonly mimetype: string;
        readonly encoding: string;
    } | null;
};
export type uploadMutation = {
    readonly response: uploadMutationResponse;
    readonly variables: uploadMutationVariables;
};



/*
mutation uploadMutation(
  $file: Upload!
) {
  uploadSingleFile(file: $file) {
    filename
    mimetype
    encoding
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "file",
    "type": "Upload!"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "file",
        "variableName": "file"
      }
    ],
    "concreteType": "File",
    "kind": "LinkedField",
    "name": "uploadSingleFile",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "filename",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "mimetype",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "encoding",
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
    "text": "mutation uploadMutation(\n  $file: Upload!\n) {\n  uploadSingleFile(file: $file) {\n    filename\n    mimetype\n    encoding\n  }\n}\n"
  }
};
})();
(node as any).hash = '279df082e1333b93125274961403da69';
export default node;
