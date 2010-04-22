Gordon.ABCOpcodeWriters = {
    // Opcode Writers
    gen_getlocal_0: function() {
        this.writeLine("opstack.push(register0);");
    },
    gen_getlocal_1: function() {
        this.writeLine("opstack.push(register1);");
    },
    gen_getlocal_2: function() {
        this.writeLine("opstack.push(register2);");
    },
    gen_getlocal_3: function() {
        this.writeLine("opstack.push(register3);");
    },
    gen_setlocal_1: function() {
        this.writeLine("register1 = opstack.pop();")
    },
    gen_setlocal_2: function() {
        this.writeLine("register2 = opstack.pop();")
    },
    gen_setlocal_3: function() {
        this.writeLine("register3 = opstack.pop();")
    },
    gen_setlocal_4: function() {
        this.writeLine("register4 = opstack.pop();")
    },
    gen_pushscope: function() {
        this.writeLine("scopestack.push(opstack.pop());");
    },
    gen_popscope: function() {
        this.writeLine("scopestack.pop();");
    },
    gen_initproperty: function(o) {
        var property = this.abcfile.constantPool.multinames[o.index];
        this.writeLine("(function() { var value = opstack.pop(); var obj = opstack.pop(); obj['" + property.name + "'] = value; })();");
    },
    gen_returnvoid: function() {
        this._writeMethodClose();
    },
    gen_pushbyte: function(o) {
        this.writeLine("opstack.push(" + o.byte_value + ");");
    },
    gen_pushint: function(o) {
        this.writeLine("opstack.push(" + o.int_value + ");");
    },
    gen_pushdouble: function(o) {
        this.writeLine("opstack.push(" + o.double_value + ");");
    },
    gen_pushstring: function(o) {
        var escapedVal = o.string_value.replace(/\"/g, "\\\"");
        this.writeLine("opstack.push(\"" + escapedVal + "\");");
    },
    gen_add: function() {
        this.writeLine("opstack.push(opstack.pop() + opstack.pop());");
    }    
};
