import type { Identifier, Entity } from '@specfocus/spec-focus/entities/Entity';

export type GetMany = <
  ResourceType extends string = string,
  RecordType extends Entity = any
>(
  resource: ResourceType,
  params: GetManyParams
) => Promise<GetManyResult<RecordType>>;

export interface GetManyParams {
  ids: Identifier[];
  meta?: any;
}

export interface GetManyResult<RecordType extends Entity = any> {
  data: RecordType[];
}