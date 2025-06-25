module.exports = {
    ifEquals: function(arg1, arg2, options){
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },

    cong: function(value){
        return parseInt(value) + 1;
    },
};