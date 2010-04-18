Gordon.ABCConstantPool = function() {

};

var cp = Gordon.ABCConstantPool;
cp.CONSTANT_INT = 0x03;
cp.CONSTANT_UINT = 0x04;
cp.CONSTANT_DOUBLE = 0x06;
cp.CONSTANT_UTF8 = 0x01;
cp.CONSTANT_TRUE = 0x0B;
cp.CONSTANT_FALSE = 0x0A;
cp.CONSTANT_NULL = 0x0C;
cp.CONSTANT_UNDEFINED = 0x00;
cp.CONSTANT_NAMESPACE = 0x08;
cp.CONSTANT_PACKAGE_NAMESPACE = 0x16;
cp.CONSTANT_PACKAGE_INTERNAL_NAMESPACE = 0x17;
cp.CONSTANT_PACKAGE_PROTECTED_NAMESPACE = 0x18;
cp.CONSTANT_EXPLICIT_NAMESPACE = 0x19;
cp.CONSTANT_STATIC_PROTECTED_NAMESPACE = 0x1A;
cp.CONSTANT_PRIVATE_NAMESPACE = 0x05;

Gordon.ABCConstantPool.prototype = {
    init: function() {
        this.integers = [ 0 ];
        this.uintegers = [ 0 ];
        this.doubles = [ NaN ];
        this.strings = [ "" ];
        this.namespaces = [ { name: "*", kind: Gordon.ABCNamespace.NAMESPACE } ];
        this.nsSets = [ null ];
        this.multinames = [ null ];  
    },
    parse: function(str) {
        var i, len;

        this.init();
        len = str.readEncodedS32();
        console.log("S32 Count: " + len);
        for (i = 1; i < len; i ++) {
            console.log("reading S32");
            this.integers.push(str.readEncodedS32());
        }
        
        len = str.readEncodedU32();
        console.log("U32 Count: " + len);
        for (i = 1; i < len; i ++) {
            console.log("reading U32");
            this.uintegers.push(str.readEncodedU32());
        }
        
        len = str.readEncodedU32();
        console.log("Double Count: " + len);
        for (i = 1; i < len; i ++) {
            console.log("Reading double");
            this.doubles.push(str.readDouble());
        }
        
        len = str.readEncodedU32();
        console.log("StringCount: " + len);
        for (i = 1; i < len; i ++) {
            console.log("Reading string");
            var strLen = str.readEncodedU32();
            if (strLen == 0) {
                this.strings.push("");
            }
            else {
                this.strings.push(str.readString(strLen));
            }
        }
        
        len = str.readEncodedU32();
        console.log("NameSpace Count: " + len);
        for (i = 1; i < len; i ++) {
            var ns = new Gordon.ABCNamespace();
            ns.parse(str);
            ns.resolveName(this);
            this.namespaces.push(ns);
        }
        
        len = str.readEncodedU32();
        console.log("Namespace Set Count: " + len);
        for (i = 1; i < len; i ++) {
            var nsSet = new Gordon.ABCNamespaceSet();
            nsSet.parse(str);
            nsSet.resolveNamespaces(this);
            this.nsSets.push(nsSet);
        }
        
        len = str.readEncodedU32();
        console.log("Multiname Count: " + len);
        for (i = 1; i < len; i ++) {
            var multiname = new Gordon.ABCMultiname();
            multiname.parse(str);
            multiname.resolveConnections(this);
            this.multinames.push(multiname);
        }
    }
};