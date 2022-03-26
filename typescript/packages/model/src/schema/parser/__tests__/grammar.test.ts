import nearley from "nearley";
import compile from "nearley/lib/compile";
import generate from "nearley/lib/generate";
import nearleyGrammar from "nearley/lib/nearley-language-bootstrapped";
import * as fs from "fs";
import { InboundEdges, SchemaFile } from "schema/SchemaType";

test("compiling the grammer", () => {
  expect(compileGrammar().ParserStart).toEqual("main");
});

test("parsing a small schema", () => {
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(compileGrammar())
  );

  parser.feed(`
storageEngine: postgres
dbName: test

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
`);

  const schema = parser.results[0] as SchemaFile;

  const expected: SchemaFile = {
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
        src: "Person",
        dest: "Person",
        name: "FollowEdge",
        fields: [],
        extensions: [],
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
  expect(schema).toEqual(expected);
});

function compileGrammar() {
  const grammarParser = new nearley.Parser(nearleyGrammar);
  const ourGrammar = readResourceFile("../Grammar.ne");
  grammarParser.feed(ourGrammar);

  const grammarAst = grammarParser.results[0];
  const grammarInfoObject = compile(grammarAst, {});
  const grammarJs = generate(grammarInfoObject, "grammar");
  const module: any = { exports: {} };
  eval(grammarJs);

  return module.exports;
}

function readResourceFile(path: string): string {
  const ourDir = __dirname;
  const resourcePath = ourDir.replace("/lib/", "/src/") + "/" + path;

  return fs.readFileSync(resourcePath, { encoding: "utf8", flag: "r" });
}
