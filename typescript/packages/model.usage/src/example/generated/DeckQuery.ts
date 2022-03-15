// SIGNED-SOURCE: <b5c02c801a3f08ace178d2d636654246>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad } from "@strut/model/query/Expression";
import { Predicate } from "@strut/model/query/Predicate";
import Deck, { Data, spec } from "./Deck";

export default class DeckQuery extends DerivedQuery<Data, Deck> {
  static create() {
    return new DeckQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  whereId(p: Predicate<Data["id"]>) {}
  whereTitle(p: Predicate<Data["title"]>) {}
}
