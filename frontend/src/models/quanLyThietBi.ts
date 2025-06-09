import { addThietBi, delThietBi, getThietBi, updThietBi } from '@/services/QuanLyThietBi';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

// 1. Định nghĩa kiểu cho State - Cập nhật kiểu dữ liệu cho data
export interface QuanLyThietBiStateType {
  data: QuanLyThietBi.Record[]; // Sử dụng Record từ namespace QuanLyThietBi
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  filter: Record<string, any>;
}

// 2. Định nghĩa kiểu cho Model
export interface QuanLyThietBiModelType {
  namespace: 'quanLyThietBi';
  state: QuanLyThietBiStateType;
  effects: {
    get: Effect;
    add: Effect;
    upd: Effect;
    del: Effect;
  };
  reducers: {
    save: Reducer<QuanLyThietBiStateType>;
  };
}

// 3. Áp dụng kiểu vào Model
const ModelQuanLyThietBi: QuanLyThietBiModelType = {
  namespace: 'quanLyThietBi',
  state: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    filter: {},
  },

  // === CẬP NHẬT TOÀN BỘ KHỐI EFFECTS ===
  effects: {
     *get({ payload }, { call, put }): any {
      // Tách callback và các tham số khác ra từ payload
      const { callback, ...restPayload } = payload;
      yield put({ type: 'save', payload: { loading: true } });
      try {
        const response = yield call(getThietBi, restPayload);
        if (response && response.success) {
          yield put({
            type: 'save',
            payload: {
              data: response.data.docs,
              total: response.data.totalDocs,
              page: response.data.page,
              limit: response.data.limit,
            },
          });
          if (callback) callback(response.data); // Gọi callback và trả về dữ liệu
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thiết bị:', error);
        if (callback) callback(null); // Báo cho table biết là đã có lỗi
      } finally {
        yield put({ type: 'save', payload: { loading: false } });
      }
    },

    *add({ payload, callback }, { call }) {
      try {
        yield call(addThietBi, payload);
        message.success('Thêm thiết bị thành công!');
        if (callback) callback(); // Gọi callback để refresh lại bảng
      } catch (error) {
        console.error('Lỗi khi thêm thiết bị:', error);
      }
    },

    *upd({ payload, callback }, { call }) {
      try {
        // Tách id và dữ liệu cần cập nhật từ payload
        const { _id, ...data } = payload;
        yield call(updThietBi, _id, data);
        message.success('Cập nhật thiết bị thành công!');
        if (callback) callback();
      } catch (error) {
        console.error('Lỗi khi cập nhật thiết bị:', error);
      }
    },

    *del({ payload, callback }, { call }) {
      try {
        // Hỗ trợ xóa nhiều: Lặp qua mảng các ID được gửi lên
        for (const id of payload.id) {
          yield call(delThietBi, id);
        }
        message.success('Xóa thiết bị thành công!');
        if (callback) callback();
      } catch (error) {
        console.error('Lỗi khi xóa thiết bị:', error);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default ModelQuanLyThietBi;