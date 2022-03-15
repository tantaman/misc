// SIGNED-SOURCE: <9b8dc9cb92d1b196588646b2156271e5>
import Model from "@strut/model/Model.js";

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
