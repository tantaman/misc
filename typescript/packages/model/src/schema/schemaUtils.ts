import { Edge, FieldEdge, ForeignKeyEdge } from "./Edge.js";

export function getInverseForeignEdges(edges: { [key: string]: Edge }) {
  return Object.entries(edges).filter(
    ([_, edge]) => edge.getInverse() instanceof ForeignKeyEdge
  );
}

export function getEdgeProps(edges: { [key: string]: Edge }): FieldEdge[] {
  return Object.values(edges).filter(
    (edge) => edge instanceof FieldEdge
  ) as FieldEdge[];
}
