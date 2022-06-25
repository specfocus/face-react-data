import type { Identifier, Entity } from '@specfocus/spec-focus/entities/Entity';

export type Update = <
  ResourceType extends string = string,
  RecordType extends Entity = any
>(
  resource: ResourceType,
  params: UpdateParams
) => Promise<UpdateResult<RecordType>>;

export interface UpdateParams<T = any> {
  id: Identifier;
  data: Partial<T>;
  previousData: T;
  meta?: any;
}
export interface UpdateResult<RecordType extends Entity = any> {
  data: RecordType;
}
