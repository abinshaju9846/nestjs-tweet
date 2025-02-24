import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from 'multer';
import { extname } from "path";


export const multerConfig:MulterOptions={
    storage:diskStorage({
        destination:'./uploads/avatars',
        filename:(req,file,cb)=>{
            const uniqueSuffix=Date.now()+'-'+Math.round(Math.random() * 1E9)
            cb(null,uniqueSuffix + extname(file.originalname))

        }
    })
}
