const { createBooking, getAllBookings, updateBooking, deleteBooking, getBookingByUserBookingId, getBookingById } = require("./booking.service");


exports.getAllBookings = async (req, res) => {
    const list = await getAllBookings(req.query);
    res.json({message: 'List bookings', data: list});
}


exports.createBooking = async (req, res) => {
    const booking = await createBooking(req.body, req.user_id)
    res.json({message: 'Create booking successed', data: booking});
}

exports.uploadBooking = async (req, res) => {
    const booking = await updateBooking(req.params, req.body, req.user_id);
    res.json({message: 'Updated booking successed', data: booking});
}

exports.deleteBooking = async (req, res) => {
    await deleteBooking(req.params);
    res.json({message: 'Delete booking successed', data: true});
}

exports.getBookingById = async (req, res) => {
    const booking = await getBookingById(req.params);
    res.json({message: 'Booking', data: booking});
}

exports.getBookingByUserBookingId = async (req, res) => {
    const booking = await getBookingByUserBookingId(req.params, req.query);
    res.json({message: 'Booking', data: booking});
}

/* 
getAllBookings
getBookingById
createBooking
updateBooking
deleteBooking
getBookingByUserBookingId

*/
