import { INodeType } from 'n8n-workflow';
import { BannerbiteNode } from './nodes/CustomNode/BannerbiteNode.node';
import { BannerbiteApi } from './credentials/BannerbiteApi.credentials';

// Export the node types
export const nodeTypes: INodeType[] = [
  new BannerbiteNode(),
];

// Export the credential types
export const credentialTypes = {
  bannerbiteApi: new BannerbiteApi(),
};

// For backward compatibility
module.exports = { nodeTypes, credentialTypes };