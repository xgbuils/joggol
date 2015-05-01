var BBCollection = Backbone.Collection
var siteswap = require('siteswap-generator')

var PatternsCollection = BBCollection.extend({
    initialize: function (models, options) {
    	this.buffer = new siteswap.Buffer(options)
    	this.length = 0
    	this.incr   = options.incr

    	this.on('add', function () {
    		this.index++
    		if (this.incr === this.index) {
    			this.trigger('add-last', this.lastPatterns)
    		}  		
    	})

    	this.on('add-last', function (patterns) {
    		console.log('Se han añadido ' + this.incr + ' patrones')
    		console.log('jeje', patterns)
    	})
    },

    add: function (newPatterns) {
    	this.index = 0
    	if (newPatterns === undefined) {
    		console.log('add')
            var start = this.index
            this.length += this.incr
            this.lastPatterns = this.buffer.slice(start, this.length)

            BBCollection.prototype.add.call(this, this.lastPatterns)
        }
    }
})
/*
var patterns = new PatternsCollection(null, {
	balls: 3, period: 3, height: 5, incr: 5
})

patterns.add()*/

module.exports = PatternsCollection

