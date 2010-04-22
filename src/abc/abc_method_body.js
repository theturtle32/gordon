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
    this.methodSignature = null;
    this._codeByByteOffset = null;
};
Gordon.ABCMethodBody.prototype = {
    parse: function(str, abcfile) {
        var o, i, j, len, instructions, pos;
        this.methodIndex = str.readEncodedU32();
        this.maxStack = str.readEncodedU32();
        this.localCount = str.readEncodedU32();
        this.initScopeDepth = str.readEncodedU32();
        this.maxScopeDepth = str.readEncodedU32();
        
        this.codeLength = str.readEncodedU32();
        instructions = new Gordon.ABCStream(str.readString(this.codeLength));
        
        o = this.code = [];
        this._codeByByteOffset = {};
        while ((pos = instructions.tell()) < this.codeLength) {
            var operand, tempname,
                abci = Gordon.ABCInstructions,
                opcode = instructions.readUI8(),
                opcodeName = abci.byOpcode[opcode],
                operandDefs = abci.operandDefinitions[opcodeName],
                obj = {
                    name: opcodeName,
                    opcode: opcode,
                    byteOffset: pos,
                    operands: []
                };

            // If the opcode includes operands directly from the code stream,
            // read and resolve them.
            if (operandDefs) {
                for (j=0,len=operandDefs.length; j < len; j++) {
                    var operandDef = operandDefs[j];
                    operand = {
                        name: operandDef.name
                    };
                    switch (operandDef.type) {
                        case "u30":
                            operand["value"] = instructions.readEncodedU32();
                            break;
                        case "u8":
                            operand["value"] = instructions.readUI8();
                            break;
                        case "s24":
                            operand["value"] = instructions.readUI24();
                            break;
                        default:
                            throw new Error("Unknown operand type: " + operandDef.kind + " for operand name: " + operandDef.name);
                    }
                    
                    // Resolve actual object references for operands that use
                    // "index" to refer to already parsed objects.
                    if (operandDef.constantPool) {
                        tempname = operandDef.constantPool.referenceName || operandDef.name;
                        operand[tempname] =
                            abcfile.constantPool[operandDef.constantPool.poolSource][operand["value"]];
                        obj[tempname] = operand[tempname];
                    }
                    if (operandDef.abcfile) {
                        tempname = operandDef.abcfile.referenceName || operandDef.name;
                        operand[tempname] =
                            abcfile[operandDef.abcfile.poolSource][operand["value"]];
                        obj[tempname] = operand[tempname];
                    }
                    if (operandDef.method) {
                        tempname = operandDef.method.referenceName || operandDef.name;
                        operand[tempname] =
                            this[operandDef.method.poolSource][operand["value"]];
                        obj[tempname] = operand[tempname];
                    }
                    
                    obj.operands.push(operand);
                    obj[operand.name] = operand.value;
                }
                
                // Special case, where the number of inline operands is defined
                // by the "case_count" inline operand.
                if (opcodeName == "lookupswitch") {
                    for (var j=0; j < obj.case_count; j++) {
                        operand = {
                            name: "case_" + j,
                            value: instructions.readUI24()
                        };
                        obj[operand.name] = operand.value;
                        obj.operands.push(operand);
                    }
                }
            }
            o.push(obj);
            this._codeByByteOffset[obj.byteOffset] = obj;
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