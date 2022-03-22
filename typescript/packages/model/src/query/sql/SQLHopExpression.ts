import { SID_of } from "@strut/sid";
import { HopExpression } from "query/Expression";

export default class SQLHopExpression<T>
  implements HopExpression<SID_of<any>, T> {}
