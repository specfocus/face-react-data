import type { Identifier, Entity } from '@specfocus/spec-focus/entities/Entity';
import type { PaginationPayload } from '../PaginationPayload';
import type { SortPayload } from '../SortPayload';

export type GetManyReference = <
  ResourceType extends string = string,
  RecordType extends Entity = any
>(
  resource: ResourceType,
  params: GetManyReferenceParams
) => Promise<GetManyReferenceResult<RecordType>>;

export interface GetManyReferenceParams {
  target: string;
  id: Identifier;
  pagination: PaginationPayload;
  sort: SortPayload;
  filter: any;
  meta?: any;
}

export interface GetManyReferenceResult<RecordType extends Entity = any> {
  data: RecordType[];
  total?: number;
  pageInfo?: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}