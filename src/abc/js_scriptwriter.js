Gordon.JSScriptWriter = function(abcfile, jsNamespace) {
    this.abcfile = abcfile;
    this.jsNamespace = jsNamespace;
    this.reset();
};
Gordon.JSScriptWriter.prototype = {
    reset: function() {
        this.script = "";
        this.indentAmount = 0;
    },
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
        scriptObj.initMethodBody = this.abcfile.methodBodies[scriptObj.init];
        this.writeMethod(scriptObj.initMethod, scriptObj.initMethodBody);
    },
    writeMethod: function(method, methodBody) {
        var i, str, w = Gordon.ABCOpcodeWriters;
        
        var params = [];
        for (i=0; i < method.paramCount; i++) {
            params.push("param"+i);
        }
        this.writeLine("function(" + params.join(",") + ") {");
        this.indent(1);
        this._writeMethodInit(methodBody);

        for (var opIndex in methodBody.code) {
            var op = methodBody.code[opIndex];
            var generator = w["gen_"+op.name];
            if (generator) {
                generator.apply(this, [op]);
            }
            else {
                this.writeLine("// " + op.name + "();");
            }
        }
        this.indent(-1);
        this.writeLine("}");
    },
    
    _writeMethodClose: function() {
        this.writeLine('opstack.release(); scopestack.release();');
    },
    
    _writeMethodInit: function(methodBody) {
        var str = "var vm = Gordon.abc.vm, " +
                  "instr = vm.instructions, " +
                  "register0 = this, ";
        // init proper number of registers
        for (var i=1; i < methodBody.localCount; i++) {
            str += ("register"+i+" = null, ");
        }
        str += "opstack = vm.Stack.getOperandStack(" + methodBody.maxStack + "), " +
               "scopestack = vm.Stack.getScopeStack(" + methodBody.maxScopeDepth + ");";
        this.writeLine(str);
    }
};