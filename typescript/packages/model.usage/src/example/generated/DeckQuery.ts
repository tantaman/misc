// SIGNED-SOURCE: <f2db42ac62bd8bbc0203989acab85491>
import { DerivedQuery } from "@strut/model/query/Query.js";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory.js";
import { modelLoad, filter } from "@strut/model/query/Expression.js";
import { Predicate, default as P } from "@strut/model/query/Predicate.js";
import { ModelFieldGetter } from "@strut/model/query/Field.js";
import { SID_of } from "@strut/sid";
import Deck, { Data, spec } from "./Deck.js";

export default class DeckQuery extends DerivedQuery<Deck> {
  static create() {
    return new DeckQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<Deck>) {
    return this.create().whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return new DeckQuery(
      this,
      filter(new ModelFieldGetter<"id", Data, Deck>("id"), p)
    );
  }

  whereTitle(p: Predicate<Data["title"]>) {
    return new DeckQuery(
      this,
      filter(new ModelFieldGetter<"title", Data, Deck>("title"), p)
    );
  }
}
