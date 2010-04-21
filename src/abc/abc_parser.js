Gordon.ABCParser = function(scriptName, flags, abcData) {
    this.abcData = abcData;
    this.scriptName = scriptName;
    this.flags = flags;
    this.abcfile = null;
};
Gordon.ABCParser.prototype = {
    parse: function() {
        var len, i = 0,
            abcfile = this.abcfile = new Gordon.ABCFile(this.scriptName),
            str = new Gordon.ABCStream(this.abcData);
        abcfile.minorVersion = str.readUI16();
        abcfile.majorVersion = str.readUI16();

        abcfile.constantPool = new Gordon.ABCConstantPool();
        abcfile.constantPool.parse(str);

        abcfile.methodCount = str.readEncodedU32();
        abcfile.methods = [];
        for (i=0; i < abcfile.methodCount; i++) {
            var method = new Gordon.ABCMethodSignature();
            method.parse(str, abcfile);
            abcfile.methods.push(method);
        }
        
        abcfile.metadataCount = str.readEncodedU32();
        abcfile.metadata = [];
        for (i=0; i < abcfile.metadataCount; i++) {
            var md = new Gordon.ABCMetadata();
            md.parse(str);
            abcfile.metadata.push(md);
        }
        
        abcfile.classCount = str.readEncodedU32();
        abcfile.instances = [];
        abcfile.classes = [];
        for (i=0; i < abcfile.classCount; i ++) {
            var instance = new Gordon.ABCInstance();
            instance.parse(str, abcfile);
            abcfile.instances.push(instance);
        }
        for (i=0; i < abcfile.classCount; i ++) {
            var abcClass = new Gordon.ABCClass();
            abcClass.parse(str, abcfile);
            abcfile.classes.push(abcClass);
        }
        
        abcfile.scriptCount = str.readEncodedU32();
        abcfile.scripts = [];
        for (i=0; i < abcfile.scriptCount; i++) {
            var script = new Gordon.ABCScript();
            script.parse(str, abcfile);
            abcfile.scripts.push(script);
        }
        
        abcfile.methodBodyCount = str.readEncodedU32();
        abcfile.methodBodies = [];
        for (i=0; i < abcfile.methodBodyCount; i++) {
            var methodBody = new Gordon.ABCMethodBody();
            methodBody.parse(str, abcfile);
            abcfile.methodBodies.push(methodBody);
        }
        
        if (Gordon.debug) {
            console.log(abcfile);
        }
        
        var writer = new Gordon.JSScriptWriter(abcfile, "testNS");
        
        for (i=0, len=abcfile.methods.length; i<len; i++) {
            writer.reset();
            writer.writeMethod(abcfile.methods[i], abcfile.methodBodies[i]);
            console.log(writer.script);
        }
        
        return script;
    }
};
