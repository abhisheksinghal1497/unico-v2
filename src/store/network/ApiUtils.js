import { useMutation, useQueries } from '@tanstack/react-query';
import { QueryObject } from '../../services/QueryObject';
import { GetListViews } from '../../services/GetRequestService/GetListViews';
import { GetListViewMetadata } from '../../services/GetRequestService/GetListViewMetadata';
import { ModifySqlOrderClause } from '../../src/utils/modifySqlOrderClause';
import { GetLeadListViewsApi } from './ApiCalls';

export const getLeadsByQuery = (isOnline) => {
  const mutate = useMutation({
    networkMode: 'always',
    mutationFn: (body) => {
      //   const { query } = body;
      console.log('Body and query', body);
      const leadList = QueryObject(body?.query);
      return leadList;
    },
  });
  return mutate;
};

export const getLeadById = (isOnline, query) => {
  const mutate = useMutation({
    networkMode: 'always',
    mutationFn: (body) => {
      const leadList = QueryObject(query);
      return leadList;
    },
  });
  return mutate;
};

export const getLeadListViews = (isOnline) => {
  const mutate = useMutation({
    networkMode: 'always',
    mutationFn: (body) => {
      const leadList = GetLeadListViewsApi();
      return leadList;
      //   console.log();
    },
  });
  return mutate;
};

export const searchLeadQuery = (isOnline) => {
  const mutate = useMutation({
    networkMode: 'always',
    mutationFn: (body) => {
      const leadList = GetLeadListViewsApi();
      return leadList;
      //   console.log();
    },
  });
  return mutate;
};
