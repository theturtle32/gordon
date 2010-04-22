Gordon.ABCConstantPool = function() {
    this.integers = null;
    this.uintegers = null;
    this.doubles = null;
    this.strings = null;
    this.namespaces = null;
    this.nsSets = null;
    this.multinames = null;
};

Gordon.extend(Gordon.ABCConstantPool, {
    "CONSTANT_INT": 0x03,
    "CONSTANT_UINT": 0x04,
    "CONSTANT_DOUBLE": 0x06,
    "CONSTANT_UTF8": 0x01,
    "CONSTANT_TRUE": 0x0B,
    "CONSTANT_FALSE": 0x0A,
    "CONSTANT_NULL": 0x0C,
    "CONSTANT_UNDEFINED": 0x00,
    "CONSTANT_NAMESPACE": 0x08,
    "CONSTANT_PACKAGE_NAMESPACE": 0x16,
    "CONSTANT_PACKAGE_INTERNAL_NAMESPACE": 0x17,
    "CONSTANT_PACKAGE_PROTECTED_NAMESPACE": 0x18,
    "CONSTANT_EXPLICIT_NAMESPACE": 0x19,
    "CONSTANT_STATIC_PROTECTED_NAMESPACE": 0x1A,
    "CONSTANT_PRIVATE_NAMESPACE": 0x05
});
Gordon.ABCConstantPool.constantLookup = {
    0x03: "CONSTANT_INT",
    0x04: "CONSTANT_UINT",
    0x06: "CONSTANT_DOUBLE",
    0x01: "CONSTANT_UTF8",
    0x0B: "CONSTANT_TRUE",
    0x0A: "CONSTANT_FALSE",
    0x0C: "CONSTANT_NULL",
    0x00: "CONSTANT_UNDEFINED",
    0x08: "CONSTANT_NAMESPACE",
    0x16: "CONSTANT_PACKAGE_NAMESPACE",
    0x17: "CONSTANT_PACKAGE_INTERNAL_NAMESPACE",
    0x18: "CONSTANT_PACKAGE_PROTECTED_NAMESPACE",
    0x19: "CONSTANT_EXPLICIT_NAMESPACE",
    0x1A: "CONSTANT_STATIC_PROTECTED_NAMESPACE",
    0x05: "CONSTANT_PRIVATE_NAMESPACE"
};

function outputBits(val) {
    var bitMask = 0x80000000;
    var string = "";
    for (var i=0; i < 32; i++) {
        string += (val & bitMask) ? "1" : "0";
        bitMask >>= 1;
        bitMask &= 0x7FFFFFFF;
    }
    console.log(string);
}

Gordon.ABCConstantPool.prototype = {
    parse: function(str) {
        var i, len;
        
        len = str.readEncodedU32();
        this.integers = new Array(Math.max(1,len));
        this.integers[0] = 0;
        for (i = 1; i < len; i ++) {
            var s32value = str.readEncodedU32();
            this.integers[i] = s32value;
        }
        
        len = str.readEncodedU32();
        this.uintegers = new Array(Math.max(1,len));
        this.uintegers[0] = 0;
        for (i = 1; i < len; i ++) {
            this.uintegers[i] = str.readEncodedU32();
        }
        
        len = str.readEncodedU32();
        this.doubles = new Array(Math.max(1,len));
        this.doubles[0] = NaN;
        console.log("Double count: " + len);
        for (i = 1; i < len; i ++) {
            console.log("Reading double");
            this.doubles[i] = str.readDouble();
        }
        
        len = str.readEncodedU32();
        this.strings = new Array(Math.max(1,len));
        this.strings[0] = "";
        for (i = 1; i < len; i ++) {
            var strLen = str.readEncodedU32();
            if (strLen == 0) {
                this.strings[i] = "";
            }
            else {
                this.strings[i] = str.readString(strLen);
            }
        }
        
        len = str.readEncodedU32();
        this.namespaces = new Array(Math.max(1,len));
        this.namespaces[0] = {
            name: "*",
            kind: Gordon.ABCNamespace.NAMESPACE,
            kindDescription: "NAMESPACE"
        };
        for (i = 1; i < len; i ++) {
            var ns = new Gordon.ABCNamespace();
            ns.parse(str);
            ns.resolveName(this);
            this.namespaces[i] = ns;
        }
        
        len = str.readEncodedU32();
        this.nsSets = new Array(Math.max(1,len));
        this.nsSets[0] = null;
        for (i = 1; i < len; i ++) {
            var nsSet = new Gordon.ABCNamespaceSet();
            nsSet.parse(str);
            nsSet.resolveNamespaces(this);
            this.nsSets[i] = nsSet;
        }
        
        len = str.readEncodedU32();
        this.multinames = new Array(Math.max(1,len));
        this.multinames[0] = null;
        for (i = 1; i < len; i ++) {
            var multiname = new Gordon.ABCMultiname();
            multiname.parse(str);
            multiname.resolveConnections(this);
            this.multinames[i] = multiname;
        }
    }
};