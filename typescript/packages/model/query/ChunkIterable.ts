export interface ChunkIterable<T> {
  [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;

  gen(): Promise<readonly T[]>;
}

export abstract class BaseChunkIterable<T> implements ChunkIterable<T> {
  abstract [Symbol.asyncIterator](): AsyncIterator<readonly T[]>;

  async gen(): Promise<readonly T[]> {
    let ret: T[] = [];
    for await (const chunk of this) {
      ret = ret.concat(chunk);
    }

    return ret;
  }

  map<TOut>(fn: (T) => Promise<TOut>): ChunkIterable<TOut> {
    return new MappedChunkIterable(this, fn);
  }
}

export class StaticSourceChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private source: T[][]) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    for (const chunk of this.source) {
      yield chunk;
    }
  }
}

export class PromiseSourceSingleChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private source: Promise<T[]>) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    const ret = await this.source;

    yield ret;
  }
}

export class MappedChunkIterable<TIn, TOut> extends BaseChunkIterable<TOut> {
  constructor(
    private source: ChunkIterable<TIn>,
    private fn: (TIn) => Promise<TOut>
  ) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly TOut[]> {
    for await (const chunk of this.source) {
      yield Promise.all(chunk.map(this.fn));
    }
  }
}

export class FilteredChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(
    private source: ChunkIterable<T>,
    private fn: (T) => Promise<boolean>
  ) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    for await (const chunk of this.source) {
      const filterResults = Promise.all(chunk.map(this.fn));
      const filteredChunk: T[] = [];
      for (let i = 0; i < chunk.length; ++i) {
        if (filterResults[i]) {
          filteredChunk.push(chunk[i]);
        }
      }
      yield filteredChunk;
    }
  }
}

export class FirstChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(private source: ChunkIterable<T>, private first: number) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    let numLeft = this.first;
    if (numLeft === 0) {
      return [];
    }

    for await (const chunk of this.source) {
      let retChunk: T[] = [];
      for (const elem of chunk) {
        numLeft -= 1;
        retChunk.push(elem);
        if (numLeft === 0) {
          return retChunk;
        }
      }
      yield retChunk;
    }
  }
}
