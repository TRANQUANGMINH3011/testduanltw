import type { PhieuMuon } from './typing';
import { mockRequests, mockEquipments } from '../../../mock/database';

export async function getPhieuMuon(params: {
  page: number;
  limit: number;
  [key: string]: any;
}): Promise<{ data: PhieuMuon[]; total: number }> {
  const { page = 1, limit = 10 } = params;
  const activeBorrows = mockRequests.filter(b => b.trangThai === 'Đã duyệt' || b.trangThai === 'Đã lấy');
  const total = activeBorrows.length;
  const paginatedData = activeBorrows.slice((page - 1) * limit, page * limit);
  return Promise.resolve({ data: paginatedData, total });
}

export async function updateTrangThaiPhieuMuon(id: string, trangThai: PhieuMuon['trangThai']) {
  const requestIndex = mockRequests.findIndex((item) => item._id === id);
  if (requestIndex !== -1) {
    const oldStatus = mockRequests[requestIndex].trangThai;
    mockRequests[requestIndex].trangThai = trangThai;

    // LỖI LOGIC ĐƯỢC SỬA Ở ĐÂY
    const thietBiId = mockRequests[requestIndex].thietBi.id;
    const soLuongMuon = mockRequests[requestIndex].soLuong;
    const equipmentIndex = mockEquipments.findIndex(e => e._id === thietBiId);

    if (equipmentIndex !== -1) {
        // Từ 'Đã duyệt' -> 'Đã lấy': Tăng số lượng đã cho mượn
        if (oldStatus === 'Đã duyệt' && trangThai === 'Đã lấy') {
            mockEquipments[equipmentIndex].soLuongDaChoMuon += soLuongMuon;
            mockEquipments[equipmentIndex].soLuongConLai -= soLuongMuon;
        }
        // Từ 'Đã lấy' -> 'Đã trả': Giảm số lượng đã cho mượn
        else if (oldStatus === 'Đã lấy' && trangThai === 'Đã trả') {
            mockEquipments[equipmentIndex].soLuongDaChoMuon -= soLuongMuon;
            mockEquipments[equipmentIndex].soLuongConLai += soLuongMuon;
        }
    }
  }
  return Promise.resolve({ success: true });
}