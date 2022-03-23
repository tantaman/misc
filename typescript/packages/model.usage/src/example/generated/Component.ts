// SIGNED-SOURCE: <34d1e3da32a71ea0767b0b3b15bef358>
import Model, { Spec } from "@strut/model/Model.js";
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

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new Component(data);
  },

  storageDescriptor: {
    nativeStorageType: "MySQL",
  },
};
