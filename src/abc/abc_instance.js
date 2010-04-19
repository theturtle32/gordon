Gordon.ABCInstance = function() {
    this.nameIndex = null;
    this.name = null; // a multiname
    this.superNameIndex = null;
    this.superName = null;
    this.flags = null;
    this.protectedNamespaceIndex = null;
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
        this.superNameIndex = str.readEncodedU32();
        this.superName = abcfile.constantPool.multinames[this.superNameIndex];
        this.flags = str.readUI8();
        if (this.flags & Gordon.ABCClass.CLASS_PROTECTED_NAMESPACE) {
            this.protectedNamespaceIndex = str.readEncodedU32();
            this.protectedNamespace = abcfile.constantPool.namespaces[this.protectedNamespaceIndex];
        }
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