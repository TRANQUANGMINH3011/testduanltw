import BorrowRecord, { BORROW_RECORD_STATUS } from '@/models/borrow-record'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function getTopBorrowedDevices(limit = 10) {
    const startDate = startOfMonth(new Date())
    const endDate = endOfMonth(new Date())

    const topDevices = await BorrowRecord.aggregate([
        {
            $match: {
                borrowDate: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$deviceId',
                borrowCount: { $sum: 1 }
            }
        },
        {
            $sort: { borrowCount: -1 }
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: 'devices',
                localField: '_id',
                foreignField: '_id',
                as: 'device'
            }
        },
        {
            $unwind: '$device'
        },
        {
            $project: {
                _id: 0,
                deviceId: '$_id',
                deviceName: '$device.name',
                borrowCount: 1
            }
        }
    ])

    return topDevices
}

// Lấy danh sách thiết bị quá hạn
export async function getOverdueBorrows() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return await BorrowRecord.find({
        status: BORROW_RECORD_STATUS.BORROWED,
        returnDate: { $lt: today }
    })
        .populate({
            path: 'borrowRequestId',
            populate: [
                { path: 'user', select: 'name email phone' },
                { path: 'device', select: 'name code' }
            ]
        })
}

// Lấy danh sách thiết bị sắp đến hạn (mặc định 3 ngày)
export async function getDueSoonBorrows(daysThreshold = 3) {
    const today = new Date()
    const dueDate = new Date()
    dueDate.setDate(today.getDate() + daysThreshold)
    
    return await BorrowRecord.find({
        status: BORROW_RECORD_STATUS.BORROWED,
        returnDate: { 
            $gte: today,
            $lte: dueDate 
        }
    })
        .populate({
            path: 'borrowRequestId',
            populate: [
                { path: 'user', select: 'name email phone' },
                { path: 'device', select: 'name code' }
            ]
        })
}
