"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialTypes = exports.nodeTypes = void 0;
const BannerbiteNode_node_1 = require("./nodes/CustomNode/BannerbiteNode.node");
const BannerbiteApi_credentials_1 = require("./credentials/BannerbiteApi.credentials");
// Export the node types
exports.nodeTypes = [
    new BannerbiteNode_node_1.BannerbiteNode(),
];
// Export the credential types
exports.credentialTypes = {
    bannerbiteApi: new BannerbiteApi_credentials_1.BannerbiteApi(),
};
// For backward compatibility
module.exports = { nodeTypes: exports.nodeTypes, credentialTypes: exports.credentialTypes };
//# sourceMappingURL=index.js.map