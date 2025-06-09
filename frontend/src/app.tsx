
import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { ConfigProvider } from 'antd';
import { notification } from 'antd';
import 'moment/locale/vi';
import viVN from 'antd/es/locale/vi_VN';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
import { OIDCBounder } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole } from './utils/ip';

/**  loading */
export const initialStateConfig = {
	loading: <></>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * // Tobe removed
 * */
export async function getInitialState(): Promise<IInitialState> {
	return {
		permissionLoading: true,
	};
}

// ProLayout setting
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
	const isUncheckPath = unCheckPermissionPaths.some((path) =>
		window.location.pathname.includes(path),
	);

	return {
		rightContentRender: () => <RightContent />,
		disableContentMargin: false,
		waterMarkProps: {
			content: initialState?.currentUser?.name,
		},
		footerRender: () => <Footer />,
		onPageChange: () => {
			const { location } = history;

			if (location.pathname === '/') {
				history.replace('/dashboard');
			} else if (
				!isUncheckPath &&
				currentRole &&
				initialState?.authorizedPermissions?.length &&
				!initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
			)
				history.replace('/403');
		},

		menuItemRender: (item: any, dom: any) => (
			<a
				className='not-underline'
				key={item?.path}
				href={item?.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(item?.path ?? '/');
				}}
				style={{ display: 'block' }}
			>
				{dom}
			</a>
		),

		childrenRender: (dom) => (
			<ConfigProvider locale={viVN}>
				<OIDCBounder>
					<ErrorBoundary>
						<OneSignalBounder>{dom}</OneSignalBounder>
					</ErrorBoundary>
				</OIDCBounder>
			</ConfigProvider>
		),
		menuHeaderRender: undefined,
		...initialState?.settings,
	};
};

// antd message config
notification.config({
	placement: 'topRight',
	bottom: 50,
	duration: 3,
});

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** get userinfo API */
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
	const token = localStorage.getItem('access_token');
	const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
	return {
		url: `${url}`,
		options: { ...options, interceptors: true, headers: { ...authHeader, ...options.headers } },
	};
};

const demoResponseInterceptors = (response: Response, options: RequestOptionsInit) => {
	response
		.clone()
		.text()
		.then((bodyText) => {
			const intl = getIntl(getLocale());
			if (response.status === 401) {
				notification.error({
					description: 'Unauthorized',
					message: intl.formatMessage({ id: 'pages.layouts.userLayout.title' }),
				});
				localStorage.removeItem('access_token');
				history.push(loginPath);
			}
		});
	return response;
};

const errorHandler = (error: ResponseError) => {
	const { response } = error;

	if (!response) {
		notification.error({
			description: 'Network error',
			message: 'Request failed',
		});
	}
	throw error;
};

export const request: RequestConfig = {
	errorHandler,
	requestInterceptors: [authHeaderInterceptor],
	responseInterceptors: [demoResponseInterceptors],
};
