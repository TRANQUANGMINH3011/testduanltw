// import { Achievement } from '@/models'
// import { abort } from '@/utils/helpers'

// /**
//  * Lấy tất cả thành tích
//  */
// export async function getAllAchievements() {
//     return await Achievement.find()
//         .populate('user_id', 'name email avatar')
//         .populate('event_id', 'name code location')
//         .sort({ created_at: -1 })
// }

// /**
//  * Lấy thành tích theo ID
//  */
// export async function getAchievementById(id) {
//     return await Achievement.findOne({ _id: id })
//         .populate('user_id', 'name email avatar')
//         .populate('event_id', 'name code location')
// }

// /**
//  * Lấy thành tích theo sự kiện
//  */
// export async function getAchievementsByEventId(eventId) {
//     return await Achievement.find({ event_id: eventId })
//         .populate('user_id', 'name email avatar')
//         .populate('event_id', 'name code location')
//         .sort({ finish_time: 1 }) // Sắp xếp theo thời gian hoàn thành tăng dần
// }

// /**
//  * Lấy thành tích theo người dùng
//  */
// export async function getAchievementsByUserId(userId) {
//     return await Achievement.find({ user_id: userId })
//         .populate('event_id', 'name code location')
//         .sort({ created_at: -1 })
// }

// /**
//  * Lấy thành tích nổi bật
//  */
// export async function getBestAchievements() {
//     return await Achievement.find({ best_achievement: true })
//         .populate('user_id', 'name email avatar')
//         .populate('event_id', 'name code location')
//         .sort({ created_at: -1 })
// }

// /**
//  * Thêm thành tích cá nhân mới không liên quan đến sự kiện của trang
//  */
// export async function createAchievement(userId, achievementData) {
//     // Tạo thành tích mới
//     return await Achievement.create({
//         ...achievementData,
//         user_id: userId
//     })
// }

// /**
//  * Cập nhật thành tích
//  */
// export async function updateAchievement(id, achievementData) {

//     // Cập nhật thành tích
//     return await Achievement.findByIdAndUpdate(
//         id,
//         achievementData,
//         { new: true }
//     )
// }

// /**
//  * Xóa thành tích
//  */
// export async function deleteAchievement(id) {
//     // Kiểm tra xem thành tích có tồn tại không
//     const achievement = await Achievement.findById(id)
//     if (!achievement) {
//         abort(404, 'Không tìm thấy thành tích')
//     }

//     // Xóa thành tích
//     return await Achievement.findByIdAndDelete(
//         id
//     )
// }
