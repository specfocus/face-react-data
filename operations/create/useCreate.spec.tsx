import React from 'react';
import { render, waitFor } from '@testing-library/react';
import expect from 'expect';

import { Entity } from '../../entities';
import { testDataProvider } from '../../providers/testDataProvider';
import { useCreate } from './useCreate';
import { DataProviderContext } from '../../providers/DataProviderContext';

describe('useCreate', () => {
  it('returns a callback that can be used with create arguments', async () => {
    const dataProvider = testDataProvider({
      create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
    });
    let localCreate;
    const Dummy = () => {
      const [create] = useCreate();
      localCreate = create;
      return <span />;
    };

    render(
      <DataProviderContext.Provider value={dataProvider}>
        <Dummy />
      </DataProviderContext.Provider>
    );
    localCreate('foo', { data: { bar: 'baz' } });
    await waitFor(() => {
      expect(dataProvider.create).toHaveBeenCalledWith('foo', {
        data: { bar: 'baz' },
      });
    });
  });

  it('returns a callback that can be used with no arguments', async () => {
    const dataProvider = testDataProvider({
      create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
    });
    let localCreate;
    const Dummy = () => {
      const [create] = useCreate('foo', { data: { bar: 'baz' } });
      localCreate = create;
      return <span />;
    };

    render(
      <DataProviderContext.Provider value={dataProvider}>
        <Dummy />
      </DataProviderContext.Provider>
    );
    localCreate();
    await waitFor(() => {
      expect(dataProvider.create).toHaveBeenCalledWith('foo', {
        data: { bar: 'baz' },
      });
    });
  });

  it('uses call time params over hook time params', async () => {
    const dataProvider = testDataProvider({
      create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
    });
    let localCreate;
    const Dummy = () => {
      const [create] = useCreate('foo', { data: { bar: 'baz' } });
      localCreate = create;
      return <span />;
    };

    render(
      <DataProviderContext.Provider value={dataProvider}>
        <Dummy />
      </DataProviderContext.Provider>
    );
    localCreate('foo', { data: { foo: 456 } });
    await waitFor(() => {
      expect(dataProvider.create).toHaveBeenCalledWith('foo', {
        data: { foo: 456 },
      });
    });
  });

  it('accepts a meta paramater', async () => {
    const dataProvider = testDataProvider({
      create: jest.fn(() => Promise.resolve({ data: { id: 1 } } as any)),
    });
    let localCreate;
    const Dummy = () => {
      const [create] = useCreate();
      localCreate = create;
      return <span />;
    };

    render(
      <DataProviderContext.Provider value={dataProvider}>
        <Dummy />
      </DataProviderContext.Provider>
    );
    localCreate('foo', { data: { bar: 'baz' }, meta: { hello: 'world' } });
    await waitFor(() => {
      expect(dataProvider.create).toHaveBeenCalledWith('foo', {
        data: { bar: 'baz' },
        meta: { hello: 'world' },
      });
    });
  });

  it('returns a state typed based on the parametric type', async () => {
    interface Product extends Entity {
      sku: string;
    }
    const dataProvider = testDataProvider({
      create: jest.fn(() =>
        Promise.resolve({ data: { id: 1, sku: 'abc' } } as any)
      ),
    });
    let localCreate;
    let sku;
    const Dummy = () => {
      const [create, { data }] = useCreate<Product>();
      localCreate = create;
      sku = data && data.sku;
      return <span />;
    };
    render(
      <DataProviderContext.Provider value={dataProvider}>
        <Dummy />
      </DataProviderContext.Provider>
    );
    expect(sku).toBeUndefined();
    localCreate('products', { data: { sku: 'abc' } });
    await waitFor(() => {
      expect(sku).toEqual('abc');
    });
  });
});
