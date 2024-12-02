const moment = require("moment");
const db = require("../../db/index.js");
const { DB_CONST } = require("../../constants/index.js");
const models = db.models;
const DB_NAME = DB_CONST.DB_NAME;

const { getListingById } = require("../listing/listing.service");
const { findUserFromUserId } = require("../user/user.service");
const { Op } = require("sequelize");

exports.getAllBookings = async ({ page = 1, size = 10 }) => {
  const BOOKING_DB = models[DB_NAME.BOOKING];
  const offset = (+page - 1) * 10; // page 1 : 0 -> 9, page 2 : 10 -> 19,
  const bookings = await BOOKING_DB.findAndCountAll({
    limit: +size,
    offset: offset,
    where: {
      [Op.not]: {
        status: DB_CONST.BOOKING.STATUS.CANCELLED,
      },
    },
    include: [
      {
        model: models[DB_NAME.USER],
        as: "user_booking",
        attributes: ["id", "name", "avartar", "email", "phone"],
      },
      {
        model: models[DB_NAME.LISTING],
        as: "listing_info",
        attributes: ["id", "name", "imgs_url"],
      },
    ],
  });

  // imgs_url when get is JSON type, need to parse
  return {
    ...bookings,
    rows: bookings.rows.map((l) => ({
      ...l,
      listing_info: {
        ...l.listing_info,
        imgs_url: JSON.parse(l.listing_info.imgs_url),
      },
    })),
  };
};

exports.getBookingById = async (params) => {
  const { id: booking_id = "" } = params;
  // no then id throw errot
  if (!booking_id) throw { message: "Booking not found!", status: 403 };
  const BOOKING_DB = models[DB_NAME.BOOKING];
  const bookingRecord = await BOOKING_DB.findByPk(booking_id, {
    include: [
      {
        model: models[DB_NAME.USER],
        as: "user_booking",
        attributes: ["id", "name", "avartar", "email", "phone"],
      },
      {
        model: models[DB_NAME.LISTING],
        as: "listing_info",
        attributes: ["id", "name", "imgs_url"],
      },
    ],
  });
  if (!bookingRecord) throw { message: "Booking not found!", status: 403 };

  // imgs_url when get is JSON type, need to parse
  return {
    ...bookingRecord.get(),
    listing_info: {
      ...bookingRecord.get().listing_info,
      imgs_url: JSON.parse(bookingRecord.get().listing_info.imgs_url),
    },
  };
};

exports.createBooking = async (body, user_id) => {
  // check user
  if (!user_id) throw { message: "Unauthorized", status: 403 };
  const user = await findUserFromUserId(user_id);

  if (user.type === DB_CONST.USER.TYPE.OWNER)
    throw { message: "Owner cannot booking!", status: 403 };

  const { listing_id, check_in_date, check_out_date, guest_count } = body;

  if (Number.isNaN(guest_count))
    throw { message: "Guest number not correct!", status: 403 };

  // check listing
  if (!listing_id) throw { message: "Listing not found!", status: 403 };
  const LISTING_DB = models[DB_NAME.LISTING];
  const listing = await LISTING_DB.findByPk(listing_id);
  if (!listing) throw { message: "Listing not found!", status: 403 };

  const CheckInDate = moment(check_in_date);
  const CheckOutDate = moment(check_out_date);

  if (!CheckInDate.isValid() || !CheckOutDate.isValid())
    throw { message: "Check in or out date not valid!", status: 403 };

  // booking
  const days = moment.duration(CheckOutDate.diff(CheckInDate)).asDays();
  if (days <= 0)
    throw { message: "Check in and out need more than 24 hours!", status: 403 };
  const total_price = days * +listing.price_per_night;

  const BOOKING_DB = models[DB_NAME.BOOKING];
  const booking = await BOOKING_DB.create({
    listing_id,
    user_book_id: user.id,
    check_in_date,
    check_out_date,
    total_price,
    status: DB_CONST.BOOKING.STATUS.PENDING,
    guest_count,
  });
  return booking;
};

