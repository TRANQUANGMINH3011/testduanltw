declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'react-split-pane/lib/Pane';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare const APP_CONFIG_IP_ROOT: string;
declare const APP_CONFIG_ONE_SIGNAL_ID: string;
declare const APP_CONFIG_SENTRY_DSN: string;
declare const APP_CONFIG_KEYCLOAK_AUTHORITY: string;
declare const APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID: string;
declare const APP_CONFIG_APP_VERSION: string;

declare const APP_CONFIG_CO_QUAN_CHU_QUAN: string;
declare const APP_CONFIG_TEN_TRUONG: string;
declare const APP_CONFIG_TIEN_TO_TRUONG: string;
declare const APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH: string;
declare const APP_CONFIG_PRIMARY_COLOR: string;

declare const APP_CONFIG_URL_LANDING: string;
declare const APP_CONFIG_URL_CONNECT: string;
declare const APP_CONFIG_URL_CAN_BO: string;
declare const APP_CONFIG_URL_DAO_TAO: string;
declare const APP_CONFIG_URL_NHAN_SU: string;
declare const APP_CONFIG_URL_TAI_CHINH: string;
declare const APP_CONFIG_URL_CTSV: string;
declare const APP_CONFIG_URL_QLKH: string;
declare const APP_CONFIG_URL_VPS: string;
declare const APP_CONFIG_URL_KHAO_THI: string;
declare const APP_CONFIG_URL_CORE: string;
declare const APP_CONFIG_URL_CSVC: string;
declare const APP_CONFIG_URL_THU_VIEN: string;
declare const APP_CONFIG_URL_QLVB: string;

declare const APP_CONFIG_TITLE_LANDING: string;
declare const APP_CONFIG_TITLE_CONNECT: string;
declare const APP_CONFIG_TITLE_CAN_BO: string;
declare const APP_CONFIG_TITLE_DAO_TAO: string;
declare const APP_CONFIG_TITLE_NHAN_SU: string;
declare const APP_CONFIG_TITLE_TAI_CHINH: string;
declare const APP_CONFIG_TITLE_CTSV: string;
declare const APP_CONFIG_TITLE_QLKH: string;
declare const APP_CONFIG_TITLE_VPS: string;
declare const APP_CONFIG_TITLE_KHAO_THI: string;
declare const APP_CONFIG_TITLE_CORE: string;
declare const APP_CONFIG_TITLE_CSVC: string;
declare const APP_CONFIG_TITLE_THU_VIEN: string;
declare const APP_CONFIG_TITLE_QLVB: string;
declare namespace API {
  /**
   * Kiểu dữ liệu cho người dùng đang đăng nhập
   * Dùng cho hệ thống login mới của chúng ta
   */
  type CurrentUser = {
    _id?: string;
    name?: string;
    avatar?: string;
    email?: string;
    role?: {
      _id?: string;
      name?: string;
      permissions?: string[];
    };
  };

  /**
   * Kiểu dữ liệu trả về của API đăng nhập mới
   */
  type LoginResult = {
    message?: string;
    accessToken?: string;
    user?: CurrentUser;
  };

  /**
   * Kiểu dữ liệu cho các tham số của form đăng nhập mới
   */
  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string; // 'user' or 'admin'
  };
  
  /**
   * Kiểu dữ liệu cho một thiết bị
   */
  type Device = {
    _id: string;
    name: string;
    description: string;
    model: string;
    status: 'available' | 'in_use' | 'under_maintenance';
    condition: 'new' | 'good' | 'fair' | 'poor';
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  };
}
declare namespace QuanLyThietBi {
  // Dùng lại kiểu Device đã định nghĩa ở trên
  export type Record = API.Device;
}
// File này định nghĩa cấu trúc của một bản ghi yêu cầu mượn thiết bị
// Nó bao gồm cả thông tin chi tiết của người dùng và thiết bị được mượn
declare namespace QuanLyYeuCau {
  export type Record = {
    _id: string;
    user: API.CurrentUser;
    device: API.Device;
    borrowDate: string;
    returnDate: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'overdue';
    createdAt: string;
    updatedAt: string;
  };
}
