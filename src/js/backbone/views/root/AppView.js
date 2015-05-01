var AppView = Backbone.View.extend({
	el: window,
	initialize: function (options) {
		var view = this

		this.layouts = options.layouts

		this.bottoms = []
		for (var name in this.layouts) {
			var layout = this.layouts[name]
			this.bottoms.push({
				bottom: layout.bottom,
				name: name
			})
		}
		this.bottoms.sort(function (a, b) {
			return a.bottom - b.bottom
		})

		console.log(this.bottoms)

		this.layoutOn = undefined

		this.$el.on('scroll', function () {
			
			var top  = $(window).scrollTop()
			var layoutOn = view.layoutOn	
			var bottoms = view.bottoms
			var len = bottoms.length
			for (var i = 0; i < len; ++i) {
				var e = bottoms[i]
				var layout = view.layouts[e.name]
				console.log(i + ': ' + top + ', ' + (e.bottom - 60) + ' -> ' + e.name)
				if (e.bottom - 60 >= top) {
				    if (layout !== layoutOn) {
					    if (layoutOn) {
						    layoutOn.trigger('inactive')
					    }
                        view.layoutOn = layout
                        layout.trigger('active')
                    }
                    return false
                }
			}
		})
	}
})

module.exports = AppView