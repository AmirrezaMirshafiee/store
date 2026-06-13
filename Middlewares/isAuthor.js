import { catchAsync, HandleERROR } from "vanta-api";

const isAuthor =catchAsync(async (req,res,next)=> {
    if(req.role!=="admin" &req.role!=="author"){
        return next(new HandleERROR("you don't have permission"),401)
    }
    return next()
})

export default isAuthor