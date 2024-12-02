const { v2 : cloudinary } = require('cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
    cloud_name: 'dypskaij4', 
    api_key: '394894562213339', 
    api_secret: 'G2Jisl71LIJDYYjYDJrE6sdU9VM' // Click 'View API Keys' above to copy your API secret
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'airbnb',
        format: async (req, file) => {
            const validImgFormat = ["png", "jpeg", "gif", "webp", "heic"]; 
            const fileFormat = file.mimetype.split('/')[1];
            if (validImgFormat.includes(fileFormat)) {
                return fileFormat;
            }

            return '.png';
        },
        transformation: [
            {
                width: 800, // giới hạn chiều width.
                quality: 'auto:good', // chat lương tu dong: tot
                fetch_format: 'auto', // tự động chọn định dạng tốt nhất.
            }
        ],
        public_id: (req, file) => file.originalname.split(".")[0],
    },
});

const validNames = ["imgs_url", "avartar"]

exports.uploadCloud = multer({
    storage, 
    fileFilter: (req, file, cb) => {
        if (validNames.includes(file.fieldname)) {
            cb(null, true);
        } else {
            cb(null, false);
        }

    },
});

// const upload = multer({
//     fileFilter: (req, file, cb) => {
//         if (file.fieldname === 'img_urls') {
//             return cb(null, true);
//         }

//         cb(null, false);
//     }
// });

// export const uploadImage = async (file) => {
//     if (!(file instanceof File)) return null;
//     const fileURL = URL.createObjectURL(file);
//     console.log('fileURL', fileURL);
//     return await cloudinary.uploader
//        .upload(
//            fileURL, 
//            {
//                public_id: file.originalname.split(".")[0],
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
// };