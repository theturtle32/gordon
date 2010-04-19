Gordon.JSScriptWriter = function(abcfile, jsNamespace) {
    this.abcfile = abcfile;
    this.jsNamespace = jsNamespace;
    this.script = "";
};
Gordon.JSScriptWriter.prototype = {
    writeClass: function(classObj) {
        
    },
    writeScript: function(scriptObj) {
        var i;
        scriptObj.initMethodBody = this.abcfile.methodBodies[scriptObj.init];
        
        var scr = "function(";
        var params = [];
        for (i=0; i < scriptObj.initMethod.paramCount; i++) {
            params.push("param"+i);
        }
        scr += params.join(",");
        scr += ") {\n";
        scr += "  " + this._methodInit(scriptObj.initMethodBody);

        for each (var op in scriptObj.initMethodBody.code) {
            var generator = this["gen_"+op.name];
            if (generator) {
                scr += "  " + generator.apply(this, [op.operands]) + "\n";
            }
            else {
                scr += "  " + op.name + "();\n";
            }
        }
        
        scr += "}";
        console.log(scr);
    },
    
    _methodInit: function(methodBody) {
        var str = "var register0 = this, ";
        // init proper number of registers
        for (var i=1; i < methodBody.localCount; i++) {
            str += ("register"+i+" = null, ");
        }
        str += "opstack = new Array(" + methodBody.maxStack + "), " +
               "scopestack = new Array(" + methodBody.maxScopeDepth + ");\n";
        return str;
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