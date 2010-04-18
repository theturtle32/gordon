Gordon.ABCMetadata = function() {
    this.name = null;
    this.itemCount = 0;
    this.itemsArray = null;
    this.items = null;
};
Gordon.ABCMetadata.prototype = {
    parse: function(str) {
        console.log("parsing metadata");
        this.name = str.readEncodedU32();
        this.itemCount = str.readEncodedU32();
        this.itemsArray = [];
        this.items = {};
        for (var i=0; i < this.itemCount; i++) {
            this.itemsArray.push({
                key: str.readEncodedU32(),
                value: str.readEncodedU32()
            });
        }
    }
};