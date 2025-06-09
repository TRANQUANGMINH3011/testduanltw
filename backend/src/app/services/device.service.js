import Device, { DEVICE_STATUS } from '@/models/device'
import { abort } from '@/utils/helpers'

// Lấy tất cả thiết bị theo query
export async function getAllDevices(query = {}) {
    try {
        console.log('Fetching devices with query:', query)
        const devices = await Device.find(query)
            .populate('borrowRequests')
            .populate('borrowRecords')
            .lean()
            .exec()
        if (!devices) {
            return []
        }

        return devices
    } catch (error) {
        console.error('Error in getAllDevices:', error)
        abort(500, 'Lỗi khi lấy danh sách thiết bị.')
    }
}

// Lấy thiết bị theo ID
export async function getDeviceById(id) {
    try {
        const device = await Device.findById(id)
            .populate('borrowRequests')
            .populate('borrowRecords')
            .lean()
        if (!device) {
            abort(404, 'Thiết bị không tồn tại.')
        }
        return device
    } catch (error) {
        abort(500, 'Lỗi khi lấy thiết bị theo ID.')
    }
}

// Tạo thiết bị mới
export async function createDevice(session, deviceData) {
    try {
        const device = await Device.create([{
            ...deviceData,
            status: DEVICE_STATUS.AVAILABLE,
        }], { session })
        return device[0]
    } catch (error) {
        abort(500, 'Lỗi khi tạo thiết bị.')
    }
}

// Cập nhật thiết bị
export async function updateDevice(session, id, updateData) {
    try {
        const device = await Device.findById(id)
            .populate('borrowRecords')
            .session(session)
        if (!device) {
            abort(404, 'Thiết bị không tồn tại.')
        }

        if (typeof updateData.quantity === 'number') {
            const borrowedQuantity =
                device.borrowRecords?.filter(record => record.status === 'borrowed').length || 0

            if (updateData.quantity < borrowedQuantity) {
                abort(
                    400,
                    `Không thể đặt số lượng nhỏ hơn số lượng thiết bị đang được mượn (${borrowedQuantity})`
                )
            }
        }

        Object.assign(device, updateData)
        await device.save()
        return device
    } catch (error) {
        abort(500, 'Lỗi khi cập nhật thiết bị.')
    }
}

// Xóa thiết bị
export async function deleteDevice(session, id) {
    try {
        const device = await Device.findById(id)
            .populate('borrowRecords')
            .session(session)
        if (!device) {
            abort(404, 'Thiết bị không tồn tại.')
        }

        const activeBorrows =
            device.borrowRecords?.filter(record => record.status === 'borrowed').length || 0

        if (activeBorrows > 0) {
            abort(400, 'Không thể xóa thiết bị đang có người mượn.')
        }

        await device.deleteOne({ session })
        return { message: 'Xóa thiết bị thành công.' }
    } catch (error) {
        abort(500, 'Lỗi khi xóa thiết bị.')
    }
}

// Lấy top thiết bị được mượn nhiều nhất
export async function getTopDevices(limit = 10) {
    try {
        const devices = await Device.aggregate([
            {
                $lookup: {
                    from: 'borrow_records',
                    localField: '_id',
                    foreignField: 'deviceId',
                    as: 'borrowRecords',
                },
            },
            {
                $addFields: {
                    borrowCount: { $size: '$borrowRecords' },
                },
            },
            {
                $sort: { borrowCount: -1 },
            },
            {
                $limit: limit,
            },
        ])
        return devices
    } catch (error) {
        abort(500, 'Lỗi khi lấy danh sách thiết bị được mượn nhiều nhất.')
    }
}
