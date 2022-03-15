import Schema from "./Schema.js";
import { nullthrows } from "@strut/utils";
import FieldAndEdgeBase from "./FieldAndEdgeBase.js";

export type QueriesWith = "id" | "foreign_id";

export abstract class Edge extends FieldAndEdgeBase {
  private src?: Schema;
  private theInverse?: Edge;

  constructor(private readonly dest: Schema) {
    super();
  }

  setSource(source: Schema) {
    this.src = source;
  }

  getDest(): Schema {
    return this.dest;
  }

  getSource(): Schema {
    return nullthrows(this.src);
  }

  getInverse(): Edge | undefined {
    return this.theInverse;
  }

  getQueryTypeName(): string {
    // TODO: this won't always be the case.
    // Some query types will vary based on source schema as well or
    // presesnce of edge data.
    return this.dest.getQueryTypeName();
  }

  inverse(inbound: Edge) {
    this.theInverse = inbound;
    return this;
  }
}

export class FieldEdge extends Edge {
  constructor(dest: Schema) {
    super(dest);
  }
}

export class JunctionEdge extends Edge {
  constructor(dest: Schema) {
    super(dest);
  }

  getQueryTypeName(): string {
    return (
      this.getSource().getModelTypeName() +
      this.getDest().getModelTypeName() +
      "JunctionEdgeQuery"
    );
  }
}

export class ForeignKeyEdge extends Edge {
  constructor(dest: Schema) {
    super(dest);
    // this.inverse(inverse);
  }
}

export default {
  field<T extends Schema>(otherSchema: typeof Schema): Edge {
    return new FieldEdge(otherSchema.get());
  },

  foreignKey(
    otherSchema: typeof Schema,
    inverseEdgeName: string
  ): ForeignKeyEdge {
    const s = otherSchema.get();
    return new ForeignKeyEdge(s);
  },

  junction<T extends Schema>(otherSchema: typeof Schema): JunctionEdge {
    return new JunctionEdge(otherSchema.get());
  },
};
