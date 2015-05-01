var KeyboardView = Backbone.View.extend({
    initialize: function (options) {
        var view = this
        //console.log('hola', options.collection)
        this.$el = $(options.el)
        this.el  = this.$el[0]
        this.collection = options.collection
        
        this.collection.on('add-last', function () {
            console.log(this)
            view.render(this.lastPatterns)
        })
    },
    render: function (patterns) {
        console.log('eoo', patterns)
        console.log(this.el)
    }
})