// SIGNED-SOURCE: <a0b3e2ade94a9e142767b55c1da44416>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad, filter } from "@strut/model/query/Expression";
import { Predicate } from "@strut/model/query/Predicate";
import { ModelFieldGetter } from "@strut/model/query/Field";
import Deck, { Data, spec } from "./Deck";

export default class DeckQuery extends DerivedQuery<Data, Deck> {
  static create() {
    return new DeckQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
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
