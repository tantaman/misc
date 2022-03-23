// SIGNED-SOURCE: <8ad698f31c8cbf5ea797f1f7bcfafc70>
import { DerivedQuery } from "@strut/model/query/Query.js";
import QueryFactory from "@strut/model/query/QueryFactory.js";
import { modelLoad, filter } from "@strut/model/query/Expression.js";
import { Predicate, default as P } from "@strut/model/query/Predicate.js";
import { ModelFieldGetter } from "@strut/model/query/Field.js";
import { SID_of } from "@strut/sid";
import Slide, { Data, spec } from "./Slide.js";
import Deck from "./Deck.js";
import { spec as ComponentSpec } from "./Component.js";
import ComponentQuery from "./ComponentQuery";
import { spec as DeckSpec } from "./Deck.js";
import DeckQuery from "./DeckQuery";

export default class SlideQuery extends DerivedQuery<Slide> {
  static create() {
    return new SlideQuery(
      QueryFactory.createSourceQueryFor(spec),
      modelLoad(spec.createFrom)
    );
  }

  static fromId(id: SID_of<Slide>) {
    return this.create().whereId(P.equals(id));
  }

  static fromDeckId(id: SID_of<Deck>) {
    return this.create().whereDeckId(P.equals(id));
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
  queryComponents(): ComponentQuery {
    return new ComponentQuery(
      QueryFactory.createHopQueryFor(this, spec, ComponentSpec),
      modelLoad(ComponentSpec.createFrom)
    );
  }
  queryDeck(): DeckQuery {
    return new DeckQuery(
      QueryFactory.createHopQueryFor(this, spec, DeckSpec),
      modelLoad(DeckSpec.createFrom)
    );
  }
}
