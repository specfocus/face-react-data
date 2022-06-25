import type { Entity } from '@specfocus/spec-focus/entities/Entity';
import type { PaginationPayload } from '../PaginationPayload';
import type { SortPayload } from '../SortPayload';

export type GetList<
  ResourceType extends string = string,
  RecordType extends Entity = any
> = (
  resource: ResourceType,
  params: GetListParams
) => Promise<GetListResult<RecordType>>;

export interface GetListParams {
  pagination: PaginationPayload;
  sort: SortPayload;
  filter: any;
  meta?: any;
}
export interface GetListResult<RecordType extends Entity = any> {
  data: RecordType[];
  total?: number;
  pageInfo?: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}