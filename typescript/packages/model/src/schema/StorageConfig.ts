export default class StorageConfig {
  #providerType: StorageProviderType = "Postgres";

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
    }
  | {
      nativeStorageType: "Postgres";
      dbName: string;
      tableName: string;
    };

export type StorageProviderType = StorageDescriptor["nativeStorageType"];
