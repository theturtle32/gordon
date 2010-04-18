Gordon.ABCMethodSignature = function() {
    this.paramCount = null;
    this.returnType = null;
    this.paramTypes = [];
    this.nameIndex = null;
    this.name = null;
    this.flags = null;
    this.options = null;
    this.paramNameIds = null;
    this.paramNames = null;
};
Gordon.ABCMethodSignature.flags = {
  NEED_ARGUMENTS: 0x01,
  NEED_ACTIVATION: 0x02,
  NEED_REST: 0x04,
  HAS_OPTIONAL: 0x08,
  SET_DXNS: 0x40,
  HAS_PARAM_NAMES: 0x80
};
Gordon.ABCMethodSignature.prototype = {
    parse: function(str, abcfile) {
        var i,
            pool = abcfile.constantPool;
        console.log("Parsing method signature");
        this.paramCount = str.readEncodedU32();
        this.returnType = str.readEncodedU32();
        this.paramTypes = [];
        for (i=0; i < this.paramCount; i ++) {
            paramTypes.push(str.readEncodedU32());
        }
        this.nameIndex = str.readEncodedU32();
        this.name = pool.strings[this.nameIndex];
        this.flags = str.readUI8();
        
        this.options = [];
        if (this.flags & Gordon.ABCMethodSignature.flags.HAS_OPTIONAL) {
            var optionCount = str.readEncodedU32();
            for (i=0; i < optionCount; i ++) {
                this.options.push({
                    val: str.readEncodedU32(),
                    kind: str.readUI8()
                });
            }
        }
        
        this.paramNameIds = [];
        this.paramNames = [];
        if (this.flags & Gordon.ABCMethodSignature.flags.HAS_PARAM_NAMES) {
            for (i=0; i < this.paramCount; i++) {
                var nameId = str.readEncodedU32();
                this.paramNameIds.push(nameId);
                this.paramNames.push(pool.strings[nameId]);
            }
        }
    }
};