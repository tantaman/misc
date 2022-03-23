// SIGNED-SOURCE: <1041aca835eef4a9c405cb733a0df490>
import { DerivedQuery } from "@strut/model/query/Query.js";
import QueryFactory from "@strut/model/query/QueryFactory.js";
import { modelLoad, filter } from "@strut/model/query/Expression.js";
import { Predicate, default as P } from "@strut/model/query/Predicate.js";
import { ModelFieldGetter } from "@strut/model/query/Field.js";
import { SID_of } from "@strut/sid";
import Deck, { Data, spec } from "./Deck.js";

import { spec as SlideSpec } from "./Slide.js";
import SlideQuery from "./SlideQuery";

export default class DeckQuery extends DerivedQuery<Deck> {
  static create() {
    return new DeckQuery(
      QueryFactory.createSourceQueryFor(spec),
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
  querySlides(): SlideQuery {
    return new SlideQuery(
      QueryFactory.createHopQueryFor(this, spec, SlideSpec),
      modelLoad(SlideSpec.createFrom)
    );
  }
}
