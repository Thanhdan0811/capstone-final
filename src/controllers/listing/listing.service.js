const db = require("../../db/index.js");
const { DB_CONST } = require("../../constants/index.js");
const { Op } = require("sequelize");
const { findUserFromUserId } = require("../user/user.service.js");

const models = db.models;
const DB_NAME = DB_CONST.DB_NAME;

const validFields = [
  "name",
  "capacity",
  "description",
  "price_per_night",
  "status",
  "address",
  "street",
  "city",
];

exports.addListService = async (user_id, body, files) => {
  // check has user_id
  if (!user_id) throw { message: "Unauthorized", status: 403 };
  const user = await findUserFromUserId(user_id);
  // check user existed and has to be an owner to create a listing.
  if (!user || +user.type !== DB_CONST.USER.TYPE.OWNER)
    throw { message: "Unauthorized", status: 403 };

  // check is any field missing.
  for (let field of validFields) {
    if (!body[field]) throw { message: `missing or invalid ${field}` };
  }

  const {
    name,
    capacity,
    description,
    price_per_night,
    status,
    address,
    street,
    city,
  } = body;

  if (Number.isNaN(price_per_night)) throw { message: "Price not correct!", status: 403 };
  // get path of file after upload to cloudinary
  const imgs_url = files?.map((f) => f.path) || [];
  // start to create listing.
  const LISTING_DB = models[DB_NAME.LISTING];

  const newList = await LISTING_DB.create({
    name,
    capacity,
    description,
    price_per_night,
    status,
    address,
    street,
    city,
    imgs_url: imgs_url,
    user_owner_id: user.id,
  });

  return { ...newList.get() };
};

exports.getAllListings = async ({page = 1, size = 10}) => {
  const LISTING_DB = models[DB_NAME.LISTING];
  const offset = ( +page - 1 ) * 10; // page 1 : 0 -> 9, page 2 : 10 -> 19,
  const listing = await LISTING_DB.findAndCountAll({
    attributes: { exclude: ["user_owner_id"] },
    limit: +size,
    offset: offset,
    include: [
      {
        model: models[DB_NAME.USER],
        as: "user_owner",
        attributes: ["id", "name", "avartar"],
      },
    ],
  });

  // imgs_url when get is JSON type, need to parse
  return {
    ...listing,
    rows: listing.rows.map((l) => ({
      ...l.get(),
      imgs_url: JSON.parse(l.get().imgs_url),
    })),
  };
};

exports.getListByAddress = async (query) => {
  const { address = "", city = "", street = "", page = 1, size = 10 } = query;
  // if dont have query then return all.
  if (!address && !city && !street) return await exports.getAllListings();
  const offset = ( +page - 1 ) * 10; // page 1 : 0 -> 9, page 2 : 10 -> 19,
  const LISTING_DB = models[DB_NAME.LISTING];
  const listing = await LISTING_DB.findAndCountAll({
    attributes: { exclude: ["user_owner_id"] },
    limit: +size,
    offset: offset,
    where: {
      [Op.and]: [
        {
          address: {
            [Op.like]: `%${address}%`,
          },
        },
        {
          street: {
            [Op.like]: `%${street}%`,
          },
        },
        {
          city: {
            [Op.like]: `%${city}%`,
          },
        },
      ],
    },
  });

  // imgs_url when get is JSON type, need to parse
  return {
    ...listing,
    rows: listing.rows.map((l) => ({
      ...l.get(),
      imgs_url: JSON.parse(l.get().imgs_url),
    })),
  };
};

exports.getListingById = async (params) => {
  const { id: listing_id = "" } = params;
  // no then id throw errot
  if (!listing_id) throw { message: "Listing not found!", status: 403 };
  const LISTING_DB = models[DB_NAME.LISTING];
  const listingRecord = await LISTING_DB.findByPk(listing_id, {
    attributes: {
      exclude: ["user_owner_id"],
    },
    include: [
      {
        model: models[DB_NAME.USER],
        as: "user_owner",
        attributes: ["id", "name", "avartar"],
      },
    ],
  });
  if (!listingRecord) throw { message: "Listing not found!", status: 403 };

  // imgs_url when get is JSON type, need to parse
  return {
    ...listingRecord.get(),
    imgs_url: JSON.parse(listingRecord.get().imgs_url),
  };
};

