Gordon.ABCStream = function(data) {
    var t = this;
    t._buffer = data;
    t._length = t._buffer.length;
    t._offset = 0;
    t._bitBuffer = null;
    t._bitOffset = 8;
};

Gordon.ABCStream.prototype = {
    readEncodedS32: function(){
        var num,
            val = 0,
            i = 5;
        while(i--){
            num = this.readByteAt(this._offset++);
            val = (val << 7) | (num & 0x7f);
            if(!(num & 0x80)){ break; }
        }
        if (num & 0x80) {
            val *= -1;
        }
        return val;
    }
};

Gordon.extend(Gordon.ABCStream.prototype, Gordon.Stream.prototype);