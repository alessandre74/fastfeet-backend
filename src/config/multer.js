import multer from 'multer'
import { extname, resolve } from 'path'

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}${extname(file.originalname)}`)
    },
  }),
}
