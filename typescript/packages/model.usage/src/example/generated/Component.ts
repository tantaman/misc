// SIGNED-SOURCE: <b5d396309f805af13c2d0f463e66c888>
import Model from "@strut/model/Model.js";
import SlideQuery from "./SlideQuery.js";

export type Data = {
  id: string;
  selected: boolean;
  classes: string;
  style: ReadonlyMap<string, string>;
};

export default class Component extends Model<Data> {
  get id(): string {
    return this.data.id;
  }

  get selected(): boolean {
    return this.data.selected;
  }

  get classes(): string {
    return this.data.classes;
  }

  get style(): ReadonlyMap<string, string> {
    return this.data.style;
  }

  querySlide(): SlideQuery {
    return SlideQuery.fromId(this.slideId);
  }
}

export const spec = {
  createFrom(data: Data) {
    return new Component(data);
  },

  nativeStorageType: "MySQL",
};
