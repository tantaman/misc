// SIGNED-SOURCE: <cee0bac84eab1053c81eb9099a512656>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad } from "@strut/model/query/Expression";
import Slide, { Data, spec } from "./Slide";

export default class SlideQuery extends DerivedQuery<Data, Slide> {
  static create() {
    return new SlideQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }
}
