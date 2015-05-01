var DashboardView = Backbone.View.extend({
    initialize: function (options) {
    	this.$el = $(options.el)
    	this.el  = this.$el[0]

    	this.fieldsetViews = options.fieldsetViews 
    }
})

module.exports = DashboardView