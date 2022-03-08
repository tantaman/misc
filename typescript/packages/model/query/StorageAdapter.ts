import Plan from "./Plan";

interface StorageAdapter {
  execute(plan: Plan);
}

/**
 * A plan may need to not just move to backend but also load
 * into current proces...
 *
 * So a plan has stages
 *
 * Each stage comprises a single chunk
 *
 * A plan is a series of expressions
 *
 * An optimized plan is a series of chunks?
 * That'd need to be merged and/or combined and transformed...
 *
 * How do we know where to split into chunks?
 * At unions? Or whenever we can't hoist to backend?
 */
