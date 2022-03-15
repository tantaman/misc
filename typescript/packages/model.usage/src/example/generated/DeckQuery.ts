// SIGNED-SOURCE: <9eba5a9e87a2b484e6cf32101cbb3495>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad, filter } from "@strut/model/query/Expression";
import { Predicate, default as P } from "@strut/model/query/Predicate";
import { ModelFieldGetter } from "@strut/model/query/Field";
import { SID_of } from "@strut/sid";
import Deck, { Data, spec } from "./Deck";

export default class DeckQuery extends DerivedQuery<Data, Deck> {
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
