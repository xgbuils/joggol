var ControlBarView = Backbone.View.extend({
    initialize: function (options) {
    	var view = this

    	this.$el = $(options.el)
        this.el  = this.$el[0]
        console.log('uee', this.el)

        this.keyboardViews = options.keyboardViews
        this.currentView   = undefined

        this.on('active', function(newKeyboardView) {
            if (newKeyboardView !== this.currentView) {
                if (this.currentView) {
                    this.currentView.trigger('inactive')
                }
                this.currentView = newKeyboardView
                newKeyboardView.trigger('active')
            }
        })
    },
    events: {
    	'click #keyboard-right': 'moveRight'
    },

    moveRight: function () {
    	console.log('clicado derecho')
    	var $el = this.keyboardViews[this.currentView].$el
    	console.log(this.keyboardViews[this.currentView].el)
    }
})
/*
var patterns = new PatternsCollection(null, {
    balls: 3, period: 3, height: 5, incr: 5
})

var patternButtons = new ButtonsView({
    el: '#keyboard-patterns',
    collection: patterns
})

var keyboard = new KeyboardView({
	el: '#keyboard',
	buttonsViews: {
		patterns: patternButtons
	}
})

patterns.add()*/