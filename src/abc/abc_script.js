Gordon.ABCScript = function() {
    // 'init' is index into 'methods' array of abcFile
    // identifies function that is to be invoked prior to any
    // other code in this script.
    this.init = null; 
    this.initMethod = null;
    this.traitCount = null;
    this.traits = null;
};
Gordon.ABCScript.prototype = {
    parse: function(str, abcfile) {
        this.init = str.readEncodedU32();
        this.initMethod = abcfile.methods[this.init];
        this.traitCount = str.readEncodedU32();
        this.traits = [];
        for (var i=0; i < this.traitCount; i ++) {
            var trait = new Gordon.ABCTrait();
            trait.parse(str, abcfile);
            this.traits.push(trait);
        }
    }
};