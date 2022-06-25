import type { Identifier, Entity } from '@specfocus/spec-focus/entities/Entity';

export type UpdateMany = <
  ResourceType extends string = string,
  RecordType extends Entity = any
>(
  resource: ResourceType,
  params: UpdateManyParams
) => Promise<UpdateManyResult<RecordType>>;

export interface UpdateManyParams<T = any> {
  ids: Identifier[];
  data: T;
  meta?: any;
}
export interface UpdateManyResult<RecordType extends Entity = any> {
  data?: RecordType['id'][];
}
