import { APISchemaRes, apis } from './schema';
import { createRequest } from '@hushaha/request';

const { apiList } = createRequest<APISchemaRes>(
	{
		baseURL: '/api'
	},
	apis
);

export { apiList };
