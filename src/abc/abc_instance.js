Gordon.ABCInstance = function() {
    this.nameIndex = null;
    this.name = null; // a multiname
    this.superName = null;
    this.flags = null;
    this.protectedNamespace = null;
    this.interfaceCount = null;
    this.interfaceIds = null;
    this.interfaces = null;
    this.instanceInitializerId = null;
    this.traitCount = null;
    this.traits = null;
};
Gordon.ABCInstance.prototype = {
    parse: function(str, abcfile) {
        var i;
        this.nameIndex = str.readEncodedU32();
        this.name = abcfile.constantPool.multinames[this.nameIndex];
        this.superName = str.readEncodedU32();
        this.flags = str.readUI8();
        this.protectedNamespace = str.readEncodedU32();
        this.interfaceCount = str.readEncodedU32();
        
        this.interfaceIds = [];
        this.interfaces = [];
        for (i=0; i < this.interfaceCount; i ++) {
            var interfaceIndex = str.readEncodedU32();
            this.interfaceIds.push(interfaceIndex);
            this.interfaces.push(abcfile.multinames[interfaceIndex]);
        }
        
        this.instanceInitializerId = str.readEncodedU32();
        this.instanceInitializer = abcfile.methods[this.instanceInitializerId];
        this.traitCount = str.readEncodedU32();
        this.traits = [];
        for (i=0; i < this.traitCount; i ++) {
            var trait = new Gordon.ABCTrait();
            trait.parse(str, abcfile);
            this.traits.push(trait);
        }
    }
};