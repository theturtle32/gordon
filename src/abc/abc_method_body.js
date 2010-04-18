Gordon.ABCMethodBody = function() {
    this.methodIndex = null;
    this.maxStack = null;
    this.localCount = null;
    this.initScopeDepth = null;
    this.maxScopeDepth = null;
    this.codeLength = null;
    this.opcodes = null;
    this.exceptionCount = null;
    this.exceptions = null;
    this.traitCount = null;
    this.traits = null;
};
Gordon.ABCMethodBody.prototype = {
    parse: function(str, abcfile) {
        var o, i;
        console.log("Parsing method body");
        this.methodIndex = str.readEncodedU32();
        this.maxStack = str.readEncodedU32();
        this.localCount = str.readEncodedU32();
        this.initScopeDepth = str.readEncodedU32();
        this.maxScopeDepth = str.readEncodedU32();
        
        this.codeLength = str.readEncodedU32();
        o = this.opcodes = [];
        for (i=0; i < this.codeLength; i ++) {
            var opcode = str.readUI8();
            o.push({
                name: Gordon.ABCInstructions.byOpcode[opcode],
                opcode: opcode
            });
        }
        
        this.exceptionCount = str.readEncodedU32();
        this.exceptions = [];
        for (i=0; i < this.exceptionCount; i ++) {
            var exception = new Gordon.ABCException();
            exception.parse(str);
            this.exceptions.push(exception);
        }

        this.traitCount = str.readEncodedU32();
        this.traits = [];
        for (i=0; i < this.traitCount; i ++) {
            var trait = new Gordon.ABCTrait();
            trait.parse(str, abcfile);
            this.traits.push(trait);
        }
    }
};