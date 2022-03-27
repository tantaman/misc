import { InboundEdges, SchemaFile, SchemaFileAst } from "../SchemaType.js";

export const contents = `
engine: postgres
db: test

Node<Person> {
  id: ID<Person>
  name: NaturalLanguage<string>
  walletId: ID<Wallet>
  thing1: string
  thing2: string
} | OutboundEdges {
  wallet: Edge<Person.walletId>
  friends: Edge<Person, Person>
  cars: Edge<Car.ownerId>
  follows: FollowEdge
  followedBy: FollowerEdge
} | InboundEdges {
  fromWallet: Edge<Person.walletId>
} | Index {
  walletId: unique(walletId)
  compound: thing1, thing2
  thing2
}

Edge<Person, Person> as FollowEdge {
  when: Timestamp
} | Invert as FollowerEdge

Node<Wallet> {
  id: ID<Wallet>
  balance: Currency<usd>
  status: Enumeration<Active | Locked>
  alias: NaturalLanguage<string>
}

Node<Transaction> {
  id: ID<Transaction>
  time: Timestamp
  blob: Map<string, string>
  blobOfBlob: Map<string, Map<string, string>>
  list: Array<string>
}
`;

export const ast: SchemaFileAst = {
  preamble: {
    engine: "postgres",
    db: "test",
  },
  entities: [
    {
      type: "node",
      name: "Person",
      fields: [
        {
          type: "id",
          name: "id",
          of: "Person",
        },
        {
          name: "name",
          type: "naturalLanguage",
        },
        {
          name: "walletId",
          type: "id",
          of: "Wallet",
        },
        {
          name: "thing1",
          type: "primitive",
          subtype: "string",
        },
        {
          name: "thing2",
          type: "primitive",
          subtype: "string",
        },
      ],
      extensions: [
        {
          name: "outboundEdges",
          declarations: [
            {
              name: "wallet",
              type: "edge",
              src: {
                type: "Person",
                column: "walletId",
              },
              dest: null,
            },
            {
              name: "friends",
              type: "edge",
              src: {
                type: "Person",
              },
              dest: {
                type: "Person",
              },
            },
            {
              name: "cars",
              type: "edge",
              src: {
                type: "Car",
                column: "ownerId",
              },
              dest: null,
            },
            {
              name: "follows",
              type: "edgeReference",
              reference: "FollowEdge",
            },
            {
              name: "followedBy",
              type: "edgeReference",
              reference: "FollowerEdge",
            },
          ],
        },
        {
          name: "inboundEdges",
          declarations: [
            {
              dest: null,
              name: "fromWallet",
              type: "edge",
              src: {
                type: "Person",
                column: "walletId",
              },
            },
          ],
        } as InboundEdges,
        {
          name: "index",
          declarations: [
            {
              name: "walletId",
              type: "unique",
              columns: ["walletId"],
            },
            {
              name: "compound",
              type: "nonUnique",
              columns: ["thing1", "thing2"],
            },
            {
              name: "thing2",
              type: "nonUnique",
              columns: ["thing2"],
            },
          ],
        },
      ],
    },
    {
      type: "edge",
      src: {
        type: "Person",
      },
      dest: {
        type: "Person",
      },
      name: "FollowEdge",
      fields: [
        {
          type: "timestamp",
          name: "when",
        },
      ],
      extensions: [
        {
          name: "invert",
          as: "FollowerEdge",
        },
      ],
    },
    {
      type: "node",
      name: "Wallet",
      fields: [
        {
          name: "id",
          type: "id",
          of: "Wallet",
        },
        {
          name: "balance",
          type: "currency",
          denomination: "usd",
        },
        {
          name: "status",
          type: "enumeration",
          keys: ["Active", "Locked"],
        },
        {
          name: "alias",
          type: "naturalLanguage",
        },
      ],
      extensions: [],
    },
    {
      type: "node",
      name: "Transaction",
      fields: [
        {
          name: "id",
          type: "id",
          of: "Transaction",
        },
        {
          name: "time",
          type: "timestamp",
        },
        {
          name: "blob",
          type: "map",
          keys: {
            type: "primitive",
            subtype: "string",
          },
          values: {
            type: "primitive",
            subtype: "string",
          },
        },
        {
          name: "blobOfBlob",
          type: "map",
          keys: {
            type: "primitive",
            subtype: "string",
          },
          values: {
            type: "map",
            keys: {
              type: "primitive",
              subtype: "string",
            },
            values: {
              type: "primitive",
              subtype: "string",
            },
          },
        },
        {
          name: "list",
          type: "array",
          values: {
            type: "primitive",
            subtype: "string",
          },
        },
      ],
      extensions: [],
    },
  ],
};

