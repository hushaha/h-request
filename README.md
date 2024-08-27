## @hushaha/request

基于 axios 封装的请求库, 请求示例如下:

1. 先初始化请求配置:

```ts
import { createRequest } from '@hushaha/request';
import type { APISchemaResponse, ApiSchemas } from '@hushaha/request';

interface APISchemaRes extends APISchemaResponse {
	getUser: {
		request: {
			petId: string;
		};
		response: {
			name: string;
		};
	};
}

const apis: ApiSchemas<APISchemaRes> = {
	getUser: {
		path: 'GET pet/:petId',
		headers: {
			'Content-Type': 'application/json'
		}
	}
};

const { apiList } = createRequest<APISchemaRes>(
	{
		baseURL: '/api'
	},
	apis
);

export { apiList };
```

`APISchemaRes` 为接口响应类型配置

`ApiSchemas` 为接口请求配置

2. 使用示例

```ts
import { apiList } from './request';

const getUser = async () => {
	const res = await apiList.getUser({
		petId: '1'
	});

	console.log(res);
};
```

其中在编辑器中敲入 `apiList` 即会 ts 提示包含的接口, 填入入参时也有格式提示