exports.updateListingById = async (params, user_id, body, files) => {
  const { id: listing_id = "" } = params;
  // no then id throw errot
  if (!listing_id) throw { message: "Listing not found!", status: 403 };
  // check user_id
  if (!user_id) throw { message: "Unauthorized", status: 403 };
  // check user existed and has to be an owner to create a listing.
  const LISTING_DB = models[DB_NAME.LISTING];
  const user = await findUserFromUserId(user_id);
  const listingRecord = await LISTING_DB.findByPk(listing_id);
  
  // if has no listing.
  if (!listingRecord) throw { message: "Listing not found!", status: 403 };
  // Check user have type is an owner, and ower_id === user.id current.
  if (!user || +user.type !== DB_CONST.USER.TYPE.OWNER || listingRecord.user_owner_id !== user.id) throw { message: "Unauthorized", status: 403 };

  // get path of file after upload to cloudinary
  const imgs_url = files?.map((f) => f.path) || [];
  
  const {
    name,
    capacity,
    description,
    price_per_night,
    status,
    address,
    street,
    city,
  } = body;

  if (!name && !capacity && !description & !price_per_night && !status && !address && !street && !city) {
    throw { message: "data update required", status: 403 };
  }

  // if field mising (null or undefined) then use old value
  const newListing = await listingRecord.update({
    name: name ?? listingRecord.name,
    capacity: capacity ?? listingRecord.capacity,
    description: description ?? listingRecord.description,
    price_per_night: price_per_night ?? listingRecord.price_per_night,
    status: status ?? listingRecord.status,
    address: address ?? listingRecord.address,
    street: street ?? listingRecord.street,
    city: city ?? listingRecord.city,
    imgs_url: imgs_url.length > 0 ? imgs_url : listingRecord.imgs_url,
  });

  return { ...newListing.get() };
}

exports.deleteListing = async (params, user_id) => {
  const { id: listing_id = "" } = params;
  // no then id throw errot
  if (!listing_id) throw { message: "Listing not found!", status: 403 };
  // check user_id
  if (!user_id) throw { message: "Unauthorized", status: 403 };
  // check user existed and has to be an owner to create a listing.
  const LISTING_DB = models[DB_NAME.LISTING];
  const user = await findUserFromUserId(user_id);
  const listingRecord = await LISTING_DB.findByPk(listing_id);
  
  // if has no listing.
  if (!listingRecord) throw { message: "Listing not found!", status: 403 };
  // Check user have type is an owner, and ower_id === user.id current.
  if (!user || +user.type !== DB_CONST.USER.TYPE.OWNER || listingRecord.user_owner_id !== user.id) throw { message: "Unauthorized", status: 403 };

  if (listingRecord.status !== DB_CONST.LISTING.STATUS.AVAILABLE) throw { message: "Listing current available, cannot be deleted!", status: 403 };

  await listingRecord.update({
    status: DB_CONST.LISTING.STATUS.INACTIVE,
  });
}

exports.uploadImgsListing = async (user_id, files, body) => {
  const {
    listing_id,
  } = body;
  // check user_id
  if (!user_id) throw { message: "Unauthorized", status: 403 };
  // check user existed and has to be an owner to create a listing.
  const LISTING_DB = models[DB_NAME.LISTING];
  const user = await findUserFromUserId(user_id);
  const listingRecord = await LISTING_DB.findByPk(listing_id);
  
  // if has no listing.
  if (!listingRecord) throw { message: "Listing not found!", status: 403 };
  // Check user have type is an owner, and ower_id === user.id current.
  if (!user || +user.type !== DB_CONST.USER.TYPE.OWNER || listingRecord.user_owner_id !== user.id) throw { message: "Unauthorized", status: 403 };

  // get path of file after upload to cloudinary
  const imgs_url = files?.map((f) => f.path) || [];

  await listingRecord.update({
    imgs_url: [...JSON.parse(listingRecord.imgs_url || []), ...imgs_url],
  });
}

