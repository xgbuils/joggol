module.exports = {
    encode: function (obj) {
        return obj.min + '-' + obj.max
    },
    decode: function (str) {
        if (typeof str !== 'string')
            return undefined

        var arr = str.split('-')
        if (arr.length !== 2)
            return undefined

        var min = parseInt(arr[0])
        var max = parseInt(arr[1])
        if (arr[0] != min || arr[1] != max)
            return undefined

        return {
            min: min,
            max: max
        }
    } 
}