exports.updateBooking = async (params, body, user_id) => {
  const { id: booking_id = "" } = params;
  // no then id throw errot
  if (!booking_id) throw { message: "Booking not found!", status: 403 };
  const BOOKING_DB = models[DB_NAME.BOOKING];
  const bookingRecord = await BOOKING_DB.findByPk(booking_id, {
    include: [
      {
        model: models[DB_NAME.USER],
        as: "user_booking",
        attributes: ["id", "name", "avartar", "email", "phone", "type"],
      },
      {
        model: models[DB_NAME.LISTING],
        as: "listing_info",
        attributes: ["id", "name", "imgs_url", "user_owner_id"],
      },
    ],
  });
  if (!bookingRecord) throw { message: "Booking not found!", status: 403 };
  // Check status booking. pending and confirmed can change.
  if (
    bookingRecord.status === DB_CONST.BOOKING.STATUS.COMPLETED ||
    bookingRecord.status === DB_CONST.BOOKING.STATUS.CANCELLED
  ) {
    throw { message: "Booking has completed or cancelled!!", status: 403 };
  }

  // check user
  if (!user_id) throw { message: "Unauthorized", status: 403 };
  const user = await findUserFromUserId(user_id);
  // Only User is a owner and own that listing can update booking.
  if (
    user.type !== DB_CONST.USER.TYPE.OWNER &&
    user.id !== bookingRecord.listing_info.user_owner_id
  ) {
    throw { message: "User unauthorized update booking!", status: 403 };
  }

  const {
    listing_id = bookingRecord.listing_info.id,
    check_in_date = bookingRecord.check_in_date,
    check_out_date = bookingRecord.check_out_date,
    guest_count = bookingRecord.guest_count,
    status = bookingRecord.status,
  } = body;
  // check status
  if (!Object.values(DB_CONST.BOOKING.STATUS).includes(status)) {
    throw { message: "Booking status not valid!", status: 403 };
  }

  // Check date
  const CheckInDate = moment(check_in_date);
  const CheckOutDate = moment(check_out_date);
  const days = moment.duration(CheckOutDate.diff(CheckInDate)).asDays();
  if (!CheckInDate.isValid() || !CheckOutDate.isValid()) {
    throw { message: "Check in or out date not valid!", status: 403 };
  }

  if (days <= 0) {
    throw { message: "Check in and out need more than 24 hours!", status: 403 };
  }

  // check listing
  if (!listing_id) throw { message: "Listing not found!", status: 403 };
  const LISTING_DB = models[DB_NAME.LISTING];
  const listing = await LISTING_DB.findByPk(listing_id);
  if (!listing) throw { message: "Listing not found!", status: 403 };
  const total_price = days * +listing.price_per_night;

  // booking
  const booking = await BOOKING_DB.update({
    listing_id,
    user_book_id: bookingRecord.user_book_id,
    check_in_date,
    check_out_date,
    total_price,
    guest_count,
    status: status,
  });
  return { ...booking.get() };
};

exports.deleteBooking = async (params) => {
  const { id: booking_id = "" } = params;
  // no then id throw errot
  if (!booking_id) throw { message: "Booking not found!", status: 403 };
  const BOOKING_DB = models[DB_NAME.BOOKING];
  const bookingRecord = await BOOKING_DB.findByPk(booking_id);
  if (!bookingRecord) throw { message: "Booking not found!", status: 403 };
  // Check status booking.
  if (bookingRecord.status === DB_CONST.BOOKING.STATUS.CANCELLED) {
    throw { message: "Booking has deleted!", status: 403 };
  }

  bookingRecord.update({
    status: DB_CONST.BOOKING.STATUS.CANCELLED,
  });
};

exports.getBookingByUserBookingId = async (params, { page = 1, size = 10 }) => {

  const { user_book_id } = params;
  if (!user_book_id) {
    throw { message: "User booking not existed!", status: 403 };
  }
  const user = findUserFromUserId(user_book_id);
  if (!user) {
    throw { message: "User booking not existed!", status: 403 };
  }
  const offset = (+page - 1) * 10; // page 1 : 0 -> 9, page 2 : 10 -> 19,
  const BOOKING_DB = models[DB_NAME.BOOKING];
  const bookings = await BOOKING_DB.findAndCountAll({
    limit: +size,
    offset: offset,
    where: {
      user_book_id,
    },
    include: [
      {
        model: models[DB_NAME.USER],
        as: "user_booking",
        attributes: ["id", "name", "avartar", "email", "phone", "type"],
      },
      {
        model: models[DB_NAME.LISTING],
        as: "listing_info",
        attributes: ["id", "name", "imgs_url"],
      },
    ],
  });


  // imgs_url when get is JSON type, need to parse
  return {
    ...bookings,
    rows: bookings.rows.map((l) => ({
      ...l,
      listing_info: {
        ...l.listing_info,
        imgs_url: JSON.parse(l.listing_info.imgs_url),
      },
    })),
  };
};
