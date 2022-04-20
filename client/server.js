const { createServer } = require("https")
const { parse } = require("url")
const next = require("next")
const fs = require("fs")

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })

app.prepare().then(() => {
  createServer({
    key: fs.readFileSync("./certs/hugo.key"),
    cert: fs.readFileSync("./certs/hugo.pem"),
  }, async (req, res) => {
    const parsedUrl = parse(req.url, true)
    await app.getRequestHandler()(req, res, parsedUrl)
  }).listen(port)
})