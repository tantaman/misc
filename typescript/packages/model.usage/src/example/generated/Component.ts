// SIGNED-SOURCE: <404e045f2095e8d53170e1a80745a9a2>
import Model from "@strut/model/Model.js";
import { SID_of } from "@strut/sid";
import SlideQuery from "./SlideQuery.js";
import Slide from "./Slide.js";

export type Data = {
  id: SID_of<any>;
  selected: boolean;
  classes: string;
  style: ReadonlyMap<string, string>;
  slideId: SID_of<Slide>;
};

export default class Component extends Model<Data> {
  get id(): SID_of<any> {
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
    return SlideQuery.fromId(this.id);
  }
}

export const spec = {
  createFrom(data: Data) {
    return new Component(data);
  },

  nativeStorageType: "MySQL",
};
