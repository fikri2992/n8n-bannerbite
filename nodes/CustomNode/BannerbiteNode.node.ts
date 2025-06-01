import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  NodeOperationError,
  ICredentialDataDecryptedObject,
  IDataObject,
  NodeConnectionType,
} from 'n8n-workflow';
import fetch from 'node-fetch';

// Type for API response
interface IApiResponse<T = IDataObject> {
  data?: T;
  error?: string;
}

// Type for API credentials
interface IApiCredentials extends ICredentialDataDecryptedObject {
  apiKey: string;
  baseUrl: string;
}

// Type for resource field
interface IResourceField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  options?: Array<{ value: string; name: string }>;
}

export class BannerbiteNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bannerbite Node',
    name: 'bannerbiteNode',
    icon: 'fa:server',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Bannerbite API',
    defaults: {
      name: 'Bannerbite API',
      color: '#1A82E2',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'BannerbiteApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: '={{$credentials.baseUrl}}',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Users',
            value: 'users',
          },
          {
            name: 'Products',
            value: 'products',
          },
        ],
        default: 'users',
        required: true,
        description: 'Resource to operate on',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['users', 'products'],
          },
        },
        options: [
          {
            name: 'Get',
            value: 'get',
            action: 'Get a resource',
            description: 'Get a single resource by ID',
            routing: {
              request: {
                method: 'GET',
                url: '={{ "/" + $parameter["resource"] + "/" + $parameter["id"] }}',
              },
            },
          },
          {
            name: 'Get All',
            value: 'getAll',
            action: 'Get all resources',
            description: 'Get all resources',
            routing: {
              request: {
                method: 'GET',
                url: '={{ "/" + $parameter["resource"] }}',
                qs: {
                  page: '={{$parameter.returnAll ? undefined : $parameter.limit}}',
                  per_page: '={{$parameter.limit}}',
                },
              },
              output: {
                postReceive: [
                  {
                    type: 'rootProperty',
                    properties: {
                      property: 'data',
                    },
                  },
                ],
              },
            },
          },
        ],
        default: 'getAll',
      },
      {
        displayName: 'ID',
        name: 'id',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['get', 'update', 'delete'],
          },
        },
        default: '',
        required: true,
        description: 'ID of the resource to operate on',
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
          show: {
            operation: ['getAll'],
          },
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        displayOptions: {
          show: {
            operation: ['getAll'],
            returnAll: [false],
          },
        },
        default: 50,
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Filter Field',
            name: 'filterField',
            type: 'options',
            typeOptions: {
              loadOptionsDependsOn: ['resource'],
              loadOptionsMethod: 'getFilterFields',
            },
            default: '',
            description: 'Field to filter by',
          },
          {
            displayName: 'Filter Value',
            name: 'filterValue',
            type: 'string',
            default: '',
            description: 'Value to filter by',
          },
        ],
      },
    ],
  };

  methods = {
    loadOptions: {
      // Load available filter fields from the API
      async loadOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const resource = this.getNodeParameter('resource', 0) as string;
        const credentials = await this.getCredentials('customApi') as IApiCredentials;

        try {
          const response = await fetch(`${credentials.baseUrl}/fields/${resource}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to load fields: ${response.statusText}`);
          }

          const data = await response.json() as { fields: IResourceField[] };
          
          return data.fields.map((field: IResourceField) => ({
            name: field.name,
            value: field.id,
            description: field.description || '',
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          throw new Error(`Error loading fields: ${errorMessage}`);
        }
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    
    try {
      // Get credentials with proper type assertion
      const credentials = await this.getCredentials('customApi') as IApiCredentials;
      
      if (!credentials) {
        throw new NodeOperationError(this.getNode(), 'No credentials found for Custom API');
      }

      // Initialize response data
      let responseData: unknown;
      let endpoint = `/${resource}`;

      // Helper function to make API requests
      const makeApiRequest = async (
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
        body?: unknown
      ): Promise<IApiResponse> => {
        try {
          const response = await fetch(`${credentials.baseUrl}${endpoint}`, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            ...(body ? { body: JSON.stringify(body) } : {}),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({} as IDataObject));
            const errorMessage = errorData.message || response.statusText || 'Unknown error occurred';
            throw new Error(`API request failed: ${response.status} - ${errorMessage}`);
          }

          return response.json();
        } catch (error) {
          if (error instanceof Error) {
            throw new NodeOperationError(this.getNode(), `API request failed: ${error.message}`, { itemIndex: 0 });
          }
          throw new NodeOperationError(this.getNode(), 'API request failed', { itemIndex: 0 });
        }
      };

      // Handle different operations
      switch (operation) {
        case 'getAll': {
          const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
          const filters = this.getNodeParameter('filters', 0, {}) as {
            filterField?: string;
            filterValue?: string;
          };

          const queryParams = new URLSearchParams();

          if (!returnAll) {
            const limit = this.getNodeParameter('limit', 0) as number;
            queryParams.append('limit', limit.toString());
          }

          if (filters.filterField && filters.filterValue) {
            queryParams.append(filters.filterField, filters.filterValue);
          }

          if (queryParams.toString()) {
            endpoint += `?${queryParams.toString()}`;
          }
          
          const response = await makeApiRequest(endpoint, 'GET');
          responseData = response.data;
          break;
        }
        
        case 'get': {
          const id = this.getNodeParameter('id', 0) as string;
          const response = await makeApiRequest(`${endpoint}/${id}`, 'GET');
          responseData = response.data;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Operation '${operation}' is not supported`);
      }

      // Process the response data
      if (Array.isArray(responseData)) {
        for (const item of responseData) {
          returnData.push({
            json: item as IDataObject,
          });
        }
      } else if (responseData) {
        returnData.push({
          json: responseData as IDataObject,
        });
      }

      return [returnData];
    } catch (error) {
      if (this.continueOnFail()) {
        return [[{ json: { error: error instanceof Error ? error.message : 'Unknown error occurred' } }]];
      }
      if (error instanceof Error) {
        throw new NodeOperationError(this.getNode(), error.message, { description: error.message });
      }
      throw new NodeOperationError(this.getNode(), 'An unknown error occurred');
    }
  }
}
