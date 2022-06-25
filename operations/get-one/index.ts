import type { Entity } from '@specfocus/spec-focus/entities/Entity';

export type GetOne = <
  ResourceType extends string = string,
  RecordType extends Entity = any
>(
  resource: ResourceType,
  params: GetOneParams
) => Promise<GetOneResult<RecordType>>;

export interface GetOneParams<RecordType extends Entity = any> {
  id: RecordType['id'];
  meta?: any;
}
export interface GetOneResult<RecordType extends Entity = any> {
  data: RecordType;
}