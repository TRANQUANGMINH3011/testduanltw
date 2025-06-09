import type { ThietBi } from '@/services/QuanLyThietBi/typing';
import type { YeuCau } from '@/services/QuanLyYeuCau/typing';
import moment from 'moment';

// --- DATABASE CHO THIẾT BỊ ---
export let mockEquipments: ThietBi[] = Array.from({ length: 25 }, (_, i) => ({
  _id: `device-${i}`,
  tenThietBi: `Loa Bluetooth Gen ${i + 1}`,
  loaiThietBi: i % 3 === 0 ? 'Âm thanh' : i % 3 === 1 ? 'Trình chiếu' : 'Khác',
  soLuongTong: 20,
  soLuongDaChoMuon: 5,
  soLuongConLai: 15,
  tinhTrang: 'Sẵn sàng',
  moTa: `Mô tả chi tiết cho Loa Bluetooth Gen ${i + 1}`,
  ngayTao: moment().subtract(i, 'days').toISOString(),
}));

// --- DATABASE CHO YÊU CẦU ---
export let mockRequests: YeuCau[] = Array.from({ length: 30 }, (_, i) => {
    let trangThai: YeuCau['trangThai'] = 'Chờ duyệt';
    if (i % 4 === 1) trangThai = 'Đã duyệt';
    if (i % 4 === 2) trangThai = 'Đã từ chối';
    if (i % 4 === 3) trangThai = 'Đã lấy';

    return {
        _id: `request-${i}`,
        nguoiMuon: { ten: `Nguyễn Văn An ${i}`, id: `user-${i}` },
        thietBi: { ten: mockEquipments[i % mockEquipments.length].tenThietBi, id: mockEquipments[i % mockEquipments.length]._id },
        soLuong: 1,
        ngayYeuCau: moment().subtract(i, 'hours').toISOString(),
        ngayHenTra: moment().add(3, 'days').toISOString(),
        lyDo: `Sử dụng cho sự kiện của CLB Guitar lần thứ ${i}. Cần gấp.`,
        trangThai: trangThai,
    }
});