// SIGNED-SOURCE: <23f7913979571baf790a3f4333d19035>
import { DerivedQuery } from "@strut/model/query/Query.js";
import QueryFactory from "@strut/model/query/QueryFactory.js";
import { modelLoad, filter } from "@strut/model/query/Expression.js";
import { Predicate, default as P } from "@strut/model/query/Predicate.js";
import { ModelFieldGetter } from "@strut/model/query/Field.js";
import { SID_of } from "@strut/sid";
import Component, { Data, spec } from "./Component.js";
import Slide from "./Slide.js";
import { spec as SlideSpec } from "./Slide.js";
import SlideQuery from "./SlideQuery";

export default class ComponentQuery extends DerivedQuery<Component> {
  static create() {
    return new ComponentQuery(
      QueryFactory.createSourceQueryFor(spec),
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
  querySlide(): SlideQuery {
    return new SlideQuery(
      QueryFactory.createHopQueryFor(this, spec, SlideSpec),
      modelLoad(SlideSpec.createFrom)
    );
  }
}
