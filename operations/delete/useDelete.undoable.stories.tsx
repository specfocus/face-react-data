import { useState } from 'react';
import { QueryClient, QueryClientProvider, useIsMutating } from 'react-query';
import { DataProviderContext } from '../../providers/DataProviderContext';
import { useGetList } from '../get-list/useGetList';
import undoableEventEmitter from '../../providers/undoableEventEmitter';
import { useDelete } from './useDelete';

export default { title: 'dataProvider/useDelete/undoable' };

export const SuccessCase = () => {
  const posts = [
    { id: 1, title: 'Hello' },
    { id: 2, title: 'World' },
  ];
  const dataProvider = {
    getList: (resource, params) => {
      console.log('getList', resource, params);
      return Promise.resolve({
        data: posts,
        total: posts.length,
      });
    },
    delete: (resource, params) => {
      console.log('delete', resource, params);
      return new Promise(resolve => {
        setTimeout(() => {
          const index = posts.findIndex(p => p.id === params.id);
          posts.splice(index, 1);
          resolve({ data: params.previousData });
        }, 1000);
      });
    },
  } as any;
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DataProviderContext.Provider
        value={dataProvider}
      >
        <SuccessCore />
      </DataProviderContext.Provider>
    </QueryClientProvider>
  );
};

const SuccessCore = () => {
  const isMutating = useIsMutating();
  const [notification, setNotification] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>();
  const { data, refetch } = useGetList('posts');
  const [deleteOne, { isLoading }] = useDelete();
  const handleClick = () => {
    deleteOne(
      'posts',
      {
        id: 1,
        previousData: { id: 1, title: 'Hello' },
      },
      {
        mutationMode: 'undoable',
        onSuccess: () => setSuccess('success'),
      }
    );
    setNotification(true);
  };
  return (
    <>
      <ul>
        {data?.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <div>
        {notification ? (
          <>
            <button
              onClick={() => {
                undoableEventEmitter.emit('end', {
                  isUndo: false,
                });
                setNotification(false);
              }}
            >
              Confirm
            </button>
            &nbsp;
            <button
              onClick={() => {
                undoableEventEmitter.emit('end', {
                  isUndo: true,
                });
                setNotification(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={handleClick} disabled={isLoading}>
            Delete first post
          </button>
        )}
        &nbsp;
        <button onClick={() => refetch()}>Refetch</button>
      </div>
      {success && <div>{success}</div>}
      {isMutating !== 0 && <div>mutating</div>}
    </>
  );
};

export const ErrorCase = () => {
  const posts = [
    { id: 1, title: 'Hello' },
    { id: 2, title: 'World' },
  ];
  const dataProvider = {
    getList: (resource, params) => {
      console.log('getList', resource, params);
      return Promise.resolve({
        data: posts,
        total: posts.length,
      });
    },
    delete: (resource, params) => {
      console.log('delete', resource, params);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('something went wrong'));
        }, 1000);
      });
    },
  } as any;
  return (
    <QueryClientProvider client={new QueryClient()}>
      <DataProviderContext.Provider
        value={dataProvider}
      >
        <ErrorCore />
      </DataProviderContext.Provider>
    </QueryClientProvider>
  );
};

const ErrorCore = () => {
  const isMutating = useIsMutating();
  const [notification, setNotification] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<any>();
  const { data, refetch } = useGetList('posts');
  const [deleteOne, { isLoading }] = useDelete();
  const handleClick = () => {
    setError(undefined);
    deleteOne(
      'posts',
      {
        id: 1,
        previousData: { id: 1, title: 'Hello World' },
      },
      {
        mutationMode: 'undoable',
        onSuccess: () => setSuccess('success'),
        onError: e => {
          setError(e);
          setSuccess('');
        },
      }
    );
    setNotification(true);
  };
  return (
    <>
      <ul>
        {data?.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <div>
        {notification ? (
          <>
            <button
              onClick={() => {
                undoableEventEmitter.emit('end', {
                  isUndo: false,
                });
                setNotification(false);
              }}
            >
              Confirm
            </button>
            &nbsp;
            <button
              onClick={() => {
                undoableEventEmitter.emit('end', {
                  isUndo: true,
                });
                setNotification(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={handleClick} disabled={isLoading}>
            Delete first post
          </button>
        )}
        &nbsp;
        <button onClick={() => refetch()}>Refetch</button>
      </div>
      {error && <div>{error.message}</div>}
      {success && <div>{success}</div>}
      {isMutating !== 0 && <div>mutating</div>}
    </>
  );
};
