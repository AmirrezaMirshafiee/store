import { body, param, query } from "express-validator";
import mongoose from "mongoose";
import Comment from "./commentMd.js";
import Product from "../Product/productMd.js";

/* ---------- helpers ---------- */
const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

/* =========================================================
   PARAMS
========================================================= */

/* ---------- comment id param ---------- */
export const commentIdParam = [
  param("id")
    .notEmpty()
    .withMessage("Comment id is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid comment id")
    .bail()
    .custom(async (value) => {
      const comment = await Comment.findById(value);
      if (!comment) {
        throw new Error("Comment not found");
      }
      return true;
    }),
];

/* ---------- product id param ---------- */
export const productIdParam = [
  param("id")
    .notEmpty()
    .withMessage("Product id is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid product id")
    .bail()
    .custom(async (value) => {
      const product = await Product.findById(value);
      if (!product) {
        throw new Error("Product not found");
      }
      return true;
    }),
];

/* =========================================================
   QUERY
========================================================= */

/* ---------- get all comments ---------- */
export const getAllCommentValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit must be a positive number"),

  query("search")
    .optional()
    .isString()
    .withMessage("search must be a string"),

  query("sort")
    .optional()
    .isString()
    .withMessage("sort must be a string"),

  query("fields")
    .optional()
    .isString()
    .withMessage("fields must be a string"),

  query("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),

  query("isReply")
    .optional()
    .isBoolean()
    .withMessage("isReply must be boolean")
    .toBoolean(),

  query("isBought")
    .optional()
    .isBoolean()
    .withMessage("isBought must be boolean")
    .toBoolean(),

  query("productId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid productId"),

  query("userId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid userId"),

  query("replyTo")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid replyTo"),
];

/* =========================================================
   GET PRODUCT COMMENTS
========================================================= */

/* ---------- get one product comments ---------- */
export const getProductCommentsValidator = [
  ...productIdParam,

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit must be a positive number"),

  query("sort")
    .optional()
    .isString()
    .withMessage("sort must be a string"),

  query("fields")
    .optional()
    .isString()
    .withMessage("fields must be a string"),

  query("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),

  query("isReply")
    .optional()
    .isBoolean()
    .withMessage("isReply must be boolean")
    .toBoolean(),
];

/* =========================================================
   CREATE
========================================================= */

/* ---------- create comment ---------- */
export const createCommentValidator = [
  body("content")
    .exists()
    .withMessage("content is required")
    .bail()
    .isString()
    .withMessage("content must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("content cannot be empty")
    .bail()
    .isLength({ min: 2, max: 2000 })
    .withMessage("content must be between 2 and 2000 characters"),

  body("productId")
    .exists()
    .withMessage("productId is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid productId")
    .bail()
    .custom(async (value) => {
      const product = await Product.findById(value);
      if (!product) {
        throw new Error("Product not found");
      }
      return true;
    }),

  body("rate")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("rate must be a number between 1 and 5")
    .toFloat(),
];

/* =========================================================
   REPLY
========================================================= */

/* ---------- reply to comment ---------- */
export const replyCommentValidator = [
  ...commentIdParam,

  body("content")
    .exists()
    .withMessage("content is required")
    .bail()
    .isString()
    .withMessage("content must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("content cannot be empty")
    .bail()
    .isLength({ min: 2, max: 2000 })
    .withMessage("content must be between 2 and 2000 characters"),

  body("productId")
    .not()
    .exists()
    .withMessage("productId is not allowed in reply"),

  body("rate")
    .not()
    .exists()
    .withMessage("rate is not allowed in reply"),

  body("replyTo")
    .not()
    .exists()
    .withMessage("replyTo is not allowed in reply"),

  body("userId")
    .not()
    .exists()
    .withMessage("userId is not allowed in reply"),

  body("isReply")
    .not()
    .exists()
    .withMessage("isReply is not allowed in reply"),

  body("isPublished")
    .not()
    .exists()
    .withMessage("isPublished is not allowed in reply"),

  body("isBought")
    .not()
    .exists()
    .withMessage("isBought is not allowed in reply"),
];

/* =========================================================
   CHANGE PUBLISH
========================================================= */

/* ---------- change comment publish status ---------- */
export const changePublishCommentValidator = [
  ...commentIdParam,
];

/* =========================================================
   DELETE
========================================================= */

/* ---------- delete comment ---------- */
export const deleteCommentValidator = [
  ...commentIdParam,
];
