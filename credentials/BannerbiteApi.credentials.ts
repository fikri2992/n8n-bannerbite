import type {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class BannerbiteApi implements ICredentialType {
  name = 'bannerbiteApi';
  displayName = 'Bannerbite Api';
  documentationUrl = 'https://support.bannerbite.com/integrations/n8n';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Authentication key from service provider',
    },
    {
      displayName: 'API Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.bannerbite.com',
      required: true,
      description: 'Base URL for the API',
    },
  ];
}
