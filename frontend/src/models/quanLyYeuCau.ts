import { addYeuCau, duyetYeuCau, getYeuCau, tuChoiYeuCau } from '@/services/QuanLyYeuCau';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

// 1. Định nghĩa kiểu cho State - Cập nhật kiểu dữ liệu cho data
export interface QuanLyYeuCauStateType {
  data: QuanLyYeuCau.Record[]; // Sử dụng Record từ namespace QuanLyYeuCau toàn cục
  total: number;
  page: number;
  limit: number;
  loading: boolean;
}

// 2. Định nghĩa kiểu cho Model - Cập nhật danh sách effects
export interface QuanLyYeuCauModelType {
  namespace: 'quanLyYeuCau';
  state: QuanLyYeuCauStateType;
  effects: {
    get: Effect;
    add: Effect;
    approve: Effect;
    reject: Effect;
  };
  reducers: {
    save: Reducer<QuanLyYeuCauStateType>;
  };
}

// 3. Áp dụng kiểu vào Model
const ModelQuanLyYeuCau: QuanLyYeuCauModelType = {
  namespace: 'quanLyYeuCau',
  state: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
  },

  // === CẬP NHẬT TOÀN BỘ KHỐI EFFECTS ===
  effects: {
    *get({ payload }, { call, put }): any {
      // Tách callback và các tham số khác ra từ payload
      const { callback, ...restPayload } = payload;
      yield put({ type: 'save', payload: { loading: true } });
      try {
        const response = yield call(getYeuCau, restPayload);
        if (response && response.success) {
          yield put({
            type: 'save',
            payload: { data: response.data.docs, total: response.data.totalDocs },
          });
          if (callback) callback(response.data); // Gọi callback và trả về dữ liệu
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu cầu:', error);
        if (callback) callback(null); // Báo cho table biết là đã có lỗi
      } finally {
        yield put({ type: 'save', payload: { loading: false } });
      }
    },

    *add({ payload, callback }, { call }): any {
      try {
        yield call(addYeuCau, payload);
        message.success('Gửi yêu cầu mượn thành công!');
        if (callback) callback();
      } catch (error) {
        console.error('Lỗi khi tạo yêu cầu:', error);
      }
    },

    *approve({ payload, callback }, { call }): any {
      try {
        yield call(duyetYeuCau, payload.id);
        message.success('Phê duyệt yêu cầu thành công!');
        if (callback) callback();
      } catch (error) {
        console.error('Lỗi khi phê duyệt yêu cầu:', error);
      }
    },

    *reject({ payload, callback }, { call }): any {
      try {
        yield call(tuChoiYeuCau, payload.id);
        message.warn('Đã từ chối yêu cầu.');
        if (callback) callback();
      } catch (error) {
        console.error('Lỗi khi từ chối yêu cầu:', error);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default ModelQuanLyYeuCau;