// SIGNED-SOURCE: <2aa8fb64e1c505ddf7e57fdb46249093>
import Model from "@strut/model/Model.js";
import { SID_of } from "@strut/sid";
import { Field, ObjectType, Int, Float, ID } from "type-graphql";
import "reflect-metadata";
import ComponentQuery from "./ComponentQuery.js";
import Component from "./Component.js";
import DeckQuery from "./DeckQuery.js";
import Deck from "./Deck.js";

export type Data = {
  id: SID_of<any>;
  selected: boolean;
  focused: boolean;
  classes: string;
  style: ReadonlyMap<string, string>;
  deckId: SID_of<Deck>;
};

@ObjectType({ description: "Represents a single slide within a deck" })
export default class Slide extends Model<Data> {
  @Field((_) => ID)
  get id(): SID_of<any> {
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

  queryComponents(): ComponentQuery {
    return ComponentQuery.fromSlideId(this.id);
  }

  queryDeck(): DeckQuery {
    return DeckQuery.fromId(this.id);
  }
}

export const spec = {
  createFrom(data: Data) {
    return new Slide(data);
  },

  nativeStorageType: "MySQL",
};
