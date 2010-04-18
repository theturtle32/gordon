Gordon.ABCNamespace = function(scriptName) {
    this.kind = null
    this.nameIndex = null;
    this.name = null;
};

Gordon.ABCNamespace.NAMESPACE = 0x08;
Gordon.ABCNamespace.PACKAGE_NAMESPACE = 0x16;
Gordon.ABCNamespace.PACKAGE_INTERNAL_NS = 0x17;
Gordon.ABCNamespace.PROTECTED_NAMESPACE = 0x18;
Gordon.ABCNamespace.EXPLICIT_NAMESPACE = 0x19;
Gordon.ABCNamespace.STATIC_PROTECTED_NS = 0x1A;
Gordon.ABCNamespace.PRIVATE_NAMESPACE = 0x05;

Gordon.ABCNamespace.prototype = {
    parse: function(str) {
        console.log("Parsing namespace");
        this.kind = str.readUI8();
        this.nameIndex = str.readEncodedU32();
    },
    resolveName: function(constantPool) {
        this.name = constantPool.strings[this.nameIndex];
    }
};