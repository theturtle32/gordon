Gordon.ABCNamespace = function(scriptName) {
    this.kind = null
    this.kindDescription = null;
    this.nameIndex = null;
    this.name = null;
};

Gordon.extend(Gordon.ABCNamespace, {
    NAMESPACE: 0x08,
    PACKAGE_NAMESPACE: 0x16,
    PACKAGE_INTERNAL_NS: 0x17,
    PROTECTED_NAMESPACE: 0x18,
    EXPLICIT_NAMESPACE: 0x19,
    STATIC_PROTECTED_NS: 0x1A,
    PRIVATE_NAMESPACE: 0x05
});

Gordon.ABCNamespace.kindLookup = {
    0x08: "NAMESPACE",
    0x16: "PACKAGE_NAMESPACE",
    0x17: "PACKAGE_INTERNAL_NS",
    0x18: "PROTECTED_NAMESPACE",
    0x19: "EXPLICIT_NAMESPACE",
    0x1A: "STATIC_PROTECTED_NS",
    0x05: "PRIVATE_NAMESPACE"
};

Gordon.ABCNamespace.prototype = {
    parse: function(str) {
        this.kind = str.readUI8();
        this.kindDescription = Gordon.ABCNamespace.kindLookup[this.kind];
        this.nameIndex = str.readEncodedU32();
    },
    resolveName: function(constantPool) {
        this.name = constantPool.strings[this.nameIndex];
    }
};