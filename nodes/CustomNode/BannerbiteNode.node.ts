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

// Type for API credentials
interface IApiCredentials extends ICredentialDataDecryptedObject {
  apiKey: string;
  baseUrl: string;
}

// Type for project
interface IProject {
  id: string;
  name: string;
  description?: string;
}

// Type for bite
interface IBite {
  id: string;
  name: string;
  project_id: string;
  description?: string;
}

// Type for scene data
interface ISceneData {
  id: string;
  label: string;
  key: string;
  value: any;
  type?: string;
  [key: string]: any;
}

export class BannerbiteNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bannerbite',
    name: 'bannerbiteNode',
    group: ['transform'],
    version: 1,
    description: 'Interact with Bannerbite API',
    defaults: {
      name: 'Bannerbite',
      color: '#1A82E2',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'bannerbiteApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Get Scene Data',
            value: 'getSceneData',
            action: 'Get scene data for a bite',
          },
        ],
        default: 'getSceneData',
      },
      {
        displayName: 'Project',
        name: 'projectId',
        type: 'options',
        description: 'Select a project',
        typeOptions: {
          loadOptionsMethod: 'getProjects',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['getSceneData'],
          },
        },
      },
      {
        displayName: 'Bite',
        name: 'biteId',
        type: 'options',
        description: 'Select a bite from the project',
        typeOptions: {
          loadOptionsMethod: 'getBites',
          loadOptionsDependsOn: ['projectId'],
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['getSceneData'],
          },
        },
      },
      {
        displayName: 'Output',
        name: 'output',
        type: 'collection',
        placeholder: 'Add Output',
        default: {},
        displayOptions: {
          show: {
            operation: ['getSceneData'],
          },
        },
        options: [
          {
            displayName: 'Include All Fields',
            name: 'includeAllFields',
            type: 'boolean',
            default: true,
            description: 'Whether to include all fields in the output',
          },
        ],
      },
    ],
  };

  methods = {
    loadOptions: {
      async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const credentials = await this.getCredentials('bannerbiteApi') as IApiCredentials;
        
        try {
          const response = await fetch(`${credentials.baseUrl}/api/projects`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to fetch projects');
          }

          const projects = await response.json() as IProject[];
          return projects.map((project) => ({
            name: project.name || `Project ${project.id}`,
            value: project.id,
            description: project.description || '',
          }));

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          throw new NodeOperationError(
            this.getNode(),
            `Error loading projects: ${errorMessage}`,
            { description: 'Check your API key and network connection' }
          );
        }
      },

      async getBites(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const projectId = this.getNodeParameter('projectId') as string;
        const credentials = await this.getCredentials('bannerbiteApi') as IApiCredentials;
        
        if (!projectId) {
          return [];
        }

        try {
          const response = await fetch(
            `${credentials.baseUrl}/api/bites?project_id=${projectId}&limit=100`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.apiKey}`,
              },
            }
          );

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to fetch bites');
          }

          const bites = await response.json() as IBite[];
          return bites.map((bite) => ({
            name: bite.name || `Bite ${bite.id}`,
            value: bite.id,
            description: bite.description || '',
          }));

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          throw new NodeOperationError(
            this.getNode(),
            `Error loading bites: ${errorMessage}`,
            { description: 'Check if the project ID is valid and you have access to it' }
          );
        }
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;
    const credentials = await this.getCredentials('bannerbiteApi') as IApiCredentials;

    for (let i = 0; i < items.length; i++) {
      try {
        if (operation === 'getSceneData') {
          const biteId = this.getNodeParameter('biteId', i) as string;
          const outputOptions = this.getNodeParameter('output', i, {}) as {
            includeAllFields?: boolean;
          };

          // Get scene data
          const response = await fetch(
            `${credentials.baseUrl}/api/zapier/bites/sceneData/${biteId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials.apiKey}`,
              },
            }
          );

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to fetch scene data');
          }

          const sceneData = await response.json() as ISceneData | ISceneData[];
          const scenes = Array.isArray(sceneData) ? sceneData : [sceneData];

          // Format the output
          const formattedData = scenes.map((scene) => {
            const baseData = {
              sceneId: scene.id,
              sceneName: scene.label || scene.key,
              biteId,
              projectId: this.getNodeParameter('projectId', i) as string,
            };

            if (outputOptions.includeAllFields !== false) {
              return {
                json: {
                  ...baseData,
                  ...scene,
                },
              };
            }

            // Return only specific fields if includeAllFields is false
            return {
              json: {
                ...baseData,
                label: scene.label,
                key: scene.key,
                value: scene.value,
                type: scene.type || 'text',
              },
            };
          });

          returnData.push(...formattedData);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: errorMessage,
              node: this.getNode().name,
              timestamp: new Date().toISOString(),
            },
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), errorMessage, { itemIndex: i });
      }
    }

    return this.prepareOutputData(returnData);
  }
}
