import type { APISchemaResponse, ApiSchemas } from '@hushaha/request';

export interface APISchemaRes extends APISchemaResponse {
	getUser: {
		request: {
			petId: string;
		};
		response: {
			id: number;
			name: string;
		};
	};
	download: {
		request: {
			id: number;
		};
		response: {
			id: number;
		};
	};
}

export const apis: ApiSchemas<APISchemaRes> = {
	getUser: {
		path: 'GET pet/:petId',
		isCancel: true
	},
	download: {
		path: 'POST api/download/:id',
		headers: { 'x-download': 'xxx' }
	}
};
