// SIGNED-SOURCE: <7bc03ab0e2fb6801ae3ff30104ebe4ec>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad, filter } from "@strut/model/query/Expression";
import { Predicate } from "@strut/model/query/Predicate";
import { ModelFieldGetter } from "@strut/model/query/Field";
import Component, { Data, spec } from "./Component";

export default class ComponentQuery extends DerivedQuery<Data, Component> {
  static create() {
    return new ComponentQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
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
