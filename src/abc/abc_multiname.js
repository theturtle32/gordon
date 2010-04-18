Gordon.ABCMultiname = function() {
    this.kind = null;
    this.nsIndex = null;
    this.namespace = null;
    this.nameIndex = null;
    this.name = null;
    this.nsSetIndex = null;
    this.nsSet = null;
};

Gordon.ABCMultiname.QNAME = 0x07;
Gordon.ABCMultiname.QNAME_A = 0x0D;
Gordon.ABCMultiname.RTQNAME = 0x0F;
Gordon.ABCMultiname.RTQNAME_A = 0x10;
Gordon.ABCMultiname.RTQNAME_L = 0x11;
Gordon.ABCMultiname.RTQNAME_LA = 0x12;
Gordon.ABCMultiname.MULTINAME = 0x09;
Gordon.ABCMultiname.MULTINAME_A = 0x0E;
Gordon.ABCMultiname.MULTINAME_L = 0x1B;
Gordon.ABCMultiname.MULTINAME_LA = 0x1C;

Gordon.ABCMultiname.prototype = {
    parse: function(str) {
        console.log("Parsing multiname");
        this.kind = str.readUI8();
        switch(this.kind) {
            case Gordon.ABCMultiname.QNAME:
            case Gordon.ABCMultiname.QNAME_A:
                this.nsIndex = str.readEncodedU32();
                this.nameIndex = str.readEncodedU32();
                break;
            case Gordon.ABCMultiname.RTQNAME:
            case Gordon.ABCMultiname.RTQNAME_A:
                this.nameIndex = str.readEncodedU32();
                break;
            case Gordon.ABCMultiname.RTQNAME_L:
            case Gordon.ABCMultiname.RTQNAME_LA:
                break;
            case Gordon.ABCMultiname.MULTINAME:
            case Gordon.ABCMultiname.MULTINAME_A:
                this.nameIndex = str.readEncodedU32();
                this.nsSetIndex = str.readEncodedU32();
                if (this.nsSetIndex == 0) {
                    throw new Error("Multiname Validation: ns_set cannot be zero.");
                }
                break;
            case Gordon.ABCMultiname.MULTINAME_L:
            case Gordon.ABCMultiname.MULTINAME_LA:
                this.nsSetIndex = str.readEncodedU32();
                if (this.nsSetIndex == 0) {
                    throw new Error("Multiname Validation: ns_set cannot be zero.");
                }
                break;
            default:
                throw new Error("Unknown Multiname Kind: " + this.kind);
        }
    },
    resolveConnections: function(constantPool) {
        if (this.nameIndex !== null) {
            this.name = constantPool.strings[this.nameIndex];
        }
        if (this.nsIndex !== null) {
            this.namespace = constantPool.namespaces[this.nsIndex];
        }
        if (this.nsSetIndex !== null) {
            this.nsSet = constantPool.nsSets[this.nsSetIndex];
        }
    }
};