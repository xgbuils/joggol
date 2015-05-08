
module.exports = {
	parseHref: function (href, config) {
        //console.log(href)
        var aux = href.split('?')
        var fragment = aux[0]
        var queryString = {}
    
        //console.log(aux[1])
        if (aux[1]) {
            var q = aux[1].split('&')
            for (var i in q) {
                aux = q[i].split('=')
                queryString[aux[0]] = aux[1]
            }
        }
    
        return {
            fragment: fragment || config.fragment,
            queryString: queryString 
        }
    },
    range: function (min, max) {
        var arr = []
        for (var i = min; i <= max; ++i) {
            arr.push(i)
        }
        return arr
    },
    isInt: function (value) {
        return !isNaN(value) && value === Math.floor(value)
    }
}