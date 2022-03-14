// SIGNED-SOURCE: <f4e7519ae454918a37c12d1bae4693aa>
import Model from "@strut/model/Model.js";
import { Field, ObjectType, Int, Float, ID } from "type-graphql";

export type Data = {
  id: string;
  selected: boolean;
  focused: boolean;
  classes: string;
  style: ReadonlyMap<string, string>;
  deckId: string;
};

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
