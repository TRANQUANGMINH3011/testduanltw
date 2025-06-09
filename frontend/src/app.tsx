import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
import { OIDCBounder } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import { getCurrentUserFromApi } from '@/services/base/api';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole } from './utils/ip';

const loginPath = '/user/login';

/**  loading */
export const initialStateConfig = {
  loading: <></>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
// === PHIÊN BẢN getInitialState ĐÃ SỬA LỖI ===
export async function getInitialState(): Promise<IInitialState> {
  // Hàm fetchUserInfo giờ chỉ là một hàm nội bộ, không được trả về trong kết quả
  const fetchUserInfoFromLocalLogin = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const userRes = await getCurrentUserFromApi();
        return userRes.data as any;
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userType');
        history.push(loginPath);
        return undefined;
      }
    }
    return undefined;
  };

  // Chỉ chạy khi không ở trang đăng nhập
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfoFromLocalLogin();
    // Đối tượng trả về phải khớp chính xác với interface IInitialState
    return {
      currentUser,
      permissionLoading: false,
    };
  }

  // Nếu ở trang đăng nhập, trả về trạng thái loading
  return {
    permissionLoading: true,
  };
}


// Giữ nguyên cấu hình request gốc của bạn
export const request: RequestConfig = {
  errorHandler: (error: ResponseError) => {
    const { messages } = getIntl(getLocale());
    const { response } = error;
    if (response && response.status) {
      const { status, statusText, url } = response;
      const requestErrorMessage = messages['app.request.error'];
      const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
      const errorDescription = messages[`app.request.${status}`] || statusText;
      notification.error({
        message: errorMessage,
        description: errorDescription,
      });
    }

    if (!response) {
      notification.error({
        description: 'Yêu cầu gặp lỗi',
        message: 'Bạn hãy thử lại sau',
      });
    }
    throw error;
  },
  requestInterceptors: [({}) => ({})],
};

// Giữ nguyên toàn bộ cấu hình layout gốc của bạn
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    unAccessible: (
      <OIDCBounder>
        <TechnicalSupportBounder>
          <NotAccessible />
        </TechnicalSupportBounder>
      </OIDCBounder>
    ),
    noFound: <NotFoundContent />,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      if (initialState?.currentUser) {
        const { location } = history;
        const isUncheckPath = unCheckPermissionPaths.some((path) =>
          window.location.pathname.includes(path),
        );
        if (location.pathname === '/') {
          history.replace('/dashboard');
        } else if (
          !isUncheckPath &&
          currentRole &&
          initialState?.authorizedPermissions?.length &&
          !initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
        )
          history.replace('/403');
      }
    },
    menuItemRender: (item: any, dom: any) => (
      <a
        className="not-underline"
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
      <OIDCBounder>
        <ErrorBoundary>
          <OneSignalBounder>{dom}</OneSignalBounder>
        </ErrorBoundary>
      </OIDCBounder>
    ),
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};