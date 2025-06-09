import * as deviceService from '@/app/services/device.service'
import { db } from '@/configs'

// Lấy danh sách thiết bị
export async function readAllDevices(req, res) {
    const devices = await deviceService.getAllDevices(req.query)
    res.json({
        message: 'Lấy danh sách thiết bị thành công',
        data: devices
    })
}

// Lấy chi tiết thiết bị theo ID
export async function readDeviceById(req, res) {
    const device = await deviceService.getDeviceById(req.params.id)
    res.json({
        message: 'Lấy thông tin thiết bị thành công',
        data: device
    })
}

// Tạo thiết bị mới
export async function createDevice(req, res) {
    await db.transaction(async (session) => {
        const newDevice = await deviceService.createDevice(session, req.body)
        res.status(201).json({
            message: 'Tạo thiết bị thành công',
            data: newDevice
        })
    })
}

// Cập nhật thiết bị
export async function updateDevice(req, res) {
    await db.transaction(async (session) => {
        const updatedDevice = await deviceService.updateDevice(session, req.params.id, req.body)
        res.json({
            message: 'Cập nhật thiết bị thành công',
            data: updatedDevice
        })
    })
}

// Xoá thiết bị
export async function deleteDevice(req, res) {
    await db.transaction(async (session) => {
        await deviceService.deleteDevice(session, req.params.id)
        res.status(204).send()
    })
}
