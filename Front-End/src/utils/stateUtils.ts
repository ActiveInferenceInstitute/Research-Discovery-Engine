/**
 * State Management Utilities
 * 
 * This module provides Redux-like state management patterns and utilities
 * for complex state management without requiring external Redux dependencies.
 */

import { useReducer, useCallback, useMemo, useContext, createContext, ReactNode } from 'react';

/**
 * Generic action interface for reducer patterns
 */
export interface Action<T = string, P = any> {
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
  initialState: S,
  reducerMap: Record<string, (state: S, action: A) => S>
) {
  const reducer: Reducer<S, A> = (state, action) => {
    const handler = reducerMap[action.type];
    return handler ? handler(state, action) : state;
  };

  const actionCreators = Object.keys(reducerMap).reduce((creators, type) => {
    creators[type] = (payload?: any) => ({ type, payload });
    return creators;
  }, {} as Record<string, (payload?: any) => A>);

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

  const dispatchAction = useCallback((type: string, payload?: any) => {
    dispatch({ type, payload } as A);
  }, []);

  const createActionDispatcher = useCallback((type: string) => {
    return (payload?: any) => dispatch({ type, payload } as A);
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
    dispatch: React.Dispatch<A>;
  } | null>(null);

  const StateProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
      <StateContext.Provider value={{ state, dispatch }}>
        {children}
      </StateContext.Provider>
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
 * @param equalityFn - Optional equality function for optimization
 * @returns Selected data from state
 */
export function createSelector<S, T>(
  selector: (state: S) => T,
  equalityFn?: (a: T, b: T) => boolean
) {
  return function useSelector(state: S): T {
    return useMemo(() => selector(state), [state]);
  };
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
  setIn<S>(state: S, path: string, value: any): S {
    const keys = path.split('.');
    
    function updateNested(obj: any, keys: string[], value: any): any {
      if (keys.length === 1) {
        return { ...obj, [keys[0]]: value };
      }
      
      const [head, ...tail] = keys;
      return {
        ...obj,
        [head]: updateNested(obj[head] || {}, tail, value)
      };
    }
    
    return updateNested(state, keys, value);
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
  updateArrayItem<S>(
    state: S,
    arrayPath: string,
    index: number,
    value: any | ((item: any) => any)
  ): S {
    const keys = arrayPath.split('.');
    
    function updateArray(obj: any, keys: string[], index: number, value: any): any {
      if (keys.length === 1) {
        const array = obj[keys[0]] || [];
        const newArray = [...array];
        newArray[index] = typeof value === 'function' ? value(array[index]) : value;
        return { ...obj, [keys[0]]: newArray };
      }
      
      const [head, ...tail] = keys;
      return {
        ...obj,
        [head]: updateArray(obj[head] || {}, tail, index, value)
      };
    }
    
    return updateArray(state, keys, index, value);
  },

  /**
   * Adds item to array immutably
   * 
   * @param state - Current state
   * @param arrayPath - Path to array
   * @param item - Item to add
   * @returns New state with item added to array
   */
  addToArray<S>(state: S, arrayPath: string, item: any): S {
    const keys = arrayPath.split('.');
    
    function addToNestedArray(obj: any, keys: string[], item: any): any {
      if (keys.length === 1) {
        const array = obj[keys[0]] || [];
        return { ...obj, [keys[0]]: [...array, item] };
      }
      
      const [head, ...tail] = keys;
      return {
        ...obj,
        [head]: addToNestedArray(obj[head] || {}, tail, item)
      };
    }
    
    return addToNestedArray(state, keys, item);
  },

  /**
   * Removes item from array immutably
   * 
   * @param state - Current state
   * @param arrayPath - Path to array
   * @param predicate - Function to identify item to remove
   * @returns New state with item removed from array
   */
  removeFromArray<S>(
    state: S,
    arrayPath: string,
    predicate: (item: any, index: number) => boolean
  ): S {
    const keys = arrayPath.split('.');
    
    function removeFromNestedArray(obj: any, keys: string[], predicate: any): any {
      if (keys.length === 1) {
        const array = obj[keys[0]] || [];
        return { ...obj, [keys[0]]: array.filter((item: any, index: number) => !predicate(item, index)) };
      }
      
      const [head, ...tail] = keys;
      return {
        ...obj,
        [head]: removeFromNestedArray(obj[head] || {}, tail, predicate)
      };
    }
    
    return removeFromNestedArray(state, keys, predicate);
  },

  /**
   * Merges object properties immutably
   * 
   * @param state - Current state
   * @param path - Path to object to merge
   * @param updates - Object with updates to merge
   * @returns New state with merged object
   */
  merge<S>(state: S, path: string, updates: Record<string, any>): S {
    const keys = path.split('.');
    
    function mergeNested(obj: any, keys: string[], updates: any): any {
      if (keys.length === 1) {
        return { ...obj, [keys[0]]: { ...(obj[keys[0]] || {}), ...updates } };
      }
      
      const [head, ...tail] = keys;
      return {
        ...obj,
        [head]: mergeNested(obj[head] || {}, tail, updates)
      };
    }
    
    return mergeNested(state, keys, updates);
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
    if (action.payload && typeof action.payload.then === 'function') {
      return action.payload
        .then((result: any) => 
          store.dispatch({ ...action, payload: result } as A)
        )
        .catch((error: any) => 
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
      const newState = typeof value === 'function' ? (value as Function)(prevState) : value;
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

// Add missing import for useState
import { useState } from 'react'; 