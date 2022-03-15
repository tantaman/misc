// SIGNED-SOURCE: <a2c32f98eb91c620b744445088d81b08>
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
    return SlideQuery.fromForeignId(this.id, "deck");
  }
}

export const spec = {
  createFrom(data: Data) {
    return new Deck(data);
  },

  nativeStorageType: "MySQL",
};
