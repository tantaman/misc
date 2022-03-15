// SIGNED-SOURCE: <48e140a17287985e9fb7f0a0e46f192e>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad, filter } from "@strut/model/query/Expression";
import { Predicate, default as P } from "@strut/model/query/Predicate";
import { ModelFieldGetter } from "@strut/model/query/Field";
import { SID_of } from "@strut/sid";
import Component, { Data, spec } from "./Component";
import Slide from "./Slide";

export default class ComponentQuery extends DerivedQuery<Data, Component> {
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
}
