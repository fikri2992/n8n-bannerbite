"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerbiteNode = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const node_fetch_1 = __importDefault(require("node-fetch"));
class BannerbiteNode {
    constructor() {
        this.description = {
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
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
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
        this.methods = {
            loadOptions: {
                async getProjects() {
                    const credentials = await this.getCredentials('bannerbiteApi');
                    try {
                        const response = await (0, node_fetch_1.default)(`${credentials.baseUrl}/api/projects`, {
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
                        let projects = [];
                        if (Array.isArray(data)) {
                            projects = data;
                        }
                        else if (data && typeof data === 'object') {
                            // Check if data has a data property that's an array
                            if (data.data && Array.isArray(data.data)) {
                                projects = data.data;
                            }
                            else if (data.projects && Array.isArray(data.projects)) {
                                projects = data.projects;
                            }
                            else if (data.items && Array.isArray(data.items)) {
                                projects = data.items;
                            }
                            else {
                                // If we got an object but not in an expected format, log it and throw an error
                                console.log('Unexpected API response format:', JSON.stringify(data));
                                throw new Error('API response format is not as expected');
                            }
                        }
                        else {
                            throw new Error('API response is not in a valid format');
                        }
                        return projects.map((project) => ({
                            name: project.name || `Project ${project.id}`,
                            value: project.id,
                            description: project.description || '',
                        }));
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error loading projects: ${errorMessage}`, { description: 'Check your API key and network connection' });
                    }
                },
                async getBites() {
                    const projectId = this.getNodeParameter('projectId');
                    const credentials = await this.getCredentials('bannerbiteApi');
                    if (!projectId) {
                        return [];
                    }
                    try {
                        const response = await (0, node_fetch_1.default)(`${credentials.baseUrl}/api/bites?project_id=${projectId}&limit=100`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${credentials.apiKey}`,
                            },
                        });
                        if (!response.ok) {
                            const error = await response.json().catch(() => ({}));
                            throw new Error(error.message || 'Failed to fetch bites');
                        }
                        const data = await response.json();
                        // Determine if the response is an array or has a data property
                        let bites = [];
                        if (Array.isArray(data)) {
                            bites = data;
                        }
                        else if (data && typeof data === 'object') {
                            // Check if data has a data property that's an array
                            if (data.data && Array.isArray(data.data)) {
                                bites = data.data;
                            }
                            else if (data.bites && Array.isArray(data.bites)) {
                                bites = data.bites;
                            }
                            else if (data.items && Array.isArray(data.items)) {
                                bites = data.items;
                            }
                            else {
                                // If we got an object but not in an expected format, log it and throw an error
                                console.log('Unexpected API response format:', JSON.stringify(data));
                                throw new Error('API response format is not as expected');
                            }
                        }
                        else {
                            throw new Error('API response is not in a valid format');
                        }
                        return bites.map((bite) => ({
                            name: bite.name || `Bite ${bite.id}`,
                            value: bite.id,
                            description: bite.description || '',
                        }));
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error loading bites: ${errorMessage}`, { description: 'Check if the project ID is valid and you have access to it' });
                    }
                },
                async getSceneFields() {
                    /* We need projectId in loadOptionsDependsOn but don't use it directly.
                       Commenting out to avoid TS errors */
                    // const projectId = this.getNodeParameter('projectId') as string;
                    const biteId = this.getNodeParameter('biteId');
                    const credentials = await this.getCredentials('bannerbiteApi');
                    if (!biteId) {
                        return [];
                    }
                    try {
                        const response = await (0, node_fetch_1.default)(`${credentials.baseUrl}/api/zapier/bites/sceneData/${biteId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${credentials.apiKey}`,
                            },
                        });
                        if (!response.ok) {
                            const error = await response.json().catch(() => ({}));
                            throw new Error(error.message || 'Failed to fetch scene fields');
                        }
                        const data = await response.json();
                        // Determine if the response is an array or has a data property
                        let scenes = [];
                        if (Array.isArray(data)) {
                            scenes = data;
                        }
                        else if (data && typeof data === 'object') {
                            if (data.data && Array.isArray(data.data)) {
                                scenes = data.data;
                            }
                            else if (data.scenes && Array.isArray(data.scenes)) {
                                scenes = data.scenes;
                            }
                            else if (data.items && Array.isArray(data.items)) {
                                scenes = data.items;
                            }
                            else {
                                console.log('Unexpected API response format:', JSON.stringify(data));
                                throw new Error('API response format is not as expected');
                            }
                        }
                        else {
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
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error loading scene fields: ${errorMessage}`, { description: 'Check if the bite ID is valid and you have access to it' });
                    }
                    // Helper function to format scene names
                    function formatSceneName(name) {
                        if (!name)
                            return '';
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
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        const credentials = await this.getCredentials('bannerbiteApi');
        for (let i = 0; i < items.length; i++) {
            try {
                if (operation === 'getSceneData') {
                    const biteId = this.getNodeParameter('biteId', i);
                    // Get the projectId for use in output data later
                    // Get the projectId for use in output data
                    const projectId = this.getNodeParameter('projectId', i);
                    const outputOptions = this.getNodeParameter('output', i, {});
                    // Get static form values
                    const renderType = this.getNodeParameter('type', i);
                    const sceneNumber = this.getNodeParameter('scene', i);
                    const webhookUrl = this.getNodeParameter('webhook', i, '');
                    const customMessage = this.getNodeParameter('custom_message', i, '');
                    // Get any scene data values that the user has input
                    let userSceneData = {};
                    try {
                        const sceneDataValues = this.getNodeParameter('sceneData.values', i, []);
                        if (sceneDataValues && sceneDataValues.length > 0) {
                            for (const entry of sceneDataValues) {
                                if (entry.field && entry.field !== '') {
                                    userSceneData[entry.field] = entry.value;
                                }
                            }
                        }
                    }
                    catch (e) {
                        // Scene data might not be set yet, which is fine
                    }
                    // First, fetch the scene data structure
                    const response = await (0, node_fetch_1.default)(`${credentials.baseUrl}/api/zapier/bites/sceneData/${biteId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${credentials.apiKey}`,
                        },
                    });
                    if (!response.ok) {
                        const error = await response.json().catch(() => ({}));
                        throw new Error(error.message || 'Failed to fetch scene data');
                    }
                    const data = await response.json();
                    let sceneData = [];
                    // Determine the format of the response
                    if (Array.isArray(data)) {
                        sceneData = data;
                    }
                    else if (data && typeof data === 'object') {
                        // Check for common response formats
                        if (data.data && Array.isArray(data.data)) {
                            sceneData = data.data;
                        }
                        else if (data.scenes && Array.isArray(data.scenes)) {
                            sceneData = data.scenes;
                        }
                        else if (data.items && Array.isArray(data.items)) {
                            sceneData = data.items;
                        }
                        else if (data.id || data.key || data.label) {
                            // Single scene object
                            sceneData = data;
                        }
                        else {
                            console.log('Unexpected API response format for scene data:', JSON.stringify(data));
                            throw new Error('API response format for scene data is not as expected');
                        }
                    }
                    else {
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
                    function formatSceneName(name) {
                        if (!name)
                            return '';
                        let sceneName = name;
                        sceneName = sceneName.replace(/_/gi, ' ');
                        sceneName = sceneName.replace('sc', 'Scene ');
                        sceneName = sceneName.replace('txt', 'Text');
                        sceneName = sceneName.replace('img', 'Image');
                        return sceneName;
                    }
                    returnData.push(...formattedData);
                }
            }
            catch (error) {
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
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), errorMessage, { itemIndex: i });
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.BannerbiteNode = BannerbiteNode;
//# sourceMappingURL=BannerbiteNode.node.js.map