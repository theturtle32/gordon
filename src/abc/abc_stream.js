Gordon.ABCStream = function(data) {
    var t = this;
    t._buffer = data;
    t._length = t._buffer.length;
    t._offset = 0;
    t._bitBuffer = null;
    t._bitOffset = 8;
};

Gordon.ABCStream.prototype = {

};

Gordon.extend(Gordon.ABCStream.prototype, Gordon.Stream.prototype);