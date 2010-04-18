Gordon.ABCFile = function(scriptName) {
    this.scriptName = scriptName;
    this.minorVersion = null;
    this.majorVersion = null;
    this.constantPool = null;
    this.methodCount = 0;
    this.methods = [];
    this.metadataCount = 0;
    this.metadata = [];
    this.classCount = 0;
    this.instances = [];
    this.classes = [];
    this.scriptCount = 0;
    this.scripts = [];
    this.methodBodyCount = 0;
    this.methodBodies = [];
};
Gordon.ABCFile.prototype = {
    run: function() {
        
    }
};