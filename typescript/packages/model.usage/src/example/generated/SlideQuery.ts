// SIGNED-SOURCE: <bddcea7ebf66e792d1d1689765682cae>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad, filter } from "@strut/model/query/Expression";
import { Predicate, default as P } from "@strut/model/query/Predicate";
import { ModelFieldGetter } from "@strut/model/query/Field";
import { SID_of } from "@strut/sid";
import Slide, { Data, spec } from "./Slide";
import Deck from "./Deck";

export default class SlideQuery extends DerivedQuery<Data, Slide> {
  static create() {
    return new SlideQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<Slide>) {
    return this.create().whereId(P.equals(id));
  }

  static fromDeckId(id: SID_of<Deck>) {
    return this.create().whereDeckId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new SlideQuery(
      this,
      filter(new ModelFieldGetter<"id", Data, Slide>("id"), p)
    );
  }

  whereSelected(p: Predicate<Data["selected"]>) {
    return new SlideQuery(
      this,
      filter(new ModelFieldGetter<"selected", Data, Slide>("selected"), p)
    );
  }

  whereFocused(p: Predicate<Data["focused"]>) {
    return new SlideQuery(
      this,
      filter(new ModelFieldGetter<"focused", Data, Slide>("focused"), p)
    );
  }

  whereClasses(p: Predicate<Data["classes"]>) {
    return new SlideQuery(
      this,
      filter(new ModelFieldGetter<"classes", Data, Slide>("classes"), p)
    );
  }

  whereStyle(p: Predicate<Data["style"]>) {
    return new SlideQuery(
      this,
      filter(new ModelFieldGetter<"style", Data, Slide>("style"), p)
    );
  }
}
