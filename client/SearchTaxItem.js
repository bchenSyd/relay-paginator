import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';


const SearchTaxItem = ({item}) => {
  return (
    <div id={`search_tax_item_${item.id}`}  style={{margin:'0 10px 10px 0', width:'20%', display:'inline-block'}}>
      <div id="title">title: {item.title}</div>
      <div id="desc">description: {item.description}</div>
      <div id="keyword">keyword: {item.keyword}</div>
    </div>
  );
};

export default createFragmentContainer(
  SearchTaxItem,
  graphql`
    fragment SearchTaxItem_item on SearchTaxItem{
        id
        title
        description
        keyword
    }
  `
);