export default class StorageConfig {
  #providerType: StorageProviderType = "MySQL";

  constructor() {}

  storageProvider(type: StorageProviderType): this {
    this.#providerType = type;
    return this;
  }

  get providerType(): StorageProviderType {
    return this.#providerType;
  }
}

export type StorageDescriptor =
  | {
      nativeStorageType: "MySQL";
      dbName: string;
      tableName: string;
    }
  | {
      nativeStorageType: "Neo4j";
      dbName: string;
      labelName: string;
    };

export type StorageProviderType = StorageDescriptor["nativeStorageType"];
