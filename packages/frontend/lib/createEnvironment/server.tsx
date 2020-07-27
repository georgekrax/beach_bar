import { RelayNetworkLayer, urlMiddleware } from "react-relay-network-modern/node8";
import { Environment, RecordSource, Store } from "relay-runtime";

export default {
  initEnvironment: (): any => {
    const source = new RecordSource();
    const store = new Store(source);

    return {
      environment: new Environment({
        store,
        network: new RelayNetworkLayer([
          urlMiddleware({
            url: () => process.env.GRAPHQL_API_ENDPOINT,
          }),
        ]),
      }),
    };
  },
  createEnvironment: (records: any): any => {
    const source = new RecordSource(records);
    const store = new Store(source);

    return new Environment({
      store,
      network: new RelayNetworkLayer([
        urlMiddleware({
          url: () => process.env.GRAPHQL_API_ENDPOINT,
        }),
      ]),
    });
  },
};
