import React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';

import { DataProviderContext } from '../../providers/DataProviderContext';
import { useGetOne } from './useGetOne';
import { testDataProvider } from '../dataProvider';

const UseGetOne = ({
  resource,
  id,
  meta = undefined,
  options = {},
  callback = null,
  ...rest
}) => {
  const hookValue = useGetOne(resource, { id, meta }, options);
  if (callback) callback(hookValue);
  return <div>hello</div>;
};

describe('useGetOne', () => {
  let dataProvider;

  beforeEach(() => {
    dataProvider = testDataProvider({
      getOne: jest
        .fn()
        .mockResolvedValue({ data: { id: 1, title: 'foo' } }),
    });
  });

  it('should call dataProvider.getOne() on mount', async () => {
    render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne resource="posts" id={1} />
      </DataProviderContext.Provider>
    );
    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
      expect(dataProvider.getOne).toHaveBeenCalledWith('posts', {
        id: 1,
      });
    });
  });

  it('should not call dataProvider.getOne() on mount if enabled is false', async () => {
    const { rerender } = render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne
          resource="posts"
          id={1}
          options={{ enabled: false }}
        />
      </DataProviderContext.Provider>
    );
    await new Promise(resolve => setTimeout(resolve));
    expect(dataProvider.getOne).toHaveBeenCalledTimes(0);
    rerender(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne
          resource="posts"
          id={1}
          options={{ enabled: true }}
        />
      </DataProviderContext.Provider>
    );
    await new Promise(resolve => setTimeout(resolve));
    expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
  });

  it('should not call dataProvider.getOne() on update', async () => {
    const { rerender } = render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne resource="posts" id={1} />
      </DataProviderContext.Provider>
    );
    await new Promise(resolve => setTimeout(resolve));
    expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
    rerender(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne resource="posts" id={1} />
      </DataProviderContext.Provider>
    );
    await new Promise(resolve => setTimeout(resolve));
    expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
  });

  it('should recall dataProvider.getOne() when id changes', async () => {
    const { rerender } = render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne resource="posts" id={1} />
      </DataProviderContext.Provider>
    );
    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
    });
    rerender(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne resource="posts" id={2} />
      </DataProviderContext.Provider>
    );
    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledTimes(2);
    });
  });

  it('should recall dataProvider.getOne() when resource changes', async () => {
    const { rerender } = render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne resource="posts" id={1} />
      </DataProviderContext.Provider>
    );
    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
    });
    rerender(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne resource="comments" id={1} />
      </DataProviderContext.Provider>
    );
    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledTimes(2);
    });
  });

  it('should accept a meta parameter', async () => {
    render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne resource="posts" id={1} meta={{ hello: 'world' }} />
      </DataProviderContext.Provider>
    );
    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
      expect(dataProvider.getOne).toHaveBeenCalledWith('posts', {
        id: 1,
        meta: { hello: 'world' },
      });
    });
  });

  it('should set the error state when the dataProvider fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const hookValue = jest.fn();
    const dataProvider = testDataProvider({
      getOne: jest.fn().mockRejectedValue(new Error('failed')),
    });
    render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne
          resource="posts"
          id={1}
          callback={hookValue}
          options={{ retry: false }}
        />
      </DataProviderContext.Provider>
    );
    expect(hookValue).toHaveBeenCalledWith(
      expect.objectContaining({
        error: null,
      })
    );
    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
    });
    expect(hookValue).toHaveBeenCalledWith(
      expect.objectContaining({
        error: new Error('failed'),
      })
    );
  });

  it('should execute success side effects on success', async () => {
    const onSuccess = jest.fn();
    render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne resource="posts" id={1} options={{ onSuccess }} />
      </DataProviderContext.Provider>
    );
    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith({ id: 1, title: 'foo' });
    });
  });

  it('should execute error side effects on failure', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => { });
    const dataProvider = testDataProvider({
      getOne: jest.fn().mockRejectedValue(new Error('failed')),
    });
    const onError = jest.fn();
    render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne
          resource="posts"
          id={1}
          options={{ onError, retry: false }}
        />
      </DataProviderContext.Provider>
    );
    await waitFor(() => {
      expect(dataProvider.getOne).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error('failed'));
    });
  });
});
