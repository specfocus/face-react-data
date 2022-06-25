import { Entity } from '@specfocus/spec-focus/entities/Entity';

export type DeleteMany = <
  ResourceType extends string = string,
  RecordType extends Entity = any
>(
  resource: ResourceType,
  params: DeleteManyParams<RecordType>
) => Promise<DeleteManyResult<RecordType>>;

export interface DeleteManyParams<RecordType extends Entity = any> {
  ids: RecordType['id'][];
  meta?: any;
}
export interface DeleteManyResult<RecordType extends Entity = any> {
  data?: RecordType['id'][];
}