export const schemaFile: SchemaFile = {
  nodes: {
    Person: {
      name: "Person",
      fields: {
        id: {
          type: "id",
          name: "id",
          of: "Person",
        },
        name: {
          name: "name",
          type: "naturalLanguage",
        },
        walletId: {
          name: "walletId",
          type: "id",
          of: "Wallet",
        },
        thing1: {
          name: "thing1",
          type: "primitive",
          subtype: "string",
        },
        thing2: {
          name: "thing2",
          type: "primitive",
          subtype: "string",
        },
      },
      extensions: {
        outboundEdges: {
          name: "outboundEdges",
          declarations: [
            {
              name: "wallet",
              type: "edge",
              src: {
                type: "Person",
                column: "walletId",
              },
              dest: null,
            },
            {
              name: "friends",
              type: "edge",
              src: {
                type: "Person",
              },
              dest: {
                type: "Person",
              },
            },
            {
              name: "cars",
              type: "edge",
              src: {
                type: "Car",
                column: "ownerId",
              },
              dest: null,
            },
            {
              name: "follows",
              type: "edgeReference",
              reference: "FollowEdge",
            },
            {
              name: "followedBy",
              type: "edgeReference",
              reference: "FollowerEdge",
            },
          ],
        },
        inboundEdges: {
          name: "inboundEdges",
          declarations: [
            {
              dest: null,
              name: "fromWallet",
              type: "edge",
              src: {
                type: "Person",
                column: "walletId",
              },
            },
          ],
        },
        index: {
          name: "index",
          declarations: [
            {
              name: "walletId",
              type: "unique",
              columns: ["walletId"],
            },
            {
              name: "compound",
              type: "nonUnique",
              columns: ["thing1", "thing2"],
            },
            {
              name: "thing2",
              type: "nonUnique",
              columns: ["thing2"],
            },
          ],
        },
      },
      storage: {
        type: "sql",
        engine: "postgres",
        db: "test",
        table: "person",
      },
    },
    Wallet: {
      name: "Wallet",
      fields: {
        id: {
          name: "id",
          type: "id",
          of: "Wallet",
        },
        balance: {
          name: "balance",
          type: "currency",
          denomination: "usd",
        },
        status: {
          name: "status",
          type: "enumeration",
          keys: ["Active", "Locked"],
        },
        alias: {
          name: "alias",
          type: "naturalLanguage",
        },
      },
      extensions: {},
      storage: {
        type: "sql",
        engine: "postgres",
        db: "test",
        table: "wallet",
      },
    },
    Transaction: {
      name: "Transaction",
      fields: {
        id: {
          name: "id",
          type: "id",
          of: "Transaction",
        },
        time: {
          name: "time",
          type: "timestamp",
        },
        blob: {
          name: "blob",
          type: "map",
          keys: {
            type: "primitive",
            subtype: "string",
          },
          values: {
            type: "primitive",
            subtype: "string",
          },
        },
        blobOfBlob: {
          name: "blobOfBlob",
          type: "map",
          keys: {
            type: "primitive",
            subtype: "string",
          },
          values: {
            type: "map",
            keys: {
              type: "primitive",
              subtype: "string",
            },
            values: {
              type: "primitive",
              subtype: "string",
            },
          },
        },
        list: {
          name: "list",
          type: "array",
          values: {
            type: "primitive",
            subtype: "string",
          },
        },
      },
      extensions: {},
      storage: {
        type: "sql",
        engine: "postgres",
        db: "test",
        table: "transaction",
      },
    },
  },
  edges: {
    FollowEdge: {
      name: "FollowEdge",
      src: {
        type: "Person",
      },
      dest: {
        type: "Person",
      },
      fields: {
        when: {
          type: "timestamp",
          name: "when",
        },
      },
      extensions: {
        invert: {
          name: "invert",
          as: "FollowerEdge",
        },
      },
      storage: {
        type: "sql",
        engine: "postgres",
        db: "test",
        table: "followedge",
      },
    },
  },
};