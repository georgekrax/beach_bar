import { createConnection, getConnectionManager, getConnectionOptions } from "typeorm";

const connectionManager = getConnectionManager();

export const createDBConnection = async (): Promise<void> => {
  if (!connectionManager.has("default")) {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    await createConnection({ ...connectionOptions, name: "default" });
  }
};
