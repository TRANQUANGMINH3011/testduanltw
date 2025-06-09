import BorrowRequest, { BORROW_REQUEST_STATUS } from '@/models/borrow-request'
import BorrowRecord, { BORROW_RECORD_STATUS } from '@/models/borrow-record'
import Device from '@/models/device'
import { abort } from '@/utils/helpers'
import * as emailService from '@/app/services/email.service'

// Lấy tất cả yêu cầu mượn
export async function getAllBorrowRequests(query = {}) {
    try {
        const borrowRequests = await BorrowRequest.find(query)
            .populate('user')
            .populate('device')
        return borrowRequests
    } catch (error) {
        abort(500, 'Lỗi khi lấy danh sách yêu cầu mượn.')
    }
}

// Lấy yêu cầu mượn theo ID
export async function getBorrowRequestById(id) {
    try {
        const borrowRequest = await BorrowRequest.findById(id)
            .populate('user')
            .populate('device')
        if (!borrowRequest) abort(404, 'Không tìm thấy yêu cầu mượn.')
        return borrowRequest
    } catch (error) {
        abort(500, 'Lỗi khi lấy yêu cầu mượn.')
    }
}

// Lấy danh sách yêu cầu của người dùng
export async function getUserBorrowRequests(userId, { page = 1, limit = 10, sort = { createdAt: -1 } } = {}) {
    try {
        const skip = (page - 1) * limit

        const [borrowRequests, total] = await Promise.all([
            BorrowRequest.find({ userId })
                .populate('device')
                .populate('user')
                .sort(sort)
                .skip(skip)
                .limit(limit),
            BorrowRequest.countDocuments({ userId })
        ])

        return {
            data: borrowRequests,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error) {
        console.error('Error getting user borrow requests:', error)
        abort(500, 'Lỗi khi lấy yêu cầu mượn của người dùng.')
    }
}

// Tạo yêu cầu mượn
export async function createBorrowRequest(data) {
    try {
        const device = await Device.findById(data.deviceId)
        if (!device) abort(404, 'Thiết bị không tồn tại.')

        if (device.status !== 'available') {
            abort(400, 'Thiết bị hiện không sẵn sàng.')
        }

        const activeBorrows = await BorrowRecord.countDocuments({
            deviceId: device._id,
            status: BORROW_RECORD_STATUS.BORROWED,
        })

        if (activeBorrows >= device.quantity) {
            abort(400, 'Thiết bị đã được mượn hết.')
        }

        const borrowRequest = await BorrowRequest.create({
            ...data,
            status: BORROW_REQUEST_STATUS.PENDING,
        })

        return borrowRequest
    } catch (error) {
        console.error('Error creating borrow request:', error)
        abort(500, 'Lỗi khi tạo yêu cầu mượn.')
    }
}

// Cập nhật trạng thái yêu cầu mượn
export async function updateBorrowRequestStatus(session, id, status) {
    try {
        const borrowRequest = await BorrowRequest.findById(id)
            .populate('user')
            .populate('device')
            .session(session)

        if (!borrowRequest) {
            abort(404, 'Yêu cầu mượn không tồn tại.')
        }

        if (!borrowRequest.canBeApproved() && status === BORROW_REQUEST_STATUS.APPROVED) {
            abort(400, 'Yêu cầu không thể được duyệt.')
        }

        if (!borrowRequest.canBeRejected() && status === BORROW_REQUEST_STATUS.REJECTED) {
            abort(400, 'Yêu cầu không thể bị từ chối.')
        }

        // Kiểm tra thiết bị có sẵn sàng không khi duyệt yêu cầu
        if (status === BORROW_REQUEST_STATUS.APPROVED) {
            const device = await Device.findById(borrowRequest.deviceId).session(session)
            if (!device) {
                abort(404, 'Thiết bị không tồn tại.')
            }
            if (device.status !== 'available') {
                abort(400, 'Thiết bị hiện không sẵn sàng.')
            }

            const activeBorrows = await BorrowRecord.countDocuments({
                deviceId: device._id,
                status: BORROW_RECORD_STATUS.BORROWED,
            }).session(session)

            if (activeBorrows >= device.quantity) {
                abort(400, 'Thiết bị đã được mượn hết.')
            }

            // Tạo bản ghi mượn mới
            await BorrowRecord.create([{
                borrowRequestId: borrowRequest._id,
                userId: borrowRequest.userId,
                deviceId: borrowRequest.deviceId,
                borrowDate: borrowRequest.borrowDate,
                returnDate: borrowRequest.returnDate,
                status: BORROW_RECORD_STATUS.BORROWED,
            }], { session })

            // Gửi email thông báo khi duyệt yêu cầu
            await emailService.sendBorrowRequestApprovedEmail(
                borrowRequest.user,
                borrowRequest
            )
        }

        borrowRequest.status = status
        await borrowRequest.save({ session })

        return borrowRequest
    } catch (error) {
        console.error('Error updating borrow request status:', error)
        if (error.status) {
            throw error
        }
        abort(500, 'Lỗi khi cập nhật trạng thái yêu cầu mượn.')
    }
}

// Trả thiết bị (Admin only)
export async function returnDevice(id) {
    try {
        const borrowRequest = await BorrowRequest.findById(id)
            .populate('user')
            .populate('device')
        if (!borrowRequest) abort(404, 'Yêu cầu mượn không tồn tại.')

        if (borrowRequest.status !== BORROW_REQUEST_STATUS.APPROVED) {
            abort(400, 'Chỉ có thể trả thiết bị đã được duyệt.')
        }

        const borrowRecord = await BorrowRecord.findOne({
            borrowRequestId: borrowRequest._id,
            status: BORROW_RECORD_STATUS.BORROWED,
        })

        if (!borrowRecord) {
            abort(400, 'Không tìm thấy lịch sử mượn đang hoạt động.')
        }

        borrowRecord.status = BORROW_RECORD_STATUS.RETURNED
        borrowRecord.actualReturnDate = new Date()
        await borrowRecord.save()

        // Send email notification to user
        await emailService.sendDeviceReturnedEmail(
            borrowRequest.user,
            borrowRequest,
            {
                actualReturnDate: borrowRecord.actualReturnDate
            }
        )

        return borrowRequest
    } catch (error) {
        console.error('Error returning device:', error)
        abort(500, 'Lỗi khi trả thiết bị.')
    }
}
