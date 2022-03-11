export type StorageProviderType = "MySQL" | "Neo4j" | "Wire";

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
