// SIGNED-SOURCE: <36806171ccaca7f9d07d928a00fcd196>
import Model from "@strut/model/Model.js";

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
