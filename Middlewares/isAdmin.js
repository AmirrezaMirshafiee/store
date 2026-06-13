import { catchAsync, HandleERROR } from "vanta-api";

const isAdmin =catchAsync(async (req,res,next)=> {
    if(req.role!=="admin"){
        return next(new HandleERROR("you don't have permission"),401)
    }
    return next()
})

export default isAdmin