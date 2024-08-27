import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	CreateAxiosDefaults,
	InternalAxiosRequestConfig
} from 'axios';
import abortHttp from './cancel';

type RemoveIndexSignature<Obj extends Record<string, any>> = {
	[Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key];
};

export type APISchemaResponse = Record<
	string,
	{
		request: Record<string, any> | void;
		response: Record<string, any> | any;
	}
>;

export type ApiSchemas<T extends APISchemaResponse> = {
	[K in keyof RemoveIndexSignature<T>]: AxiosRequestConfig & {
		path: string;
		isCancel?: boolean;
	};
};

type ApiList<T extends APISchemaResponse> = {
	[K in keyof T]: (params: T[K]['request']) => Promise<T[K]['response']>;
};

const MATCH_METHOD = /^(GET|POST|PUT|DELETE|HEAD|OPTIONS|CONNECT|TRACE|PATCH)\s+/;
const MATCH_PATH_PARAMS = /:(\w+)/g;
const USE_DATA_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

const attachApiList = <T extends APISchemaResponse>(
	client: AxiosInstance,
	apiSchema: ApiSchemas<T>
): ApiList<T> => {
	const apiList: ApiList<T> = Object.create(null);

	for (const apiName in apiSchema) {
		const apiConfig = apiSchema[apiName];

		apiList[apiName] = (params) => {
			const _params = { ...(params || {}) };
			const { path, ...config } = apiConfig;

			// 获取请求类型
			const [prefix, method] = path.match(MATCH_METHOD) || ['GET ', 'GET'];

			// 获取url
			let url = path.replace(prefix, '');

			// 获取参数占位符
			const matchParams = path.match(MATCH_PATH_PARAMS);
			if (matchParams) {
				matchParams.forEach((match) => {
					const key = match.replace(':', '');
					if (Reflect.has(_params, key)) {
						url = url.replace(match, Reflect.get(_params, key));
						Reflect.deleteProperty(_params, key);
					}
				});
			}

			const requestParams = USE_DATA_METHODS.includes(method)
				? { data: _params }
				: { params: _params };

			return client.request<any>({
				url,
				method: method.toLowerCase(),
				...requestParams,
				...config
			});
		};
	}
	return apiList;
};

export const createRequest = <T extends APISchemaResponse>(
	requestConfig: CreateAxiosDefaults,
	apis: ApiSchemas<T>,
	{
		interceptorsRequest,
		interceptorsResponse
	}: {
		interceptorsRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
		interceptorsResponse?: (res: any) => any;
	} = {}
) => {
	const client = axios.create(requestConfig);

	client.interceptors.request.use(
		(
			config: InternalAxiosRequestConfig & {
				isCancel?: boolean;
			}
		) => {
			try {
				const { isCancel } = config;
				const key = abortHttp.getAbortKey(config.url!);

				if (isCancel) {
					abortHttp.abort(key);
				}

				const controller = new AbortController();
				config.signal = controller.signal;
				abortHttp.setAbortController(key, controller);
			} catch (e) {
				throw new Error(`接口报错:${e}`);
			}

			if (interceptorsRequest) {
				config = interceptorsRequest(config);
			}

			return config;
		}
	);

	client.interceptors.response.use(
		(res): any => {
			const key = abortHttp.getAbortKey(res.config.url || '');
			if (key) abortHttp.abort(key, 'remove');

			if (interceptorsResponse) {
				return interceptorsResponse(res);
			}

			return { data: res.data, error: false };
		},
		(err) => {
			if (err.code !== 'ERR_CANCELED') return { res: err.response, error: true };
		}
	);

	const apiList = attachApiList<T>(client, apis);

	return { client, apiList };
};
