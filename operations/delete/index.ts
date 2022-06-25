import type { Identifier, Entity } from '@specfocus/spec-focus/entities/Entity';

export type Delete = <
  ResourceType extends string = string,
  RecordType extends Entity = any
>(
  resource: ResourceType,
  params: DeleteParams<RecordType>
) => Promise<DeleteResult<RecordType>>;

export interface DeleteParams<RecordType extends Entity = any> {
  id: Identifier;
  previousData?: RecordType;
  meta?: any;
}
export interface DeleteResult<RecordType extends Entity = any> {
  data: RecordType;
}