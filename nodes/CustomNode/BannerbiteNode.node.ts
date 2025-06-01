import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  NodeOperationError,
  ICredentialDataDecryptedObject,
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
  id?: string;
  label?: string;
  key: string;
  value?: any;
  type?: string;
  name?: string;
  default?: string;
  [key: string]: any;
}

export class BannerbiteNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Bannerbite',
    name: 'bannerbite',
    icon: 'file:bannerbite.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Interact with Bannerbite API to create dynamic creatives',
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
        displayOptions: {
          show: {
            operation: [
              'getSceneData'
            ],
          },
        },
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
          hide: {
            projectId: [
              ''
            ],
          },
        },
      },
      {
        displayName: 'Scene Data',
        name: 'sceneData',
        type: 'fixedCollection',
        placeholder: 'Add Scene Data',
        default: {},
        typeOptions: {
          multipleValues: true,
        },
        displayOptions: {
          show: {
            operation: ['getSceneData'],
          },
          hide: {
            biteId: [''],
          },
        },
        options: [
          {
            name: 'values',
            displayName: 'Values',
            values: [
              {
                displayName: 'Field',
                name: 'field',
                type: 'options',
                typeOptions: {
                  loadOptionsMethod: 'getSceneFields',
                  loadOptionsDependsOn: ['projectId', 'biteId'],
                },
                default: '',
                description: 'Field to set value for',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'Value for the field',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Render Type',
        name: 'type',
        type: 'options',
        options: [
          {
            name: 'Image',
            value: 'image',
          },
          {
            name: 'Sequence',
            value: 'sequence',
          },
          {
            name: 'Video',
            value: 'video',
          },
          {
            name: 'Overlay',
            value: 'overlay',
          },
        ],
        default: 'image',
        description: 'Select Render Type',
        required: true,
        displayOptions: {
          show: {
            operation: ['getSceneData'],
          },
          hide: {
            biteId: [''],
          },
        },
      },
      {
        displayName: 'Scene',
        name: 'scene',
        type: 'number',
        default: 1,
        description: 'Scene number',
        displayOptions: {
          show: {
            operation: ['getSceneData'],
          },
          hide: {
            biteId: [''],
          },
        },
      },
      {
        displayName: 'Webhook URL',
        name: 'webhook',
        type: 'string',
        default: '',
        description: 'Input Webhook Url',
        displayOptions: {
          show: {
            operation: ['getSceneData'],
          },
          hide: {
            biteId: [''],
          },
        },
      },
      {
        displayName: 'Custom Message',
        name: 'custom_message',
        type: 'string',
        default: '',
        description: 'Input Your Custom Message',
        displayOptions: {
          show: {
            operation: ['getSceneData'],
          },
          hide: {
            biteId: [''],
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

          const data = await response.json();
          
          // Determine if the response is an array or has a data property
          let projects: IProject[] = [];
          
          if (Array.isArray(data)) {
            projects = data as IProject[];
          } else if (data && typeof data === 'object') {
            // Check if data has a data property that's an array
            if (data.data && Array.isArray(data.data)) {
              projects = data.data as IProject[];
            } else if (data.projects && Array.isArray(data.projects)) {
              projects = data.projects as IProject[];
            } else if (data.items && Array.isArray(data.items)) {
              projects = data.items as IProject[];
            } else {
              // If we got an object but not in an expected format, log it and throw an error
              console.log('Unexpected API response format:', JSON.stringify(data));
              throw new Error('API response format is not as expected');
            }
          } else {
            throw new Error('API response is not in a valid format');
          }
          
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

          const data = await response.json();
          
          // Determine if the response is an array or has a data property
          let bites: IBite[] = [];
          
          if (Array.isArray(data)) {
            bites = data as IBite[];
          } else if (data && typeof data === 'object') {
            // Check if data has a data property that's an array
            if (data.data && Array.isArray(data.data)) {
              bites = data.data as IBite[];
            } else if (data.bites && Array.isArray(data.bites)) {
              bites = data.bites as IBite[];
            } else if (data.items && Array.isArray(data.items)) {
              bites = data.items as IBite[];
            } else {
              // If we got an object but not in an expected format, log it and throw an error
              console.log('Unexpected API response format:', JSON.stringify(data));
              throw new Error('API response format is not as expected');
            }
          } else {
            throw new Error('API response is not in a valid format');
          }
          
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

      async getSceneFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        /* We need projectId in loadOptionsDependsOn but don't use it directly.
           Commenting out to avoid TS errors */
        // const projectId = this.getNodeParameter('projectId') as string;

        const biteId = this.getNodeParameter('biteId') as string;
        const credentials = await this.getCredentials('bannerbiteApi') as IApiCredentials;
        
        if (!biteId) {
          return [];
        }

        try {
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
            throw new Error(error.message || 'Failed to fetch scene fields');
          }

          const data = await response.json();
          
          // Determine if the response is an array or has a data property
          let scenes: ISceneData[] = [];
          
          if (Array.isArray(data)) {
            scenes = data as ISceneData[];
          } else if (data && typeof data === 'object') {
            if (data.data && Array.isArray(data.data)) {
              scenes = data.data as ISceneData[];
            } else if (data.scenes && Array.isArray(data.scenes)) {
              scenes = data.scenes as ISceneData[];
            } else if (data.items && Array.isArray(data.items)) {
              scenes = data.items as ISceneData[];
            } else {
              console.log('Unexpected API response format:', JSON.stringify(data));
              throw new Error('API response format is not as expected');
            }
          } else {
            throw new Error('API response is not in a valid format');
          }
          
          return scenes.map((scene) => {
            const fieldName = scene.label || formatSceneName(scene.name || scene.key || '');
            return {
              name: fieldName,
              value: scene.key,
              description: `Type: ${scene.type || 'text'}${scene.default ? `, Default: ${scene.default}` : ''}`,
            };
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          throw new NodeOperationError(
            this.getNode(),
            `Error loading scene fields: ${errorMessage}`,
            { description: 'Check if the bite ID is valid and you have access to it' }
          );
        }
        
        // Helper function to format scene names
        function formatSceneName(name: string): string {
          if (!name) return '';
          
          let sceneName = name;
          sceneName = sceneName.replace(/_/gi, ' ');
          sceneName = sceneName.replace('sc', 'Scene ');
          sceneName = sceneName.replace('txt', 'Text');
          sceneName = sceneName.replace('img', 'Image');
          
          return sceneName;
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
          // Get the projectId for use in output data later
          // Get the projectId for use in output data
          const projectId = this.getNodeParameter('projectId', i) as string;
          const outputOptions = this.getNodeParameter('output', i, {}) as {
            includeAllFields?: boolean;
          };
          
          // Get static form values
          const renderType = this.getNodeParameter('type', i) as string;
          const sceneNumber = this.getNodeParameter('scene', i) as number;
          const webhookUrl = this.getNodeParameter('webhook', i, '') as string;
          const customMessage = this.getNodeParameter('custom_message', i, '') as string;
          
          // Get any scene data values that the user has input
          let userSceneData: { [key: string]: string } = {};
          try {
            const sceneDataValues = this.getNodeParameter('sceneData.values', i, []) as Array<{ field: string, value: string }>;
            if (sceneDataValues && sceneDataValues.length > 0) {
              for (const entry of sceneDataValues) {
                if (entry.field && entry.field !== '') {
                  userSceneData[entry.field] = entry.value;
                }
              }
            }
          } catch (e) {
            // Scene data might not be set yet, which is fine
          }

          // First, fetch the scene data structure
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

          const data = await response.json();
          let sceneData: ISceneData | ISceneData[] = [];
          
          // Determine the format of the response
          if (Array.isArray(data)) {
            sceneData = data;
          } else if (data && typeof data === 'object') {
            // Check for common response formats
            if (data.data && Array.isArray(data.data)) {
              sceneData = data.data;
            } else if (data.scenes && Array.isArray(data.scenes)) {
              sceneData = data.scenes;
            } else if (data.items && Array.isArray(data.items)) {
              sceneData = data.items;
            } else if (data.id || data.key || data.label) {
              // Single scene object
              sceneData = data as ISceneData;
            } else {
              console.log('Unexpected API response format for scene data:', JSON.stringify(data));
              throw new Error('API response format for scene data is not as expected');
            }
          } else {
            throw new Error('API response for scene data is not in a valid format');
          }
          
          const scenes = Array.isArray(sceneData) ? sceneData : [sceneData];

          // Format the output
          const formattedData = scenes.map((scene) => {
            const sceneKey = scene.key;
            
            // Check if user provided a value for this scene field
            const userValue = userSceneData[sceneKey];
            
            // Create a consistent base data structure regardless of input format
            const baseData = {
              sceneId: scene.id || '',
              sceneName: scene.label || scene.key || (scene.name ? formatSceneName(scene.name) : ''),
              biteId,
              projectId,
              // Include static form values
              renderType,
              sceneNumber,
              webhookUrl,
              customMessage,
            };

            if (outputOptions.includeAllFields !== false) {
              const sceneData = {
                ...baseData,
                // Use optional properties from the scene object, but with defaults
                label: scene.label || formatSceneName(scene.name || scene.key),
                key: scene.key,
                // Use user-provided value if available, otherwise use default or empty string
                value: userValue !== undefined ? userValue : (scene.value || scene.default || ''),
                type: scene.type || 'text',
                userModified: userValue !== undefined,
              };
              
              // Merge with the rest of the scene properties for full data access
              return {
                json: {
                  ...sceneData,
                  ...scene,
                  // Ensure user value overrides any existing value
                  ...(userValue !== undefined ? { value: userValue } : {}),
                },
              };
            }

            // Return only specific fields if includeAllFields is false
            return {
              json: {
                ...baseData,
                label: scene.label || formatSceneName(scene.name || scene.key),
                key: scene.key,
                // Use user-provided value if available, otherwise use default
                value: userValue !== undefined ? userValue : (scene.value || scene.default || ''),
                type: scene.type || 'text',
                userModified: userValue !== undefined,
              },
            };
          });
          
          // Helper function to format scene names
          function formatSceneName(name: string): string {
            if (!name) return '';
            
            let sceneName = name;
            sceneName = sceneName.replace(/_/gi, ' ');
            sceneName = sceneName.replace('sc', 'Scene ');
            sceneName = sceneName.replace('txt', 'Text');
            sceneName = sceneName.replace('img', 'Image');
            
            return sceneName;
          }

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
