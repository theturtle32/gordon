Gordon.ABCNamespaceSet = function() {
    this.count = null;
    this.nsIndices = [];
    this.namespaces = [];
};

Gordon.ABCNamespaceSet.prototype = {
    parse: function(str) {
        console.log("parsing namespace set");
        this.count = str.readEncodedU32();
        for (var i = 0; i < this.count; i ++) {
            this.nsIndices.push(str.readEncodedU32());
        }
    },
    resolveNamespaces: function(constantPool) {
        for (var i = 0, length = this.nsIndices.length; i < length; i++) {
            var nsIndex = this.nsIndices[i];
            this.namespaces[i] = constantPool.namespaces[nsIndex];
        }
    }
};