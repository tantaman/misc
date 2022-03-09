import { filter, hop, orderBy, take } from "./Expression";

export interface ExpressionVisitor<TRet> {
  filter<T>(f: ReturnType<typeof filter<T, any>>): TRet;
  orderBy<T>(o: ReturnType<typeof orderBy<T, any>>): TRet;
  limit<T>(l: ReturnType<typeof take<T>>): TRet;
  hop(h: ReturnType<typeof hop>): TRet;
}
