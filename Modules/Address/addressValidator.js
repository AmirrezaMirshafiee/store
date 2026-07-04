import { body, param, query } from "express-validator";
import mongoose from "mongoose";
import Address from "./addressMd.js";

/* ---------- helpers ---------- */
const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

/* =========================================================
   PARAMS
========================================================= */

/* ---------- address id param ---------- */
export const addressIdParam = [
  param("id")
    .notEmpty()
    .withMessage("Address id is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid address id")
    .bail()
    .custom(async (value) => {
      const address = await Address.findById(value);
      if (!address) {
        throw new Error("Address not found");
      }
      return true;
    }),
];

/* =========================================================
   QUERY
========================================================= */

/* ---------- get all addresses ---------- */
export const getAllAddressValidator = [
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

  query("province")
    .optional()
    .isString()
    .withMessage("province must be a string"),

  query("city")
    .optional()
    .isString()
    .withMessage("city must be a string"),

  query("isMe")
    .optional()
    .isBoolean()
    .withMessage("isMe must be boolean")
    .toBoolean(),
];

/* =========================================================
   CREATE
========================================================= */

/* ---------- create address ---------- */
export const createAddressValidator = [
  body("province")
    .exists()
    .withMessage("province is required")
    .bail()
    .isString()
    .withMessage("province must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("province cannot be empty")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("province must be between 2 and 50 characters"),

  body("city")
    .exists()
    .withMessage("city is required")
    .bail()
    .isString()
    .withMessage("city must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("city cannot be empty")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("city must be between 2 and 50 characters"),

  body("title")
    .exists()
    .withMessage("title is required")
    .bail()
    .isString()
    .withMessage("title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("title must be between 2 and 100 characters"),

  body("address")
    .exists()
    .withMessage("address is required")
    .bail()
    .isString()
    .withMessage("address must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("address cannot be empty")
    .bail()
    .isLength({ min: 5, max: 500 })
    .withMessage("address must be between 5 and 500 characters"),

  body("NO")
    .exists()
    .withMessage("NO is required")
    .bail()
    .isString()
    .withMessage("NO must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("NO cannot be empty")
    .bail()
    .isLength({ min: 1, max: 20 })
    .withMessage("NO must be between 1 and 20 characters"),

  body("floor")
    .exists()
    .withMessage("floor is required")
    .bail()
    .isString()
    .withMessage("floor must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("floor cannot be empty")
    .bail()
    .isLength({ min: 1, max: 20 })
    .withMessage("floor must be between 1 and 20 characters"),

  body("postCode")
    .exists()
    .withMessage("postCode is required")
    .bail()
    .isString()
    .withMessage("postCode must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("postCode cannot be empty")
    .bail()
    .matches(/^\d{10}$/)
    .withMessage("postCode must be exactly 10 digits"),

  body("isMe")
    .optional()
    .isBoolean()
    .withMessage("isMe must be boolean")
    .toBoolean(),

  body("receiverPhoneNumber")
    .exists()
    .withMessage("receiverPhoneNumber is required")
    .bail()
    .isString()
    .withMessage("receiverPhoneNumber must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("receiverPhoneNumber cannot be empty")
    .bail()
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage("invalid receiverPhoneNumber"),

  body("receiverName")
    .exists()
    .withMessage("receiverName is required")
    .bail()
    .isString()
    .withMessage("receiverName must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("receiverName cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("receiverName must be between 2 and 100 characters"),
];

/* =========================================================
   UPDATE
========================================================= */

/* ---------- update address ---------- */
export const updateAddressValidator = [
  ...addressIdParam,

  body("province")
    .optional()
    .isString()
    .withMessage("province must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("province cannot be empty")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("province must be between 2 and 50 characters"),

  body("city")
    .optional()
    .isString()
    .withMessage("city must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("city cannot be empty")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("city must be between 2 and 50 characters"),

  body("title")
    .optional()
    .isString()
    .withMessage("title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("title must be between 2 and 100 characters"),

  body("address")
    .optional()
    .isString()
    .withMessage("address must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("address cannot be empty")
    .bail()
    .isLength({ min: 5, max: 500 })
    .withMessage("address must be between 5 and 500 characters"),

  body("NO")
    .optional()
    .isString()
    .withMessage("NO must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("NO cannot be empty")
    .bail()
    .isLength({ min: 1, max: 20 })
    .withMessage("NO must be between 1 and 20 characters"),

  body("floor")
    .optional()
    .isString()
    .withMessage("floor must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("floor cannot be empty")
    .bail()
    .isLength({ min: 1, max: 20 })
    .withMessage("floor must be between 1 and 20 characters"),

  body("postCode")
    .optional()
    .isString()
    .withMessage("postCode must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("postCode cannot be empty")
    .bail()
    .matches(/^\d{10}$/)
    .withMessage("postCode must be exactly 10 digits"),

  body("isMe")
    .optional()
    .isBoolean()
    .withMessage("isMe must be boolean")
    .toBoolean(),

  body("receiverPhoneNumber")
    .optional()
    .isString()
    .withMessage("receiverPhoneNumber must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("receiverPhoneNumber cannot be empty")
    .bail()
    .matches(/^(\+98|0)?9\d{9}$/)
    .withMessage("invalid receiverPhoneNumber"),

  body("receiverName")
    .optional()
    .isString()
    .withMessage("receiverName must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("receiverName cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("receiverName must be between 2 and 100 characters"),
];

/* =========================================================
   DELETE
========================================================= */

/* ---------- delete address ---------- */
export const deleteAddressValidator = [
  ...addressIdParam,
];

/* =========================================================
   GET ONE
========================================================= */

/* ---------- get one address ---------- */
export const getOneAddressValidator = [
  ...addressIdParam,
];
