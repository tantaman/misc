// SIGNED-SOURCE: <8f1acca7e86bc3f7f6e33c726f6382ce>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad } from "@strut/model/query/Expression";
import Component, { Data, spec } from "./Component";

export default class ComponentQuery extends DerivedQuery<Data, Component> {
  static create() {
    return new ComponentQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }
}
