Gordon.ABCClass = function() {
    this.classInitializerIndex = null; // cinit
    this.traitCount = null;
    this.traits = null;
};
Gordon.extend(Gordon.ABCClass, {
    CLASS_SEALED: 0x01,
    CLASS_FINAL: 0x02,
    CLASS_INTERFACE: 0x04,
    CLASS_PROTECTED_NAMESPACE: 0x08
});
Gordon.ABCClass.prototype = {
    parse: function(str, abcfile) {
        this.classInitializerIndex = str.readEncodedU32();
        this.traitCount = str.readEncodedU32();

        this.traits = [];
        for (var i=0; i < this.traitCount; i ++) {
            var trait = new Gordon.ABCTrait();
            trait.parse(str, abcfile);
            this.traits.push(trait);
        }
    }
};