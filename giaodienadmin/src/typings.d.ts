
declare namespace API {
  type CurrentUser = {
    id?: string;
    username?: string;
    email?: string;
    name?: string;
    avatar?: string;
    role?: string;
    permissions?: string[];
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
    token?: string;
    message?: string;
    data?: {
      token: string;
      user: CurrentUser;
    };
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
