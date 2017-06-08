'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _graphql = require('graphql');

var _graphqlRelay = require('graphql-relay');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchTaxItems = void 0;

(function _setupData() {
    searchTaxItems = (0, _from2.default)(Array(120), function (_, index) {
        var tmp = index % 3;
        var keyword = void 0;
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
            title: 'title:' + index,
            description: 'description:' + index,
            keyword: keyword
        };
    });
})();

var _searchTaxItems = function _searchTaxItems(keyword) {
    if (!keyword) {
        return searchTaxItems;
    }
    return searchTaxItems.filter(function (e) {
        return e.keyword === keyword;
    });
};

var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
    var _globalId$split = globalId.split(':'),
        _globalId$split2 = (0, _slicedToArray3.default)(_globalId$split, 2),
        type = _globalId$split2[0],
        id = _globalId$split2[1];

    return searchTaxItems.find(function (e) {
        return e.id === Number(id);
    });
}, function (obj) {
    return GraphQLSearchTaxItem;
}),
    nodeInterface = _nodeDefinitions.nodeInterface,
    nodeField = _nodeDefinitions.nodeField;

var GraphQLSearchTaxItem = new _graphql.GraphQLObjectType({
    name: 'SearchTaxItem',
    fields: {
        id: {
            type: new _graphql.GraphQLNonNull(_graphql.GraphQLID),
            resolve: function resolve(obj) {
                return 'SearchTaxItem:' + obj.id;
            }
        },
        title: {
            type: _graphql.GraphQLString,
            resolve: function resolve(obj) {
                return obj.title;
            }
        },
        description: {
            type: _graphql.GraphQLString,
            resolve: function resolve(obj) {
                return obj.description;
            }
        },
        keyword: {
            type: _graphql.GraphQLString
        }
    },
    interfaces: [nodeInterface]
});

var _connectionDefinition = (0, _graphqlRelay.connectionDefinitions)({
    name: 'SearchTaxItem',
    nodeType: GraphQLSearchTaxItem
}),
    SearchTaxItemsConnection = _connectionDefinition.connectionType,
    GraphQLSearchTaxItemEdge = _connectionDefinition.edgeType;

var GraphQLUser = new _graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { // every GraphqlObjectType need an 'id' field to generate __dataId 
            type: new _graphql.GraphQLNonNull(_graphql.GraphQLID),
            resolve: function resolve(_) {
                return 'user:0';
            }
        },
        searchTaxClass: {
            type: SearchTaxItemsConnection,
            args: (0, _extends3.default)({
                keyword: {
                    type: _graphql.GraphQLString,
                    defaultValue: ''
                }
            }, _graphqlRelay.connectionArgs),
            resolve: function resolve(obj, _ref) {
                var keyword = _ref.keyword,
                    args = (0, _objectWithoutProperties3.default)(_ref, ['keyword']);
                return (0, _graphqlRelay.connectionFromArray)(_searchTaxItems(keyword), args);
            }
        }
    }
});

var Query = new _graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        viewer: {
            type: GraphQLUser,
            resolve: function resolve() {
                return {};
            }
        },
        node: nodeField
    }
});

var schema = exports.schema = new _graphql.GraphQLSchema({
    query: Query
});
//# sourceMappingURL=schema.js.map