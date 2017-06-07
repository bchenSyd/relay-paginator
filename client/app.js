// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';
import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

import SearchTaxInput from './SearchTaxInput';


function fetchQuery(
  operation,
  variables,
) {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}

const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});


const mountNode = document.getElementById('root');
ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`query appQuery(
        $count: Int,
        $cursor: String,
        $keyword: String
        ){
            viewer{
                ...SearchTaxInput_viewer
            }
      }`
    }
    variables={{
      count: 5
    }}
    render={({error, props, retry}) => {
      if (props) {
        return  <SearchTaxInput {...props} />
      }else{
        return <div>Loding...</div>
      }
    }}
  />, mountNode);