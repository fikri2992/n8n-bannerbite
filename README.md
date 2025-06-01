# n8n Bannerbite Node

A custom n8n node that provides API key authentication and dynamic form generation capabilities. This node allows you to interact with RESTful APIs that require API key authentication and provides dynamic field loading based on API responses.

## Features

- **Environment Configuration**: Secure management of configuration using environment variables
- **API Key Authentication**: Secure authentication using API keys
- **Dynamic Form Generation**: Form fields are loaded dynamically from the API
- **Resource Operations**: Supports common CRUD operations (GET, POST, PUT, DELETE)
- **Filtering & Pagination**: Built-in support for filtering and pagination
- **Error Handling**: Comprehensive error handling and validation
- **Type Safety**: Full TypeScript support with type definitions
- **Environment Validation**: Automatic validation of required environment variables

## Environment Setup

### Prerequisites

- Node.js 18.17.0 or later
- npm 9 or later
- n8n instance

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/n8n-bannerbite.git
   cd n8n-bannerbite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your configuration:
   ```env
   # API Configuration
   API_BASE_URL=https://api.example.com
   API_KEY=your_api_key_here
   
   # Node Configuration
   NODE_ENV=development
   PORT=3000
   
   # Logging
   LOG_LEVEL=info
   ```

5. Build the project:
   ```bash
   npm run build
   ```

6. Link the package locally for development:
   ```bash
   npm link
   ```

7. In your n8n project directory:
   ```bash
   npm link n8n-bannerbite
   ```

8. Restart your n8n instance to load the custom node.

## Usage

### Environment Management

- Check environment configuration:
  ```bash
  npm run env:check
  ```

- Create a new `.env` file from the example:
  ```bash
  npm run env:example
  ```

### Configuration Options

| Environment Variable        | Description                                 | Default Value           | Required |
|----------------------------|---------------------------------------------|-------------------------|----------|
| `API_BASE_URL`             | Base URL of your API                        | -                       | Yes      |
| `API_KEY`                  | API key for authentication                  | -                       | Yes      |
| `API_TIMEOUT_MS`           | Request timeout in milliseconds             | `10000` (10 seconds)    | No       |
| `NODE_ENV`                 | Node environment (development/production)   | `development`           | No       |
| `PORT`                     | Port to run the server on                   | `3000`                  | No       |
| `LOG_LEVEL`                | Logging level                               | `info`                  | No       |
| `CORS_ORIGIN`              | Allowed CORS origins (comma-separated)      | `http://localhost:3000` | No       |
| `RATE_LIMIT_WINDOW_MS`     | Rate limiting window in milliseconds        | `900000` (15 minutes)   | No       |
| `RATE_LIMIT_MAX_REQUESTS`  | Maximum requests per window                 | `100`                   | No       |

### Setting Up Credentials

1. Add a new credential of type "Custom API Credentials"
2. The node will automatically use the environment variables from your `.env` file
3. Save the credentials

### Using the Node

1. Add the "Custom API" node to your workflow
2. Select the operation you want to perform (Get, GetAll, etc.)
3. Configure the required parameters
4. The node will use the environment variables for API configuration
5. Execute the workflow

### Dynamic Fields

The node supports dynamic field loading from your API. When you select a resource, the node will automatically fetch the available fields from your API and update the form accordingly.

## Development

### Available Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run start`: Start the compiled application
- `npm run dev`: Run the application in development mode with ts-node
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues
- `npm run env:example`: Create a new `.env` file from example
- `npm run env:check`: Validate environment configuration

### Development Workflow

1. Make your changes in the `src` directory
2. Run tests:
   ```bash
   npm test
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Test the built package:
   ```bash
   npm link
   cd /path/to/your/n8n/instance
   npm link n8n-bannerbite
   ```

### Testing

To run tests:

```bash
npm test
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

### Environment Variables in Development

For local development, create a `.env.development` file to override any environment variables:

```env
NODE_ENV=development
LOG_LEVEL=debug
```

## License

MIT
