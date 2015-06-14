var Router = require('frontpiece.router')
var callbacks = require('./callbacks')
console.log(callbacks)

var router = new Router()
router
.on(/^header(?:\/?(\?.+))?/, callbacks.header)
.on(/^generator(?:\/?(\?.+))?/, callbacks.generator)
.on(/^simulator(?:\/?(\?.+))?/, callbacks.simulator)

module.exports = router