$.fn.triggerDelegated = function (name, $context) {
    var e = $.Event(name)
    e.target = this[0]
    $context.trigger(e)
}

