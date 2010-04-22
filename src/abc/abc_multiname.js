Gordon.ABCMultiname = function() {
    this.kind = null;
    this.nsIndex = null;
    this.namespace = null;
    this.nameIndex = null;
    this.name = null;
    this.nsSetIndex = null;
    this.nsSet = null;
};

Gordon.extend(Gordon.ABCMultiname, {
    QNAME: 0x07,
    QNAME_A: 0x0D,
    RTQNAME: 0x0F,
    RTQNAME_A: 0x10,
    RTQNAME_L: 0x11,
    RTQNAME_LA: 0x12,
    MULTINAME: 0x09,
    MULTINAME_A: 0x0E,
    MULTINAME_L: 0x1B,
    MULTINAME_LA: 0x1C
});
Gordon.ABCMultiname.kinds = {
    0x07: "QNAME",
    0x0D: "QNAME_A",
    0x0F: "RTQNAME",
    0x10: "RTQNAME_A",
    0x11: "RTQNAME_L",
    0x12: "RTQNAME_LA",
    0x09: "MULTINAME",
    0x0E: "MULTINAME_A",
    0x1B: "MULTINAME_L",
    0x1C: "MULTINAME_LA"
};

Gordon.ABCMultiname.prototype = {
    parse: function(str) {
        var m = Gordon.ABCMultiname;
        this.kind = str.readUI8();
        this.kindDescription = m.kinds[this.kind];
        switch(this.kind) {
            case m.QNAME:
            case m.QNAME_A:
                this.nsIndex = str.readEncodedU32();
                this.nameIndex = str.readEncodedU32();
                break;
            case m.RTQNAME:
            case m.RTQNAME_A:
                this.nameIndex = str.readEncodedU32();
                break;
            case m.RTQNAME_L:
            case m.RTQNAME_LA:
                break;
            case m.MULTINAME:
            case m.MULTINAME_A:
                this.nameIndex = str.readEncodedU32();
                this.nsSetIndex = str.readEncodedU32();
                if (this.nsSetIndex == 0) {
                    throw new Error("Multiname Validation: ns_set cannot be zero.");
                }
                break;
            case m.MULTINAME_L:
            case m.MULTINAME_LA:
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
            if (this.nameIndex == 0) {
                this.name = "*";
            }
            else {
                this.name = constantPool.strings[this.nameIndex];
            }
        }
        if (this.nsIndex !== null) {
            this.namespace = constantPool.namespaces[this.nsIndex];
        }
        if (this.nsSetIndex !== null) {
            this.nsSet = constantPool.nsSets[this.nsSetIndex];
        }
    }
};