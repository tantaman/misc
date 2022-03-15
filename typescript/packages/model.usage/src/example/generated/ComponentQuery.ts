// SIGNED-SOURCE: <6221ef2153fb35443bfbd1bc83718dbd>
import { DerivedQuery } from "@strut/model/query/Query.js";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory.js";
import { modelLoad, filter } from "@strut/model/query/Expression.js";
import { Predicate, default as P } from "@strut/model/query/Predicate.js";
import { ModelFieldGetter } from "@strut/model/query/Field.js";
import { SID_of } from "@strut/sid";
import Component, { Data, spec } from "./Component.js";
import Slide from "./Slide.js";

export default class ComponentQuery extends DerivedQuery<Component> {
  static create() {
    return new ComponentQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<Component>) {
    return this.create().whereId(P.equals(id));
  }

  static fromSlideId(id: SID_of<Slide>) {
    return this.create().whereSlideId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new ComponentQuery(
      this,
      filter(new ModelFieldGetter<"id", Data, Component>("id"), p)
    );
  }

  whereSelected(p: Predicate<Data["selected"]>) {
    return new ComponentQuery(
      this,
      filter(new ModelFieldGetter<"selected", Data, Component>("selected"), p)
    );
  }

  whereClasses(p: Predicate<Data["classes"]>) {
    return new ComponentQuery(
      this,
      filter(new ModelFieldGetter<"classes", Data, Component>("classes"), p)
    );
  }

  whereStyle(p: Predicate<Data["style"]>) {
    return new ComponentQuery(
      this,
      filter(new ModelFieldGetter<"style", Data, Component>("style"), p)
    );
  }

  whereSlideId(p: Predicate<Data["slideId"]>) {
    return new ComponentQuery(
      this,
      filter(new ModelFieldGetter<"slideId", Data, Component>("slideId"), p)
    );
  }
}
