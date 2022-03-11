// SIGNED-SOURCE: <11ed15c7908575d4a71f7fe9ad113ea2>
import Model from "@strut/model/Model.js";
import { Field, ObjectType, Int, Float, ID } from "type-graphql";
@ObjectType({ description: "Represents a single slide within a deck" })
export default class Slide extends Model<{
  id: string;
  selected: boolean;
  focused: boolean;
  classes: string;
  style: ReadonlyMap<string, string>;
  deckId: string;
}> {
  @Field((_) => ID)
  get id(): string {
    return this.data.id;
  }

  @Field((_) => Boolean)
  get selected(): boolean {
    return this.data.selected;
  }

  @Field((_) => Boolean)
  get focused(): boolean {
    return this.data.focused;
  }

  @Field((_) => String)
  get classes(): string {
    return this.data.classes;
  }

  get style(): ReadonlyMap<string, string> {
    return this.data.style;
  }

  get deckId(): string {
    return this.data.deckId;
  }

  queryComponents(): ComponentQuery {
    return ComponentQuery.fromForeignId(this.id, "slide");
  }

  queryDeck(): DeckQuery {
    return DeckQuery.fromId(this.deckId);
  }
}
