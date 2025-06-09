import { getPhieuMuon, updateTrangThaiPhieuMuon } from '@/services/QuanLyMuonTra';
import type { PhieuMuon } from '@/services/QuanLyMuonTra/typing';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

// 1. Định nghĩa kiểu cho State của model
export interface QuanLyMuonTraStateType {
  data: PhieuMuon[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
}

// 2. Định nghĩa kiểu cho toàn bộ Model
export interface QuanLyMuonTraModelType {
  namespace: 'quanLyMuonTra';
  state: QuanLyMuonTraStateType;
  effects: {
    get: Effect;
    updateTrangThai: Effect;
  };
  reducers: {
    save: Reducer<QuanLyMuonTraStateType>;
  };
}

// 3. Áp dụng kiểu đã định nghĩa vào model object
const ModelQuanLyMuonTra: QuanLyMuonTraModelType = {
  namespace: 'quanLyMuonTra',
  state: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
  },

  effects: {
    *get({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      try {
        // SỬA LỖI Ở ĐÂY: Thêm kiểu dữ liệu tường minh cho 'response'
        const response: { data: PhieuMuon[]; total: number } = yield call(getPhieuMuon, payload);
        
        yield put({
          type: 'save',
          payload: {
            data: response.data ?? [],
            total: response.total ?? 0,
            page: payload.page,
            limit: payload.limit,
          },
        });
      } finally {
        yield put({ type: 'save', payload: { loading: false } });
      }
    },
    *updateTrangThai({ payload }, { call, put, select }) {
      const { id, trangThai, successMessage } = payload;
      yield call(updateTrangThaiPhieuMuon, id, trangThai);
      message.success(successMessage);
      const { page, limit } = yield select((state: { quanLyMuonTra: QuanLyMuonTraStateType }) => state.quanLyMuonTra);
      yield put({ type: 'get', payload: { page, limit } });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload, };
    },
  },
};

export default ModelQuanLyMuonTra;