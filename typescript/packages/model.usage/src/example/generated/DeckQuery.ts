// SIGNED-SOURCE: <22a08b502c741ade0eb1e59bc232e4d4>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad } from "@strut/model/query/Expression";
import Deck, { Data, spec } from "./Deck";

export default class DeckQuery extends DerivedQuery<Data, Deck> {
  static create() {
    return new DeckQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }
}
