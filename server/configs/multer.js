{/*import multer from 'multer'

const storage=multer.diskStorage({})

const upload=multer({storage})

export default upload
*/}
import multer from 'multer';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp'); 
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({ storage });
