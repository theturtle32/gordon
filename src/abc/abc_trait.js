Gordon.ABCTrait = function() {
    this.nameIndex = null;
    this.name = null;
    this.kind = null;
    this.kindDescription = null;
    this.data = {
        traitSlot: null,
        traitClass: null,
        traitFunction: null,
        traitMethod: null
    };
    this.attrs = {
        isFinal: false,
        isOverride: false,
        hasMetadata: false
    };
    this.metadataCount = null;
    this.metadata = null;
};
Gordon.extend(Gordon.ABCTrait, {
   ATTR_FINAL: 0x1,
   ATTR_OVERRIDE: 0x2,
   ATTR_METADATA: 0x4,
   TRAIT_SLOT: 0x0,
   TRAIT_METHOD: 0x1,
   TRAIT_GETTER: 0x2,
   TRAIT_SETTER: 0x3,
   TRAIT_CLASS: 0x4,
   TRAIT_FUNCTION: 0x5,
   TRAIT_CONST: 0x6
});
Gordon.ABCTrait.kindLookup = {
    0x1: "ATTR_FINAL",
    0x2: "ATTR_OVERRIDE",
    0x4: "ATTR_METADATA",
    0x0: "TRAIT_SLOT",
    0x1: "TRAIT_METHOD",
    0x2: "TRAIT_GETTER",
    0x3: "TRAIT_SETTER",
    0x4: "TRAIT_CLASS",
    0x5: "TRAIT_FUNCTION",
    0x6: "TRAIT_CONST"
};
Gordon.ABCTrait.prototype = {
    parse: function(str, abcfile) {
        var i, attr, traitType,
            c = Gordon.ABCTrait;
        this.nameIndex = str.readEncodedU32();
        this.name = abcfile.constantPool.multinames[this.nameIndex];
        this.kind = str.readUI8();
        this.kindDescription = Gordon.ABCTrait.kindLookup[(this.kind >> 4) & 0x0F];
        
        this.metadata = [];
        
        attr = (this.kind >> 4) & 0x0F;
        if (attr && Gordon.ABCTrait.ATTR_FINAL) {
            this.attrs.isFinal = true;
        }
        if (attr && Gordon.ABCTrait.ATTR_OVERRIDE) {
            this.attrs.isOverride = true;
        }
        if (attr && Gordon.ABCTrait.ATTR_METADATA) {
            this.attrs.hasMetadata = true;
        }
        
        traitType = this.kind & 0x0F;
        switch(traitType) {
            case c.TRAIT_SLOT:
            case c.TRAIT_CONST:
                this._readTraitSlot(str, abcfile);
                break;
            case c.TRAIT_CLASS:
                this._readTraitClass(str, abcfile);
                break;
            case c.TRAIT_FUNCTION:
                this._readTraitFunction(str, abcfile);
                break;
            case c.TRAIT_METHOD:
            case c.TRAIT_GETTER:
            case c.TRAIT_SETTER:
                this._readTraitMethod(str, abcfile);
                break;
            default:
                throw new Error("Unknown trait type: 0x" + traitType.toString(16));
        }

        this.metadata = [];
        if (this.attrs.hasMetadata) {
            this.metadataCount = str.readEncodedU32();
            for (i=0; i < this.metadataCount; i ++) {
                this.metadata.push(str.readEncodedU32());
            }
        }
    },
    
    // for all traits, a slotId of 0 asks the VM to assign a slotId
    _readTraitSlot: function(str, abcfile) {
        var pool = abcfile.constantPool;
        var ts = this.data.traitSlot = {
            slotId: str.readEncodedU32(),
            typeName: str.readEncodedU32(),
            value: null,
            vIndex: str.readEncodedU32(),
            vKind: null
        };
        ts.typeMultiname = pool.multinames[this.data.traitSlot.typeName];
        if (ts.vIndex != 0) {
            ts.vKind = str.readUI8();
            var cp = Gordon.ABCConstantPool;
            switch (ts.vKind) {
                case 0: // the "any" type
                    ts.value = "*";
                    break;
                case cp.CONSTANT_INT:
                    ts.value = pool.integers[ts.vIndex];
                    break;
                case cp.CONSTANT_UINT:
                    ts.value = pool.uintegers[ts.vIndex];
                    break;
                case cp.CONSTANT_DOUBLE:
                    ts.value = pool.doubles[ts.vIndex];
                    break;
                case cp.CONSTANT_UTF8:
                    ts.value = pool.strings[ts.vIndex];
                    break;
                case cp.CONSTANT_TRUE:
                    ts.value = true;
                    break;
                case cp.CONSTANT_FALSE:
                    ts.value = false;
                    break;
                case cp.CONSTANT_NULL:
                    ts.value = null;
                    break;
                case cp.CONSTANT_UNDEFINED:
                    ts.value = undefined;
                    break;
                case cp.CONSTANT_NAMESPACE:
                case cp.CONSTANT_PACKAGE_NAMESPACE:
                case cp.CONSTANT_PACKAGE_INTERNAL_NAMESPACE:
                case cp.CONSTANT_PACKAGE_PROTECTED_NAMESPACE:
                case cp.CONSTANT_EXPLICIT_NAMESPACE:
                case cp.CONSTANT_STATIC_PROTECTED_NAMESPACE:
                case cp.CONSTANT_PRIVATE_NAMESPACE:
                    ts.value = pool.namespaces[ts.vIndex];
                    break;
                default:
                    throw new Error("Unknown vKind while resolving Trait value");
            }
        }
    },
    _readTraitClass: function(str, abcfile) {
        var tc = this.data.traitClass = {
            slotId: str.readEncodedU32(),
            // classi is index into the 'classes' array of the ABCFile
            classi: str.readEncodedU32()
        };
        tc.classDef = abcfile.classes[tc.classi];
    },
    _readTraitFunction: function(str, abcfile) {
        var tf = this.data.traitFunction = {
            slotId: str.readEncodedU32(),
            // functioni is index into the 'methodSignatures' array of the ABCFile
            functioni: str.readEncodedU32()
        };
        tf.functionDef = abcfile.methodSignatures[tf.functioni];
    },
    _readTraitMethod: function(str, abcfile) {
        var tm = this.data.traitMethod = {
            /* 
                The disp_id field is a compiler assigned integer that is used
                by the AVM2 to optimize the resolution of virtual function
                calls. An overridden method must have the same disp_id as that
                of the method in the base class. A value of zero disables this
                optimization.
            */
            dispId: str.readEncodedU32(),
            // methodi is index into the 'methodSignatures' array of the ABCFile
            methodi: str.readEncodedU32()
        }
        tm.methodDef = abcfile.methodSignatures[tm.methodi];
    }
};