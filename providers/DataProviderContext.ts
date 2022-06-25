import { createContext } from 'react';

import { DataProvider } from './DataProvider';

export const DataProviderContext = createContext<DataProvider>(null);

DataProviderContext.displayName = 'DataProviderContext';