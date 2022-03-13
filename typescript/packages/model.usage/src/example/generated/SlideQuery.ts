// SIGNED-SOURCE: <2243c0e90184a52f415314aa3aa8f8e6>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import Slide from "./Slide";
export default class SlideQuery extends DerivedQuery<T, Slide> {
  static create() {
    return new SlideQuery(
      SourceQueryFactory.createSourceQueryFor(schema),
      new ModelLoadExpression(schema)
    );
  }
}
