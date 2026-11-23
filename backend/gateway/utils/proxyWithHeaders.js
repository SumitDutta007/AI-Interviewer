import proxy from "express-http-proxy"
import http from "http"
import https from "https"

export const proxyWithHeaders = (serviceUrl, options = {}) => {
  return proxy(serviceUrl, {
    timeout: 300000,
    ...options,
    proxyErrorHandler: (error, response) => {
      if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
        return response.status(504).json({
          success: false,
          message: "The upstream service timed out.",
        })
      }
      return response.status(502).json({
        success: false,
        message: "The upstream service is unavailable.",
      })
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
      }
      return proxyReqOpts
    },
  })
}

export const nativeServiceProxy = (serviceUrl, fixedPath) => {
  return (req, res) => {
    const chunks = []

    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => {
      const body = Buffer.concat(chunks)

      const send = (attempt) => {
        const upstreamPath = fixedPath || req.url || "/"
        const target = new URL(upstreamPath, serviceUrl)
        const transport = target.protocol === "https:" ? https : http
        const headers = { ...req.headers }
        headers.host = target.host
        headers["content-length"] = body.length

        if (req.user) {
          headers["x-user-id"] = req.user.userId
        }

        const upstream = transport.request(target, {
          method: req.method,
          headers,
          timeout: 300000,
        }, (upstreamResponse) => {
          if (attempt < 3 && [502, 503, 504].includes(upstreamResponse.statusCode)) {
            upstreamResponse.resume()
            setTimeout(() => send(attempt + 1), 20000)
            return
          }

          res.status(upstreamResponse.statusCode || 502)
          Object.entries(upstreamResponse.headers).forEach(([name, value]) => {
            if (!["connection", "transfer-encoding"].includes(name)) {
              res.setHeader(name, value)
            }
          })
          upstreamResponse.pipe(res)
        })

        upstream.on("timeout", () => {
          upstream.destroy(Object.assign(new Error("Upstream timed out"), {
            code: "ETIMEDOUT",
          }))
        })

        upstream.on("error", (error) => {
          const retriableError =
            attempt < 3 &&
            ["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND"].includes(error.code)

          if (retriableError) {
            setTimeout(() => send(attempt + 1), 20000)
            return
          }

          if (!res.headersSent) {
            res.status(502).json({
              success: false,
              message: "Upstream service is unavailable.",
            })
          }
        })

        upstream.end(body)
      }

      send(0)
    })
  }
}
