// SIGNED-SOURCE: <ee20425f98fc7f4dbacf6c293a60f83a>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad } from "@strut/model/query/Expression";
import { Predicate } from "@strut/model/query/Predicate";
import Component, { Data, spec } from "./Component";

export default class ComponentQuery extends DerivedQuery<Data, Component> {
  static create() {
    return new ComponentQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  whereId(p: Predicate<Data["id"]>) {}
  whereSelected(p: Predicate<Data["selected"]>) {}
  whereClasses(p: Predicate<Data["classes"]>) {}
  whereStyle(p: Predicate<Data["style"]>) {}
}
