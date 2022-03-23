// SIGNED-SOURCE: <ab581fce9214af7fe78db3c11f46e7e5>
import Model, { Spec } from "@strut/model/Model.js";
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

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new Deck(data);
  },

  storageDescriptor: {
    nativeStorageType: "MySQL",
  },
};
