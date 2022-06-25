import type { Entity } from '@specfocus/spec-focus/entities/Entity';

export type create = <
  ResourceType extends string = string,
  RecordType extends Entity = any
>(
  resource: ResourceType,
  params: CreateParams
) => Promise<CreateResult<RecordType>>;

export interface CreateParams<T = any> {
  data: T;
  meta?: any;
}
export interface CreateResult<RecordType extends Entity = any> {
  data: RecordType;
}
