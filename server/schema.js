import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from 'graphql';

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    cursorForObjectInConnection,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
    toGlobalId,
} from 'graphql-relay';

let searchTaxItems;

(function _setupData() {
    searchTaxItems = Array.from(Array(20), (_, index) => {
        const tmp = index % 3;
        let keyword;
        switch (tmp) {
            case 0:
                keyword = 'apple';
                break;
            case 1:
                keyword = 'banana';
                break;
            case 2:
                keyword = 'oringe';
                break;
        }
        return {
            id: index,
            title: `title:${index}`,
            description: `description:${index}`,
            keyword
        }
    })

})();

const _searchTaxItems = keyword => {
    if (!keyword) {
        return searchTaxItems;
    }
    return searchTaxItems.filter(e => e.keyword === keyword);
}

const {nodeInterface, nodeField} = nodeDefinitions(
    globalId => {
        const [type, id] = globalId.split(':');
        return searchTaxItems.find(e => e.id === Number(id));
    },
    obj => GraphQLSearchTaxItem
);

const GraphQLSearchTaxItem = new GraphQLObjectType({
    name: 'SearchTaxItem',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: (obj) => 'SearchTaxItem:' + obj.id,
        },
        title: {
            type: GraphQLString,
            resolve: (obj) => obj.title,
        },
        description: {
            type: GraphQLString,
            resolve: (obj) => obj.description,
        },
        keyword: {
            type: GraphQLString
        },
    },
    interfaces: [nodeInterface],
});

const {
    connectionType: SearchTaxItemsConnection,
    edgeType: GraphQLSearchTaxItemEdge,
} = connectionDefinitions({
    name: 'SearchTaxItem',
    nodeType: GraphQLSearchTaxItem,
});

const GraphQLUser = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { // every GraphqlObjectType need an 'id' field to generate __dataId 
            type: new GraphQLNonNull(GraphQLID),
            resolve:_=>'user:0',
        },
        searchTaxClass: {
            type: SearchTaxItemsConnection,
            args: {
                keyword: {
                    type: GraphQLString,
                    defaultValue: '',
                },
                ...connectionArgs,
            },
            resolve: (obj, {keyword, ...args}) =>
                connectionFromArray(_searchTaxItems(keyword), args),
        },
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        viewer: {
            type: GraphQLUser,
            resolve: () => ({}),
        },
        node: nodeField,
    },
});

export const schema = new GraphQLSchema({
    query: Query
});