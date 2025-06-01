import { INodeType } from 'n8n-workflow';
import { BannerbiteNode } from './nodes/Bannerbite/BannerbiteNode.node';
import { NewBannerbiteNode } from './nodes/NewBannerbite/NewBannerbiteNode.node';
import { BannerbiteApi } from './credentials/BannerbiteApi.credentials';

// Export the node types
export const nodeTypes: INodeType[] = [
  new BannerbiteNode(),
  new NewBannerbiteNode(),
];

// Export the credential types
export const credentialTypes = {
  bannerbiteApi: new BannerbiteApi(),
};

// For backward compatibility
module.exports = { nodeTypes, credentialTypes };