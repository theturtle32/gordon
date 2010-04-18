Gordon.ABCException = function() {
    this.from = null;
    this.to = null;
    this.jumpTo = null;
    this.exceptionType = null;
    this.variableName = null;
};
Gordon.ABCException.prototype = {
    parse: function(str) {
        this.from = str.readEncodedU32();
        this.to = str.readEncodedU32();
        this.jumpTo = str.readEncodedU32();
        this.exceptionType = str.readEncodedU32();
        this.variableName = str.readEncodedU32();
    }
};