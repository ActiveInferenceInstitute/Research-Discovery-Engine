/**
 * State Management Utilities
 * 
 * This module provides Redux-like state management patterns and utilities
 * for complex state management without requiring external Redux dependencies.
 */

import { useReducer, useCallback, useMemo, useState, useContext, createContext, createElement, type Dispatch, type ReactNode } from 'react';

/**
 * Generic action interface for reducer patterns
 */
export interface Action<T = string, P = unknown> {
  type: T;
  payload?: P;
}

/**
 * Reducer function type
 */
export type Reducer<S, A> = (state: S, action: A) => S;

/**
 * Creates a strongly typed reducer with action creators
 * 
 * @param initialState - Initial state value
 * @param reducerMap - Map of action types to reducer functions
 * @returns Object with reducer function and action creators
 */
export function createReducer<S, A extends Action>(
  ...[, reducerMap]: [
    initialState: S,
    reducerMap: Record<string, (state: S, action: A) => S>
  ]
) {
  const reducer: Reducer<S, A> = (state, action) => {
    const handler = reducerMap[action.type];
    return handler ? handler(state, action) : state;
  };

  const actionCreators = Object.keys(reducerMap).reduce((creators, type) => {
    creators[type] = (payload?: A['payload']) => ({ type, payload } as A);
    return creators;
  }, {} as Record<string, (payload?: A['payload']) => A>);

  return { reducer, actionCreators };
}

/**
 * Enhanced useReducer hook with action dispatching helpers
 * 
 * @param reducer - Reducer function
 * @param initialState - Initial state
 * @returns Object with state, dispatch, and helper methods
 */
export function useEnhancedReducer<S, A extends Action>(
  reducer: Reducer<S, A>,
  initialState: S
) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatchAction = useCallback((type: string, payload?: A['payload']) => {
    dispatch({ type, payload } as A);
  }, []);

  const createActionDispatcher = useCallback((type: string) => {
    return (payload?: A['payload']) => dispatch({ type, payload } as A);
  }, []);

  return {
    state,
    dispatch,
    dispatchAction,
    createActionDispatcher
  };
}

/**
 * Creates a context-based state provider with reducer pattern
 * 
 * @param reducer - Reducer function
 * @param initialState - Initial state
 * @returns Context provider component and hook for consuming state
 */
export function createStateProvider<S, A extends Action>(
  reducer: Reducer<S, A>,
  initialState: S
) {
  const StateContext = createContext<{
    state: S;
    dispatch: Dispatch<A>;
  } | null>(null);

  const StateProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // JSX in a .ts file does not parse; createElement is the identical call.
    return createElement(
      StateContext.Provider,
      { value: { state, dispatch } },
      children
    );
  };

  const useStateContext = () => {
    const context = useContext(StateContext);
    if (!context) {
      throw new Error('useStateContext must be used within StateProvider');
    }
    return context;
  };

  return { StateProvider, useStateContext };
}

/**
 * Creates a selector hook for accessing specific parts of state
 * 
 * @param selector - Function to select data from state
 * @param equalityFn - Reserved for a custom-equality memo; not applied yet
 * @returns Selected data from state
 */
export const createSelector: <S, T>(
  selector: (state: S) => T,
  equalityFn?: (a: T, b: T) => boolean
) => (state: S) => T = <S, T>(selector: (state: S) => T) => {
  return function useSelector(state: S): T {
    return useMemo(() => selector(state), [state]);
  };
};

// Dynamic dotted paths cannot express their leaf type in terms of S. Keep
// traversal values unknown and preserve the root type at the public boundary.
function updateIn<S>(state: S, path: string, update: (value: unknown) => unknown): S {
  function visit(value: unknown, [key, ...tail]: string[]): Record<string, unknown> {
    const object = (value || {}) as Record<string, unknown>;
    const child = object[key];
    return { ...object, [key]: tail.length ? visit(child, tail) : update(child) };
  }

  return visit(state, path.split('.')) as S;
}

/**
 * Immutable state update utilities
 */
