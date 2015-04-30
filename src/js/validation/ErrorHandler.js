function ErrorHandler() {
    this._length = 0
    this._errors = {}
}

ErrorHandler.prototype = {
    ok: function () {
        return this._length === 0
    },
    add: function (type, message) {
        if (!(type in this._errors)) {
            ++this._length
        }
        this._errors[type] = message
    },
    remove: function (type) {
        if (type in this._errors) {
            delete this._errors[type]
            --this._length
        }
    },
    message: function () {
        for (var key in this._errors) {
            return this._errors[key]
        }
    }
}

module.exports = ErrorHandler