// SIGNED-SOURCE: <be6ea97744f9dc538d80e78c487d0f90>
import { DerivedQuery } from "@strut/model/query/Query";
import SourceQueryFactory from "@strut/model/query/SourceQueryFactory";
import { modelLoad, filter } from "@strut/model/query/Expression";
import { Predicate } from "@strut/model/query/Predicate";
import { ModelFieldGetter } from "@strut/model/query/Field";
import Slide, { Data, spec } from "./Slide";

export default class SlideQuery extends DerivedQuery<Data, Slide> {
  static create() {
    return new SlideQuery(
      SourceQueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
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
  whereDeckId(p: Predicate<Data["deckId"]>) {
    return new SlideQuery(
      this,
      filter(new ModelFieldGetter<"deckId", Data, Slide>("deckId"), p)
    );
  }
}
