import { IExecuteFunctions } from 'n8n-core';
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class MyCustomNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Custom Node',
    name: 'myCustomNode',
    group: ['transform'],
    version: 1,
    description: 'A custom node that reverses a string',
    defaults: {
      name: 'My Custom Node',
      color: '#1F8EB2',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'String to Reverse',
        name: 'stringToReverse',
        type: 'string',
        default: '',
        placeholder: 'Enter a string',
        description: 'The string to reverse',
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    const stringToReverse = this.getNodeParameter('stringToReverse', 0) as string;
    const reversedString = stringToReverse.split('').reverse().join('');

    returnData.push({ json: { reversedString } });

    return this.prepareOutputData(returnData);
  }
}