export const immer = {
  /**
   * Updates a nested property in state immutably
   * 
   * @param state - Current state
   * @param path - Dot-separated path to property
   * @param value - New value
   * @returns New state with updated property
   */
  setIn<S>(state: S, path: string, value: unknown): S {
    return updateIn(state, path, () => value);
  },

  /**
   * Updates an array item immutably
   *
   * @param state - Current state
   * @param arrayPath - Path to array
   * @param index - Index to update
   * @param value - New value or update function
   * @returns New state with updated array item
   */
  updateArrayItem<S, T = unknown>(
    state: S,
    arrayPath: string,
    index: number,
    value: T | ((item: T) => T)
  ): S {
    return updateIn(state, arrayPath, current => {
      const array = (current || []) as T[];
      const next = [...array];
      next[index] = typeof value === 'function' ? (value as (item: T) => T)(array[index]) : value;
      return next;
    });
  },

  /**
   * Adds item to array immutably
   *
   * @param state - Current state
   * @param arrayPath - Path to array
   * @param item - Item to add
   * @returns New state with item added to array
   */
  addToArray<S>(state: S, arrayPath: string, item: unknown): S {
    return updateIn(state, arrayPath, current => [...((current || []) as Iterable<unknown>), item]);
  },

  /**
   * Removes item from array immutably
   *
   * @param state - Current state
   * @param arrayPath - Path to array
   * @param predicate - Function to identify item to remove
   * @returns New state with item removed from array
   */
  removeFromArray<S, T = unknown>(state: S, arrayPath: string, predicate: (item: T, index: number) => boolean): S {
    return updateIn(state, arrayPath, current => {
      const array = (current || []) as T[];
      return array.filter((item, index) => !predicate(item, index));
    });
  },

  /**
   * Merges object properties immutably
   *
   * @param state - Current state
   * @param path - Path to object to merge
   * @param updates - Object with updates to merge
   * @returns New state with merged object
   */
  merge<S>(state: S, path: string, updates: Record<string, unknown>): S {
    return updateIn(state, path, current => ({ ...(current as object), ...updates }));
  }
};

/**
 * Creates a middleware system for reducers
 * 
 * @param middlewares - Array of middleware functions
 * @returns Enhanced dispatch function
 */
export function createMiddleware<S, A extends Action>(
  middlewares: Array<(store: { getState: () => S; dispatch: React.Dispatch<A> }) => 
    (next: React.Dispatch<A>) => (action: A) => void>
) {
  return function enhanceDispatch(
    dispatch: React.Dispatch<A>,
    getState: () => S
  ): React.Dispatch<A> {
    let enhancedDispatch = dispatch;
    
    middlewares.reverse().forEach(middleware => {
      const store = { getState, dispatch: enhancedDispatch };
      enhancedDispatch = middleware(store)(enhancedDispatch);
    });
    
    return enhancedDispatch;
  };
}

/**
 * Logging middleware for development
 */
export const loggerMiddleware = <S, A extends Action>() => 
  (store: { getState: () => S; dispatch: React.Dispatch<A> }) =>
  (next: React.Dispatch<A>) =>
  (action: A) => {
    console.group(`Action: ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
    next(action);
    console.log('Next State:', store.getState());
    console.groupEnd();
  };

/**
 * Async action middleware for handling promises
 */
export const asyncMiddleware = <S, A extends Action>() =>
  (store: { getState: () => S; dispatch: React.Dispatch<A> }) =>
  (next: React.Dispatch<A>) =>
  (action: A) => {
    const { payload } = action;
    if (payload && typeof (payload as Partial<PromiseLike<unknown>>).then === 'function') {
      return Promise.resolve(payload)
        .then(result =>
          store.dispatch({ ...action, payload: result } as A)
        )
        .catch((error: unknown) =>
          store.dispatch({ 
            type: `${action.type}_ERROR`, 
            payload: error 
          } as A)
        );
    }
    
    return next(action);
  };

/**
 * Creates a persistent state hook that saves to localStorage
 * 
 * @param key - localStorage key
 * @param initialState - Initial state if no stored value
 * @returns State and setter with automatic persistence
 */
export function usePersistentState<T>(
  key: string,
  initialState: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialState;
    } catch {
      return initialState;
    }
  });

  const setPersistentState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prevState => {
      const newState = typeof value === 'function' ? (value as (previous: T) => T)(prevState) : value;
      try {
        localStorage.setItem(key, JSON.stringify(newState));
      } catch (error) {
        console.warn('Failed to persist state to localStorage:', error);
      }
      return newState;
    });
  }, [key]);

  return [state, setPersistentState];
}

/**
 * Creates optimistic updates with rollback capability
 * 
 * @param initialState - Initial state
 * @returns State management with optimistic updates
 */
export function useOptimisticState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const [optimisticState, setOptimisticState] = useState(initialState);
  const [pendingActions, setPendingActions] = useState<Map<string, () => void>>(new Map());

  const performOptimisticUpdate = useCallback((
    id: string,
    optimisticValue: T,
    asyncAction: () => Promise<T>
  ) => {
    // Apply optimistic update
    setOptimisticState(optimisticValue);
    
    // Store rollback function
    const rollback = () => setOptimisticState(state);
    setPendingActions(prev => new Map(prev).set(id, rollback));
    
    // Execute async action
    asyncAction()
      .then(result => {
        setState(result);
        setOptimisticState(result);
        setPendingActions(prev => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      })
      .catch(() => {
        // Rollback on error
        rollback();
        setPendingActions(prev => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      });
  }, [state]);

  const rollbackAll = useCallback(() => {
    pendingActions.forEach(rollback => rollback());
    setPendingActions(new Map());
  }, [pendingActions]);

  return {
    state: optimisticState,
    setState,
    performOptimisticUpdate,
    rollbackAll,
    hasPendingActions: pendingActions.size > 0
  };
}
