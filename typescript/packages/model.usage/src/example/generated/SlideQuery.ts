// SIGNED-SOURCE: <1ac6e452a0ac2f0495e31decbf4491ca>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import Slide, { Data } from "./Slide";

export default class SlideQuery extends DerivedQuery<Data, Slide> {
  static create() {
    return new SlideQuery(
      SourceQueryFactory.createSourceQueryFor(schema),
      new ModelLoadExpression(schema)
    );
  }
}
