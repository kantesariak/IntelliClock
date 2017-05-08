import { createStore } from 'redux';

import Reducers from '../reducers/reducers';

export const store = createStore(Reducers);