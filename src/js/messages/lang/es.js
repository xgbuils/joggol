function capitalize(str) {
    return str[0].toUpperCase(str) + str.substring(1)
}

module.exports = {
	order: ['patterns', 'balls', 'periods', 'heights'],
	patterns: 'Patrones',
	balls: [
	    function (min, max) {
	    	return 'de ' + max + ' bolas'
	    },
	    function (min, max) {
	    	return 'de máximo ' + max + ' bolas'
	    },
	    function (min, max) {
	    	return 'de ' + min + ' a ' + max + ' bolas'
	    },
	    function (min, max) {
	    	return 'L\'interval de boles que demanes no es correcte'
	    },
	],
	periods: [
	    function (min, max) {
	    	return 'de periodo ' + max
	    },
	    function (min, max) {
	    	return 'con periodos no más grandes de ' + max
	    },
	    function (min, max) {
	    	return 'con periodos entre ' + min + ' y ' + max
	    },
	    function (min, max) {
	    	return 'L\'interval de períodes que demanes no es correcte'
	    },
	],
	heights: [
	    function (min, max) {
	    	return 'con lanzamientos no más altos de ' + max
	    },
	    function (min, max) {
	    	return 'con algún lanzamiento mayor o igual a ' + min
	    },
	    function (min, max) {
	    	return 'con algún lanzamiento de ' + min + ' y no más alto'
	    },
	    function (min, max) {
	    	return 'con lanzamientos mayores o iguales a ' + min + ' y no superiores a ' + max
	    },
	    function (min, max) {
	    	return 'L\'interval de períodes que demanes no es correcte'
	    },
	],
	message: {
        isNotAInt: function (value) {
            return value + 'no és un nombre enter'
        },
        invalidRange: function (range, type) {
            type = {
                balls: 'el número de bolas',
                periods: 'el periodo',
                heights: 'la altura'
            }[type]
            return capitalize(type) + ' menor (' + range.min 
                 + ') no puede sobrepasar ' + type + ' mayor (' + range.max + ')'
        },
        emptyWithBigPeriod: function () {
            return 'No existen patrones válidos dentro del rango indicado. Prueba que la altura máxima sea mayor al número mínimo de bolas'
        },
        emptyWithLittlePeriod: function () {
            return 'No existen patrones válidos dentro del rango indicado. Prueba que la altura máxima sea mayor o igual al número mínimo de bolas'
        }
    }
}