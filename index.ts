import { INodeType } from 'n8n-workflow';
import { MyCustomNode } from './MyCustomNode.node';

export const nodeTypes: INodeType[] = [
  new MyCustomNode(),
];