Gordon.ABCMethodBody = function() {
    this.methodIndex = null;
    this.maxStack = null;
    this.localCount = null;
    this.initScopeDepth = null;
    this.maxScopeDepth = null;
    this.codeLength = null;
    this.code = null;
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
        o = this.code = [];
        for (i=0; i < this.codeLength; i ++) {
            var abci = Gordon.ABCInstructions,
                opcode = str.readUI8();
            var opcodeName = abci.byOpcode[opcode];
            var opDefs = abci.operandDefinitions[opcodeName];
            var operand;
            var obj = {
                name: opcodeName,
                opcode: opcode,
                operands: []
            }
            if (opDefs) {
                for each (var operandDef in opDefs) {
                    operand = {
                        name: operandDef.name
                    };
                    switch (operandDef.type) {
                        case "u30":
                            operand["value"] = str.readEncodedU32();
                            break;
                        case "u8":
                            operand["value"] = str.readUI8();
                            break;
                        case "s24":
                            operand["value"] = str.readUI24();
                            break;
                        default:
                            throw new Error("Unknown operand type: " + operandDef.type);
                    }
                    obj.operands.push(operand);
                    i++;          
                }
                if (opcodeName == "lookupswitch") {
                    for (var j=0; j < obj.case_count; j++) {
                        operand = {
                            name: "case_" + j,
                            value: str.readUI24()
                        };
                        obj.operands.push(operand);
                    }
                }
            }
            o.push(obj);
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