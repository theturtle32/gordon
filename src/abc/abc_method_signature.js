Gordon.ABCMethodSignature = function() {
    this.paramCount = null;
    this.returnType = null;
    this.paramTypes = [];
    this.nameIndex = null;
    this.name = null;
    this.flags = null;
    this.flagByte = null;
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
            f = Gordon.ABCMethodSignature.flags,
            pool = abcfile.constantPool;
        this.paramCount = str.readEncodedU32();
        this.returnType = str.readEncodedU32();
        this.paramTypes = [];
        for (i=0; i < this.paramCount; i ++) {
            paramTypes.push(str.readEncodedU32());
        }
        this.nameIndex = str.readEncodedU32();
        this.name = pool.strings[this.nameIndex];
        this.flagByte = str.readUI8();
        this.flags = {
            needArguments: Boolean(this.flagByte & f.NEED_ARGUMENTS),
            needActivation: Boolean(this.flagByte & f.NEED_ACTIVATION),
            needRest: Boolean(this.flagByte & f.NEED_REST),
            hasOptional: Boolean(this.flagByte & f.HAS_OPTIONAL),
            setDXNS: Boolean(this.flagByte & f.SET_DXNS),
            hasParamNames: Boolean(this.flagByte & f.HAS_PARAM_NAMES)
        };
        
        this.options = [];
        if (this.flags.hasOptional) {
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
        if (this.flags.hasParamNames) {
            for (i=0; i < this.paramCount; i++) {
                var nameId = str.readEncodedU32();
                this.paramNameIds.push(nameId);
                this.paramNames.push(pool.strings[nameId]);
            }
        }
    }
};