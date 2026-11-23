import proxy from "express-http-proxy"



export const proxyWithHeaders =(serviceUrl)=>{
    return proxy(
        serviceUrl,
        {
          timeout: 300000,
          proxyReqOptDecorator:(proxyReqOpts, srcReq) =>{
            if(srcReq.user){
                proxyReqOpts.headers["x-user-id"]=srcReq.user.userId
            }
            return proxyReqOpts

          } 
        }

    )
}