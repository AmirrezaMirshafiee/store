import { catchAsync } from "vanta-api";
import Order from "../Order/orderMd.js";

export const dashboardReport = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 100 } = req.query;
  const skip = (page - 1) * limit;

  const mostBoughtPricePipeline = [
    { $match: { status: "success" } },
    {
      $group: {
        _id: "$userId",
        totalPricePerUser: { $sum: "$totalPriceAfterDiscount" }
      }
    },
    { $sort: { totalPricePerUser: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" }
  ];

  const mostBoughtCountPipeline = [
    { $match: { status: "success" } },
    {
      $group: {
        _id: "$userId",
        boughtCount: { $sum: 1 }
      }
    },
    { $sort: { boughtCount: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" }
  ];

  const mostSoldByCategoryPipeline = [
    { $match: { status: "success" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.categoryId._id",
        boughtCount: { $sum: "$items.quantity" }
      }
    },
    { $sort: { boughtCount: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const [
    mostBoughtPrice,
    mostBoughtCount,
    mostSoldByCategory
  ] = await Promise.all([
    Order.aggregate(mostBoughtPricePipeline),
    Order.aggregate(mostBoughtCountPipeline),
    Order.aggregate(mostSoldByCategoryPipeline)
  ]);

  return res.status(200).json({
    success: true,
    data: {
      mostBoughtPrice,
      mostBoughtCount,
      mostSoldByCategory
    }
  });
});
// redis


// import Order from "../Order/orderMd.js";
// import { catchAsync } from "vanta-api";
// export const mostBoughtUser = catchAsync(async (req, res, next) => {
//   const { page = 1, limit = 50 } = req.query;
//   const skip = (Number(page) - 1) * Number(limit);

//   const order = await Order.aggregate([
//     { $match: { status: "success" } },
//     {
//       $group: {
//         _id: "$userId",
//         totalPricePerUser: { $sum: "$totalPriceAfterDiscount" }, // اضافه کردن $
//       },
//     },
//     { $sort: { totalPricePerUser: -1 } }, // استفاده از فیلد جدید برای سورت
//     { $skip: skip },
//     { $limit: Number(limit) },
//     {
//       $lookup: {
//         from: "users",
//         localField: "_id",
//         foreignField: "_id", // اصلاح غلط تایپی
//         as: "user",
//       },
//     },
//     { $unwind: "$user" }, // برای اینکه خروجی تمیزتر شود
//   ]);

//   return res.status(200).json({
//     success: true,
//     message: "Top buying users retrieved successfully",
//     data: order,
//   });
// });
// export const mostBoughtCount = catchAsync(async (req, res, next) => {
//   const { page = 1, limit = 50 } = req.query;
//   const skip = (Number(page) - 1) * Number(limit);
//   const order = await Order.aggregate([
//     { $match: { status: "success" } },
//     {
//       $group: {
//         _id: "$userId",
//         boughtCount: { $sum: 1 },
//       },
//     },
//     { $sort: { boughtCount: -1 } },
//     { $skip: skip },
//     { $limit: Number(limit) },
//     {
//       $lookup: {
//         from: "users",
//         localField: "_id",
//         foreignField: "_id", // اصلاح غلط تایپی
//         as: "user",
//       },
//     },
//     { $unwind: "$user" }, // برای اینکه خروجی تمیزتر شود
//   ]);
//   return res.status(200).json({
//     success: true,
//     message: "Top buying users retrieved successfully",
//     data: order,
//   });
// });

// export const mostSoldCategory = catchAsync(async (req, res, next) => {
//   const { page = 1, limit = 50 } = req.query;
//   const skip = (Number(page) - 1) * Number(limit);
//   const order = await Order.aggregate([
//     { $match: { status: "success" } },
//     { $unwind: "$items" },
//     {
//       $group: {
//         _id: "$items.categoryId._id",
//         boughtCount: { $sum: "$items.quantity " },
//       },
//     },
//     { $sort: { boughtCount: -1 } },
//     { $skip: skip },
//     { $limit: Number(limit) },
//     {
//       $lookup: {
//         from: "users",
//         localField: "_id",
//         foreignField: "_id",
//         as: "category",
//       },
//     },
//   ]);
//   return res.status(200).json({
//     success: true,
//     message: "Top buying users retrieved successfully",
//     data: order,
//   });
// });
