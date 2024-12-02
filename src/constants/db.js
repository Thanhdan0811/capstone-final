exports.DB_CONST = {
    DB_NAME: {
        USER: 'User',
        LISTING: 'Listing',
        COMMENT: 'Comment',
        BOOKING: 'Booking',
    },
    TABLE_NAME: {
        USER: 'users',
        LISTING: 'listings',
        COMMENT: 'comments',
        BOOKING: 'bookings',
    },
    LISTING: {
        STATUS: {
            AVAILABLE: 'available',
            BOOKED: 'booked',
            INACTIVE: 'inactive',
        }
    },
    BOOKING: {
        STATUS: {
            PENDING: 'pending', // chờ xác nhận từ owner
            CONFIRMED: 'confirmed', // đơn được chấp nhận.
            CANCELLED: 'cancelled', // đơn bị hủy.
            COMPLETED: 'completed', // đơn hoàn thành.
        }
    },
    USER: {
        ROLE: {
            ADMIN: 1,
            USER: 0,
        }, 
        TYPE: {
            OWNER: 1,
            GUEST: 0,
        },
        GENDER: {
            MALE: 'male',
            FEMALE: 'female',
        }
    }
}