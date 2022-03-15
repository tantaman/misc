// SIGNED-SOURCE: <3fe1cfd15acf210e8d90b6694c8e1af1>
import Model from "@strut/model/Model.js";
import { SID_of } from "@strut/sid";
import SlideQuery from "./SlideQuery.js";
import Slide from "./Slide.js";

export type Data = {
  id: SID_of<any>;
  title: string;
};

export default class Deck extends Model<Data> {
  get id(): SID_of<any> {
    return this.data.id;
  }

  get title(): string {
    return this.data.title;
  }

  querySlides(): SlideQuery {
    return SlideQuery.fromDeckId(this.id);
  }
}

export const spec = {
  createFrom(data: Data) {
    return new Deck(data);
  },

  nativeStorageType: "MySQL",
};
