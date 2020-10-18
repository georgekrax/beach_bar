/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type pages_indexQueryVariables = {};
export type pages_indexQueryResponse = {
    readonly getBeachBarProducts: ReadonlyArray<{
        readonly name: string;
        readonly category: {
            readonly name: string;
        };
    }> | null;
};
export type pages_indexQuery = {
    readonly response: pages_indexQueryResponse;
    readonly variables: pages_indexQueryVariables;
};



/*
query pages_indexQuery {
  getBeachBarProducts(beachBarId: 2) {
    name
    category {
      name
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "beachBarId",
        "value": 2
      }
    ],
    "concreteType": "Product",
    "kind": "LinkedField",
    "name": "getBeachBarProducts",
    "plural": true,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "ProductCategory",
        "kind": "LinkedField",
        "name": "category",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": "getBeachBarProducts(beachBarId:2)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pages_indexQuery",
    "selections": (v1/*: any*/),
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pages_indexQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "pages_indexQuery",
    "operationKind": "query",
    "text": "query pages_indexQuery {\n  getBeachBarProducts(beachBarId: 2) {\n    name\n    category {\n      name\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '10fe4e75ecb99f5b0a20081c2f4224b3';
export default node;
