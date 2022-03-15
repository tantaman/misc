// SIGNED-SOURCE: <e0a30e329a801abe639c2fedd0469c56>
import Model from "@strut/model/Model.js";
import SlideQuery from "./SlideQuery.js";

export type Data = {
  id: string;
  title: string;
};

export default class Deck extends Model<Data> {
  get id(): string {
    return this.data.id;
  }

  get title(): string {
    return this.data.title;
  }

  querySlides(): SlideQuery {
    return SlideQuery.fromForeignId(this.id, "inverse");
  }
}

export const spec = {
  createFrom(data: Data) {
    return new Deck(data);
  },

  nativeStorageType: "MySQL",
};
