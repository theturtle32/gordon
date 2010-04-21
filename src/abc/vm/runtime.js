Gordon.abc.vm.Stack = {
    scopeStackPool: [],
    opStackPool: {}, // by depth
    getScopeStack: function(maxDepth) {
        var stack;
        if (scopeStackPool.length) {
            stack = scopeStackPool.pop();
            stack.init();
            return stack;
        }
        return new Gordon.abc.vm.ScopeStack(maxDepth);
    },
    returnScopeStack: function(stack) {
        scopeStackPool.push(stack);
    },
    getOperandStack: function(maxDepth) {
        var pool;
        if (this.opStackPool[maxDepth]) {
            pool = this.opStackPool[maxDepth];
            if (pool.length) {
                var stack = pool.pop();
                stack.init();
                return stack;
            }
        }
        else {
            pool = this.opStackPool[maxDepth] = [];
        }
        return new Gordon.abc.vm.OperandStack(maxDepth);
    },
    returnOperandStack: function(stack) {
        this.opStackPool[stack.maxDepth].push(stack);
    }
}

Gordon.abc.vm.ScopeStack = function(){
    this._init();
};
Gordon.abc.vm.ScopeStack.prototype = {
    init: function() {
        this._cache = {};
        this._stack = [];
        this._cacheCount = 0;
    },
    push: function(scope) {
        this._stack.push(scope);
        this._repairCache(scope);
    },
    pop: function() {
        this._repairCache(this._stack.pop());
    },
    _repairCache: function(changedScope) {
        if (this._cacheCount == 0) { return; }
        this._cacheCount = 0;
        for (var propName in this._cache) {
            if (changedScope.hasOwnProperty(propName)) {
                delete this._cache[propName];
            }
            else {
                this._cacheCount++;
            }
        }
    },
    resolveName: function(name, skipExceptions) {
        if (this._cache.hasOwnProperty(name)) {
            return this._cache[name];
        }
        for (var i = this._stack.length - 1; i >= 0; i--) {
            var scope = this._stack[i];
            if (scope.hasOwnProperty(name)) {
                this._cacheCount++;
                return this._cache[name] = scope[name];
            }
        }
        if (!skipExceptions) {
            throw new Error("Unable to resolve property '" + name + "'");
        }
        return undefined;
    },
    release: function() {
        Gordon.abc.vm.Stack.returnScopeStack(this);
    }
};

Gordon.abc.vm.OperandStack = function(maxDepth){
    this._stack = new Array(maxDepth);
    this._pos = 0;
    this.maxDepth = maxDepth;
};
Gordon.abc.vm.OperandStack.prototype = {
    init: function() {
        this._pos = 0;
    },
    push: function(item) {
        this._stack[this._pos++] = item;
    },
    pop: function() {
        var item = this._stack[--this.pos];
        this._stack[this._pos] = undefined;
        return item;
    },
    release: function() {
        Gordon.abc.vm.Stack.returnOperandStack(this);
    }
};
