const { createServer } = require('http')
const { createProxyMiddleware } = require('http-proxy-middleware')
const next = require('next')
const express = require('express')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use("/api", createProxyMiddleware({
    pathRewrite: { '^/api/': '/' },
    target: 'http://localhost:3001',
    ws: true
  }))

  server.all('*', (req, res) => handler(req, res));
  server.all(/^\/_next\/webpack-hmr(\/.*)?/, (req, res) => handler(req, res))

  createServer(server).listen(port);
})