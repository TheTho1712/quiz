module.exports = {
    ifEquals: function(arg1, arg2, options){
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },

    cong: function(value){
        return parseInt(value) + 1;
    },

    gt: function(a, b, options) {
        return (Number(a) > Number(b)) ? options.fn(this) : options.inverse(this);
    },

    lt: function(a, b, options) {
        return (Number(a) < Number(b)) ? options.fn(this) : options.inverse(this);
    },

    add: function(a, b) {
        return Number(a) + Number(b);
    },

    subtract: function (a, b) {
        return Number(a) - Number(b);
    },

    cong: function(value){
        return parseInt(value) + 1;
    }
};