import React from 'react';
import { useState, useEffect } from 'react';
import { render, act } from '@testing-library/react';
import expect from 'expect';

import { useDataProvider } from './useDataProvider';
import { DataProviderContext } from '../../providers/DataProviderContext';

const UseGetOne = () => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const dataProvider = useDataProvider();
  useEffect(() => {
    dataProvider
      .getOne('posts', { id: 1 })
      .then(res => setData(res.data))
      .catch(e => setError(e));
  }, [dataProvider]);
  if (error) return <div data-testid="error">{error.message}</div>;
  if (data) return <div data-testid="data">{JSON.stringify(data)}</div>;
  return <div data-testid="loading">loading</div>;
};

describe('useDataProvider', () => {
  it('should return a way to call the dataProvider', async () => {
    const getOne = jest.fn(() =>
      Promise.resolve({ data: { id: 1, title: 'foo' } })
    );
    const dataProvider = { getOne };
    const { queryByTestId } = render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne />
      </DataProviderContext.Provider>
    );
    expect(queryByTestId('loading')).not.toBeNull();
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
    });
    expect(getOne).toBeCalledTimes(1);
    expect(queryByTestId('loading')).toBeNull();
    expect(queryByTestId('data').textContent).toBe(
      '{"id":1,"title":"foo"}'
    );
  });

  it('should handle async errors in the dataProvider', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => { });
    const getOne = jest.fn(() => Promise.reject(new Error('foo')));
    const dataProvider = { getOne };
    const { queryByTestId } = render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseGetOne />
      </DataProviderContext.Provider>
    );
    expect(queryByTestId('loading')).not.toBeNull();
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
    });
    expect(getOne).toBeCalledTimes(1);
    expect(queryByTestId('loading')).toBeNull();
    expect(queryByTestId('error').textContent).toBe('foo');
  });

  it('should throw a meaningful error when the dataProvider throws a sync error', async () => {
    const c = jest.spyOn(console, 'error').mockImplementation(() => { });
    const getOne = jest.fn(() => {
      throw new Error('foo');
    });
    const dataProvider = { getOne };
    const r = () =>
      render(
        <DataProviderContext.Provider value={dataProvider}>
          <UseGetOne />
        </DataProviderContext.Provider>
      );
    expect(r).toThrow(
      new Error(
        'The dataProvider threw an error. It should return a rejected Promise instead.'
      )
    );
    c.mockRestore();
  });

  it('should call custom verbs with standard signature (resource, payload, options)', async () => {
    const UseCustomVerbWithStandardSignature = () => {
      const [data, setData] = useState();
      const [error, setError] = useState();
      const dataProvider = useDataProvider();
      useEffect(() => {
        dataProvider
          .customVerb('posts', { id: 1 })
          .then(res => setData(res.data))
          .catch(e => setError(e));
      }, [dataProvider]);
      if (error) return <div data-testid="error">{error.message}</div>;
      if (data)
        return <div data-testid="data">{JSON.stringify(data)}</div>;
      return <div data-testid="loading">loading</div>;
    };
    const customVerb = jest.fn(() => Promise.resolve({ data: null }));
    const dataProvider = { customVerb };
    render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseCustomVerbWithStandardSignature />
      </DataProviderContext.Provider>
    );
    // waitFor for the dataProvider to return
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
    });

    expect(customVerb).toHaveBeenCalledWith('posts', { id: 1 });
  });

  it('should accept calls to custom verbs with no arguments', async () => {
    const UseCustomVerbWithNoArgument = () => {
      const [data, setData] = useState();
      const [error, setError] = useState();
      const dataProvider = useDataProvider();
      useEffect(() => {
        dataProvider
          .customVerb()
          .then(res => setData(res.data))
          .catch(e => setError(e));
      }, [dataProvider]);
      if (error) return <div data-testid="error">{error.message}</div>;
      if (data)
        return <div data-testid="data">{JSON.stringify(data)}</div>;
      return <div data-testid="loading">loading</div>;
    };
    const customVerb = jest.fn(() => Promise.resolve({ data: null }));
    const dataProvider = { customVerb };
    render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseCustomVerbWithNoArgument />
      </DataProviderContext.Provider>
    );
    // waitFor for the dataProvider to return
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
    });

    expect(customVerb).toHaveBeenCalledWith();
  });

  it('should accept custom arguments for custom verbs', async () => {
    const UseCustomVerb = () => {
      const [data, setData] = useState();
      const [error, setError] = useState();
      const dataProvider = useDataProvider();
      useEffect(() => {
        dataProvider
          .customVerb({ id: 1 }, ['something'])
          .then(res => setData(res.data))
          .catch(e => setError(e));
      }, [dataProvider]);
      if (error) return <div data-testid="error">{error.message}</div>;
      if (data)
        return <div data-testid="data">{JSON.stringify(data)}</div>;
      return <div data-testid="loading">loading</div>;
    };
    const customVerb = jest.fn(() => Promise.resolve({ data: null }));
    const dataProvider = { customVerb };
    render(
      <DataProviderContext.Provider value={dataProvider}>
        <UseCustomVerb />
      </DataProviderContext.Provider>
    );
    // waitFor for the dataProvider to return
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve));
    });

    expect(customVerb).toHaveBeenCalledWith({ id: 1 }, ['something']);
  });
});
