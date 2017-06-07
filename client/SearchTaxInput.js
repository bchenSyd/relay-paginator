// @flow
// refetcher;
import React, {Component} from 'react';
import {
  createRefetchContainer,
  graphql,
} from 'react-relay';

import SearchTaxList from './SearchTaxList';

class SearchTaxInput extends Component<any, any, any> {
  constructor() {
    super();
    this.state = {
      searchKey: '',
    }
  }
  _onSearchTextChanged = e=>{
    const {id, value} = e.target;
    this.setState({searchKey: value})
  }
  _search = _ => {
    let keyword = this.state.searchKey;
    const refetchVariables = fragmentVariables => ({
      keyword,
      count: 30
    });

    this.props.relay.refetch(refetchVariables, null);
  }

  render() {
    const {searchKey} = this.state;
    return (
      <div>
        <div><input id="txt_keyword" type="text" value={searchKey} onChange={this._onSearchTextChanged} placeholder='type a fruit...'/>
          <button onClick={this._search} style={{marginLeft: '10px'}}>Search</button>
        </div>

        <SearchTaxList viewer={this.props.viewer} />
      </div>
    );
  }
}

export default createRefetchContainer(
  SearchTaxInput,
  {
    viewer: graphql.experimental`
      fragment SearchTaxInput_viewer on User{
        ...SearchTaxList_viewer
      }
    `
  },
  graphql.experimental`
    query SearchTaxInputRefetchQuery(
      $keyword: String,
      $count: Int,
      $cursor: String
    ){
      viewer {
        # !! call arguments without argumentDefinitions
        ... SearchTaxInput_viewer @arguments(
          keyword: $keyword,
          first: $count,
          after: $cursor
        )
      }
    }
  `
);