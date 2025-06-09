import { mockEquipments, mockRequests } from '../../../mock/database';
import moment from 'moment';

/**
 * Lấy các số liệu thống kê tổng quan cho Dashboard
 */
export async function getThongKeTongQuan() {
  const totalEquipments = mockEquipments.length;
  const borrowedEquipments = mockRequests.filter(r => r.trangThai === 'Đã lấy').length;
  const pendingRequests = mockRequests.filter(r => r.trangThai === 'Chờ duyệt').length;

  return Promise.resolve({
    totalEquipments,
    borrowedEquipments,
    pendingRequests,
  });
}

/**
 * Lấy dữ liệu thống kê số lượt mượn của các thiết bị theo tháng được chỉ định
 * @param params - Chứa tháng cần thống kê, ví dụ: { month: '2025-06' }
 */
export async function getThongKeMuonTheoThang(params: { month: string }) {
  console.log('Đang thống kê cho tháng:', params.month);

  // 1. Lọc các yêu cầu đã được hoàn tất (đã lấy hoặc đã trả) trong tháng được chọn
  const filteredRequests = mockRequests.filter(req =>
    (req.trangThai === 'Đã lấy' || req.trangThai === 'Đã trả') &&
    moment(req.ngayYeuCau).isSame(params.month, 'month')
  );

  // 2. Tổng hợp số lần mượn cho từng thiết bị
  const stats: { [thietBiId: string]: { tenThietBi: string; soLanMuon: number } } = {};

  for (const req of filteredRequests) {
    const thietBiId = req.thietBi.id;
    // Nếu thiết bị chưa có trong danh sách thống kê, khởi tạo nó
    if (!stats[thietBiId]) {
      stats[thietBiId] = {
        tenThietBi: req.thietBi.ten,
        soLanMuon: 0,
      };
    }
    // Cộng dồn số lượng mượn
    stats[thietBiId].soLanMuon += req.soLuong;
  }
  const chartData = Object.values(stats).sort((a, b) => b.soLanMuon - a.soLanMuon);

  return Promise.resolve({ data: chartData });
}