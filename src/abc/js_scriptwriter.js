Gordon.JSScriptWriter = function(abcfile, jsNamespace) {
    this.abcfile = abcfile;
    this.jsNamespace = jsNamespace;
    this.script = "";
    this.indentAmount = 0;
};
Gordon.JSScriptWriter.prototype = {
    writeClass: function(classObj) {
        
    },
    indent: function(amount) {
        this.indentAmount += amount;
    },
    writeLine: function(output) {
        for (var i=0; i < this.indentAmount; i++) {
            this.script += "  ";
        }
        this.script += (output + "\n");
    },
    writeScript: function(scriptObj) {
        var i, str;
        scriptObj.initMethodBody = this.abcfile.methodBodies[scriptObj.init];
        
        var params = [];
        for (i=0; i < scriptObj.initMethod.paramCount; i++) {
            params.push("param"+i);
        }
        this.writeLine("function(" + params.join(",") + ") {");
        this.indent(1);
        this._writeMethodInit(scriptObj.initMethodBody);

        for (var opIndex in scriptObj.initMethodBody.code) {
            var op = scriptObj.initMethodBody.code[opIndex];
            var generator = this["gen_"+op.name];
            if (generator) {
                this.writeLine(generator.apply(this, [op.operands]));
            }
            else {
                this.writeLine("// " + op.name + "();");
            }
        }
        this.indent(-1);
        this.writeLine("}");
    },
    
    _writeMethodInit: function(methodBody) {
        var str = "var vm = Gordon.abc.vm, " +
                  "register0 = this, ";
        // init proper number of registers
        for (var i=1; i < methodBody.localCount; i++) {
            str += ("register"+i+" = null, ");
        }
        str += "opstack = vm.Stack.getOperandStack(" + methodBody.maxStack + "), " +
               "scopestack = vm.Stack.getScopeStack(" + methodBody.maxScopeDepth + ");";
        this.writeLine(str);
    },
    
    // Opcode Writers
    gen_getlocal_0: function() {
        return "opstack.push(register0);";
    },
    gen_getlocal_1: function() {
        return "opstack.push(register1);";
    },
    gen_getlocal_2: function() {
        return "opstack.push(register2);";
    },
    gen_getlocal_3: function() {
        return "opstack.push(register3);";
    },
    gen_pushscope: function() {
        return "scopestack.push(opstack.pop());";
    },
    gen_popscope: function() {
        return "scopestack.pop();";
    },
    gen_initproperty: function(o) {
        var property = this.abcfile.constantPool.multinames[o[0].value];
        return "(function() { var value = opstack.pop(); var obj = opstack.pop(); obj['" + property.name + "'] = value; })();";
    }
};