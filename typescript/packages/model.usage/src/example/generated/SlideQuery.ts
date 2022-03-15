// SIGNED-SOURCE: <758f27dc09764843c395483f09c73a13>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad } from "@strut/model/query/Expression";
import { Predicate } from "@strut/model/query/Predicate";
import Slide, { Data, spec } from "./Slide";

export default class SlideQuery extends DerivedQuery<Data, Slide> {
  static create() {
    return new SlideQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  whereId(p: Predicate<Data["id"]>) {}
  whereSelected(p: Predicate<Data["selected"]>) {}
  whereFocused(p: Predicate<Data["focused"]>) {}
  whereClasses(p: Predicate<Data["classes"]>) {}
  whereStyle(p: Predicate<Data["style"]>) {}
  whereDeckId(p: Predicate<Data["deckId"]>) {}
}
