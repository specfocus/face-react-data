import type { Entity } from '@specfocus/spec-focus/entities/Entity';
import type { CreateParams, CreateResult } from '../operations/create';
import type { DeleteParams, DeleteResult } from '../operations/delete';
import type { DeleteManyParams, DeleteManyResult } from '../operations/delete-many';
import type { GetListParams, GetListResult } from '../operations/get-list';
import type { GetManyParams, GetManyResult } from '../operations/get-many';
import type { GetManyReferenceParams, GetManyReferenceResult } from '../operations/get-many-reference';
import type { GetOneParams, GetOneResult } from '../operations/get-one';
import type { MutationMode } from '../operations/MutationMode';
import type { UpdateParams, UpdateResult } from '../operations/update';
import type { UpdateManyParams, UpdateManyResult } from '../operations/update-many';

 export type DataProvider<ResourceType extends string = string> = {
  getList: <RecordType extends Entity = any>(
    resource: ResourceType,
    params: GetListParams
  ) => Promise<GetListResult<RecordType>>;

  getOne: <RecordType extends Entity = any>(
    resource: ResourceType,
    params: GetOneParams
  ) => Promise<GetOneResult<RecordType>>;

  getMany: <RecordType extends Entity = any>(
    resource: ResourceType,
    params: GetManyParams
  ) => Promise<GetManyResult<RecordType>>;

  getManyReference: <RecordType extends Entity = any>(
    resource: ResourceType,
    params: GetManyReferenceParams
  ) => Promise<GetManyReferenceResult<RecordType>>;

  update: <RecordType extends Entity = any>(
    resource: ResourceType,
    params: UpdateParams
  ) => Promise<UpdateResult<RecordType>>;

  updateMany: <RecordType extends Entity = any>(
    resource: ResourceType,
    params: UpdateManyParams
  ) => Promise<UpdateManyResult<RecordType>>;

  create: <RecordType extends Entity = any>(
    resource: ResourceType,
    params: CreateParams
  ) => Promise<CreateResult<RecordType>>;

  delete: <RecordType extends Entity = any>(
    resource: ResourceType,
    params: DeleteParams<RecordType>
  ) => Promise<DeleteResult<RecordType>>;

  deleteMany: <RecordType extends Entity = any>(
    resource: ResourceType,
    params: DeleteManyParams<RecordType>
  ) => Promise<DeleteManyResult<RecordType>>;

  [key: string]: any;
};

export type DataProviderResult<RecordType extends Entity = any> =
  | CreateResult<RecordType>
  | DeleteResult<RecordType>
  | DeleteManyResult
  | GetListResult<RecordType>
  | GetManyResult<RecordType>
  | GetManyReferenceResult<RecordType>
  | GetOneResult<RecordType>
  | UpdateResult<RecordType>
  | UpdateManyResult;

export type OnSuccess = (
  response?: any,
  variables?: any,
  context?: any
) => void;
export type onError = (error?: any, variables?: any, context?: any) => void;

export type TransformData = (
  data: any,
  options?: { previousData: any; }
) => any | Promise<any>;

export interface UseDataProviderOptions {
  action?: string;
  fetch?: string;
  meta?: object;
  mutationMode?: MutationMode;
  onSuccess?: OnSuccess;
  onError?: onError;
  enabled?: boolean;
}

export type LegacyDataProvider = (
  type: string,
  resource: string,
  params: any
) => Promise<any>;
