// @flow
// paginator;
import React from 'react';
import {createPaginationContainer, graphql} from 'react-relay';
import SearchTaxItem from './SearchTaxItem';

const SearchTaxList = props => {
  const _loadMore = _ => {
    if (!props.relay.hasMore() || props.relay.isLoading()) {
      alert('no more record')
      return;
    }

    props.relay.loadMore(
      5, // Fetch the next 5 feed items
      error => {
        
      },
    );
  }

  return (
    <div>
      <div style={{margin:'10px 0 10px 0'}}><button onClick={_loadMore} >Load More</button></div>
      <div style={{padding:'5px', border:'solid 1px grey'}}> {props.viewer.searchTaxClass.edges.map(
        edge => <SearchTaxItem item={edge.node} key={edge.node.id} />
      )}</div>
    </div>
  );
};

export default createPaginationContainer(
  SearchTaxList,
  {
    viewer: graphql`
      fragment SearchTaxList_viewer on User {
        searchTaxClass(first: $count, 
        after: $cursor, 
        keyword: $keyword   # other Variables
        ) @connection(key: "SearchTaxList_searchTaxClass"){
          pageInfo{
            hasNextPage
            startCursor
            endCursor
          }
          edges{
            cursor
            node{
              id
              ...SearchTaxItem_item
            }
            
          }
        }
      }
    `
  },
  {
    direction: 'forward',

    getConnectionFromProps(props) {
      return props.viewer.searchTaxClass;
    },

    // for render fragment
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      }
    },

    // for query
    getVariables(props, {count, cursor}, fragmentVariables) {
      return {
        count,
        cursor,
        keyword: fragmentVariables.keyword
      }
    },

    query: graphql`
      query SearchTaxListReadMoreQuery(
        $count: Int,
        $cursor: String
        $keyword: String
      ){
        viewer {
          # reference the pagination_container_fragment, but don't have to pass arguments like in refetchContainer
          ...SearchTaxList_viewer
        }
      }
    `,
  }
);