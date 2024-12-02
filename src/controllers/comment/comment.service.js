const db = require("../../db/index.js");
const { DB_CONST } = require("../../constants/index.js");
const { findUserFromUserId } = require("../user/user.service.js");

const models = db.models;
const DB_NAME = DB_CONST.DB_NAME;

exports.createcomment = async (user_id, body) => {
  // check user
  if (!user_id) throw { message: "User not found!", status: 403 };
  const user = findUserFromUserId(user_id);
  if (!user) throw { message: "User not found!", status: 403 };

  const { listing_id, content = '' } = body;

  // check content
  if (!content.trim()) throw { message: "Nothing to comment!", status: 403 };

  // Check listing existed.
  if (!listing_id) throw { message: "Listing not found!", status: 403 };
  const LISTING_DB = models[DB_NAME.LISTING];
  const listingRecord = await LISTING_DB.findByPk(listing_id);
  if (!listingRecord) throw { message: "Listing not found!", status: 403 };
  
  const COMMENT_DB = models[DB_NAME.COMMENT];

  const comment = await COMMENT_DB.create({
    listing_id,
    user_id,
    content,
  })

  return comment;
};

exports.updateComment = async (params, user_id, body) => {
    const { comment_id } = params;
    if (!comment_id) throw { message: "Comment not found!", status: 403 };
    const COMMENT_DB = models[DB_NAME.COMMENT];
    const comment = COMMENT_DB.findByPk(comment_id);
    if (!comment) throw { message: "Comment not found!", status: 403 };

    // check user
    if (!user_id) throw { message: "User not found!", status: 403 };
    const user = findUserFromUserId(user_id);
    if (!user) throw { message: "User not found!", status: 403 };
    if (user.id !== comment.user_id) throw { message: "Unauthorized!", status: 403 };

    const { content = '' } = body;

    // update
    if (!content.trim()) throw { message: "Nothing to update comment!", status: 403 };

    const commentUpdate = comment.update({
        content,
    })

    return { ...commentUpdate.get() };
};

exports.getAllComments = async ({ page = 1, size = 10 }) => {
    const COMMENT_DB = models[DB_NAME.COMMENT];
    const offset = (+page - 1) * 10; // page 1 : 0 -> 9, page 2 : 10 -> 19,
    const comments = COMMENT_DB.findAndCountAll({
        limit: +size,
        offset: offset,
        include: [
            {
                model: models[DB_NAME.USER],
                attributes: ["id", "name", "avartar"]
            },
            {
                model: models[DB_NAME.LISTING],
                attributes: ["id", "name"]
            },
        ]
    });

    return comments;
};

exports.getCommentsByListingId = async (params, { page = 1, size = 10 }) => {
    const {id: listing_id} = params;
    if (!listing_id) throw {message: "Listing not found", status: 403};
    const COMMENT_DB = models[DB_NAME.COMMENT];
    const offset = (+page - 1) * 10; // page 1 : 0 -> 9, page 2 : 10 -> 19,
    const comments = COMMENT_DB.findAndCountAll({
        limit: +size,
        offset: offset,
        where: {
            listing_id,
        },
        include: [
            {
                model: models[DB_NAME.USER],
                attributes: ["id", "name", "avartar"]
            },
            {
                model: models[DB_NAME.LISTING],
                attributes: ["id", "name"]
            },
        ]
    });

    return comments;
};

exports.deleteComment = async (params, user_id) => {
    const {id: comment_id} = params;
    if (!user_id) throw {message: "User unauthorized", status: 403};
    if (!comment_id) throw {message: "Listing not found", status: 403};
    const COMMENT_DB = models[DB_NAME.COMMENT];
    const comment = COMMENT_DB.findByPk(comment_id);
    if (!comment) throw { message: "Comment not found!", status: 403 };

    if (comment.user_id !== user_id) throw {message: "User unauthorized", status: 403};

    await comment.destroy();

    return true;
};
