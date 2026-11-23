import proxy from "express-http-proxy"



export const proxyWithHeaders =(serviceUrl, options = {})=>{
    return proxy(
        serviceUrl,
        {
          timeout: 300000,
          ...options,
          proxyErrorHandler: (error, response) => {
            if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
              return response.status(504).json({
                success: false,
                message: "The upstream service timed out. Please try again."
              })
            }
            return response.status(502).json({
              success: false,
              message: "The upstream service is unavailable. Please try again."
            })
          },
          proxyReqOptDecorator:(proxyReqOpts, srcReq) =>{
            if(srcReq.user){
                proxyReqOpts.headers["x-user-id"]=srcReq.user.userId
            }
            return proxyReqOpts

          } 
        }

    )
}