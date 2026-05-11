# @creadev.org/api

> API - client wrapper

[![npm](https://img.shields.io/npm/v/@creadev.org/api)](https://www.npmjs.com/package/@creadev.org/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Install

```bash
npm install @creadev.org/api
```

## Usage

```typescript
import { ApiClient, createApi, get, post, put, del } from '@creadev.org/api';

const api = createApi({ baseUrl: 'https://api.example.com' });
const data = await get('/users');
await post('/users', { name: 'New User' });
await put('/users/1', { name: 'Updated' });
await del('/users/1');
```

## API

| Function | Description |
|----------|-------------|
| `createApi(options?)` | Create API client |
| `get(path)` | GET request |
| `post(path, data)` | POST request |
| `put(path, data)` | PUT request |
| `del(path)` | DELETE request |

## License

MIT
trigger
