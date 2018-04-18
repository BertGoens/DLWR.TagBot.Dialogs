export interface IStores {
  devStore: string;
  prodStore: string;
}
export const getStoreUrl = (q: IStores): string => {
  const devlStore = q.devStore;
  const prodStore = q.prodStore;
  let nodeEnv = "production";
  if (process.env.NODE_ENV) {
    nodeEnv = process.env.NODE_ENV.toLowerCase();
  }

  if (nodeEnv === "production") {
    return prodStore || devlStore;
  } else {
    return devlStore || prodStore;
  }
};
