const PUSH_SEEN = 29;
const PUSH_DISMISSED = 27;
const PUSH_RECEIVED = 25;
! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).firebase = t()
}(this, function() {
    "use strict";

    function c(e, t) {
        if (!(t instanceof Object)) return t;
        switch (t.constructor) {
            case Date:
                const i = t;
                return new Date(i.getTime());
            case Object:
                void 0 === e && (e = {});
                break;
            case Array:
                e = [];
                break;
            default:
                return t
        }
        for (const r in t) t.hasOwnProperty(r) && "__proto__" !== r && (e[r] = c(e[r], t[r]));
        return e
    }
    class n {
        constructor() {
            this.reject = () => {}, this.resolve = () => {}, this.promise = new Promise((e, t) => {
                this.resolve = e, this.reject = t
            })
        }
        wrapCallback(i) {
            return (e, t) => {
                e ? this.reject(e) : this.resolve(t), "function" == typeof i && (this.promise.catch(() => {}), 1 === i.length ? i(e) : i(e, t))
            }
        }
    }
    class a extends Error {
        constructor(e, t, i) {
            super(t), this.code = e, this.customData = i, this.name = "FirebaseError", Object.setPrototypeOf(this, a.prototype), Error.captureStackTrace && Error.captureStackTrace(this, r.prototype.create)
        }
    }
    class r {
        constructor(e, t, i) {
            this.service = e, this.serviceName = t, this.errors = i
        }
        create(e, ...t) {
            var r, i = t[0] || {},
                n = `${this.service}/${e}`,
                s = this.errors[e],
                s = s ? (r = i, s.replace(o, (e, t) => {
                    var i = r[t];
                    return null != i ? String(i) : `<${t}?>`
                })) : "Error",
                s = `${this.serviceName}: ${s} (${n}).`;
            return new a(n, s, i)
        }
    }
    const o = /\{\$([^}]+)}/g;

    function l(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }

    function h(e, t) {
        if (e === t) return 1;
        const i = Object.keys(e),
            r = Object.keys(t);
        for (const a of i) {
            if (!r.includes(a)) return;
            var n = e[a],
                s = t[a];
            if (p(n) && p(s)) {
                if (!h(n, s)) return
            } else if (n !== s) return
        }
        for (const o of r)
            if (!i.includes(o)) return;
        return 1
    }

    function p(e) {
        return null !== e && "object" == typeof e
    }

    function i(e, t) {
        const i = new s(e, t);
        return i.subscribe.bind(i)
    }
    class s {
        constructor(e, t) {
            this.observers = [], this.unsubscribes = [], this.observerCount = 0, this.task = Promise.resolve(), this.finalized = !1, this.onNoObservers = t, this.task.then(() => {
                e(this)
            }).catch(e => {
                this.error(e)
            })
        }
        next(t) {
            this.forEachObserver(e => {
                e.next(t)
            })
        }
        error(t) {
            this.forEachObserver(e => {
                e.error(t)
            }), this.close(t)
        }
        complete() {
            this.forEachObserver(e => {
                e.complete()
            }), this.close()
        }
        subscribe(e, t, i) {
            let r;
            if (void 0 === e && void 0 === t && void 0 === i) throw new Error("Missing Observer.");
            r = function(e, t) {
                if ("object" != typeof e || null === e) return !1;
                for (const i of t)
                    if (i in e && "function" == typeof e[i]) return !0;
                return !1
            }(e, ["next", "error", "complete"]) ? e : {
                next: e,
                error: t,
                complete: i
            }, void 0 === r.next && (r.next = f), void 0 === r.error && (r.error = f), void 0 === r.complete && (r.complete = f);
            var n = this.unsubscribeOne.bind(this, this.observers.length);
            return this.finalized && this.task.then(() => {
                try {
                    this.finalError ? r.error(this.finalError) : r.complete()
                } catch (e) {}
            }), this.observers.push(r), n
        }
        unsubscribeOne(e) {
            void 0 !== this.observers && void 0 !== this.observers[e] && (delete this.observers[e], --this.observerCount, 0 === this.observerCount && void 0 !== this.onNoObservers && this.onNoObservers(this))
        }
        forEachObserver(t) {
            if (!this.finalized)
                for (let e = 0; e < this.observers.length; e++) this.sendOne(e, t)
        }
        sendOne(e, t) {
            this.task.then(() => {
                if (void 0 !== this.observers && void 0 !== this.observers[e]) try {
                    t(this.observers[e])
                } catch (e) {
                    "undefined" != typeof console && console.error && console.error(e)
                }
            })
        }
        close(e) {
            this.finalized || (this.finalized = !0, void 0 !== e && (this.finalError = e), this.task.then(() => {
                this.observers = void 0, this.onNoObservers = void 0
            }))
        }
    }

    function f() {}
    class d {
        constructor(e, t, i) {
            this.name = e, this.instanceFactory = t, this.type = i, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = "LAZY", this.onInstanceCreated = null
        }
        setInstantiationMode(e) {
            return this.instantiationMode = e, this
        }
        setMultipleInstances(e) {
            return this.multipleInstances = e, this
        }
        setServiceProps(e) {
            return this.serviceProps = e, this
        }
        setInstanceCreatedCallback(e) {
            return this.onInstanceCreated = e, this
        }
    }
    const u = "[DEFAULT]";
    class m {
        constructor(e, t) {
            this.name = e, this.container = t, this.component = null, this.instances = new Map, this.instancesDeferred = new Map, this.instancesOptions = new Map, this.onInitCallbacks = new Map
        }
        get(e) {
            var t = this.normalizeInstanceIdentifier(e);
            if (!this.instancesDeferred.has(t)) {
                const r = new n;
                if (this.instancesDeferred.set(t, r), this.isInitialized(t) || this.shouldAutoInitialize()) try {
                    var i = this.getOrInitializeService({
                        instanceIdentifier: t
                    });
                    i && r.resolve(i)
                } catch (e) {}
            }
            return this.instancesDeferred.get(t).promise
        }
        getImmediate(e) {
            var t = this.normalizeInstanceIdentifier(null == e ? void 0 : e.identifier),
                i = null !== (i = null == e ? void 0 : e.optional) && void 0 !== i && i;
            if (!this.isInitialized(t) && !this.shouldAutoInitialize()) {
                if (i) return null;
                throw Error(`Service ${this.name} is not available`)
            }
            try {
                return this.getOrInitializeService({
                    instanceIdentifier: t
                })
            } catch (e) {
                if (i) return null;
                throw e
            }
        }
        getComponent() {
            return this.component
        }
        setComponent(e) {
            if (e.name !== this.name) throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
            if (this.component) throw Error(`Component for ${this.name} has already been provided`);
            if (this.component = e, this.shouldAutoInitialize()) {
                if ("EAGER" === e.instantiationMode) try {
                    this.getOrInitializeService({
                        instanceIdentifier: u
                    })
                } catch (e) {}
                for (var [t, i] of this.instancesDeferred.entries()) {
                    t = this.normalizeInstanceIdentifier(t);
                    try {
                        var r = this.getOrInitializeService({
                            instanceIdentifier: t
                        });
                        i.resolve(r)
                    } catch (e) {}
                }
            }
        }
        clearInstance(e = u) {
            this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e)
        }
        async delete() {
            const e = Array.from(this.instances.values());
            await Promise.all([...e.filter(e => "INTERNAL" in e).map(e => e.INTERNAL.delete()), ...e.filter(e => "_delete" in e).map(e => e._delete())])
        }
        isComponentSet() {
            return null != this.component
        }
        isInitialized(e = u) {
            return this.instances.has(e)
        }
        getOptions(e = u) {
            return this.instancesOptions.get(e) || {}
        }
        initialize(e = {}) {
            var {
                options: t = {}
            } = e, i = this.normalizeInstanceIdentifier(e.instanceIdentifier);
            if (this.isInitialized(i)) throw Error(`${this.name}(${i}) has already been initialized`);
            if (!this.isComponentSet()) throw Error(`Component ${this.name} has not been registered yet`);
            var r, n, s = this.getOrInitializeService({
                instanceIdentifier: i,
                options: t
            });
            for ([r, n] of this.instancesDeferred.entries()) i === this.normalizeInstanceIdentifier(r) && n.resolve(s);
            return s
        }
        onInit(e, t) {
            var i = this.normalizeInstanceIdentifier(t);
            const r = null !== (n = this.onInitCallbacks.get(i)) && void 0 !== n ? n : new Set;
            r.add(e), this.onInitCallbacks.set(i, r);
            var n = this.instances.get(i);
            return n && e(n, i), () => {
                r.delete(e)
            }
        }
        invokeOnInitCallbacks(e, t) {
            var i = this.onInitCallbacks.get(t);
            if (i)
                for (const r of i) try {
                    r(e, t)
                } catch (e) {}
        }
        getOrInitializeService({
                                   instanceIdentifier: e,
                                   options: t = {}
                               }) {
            let i = this.instances.get(e);
            if (!i && this.component && (i = this.component.instanceFactory(this.container, {
                instanceIdentifier: (r = e) === u ? void 0 : r,
                options: t
            }), this.instances.set(e, i), this.instancesOptions.set(e, t), this.invokeOnInitCallbacks(i, e), this.component.onInstanceCreated)) try {
                this.component.onInstanceCreated(this.container, e, i)
            } catch (e) {}
            var r;
            return i || null
        }
        normalizeInstanceIdentifier(e = u) {
            return !this.component || this.component.multipleInstances ? e : u
        }
        shouldAutoInitialize() {
            return !!this.component && "EXPLICIT" !== this.component.instantiationMode
        }
    }
    class g {
        constructor(e) {
            this.name = e, this.providers = new Map
        }
        addComponent(e) {
            const t = this.getProvider(e.name);
            if (t.isComponentSet()) throw new Error(`Component ${e.name} has already been registered with ${this.name}`);
            t.setComponent(e)
        }
        addOrOverwriteComponent(e) {
            const t = this.getProvider(e.name);
            t.isComponentSet() && this.providers.delete(e.name), this.addComponent(e)
        }
        getProvider(e) {
            if (this.providers.has(e)) return this.providers.get(e);
            var t = new m(e, this);
            return this.providers.set(e, t), t
        }
        getProviders() {
            return Array.from(this.providers.values())
        }
    }
    const v = [];
    var b, e;
    (e = b = b || {})[e.DEBUG = 0] = "DEBUG", e[e.VERBOSE = 1] = "VERBOSE", e[e.INFO = 2] = "INFO", e[e.WARN = 3] = "WARN", e[e.ERROR = 4] = "ERROR", e[e.SILENT = 5] = "SILENT";
    const I = {
            debug: b.DEBUG,
            verbose: b.VERBOSE,
            info: b.INFO,
            warn: b.WARN,
            error: b.ERROR,
            silent: b.SILENT
        },
        t = b.INFO,
        E = {
            [b.DEBUG]: "log",
            [b.VERBOSE]: "log",
            [b.INFO]: "info",
            [b.WARN]: "warn",
            [b.ERROR]: "error"
        },
        y = (e, t, ...i) => {
            if (!(t < e.logLevel)) {
                var r = (new Date).toISOString(),
                    n = E[t];
                if (!n) throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);
                console[n](`[${r}]  ${e.name}:`, ...i)
            }
        };
    class _ {
        constructor(e) {
            this.name = e, this._logLevel = t, this._logHandler = y, this._userLogHandler = null, v.push(this)
        }
        get logLevel() {
            return this._logLevel
        }
        set logLevel(e) {
            if (!(e in b)) throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
            this._logLevel = e
        }
        setLogLevel(e) {
            this._logLevel = "string" == typeof e ? I[e] : e
        }
        get logHandler() {
            return this._logHandler
        }
        set logHandler(e) {
            if ("function" != typeof e) throw new TypeError("Value assigned to `logHandler` must be a function");
            this._logHandler = e
        }
        get userLogHandler() {
            return this._userLogHandler
        }
        set userLogHandler(e) {
            this._userLogHandler = e
        }
        debug(...e) {
            this._userLogHandler && this._userLogHandler(this, b.DEBUG, ...e), this._logHandler(this, b.DEBUG, ...e)
        }
        log(...e) {
            this._userLogHandler && this._userLogHandler(this, b.VERBOSE, ...e), this._logHandler(this, b.VERBOSE, ...e)
        }
        info(...e) {
            this._userLogHandler && this._userLogHandler(this, b.INFO, ...e), this._logHandler(this, b.INFO, ...e)
        }
        warn(...e) {
            this._userLogHandler && this._userLogHandler(this, b.WARN, ...e), this._logHandler(this, b.WARN, ...e)
        }
        error(...e) {
            this._userLogHandler && this._userLogHandler(this, b.ERROR, ...e), this._logHandler(this, b.ERROR, ...e)
        }
    }
    class O {
        constructor(e) {
            this.container = e
        }
        getPlatformInfoString() {
            const e = this.container.getProviders();
            return e.map(e => {
                if ("VERSION" !== (null == (t = e.getComponent()) ? void 0 : t.type)) return null;
                var t, t = e.getImmediate();
                return `${t.library}/${t.version}`
            }).filter(e => e).join(" ")
        }
    }
    const w = "@firebase/app",
        C = "0.7.13",
        N = new _("@firebase/app");
    var L;
    const A = "[DEFAULT]",
        D = {
            "@firebase/app": "fire-core",
            "@firebase/app-compat": "fire-core-compat",
            "@firebase/analytics": "fire-analytics",
            "@firebase/analytics-compat": "fire-analytics-compat",
            "@firebase/app-check": "fire-app-check",
            "@firebase/app-check-compat": "fire-app-check-compat",
            "@firebase/auth": "fire-auth",
            "@firebase/auth-compat": "fire-auth-compat",
            "@firebase/database": "fire-rtdb",
            "@firebase/database-compat": "fire-rtdb-compat",
            "@firebase/functions": "fire-fn",
            "@firebase/functions-compat": "fire-fn-compat",
            "@firebase/installations": "fire-iid",
            "@firebase/installations-compat": "fire-iid-compat",
            "@firebase/messaging": "fire-fcm",
            "@firebase/messaging-compat": "fire-fcm-compat",
            "@firebase/performance": "fire-perf",
            "@firebase/performance-compat": "fire-perf-compat",
            "@firebase/remote-config": "fire-rc",
            "@firebase/remote-config-compat": "fire-rc-compat",
            "@firebase/storage": "fire-gcs",
            "@firebase/storage-compat": "fire-gcs-compat",
            "@firebase/firestore": "fire-fst",
            "@firebase/firestore-compat": "fire-fst-compat",
            "fire-js": "fire-js",
            firebase: "fire-js-all"
        },
        S = new Map,
        R = new Map;

    function $(t, i) {
        try {
            t.container.addComponent(i)
        } catch (e) {
            N.debug(`Component ${i.name} failed to register with FirebaseApp ${t.name}`, e)
        }
    }

    function k(e, t) {
        e.container.addOrOverwriteComponent(t)
    }

    function P(e) {
        var t = e.name;
        if (R.has(t)) return N.debug(`There were multiple attempts to register component ${t}.`), !1;
        R.set(t, e);
        for (const i of S.values()) $(i, e);
        return !0
    }

    function z(e, t) {
        return e.container.getProvider(t)
    }
    const F = new r("app", "Firebase", {
        "no-app": "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",
        "bad-app-name": "Illegal App name: '{$appName}",
        "duplicate-app": "Firebase App named '{$appName}' already exists with different options or config",
        "app-deleted": "Firebase App named '{$appName}' already deleted",
        "invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance.",
        "invalid-log-argument": "First argument to `onLog` must be null or a function."
    });
    class j {
        constructor(e, t, i) {
            this._isDeleted = !1, this._options = Object.assign({}, e), this._config = Object.assign({}, t), this._name = t.name, this._automaticDataCollectionEnabled = t.automaticDataCollectionEnabled, this._container = i, this.container.addComponent(new d("app", () => this, "PUBLIC"))
        }
        get automaticDataCollectionEnabled() {
            return this.checkDestroyed(), this._automaticDataCollectionEnabled
        }
        set automaticDataCollectionEnabled(e) {
            this.checkDestroyed(), this._automaticDataCollectionEnabled = e
        }
        get name() {
            return this.checkDestroyed(), this._name
        }
        get options() {
            return this.checkDestroyed(), this._options
        }
        get config() {
            return this.checkDestroyed(), this._config
        }
        get container() {
            return this._container
        }
        get isDeleted() {
            return this._isDeleted
        }
        set isDeleted(e) {
            this._isDeleted = e
        }
        checkDestroyed() {
            if (this.isDeleted) throw F.create("app-deleted", {
                appName: this._name
            })
        }
    }
    const H = "9.6.3";

    function T(e, t = {}) {
        if ("object" != typeof t) {
            const r = t;
            t = {
                name: r
            }
        }
        var i = Object.assign({
            name: A,
            automaticDataCollectionEnabled: !1
        }, t);
        const r = i.name;
        if ("string" != typeof r || !r) throw F.create("bad-app-name", {
            appName: String(r)
        });
        var n = S.get(r);
        if (n) {
            if (h(e, n.options) && h(i, n.config)) return n;
            throw F.create("duplicate-app", {
                appName: r
            })
        }
        const s = new g(r);
        for (const a of R.values()) s.addComponent(a);
        i = new j(e, i, s);
        return S.set(r, i), i
    }
    async function M(e) {
        var t = e.name;
        S.has(t) && (S.delete(t), await Promise.all(e.container.getProviders().map(e => e.delete())), e.isDeleted = !0)
    }

    function B(e, t, i) {
        let r = null !== (s = D[e]) && void 0 !== s ? s : e;
        i && (r += `-${i}`);
        var n = r.match(/\s|\//),
            s = t.match(/\s|\//);
        if (n || s) {
            const a = [`Unable to register library "${r}" with version "${t}":`];
            return n && a.push(`library name "${r}" contains illegal characters (whitespace or "/")`), n && s && a.push("and"), s && a.push(`version name "${t}" contains illegal characters (whitespace or "/")`), void N.warn(a.join(" "))
        }
        P(new d(`${r}-version`, () => ({
            library: r,
            version: t
        }), "VERSION"))
    }

    function V(e, t) {
        if (null !== e && "function" != typeof e) throw F.create("invalid-log-argument");
        ! function(s, e) {
            for (const t of v) {
                let n = null;
                e && e.level && (n = I[e.level]), t.userLogHandler = null === s ? null : (e, t, ...i) => {
                    var r = i.map(e => {
                        if (null == e) return null;
                        if ("string" == typeof e) return e;
                        if ("number" == typeof e || "boolean" == typeof e) return e.toString();
                        if (e instanceof Error) return e.message;
                        try {
                            return JSON.stringify(e)
                        } catch (e) {
                            return null
                        }
                    }).filter(e => e).join(" ");
                    t >= (null !== n && void 0 !== n ? n : e.logLevel) && s({
                        level: b[t].toLowerCase(),
                        message: r,
                        args: i,
                        type: e.name
                    })
                }
            }
        }(e, t)
    }

    function U(e) {
        var t;
        t = e, v.forEach(e => {
            e.setLogLevel(t)
        })
    }
    L = "", P(new d("platform-logger", e => new O(e), "PRIVATE")), B(w, C, L), B(w, C, "esm2017"), B("fire-js", "");
    var x = Object.freeze({
        __proto__: null,
        SDK_VERSION: H,
        _DEFAULT_ENTRY_NAME: A,
        _addComponent: $,
        _addOrOverwriteComponent: k,
        _apps: S,
        _clearComponents: function() {
            R.clear()
        },
        _components: R,
        _getProvider: z,
        _registerComponent: P,
        _removeServiceInstance: function(e, t, i = A) {
            z(e, t).clearInstance(i)
        },
        deleteApp: M,
        getApp: function(e = A) {
            var t = S.get(e);
            if (!t) throw F.create("no-app", {
                appName: e
            });
            return t
        },
        getApps: function() {
            return Array.from(S.values())
        },
        initializeApp: T,
        onLog: V,
        registerVersion: B,
        setLogLevel: U,
        FirebaseError: a
    });
    class W {
        constructor(e, t) {
            this._delegate = e, this.firebase = t, $(e, new d("app-compat", () => this, "PUBLIC")), this.container = e.container
        }
        get automaticDataCollectionEnabled() {
            return this._delegate.automaticDataCollectionEnabled
        }
        set automaticDataCollectionEnabled(e) {
            this._delegate.automaticDataCollectionEnabled = e
        }
        get name() {
            return this._delegate.name
        }
        get options() {
            return this._delegate.options
        }
        delete() {
            return new Promise(e => {
                this._delegate.checkDestroyed(), e()
            }).then(() => (this.firebase.INTERNAL.removeApp(this.name), M(this._delegate)))
        }
        _getService(e, t = A) {
            var i;
            this._delegate.checkDestroyed();
            const r = this._delegate.container.getProvider(e);
            return r.isInitialized() || "EXPLICIT" !== (null === (i = r.getComponent()) || void 0 === i ? void 0 : i.instantiationMode) || r.initialize(), r.getImmediate({
                identifier: t
            })
        }
        _removeServiceInstance(e, t = A) {
            this._delegate.container.getProvider(e).clearInstance(t)
        }
        _addComponent(e) {
            $(this._delegate, e)
        }
        _addOrOverwriteComponent(e) {
            k(this._delegate, e)
        }
        toJSON() {
            return {
                name: this.name,
                automaticDataCollectionEnabled: this.automaticDataCollectionEnabled,
                options: this.options
            }
        }
    }
    const G = new r("app-compat", "Firebase", {
        "no-app": "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",
        "invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance."
    });

    function Y(n) {
        const s = {},
            a = {
                __esModule: !0,
                initializeApp: function(e, t = {}) {
                    var i = T(e, t);
                    if (l(s, i.name)) return s[i.name];
                    var r = new n(i, a);
                    return s[i.name] = r
                },
                app: o,
                registerVersion: B,
                setLogLevel: U,
                onLog: V,
                apps: null,
                SDK_VERSION: H,
                INTERNAL: {
                    registerComponent: function(i) {
                        const r = i.name,
                            t = r.replace("-compat", "");
                        {
                            var e;
                            P(i) && "PUBLIC" === i.type && (e = (e = o()) => {
                                if ("function" != typeof e[t]) throw G.create("invalid-app-argument", {
                                    appName: r
                                });
                                return e[t]()
                            }, void 0 !== i.serviceProps && c(e, i.serviceProps), a[t] = e, n.prototype[t] = function(...e) {
                                const t = this._getService.bind(this, r);
                                return t.apply(this, i.multipleInstances ? e : [])
                            })
                        }
                        return "PUBLIC" === i.type ? a[t] : null
                    },
                    removeApp: function(e) {
                        delete s[e]
                    },
                    useAsService: function(e, t) {
                        if ("serverAuth" === t) return null;
                        var i = t;
                        return i
                    },
                    modularAPIs: x
                }
            };

        function o(e) {
            if (e = e || A, !l(s, e)) throw G.create("no-app", {
                appName: e
            });
            return s[e]
        }
        return a.default = a, Object.defineProperty(a, "apps", {
            get: function() {
                return Object.keys(s).map(e => s[e])
            }
        }), o.App = n, a
    }
    var K = function e() {
        const t = Y(W);
        return t.INTERNAL = Object.assign(Object.assign({}, t.INTERNAL), {
            createFirebaseNamespace: e,
            extendNamespace: function(e) {
                c(t, e)
            },
            createSubscribe: i,
            ErrorFactory: r,
            deepExtend: c
        }), t
    }();
    const J = new _("@firebase/app-compat");
    if ("object" == typeof self && self.self === self && void 0 !== self.firebase) {
        J.warn(`
    Warning: Firebase is already defined in the global scope. Please make sure
    Firebase library is only loaded once.
  `);
        const Z = self.firebase.SDK_VERSION;
        Z && 0 <= Z.indexOf("LITE") && J.warn(`
    Warning: You are trying to load Firebase while using Firebase Performance standalone script.
    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.
    `)
    }
    const X = K;
    B("@firebase/app-compat", "0.1.14", void 0);
    return X.registerVersion("firebase", "9.6.3", "app-compat-cdn"), X
});
//# sourceMappingURL=firebase-app-compat.js.map
! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(require("./firebase-app-compat"), require("@firebase/app")) : "function" == typeof define && define.amd ? define(["@firebase/app-compat", "@firebase/app"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).firebase, e.firebase.INTERNAL.modularAPIs)
}(this, function(Bt, qt) {
    "use strict";
    try {
        !(function() {
            function e(e) {
                return e && "object" == typeof e && "default" in e ? e : {
                    default: e
                }
            }
            var t = e(Bt);

            function n() {
                return "object" == typeof indexedDB
            }
            class o extends Error {
                constructor(e, t, n) {
                    super(t), this.code = e, this.customData = n, this.name = "FirebaseError", Object.setPrototypeOf(this, o.prototype), Error.captureStackTrace && Error.captureStackTrace(this, i.prototype.create)
                }
            }
            class i {
                constructor(e, t, n) {
                    this.service = e, this.serviceName = t, this.errors = n
                }
                create(e, ...t) {
                    var i, n = t[0] || {},
                        a = `${this.service}/${e}`,
                        r = this.errors[e],
                        r = r ? (i = n, r.replace(s, (e, t) => {
                            var n = i[t];
                            return null != n ? String(n) : `<${t}?>`
                        })) : "Error",
                        r = `${this.serviceName}: ${r} (${a}).`;
                    return new o(a, r, n)
                }
            }
            const s = /\{\$([^}]+)}/g;

            function a(e) {
                return e && e._delegate ? e._delegate : e
            }
            class r {
                constructor(e, t, n) {
                    this.name = e, this.instanceFactory = t, this.type = n, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = "LAZY", this.onInstanceCreated = null
                }
                setInstantiationMode(e) {
                    return this.instantiationMode = e, this
                }
                setMultipleInstances(e) {
                    return this.multipleInstances = e, this
                }
                setServiceProps(e) {
                    return this.serviceProps = e, this
                }
                setInstanceCreatedCallback(e) {
                    return this.onInstanceCreated = e, this
                }
            }

            function c(n) {
                return new Promise(function(e, t) {
                    n.onsuccess = function() {
                        e(n.result)
                    }, n.onerror = function() {
                        t(n.error)
                    }
                })
            }

            function u(n, i, a) {
                var r, e = new Promise(function(e, t) {
                    c(r = n[i].apply(n, a)).then(e, t)
                });
                return e.request = r, e
            }

            function p(e, n, t) {
                t.forEach(function(t) {
                    Object.defineProperty(e.prototype, t, {
                        get: function() {
                            return this[n][t]
                        },
                        set: function(e) {
                            this[n][t] = e
                        }
                    })
                })
            }

            function d(t, n, i, e) {
                e.forEach(function(e) {
                    e in i.prototype && (t.prototype[e] = function() {
                        return u(this[n], e, arguments)
                    })
                })
            }

            function l(t, n, i, e) {
                e.forEach(function(e) {
                    e in i.prototype && (t.prototype[e] = function() {
                        return this[n][e].apply(this[n], arguments)
                    })
                })
            }

            function f(e, i, t, n) {
                n.forEach(function(n) {
                    n in t.prototype && (e.prototype[n] = function() {
                        return e = this[i], (t = u(e, n, arguments)).then(function(e) {
                            if (e) return new h(e, t.request)
                        });
                        var e, t
                    })
                })
            }

            function g(e) {
                this._index = e
            }

            function h(e, t) {
                this._cursor = e, this._request = t
            }

            function w(e) {
                this._store = e
            }

            function m(n) {
                this._tx = n, this.complete = new Promise(function(e, t) {
                    n.oncomplete = function() {
                        e()
                    }, n.onerror = function() {
                        t(n.error)
                    }, n.onabort = function() {
                        t(n.error)
                    }
                })
            }

            function y(e, t, n) {
                this._db = e, this.oldVersion = t, this.transaction = new m(n)
            }

            function b(e) {
                this._db = e
            }

            function v(e, t, n) {
                var i = u(indexedDB, "open", [e, t]),
                    a = i.request;
                return a && (a.onupgradeneeded = function(e) {
                    n && n(new y(a.result, e.oldVersion, a.transaction))
                }), i.then(function(e) {
                    return new b(e)
                })
            }

            function k(e) {
                return u(indexedDB, "deleteDatabase", [e])
            }
            p(g, "_index", ["name", "keyPath", "multiEntry", "unique"]), d(g, "_index", IDBIndex, ["get", "getKey", "getAll", "getAllKeys", "count"]), f(g, "_index", IDBIndex, ["openCursor", "openKeyCursor"]), p(h, "_cursor", ["direction", "key", "primaryKey", "value"]), d(h, "_cursor", IDBCursor, ["update", "delete"]), ["advance", "continue", "continuePrimaryKey"].forEach(function(n) {
                n in IDBCursor.prototype && (h.prototype[n] = function() {
                    var t = this,
                        e = arguments;
                    return Promise.resolve().then(function() {
                        return t._cursor[n].apply(t._cursor, e), c(t._request).then(function(e) {
                            if (e) return new h(e, t._request)
                        })
                    })
                })
            }), w.prototype.createIndex = function() {
                return new g(this._store.createIndex.apply(this._store, arguments))
            }, w.prototype.index = function() {
                return new g(this._store.index.apply(this._store, arguments))
            }, p(w, "_store", ["name", "keyPath", "indexNames", "autoIncrement"]), d(w, "_store", IDBObjectStore, ["put", "add", "delete", "clear", "get", "getAll", "getKey", "getAllKeys", "count"]), f(w, "_store", IDBObjectStore, ["openCursor", "openKeyCursor"]), l(w, "_store", IDBObjectStore, ["deleteIndex"]), m.prototype.objectStore = function() {
                return new w(this._tx.objectStore.apply(this._tx, arguments))
            }, p(m, "_tx", ["objectStoreNames", "mode"]), l(m, "_tx", IDBTransaction, ["abort"]), y.prototype.createObjectStore = function() {
                return new w(this._db.createObjectStore.apply(this._db, arguments))
            }, p(y, "_db", ["name", "version", "objectStoreNames"]), l(y, "_db", IDBDatabase, ["deleteObjectStore", "close"]), b.prototype.transaction = function() {
                return new m(this._db.transaction.apply(this._db, arguments))
            }, p(b, "_db", ["name", "version", "objectStoreNames"]), l(b, "_db", IDBDatabase, ["close"]), ["openCursor", "openKeyCursor"].forEach(function(r) {
                [w, g].forEach(function(e) {
                    r in e.prototype && (e.prototype[r.replace("open", "iterate")] = function() {
                        var e, t = (e = arguments, Array.prototype.slice.call(e)),
                            n = t[t.length - 1],
                            i = this._store || this._index,
                            a = i[r].apply(i, t.slice(0, -1));
                        a.onsuccess = function() {
                            n(a.result)
                        }
                    })
                })
            }), [g, w].forEach(function(e) {
                e.prototype.getAll || (e.prototype.getAll = function(e, n) {
                    var i = this,
                        a = [];
                    return new Promise(function(t) {
                        i.iterateCursor(e, function(e) {
                            e ? (a.push(e.value), void 0 === n || a.length != n ? e.continue() : t(a)) : t(a)
                        })
                    })
                })
            });
            var I = "@firebase/installations",
                S = "0.5.5";
            const T = 1e4,
                _ = `w:${S}`,
                C = "FIS_v2",
                j = "https://firebaseinstallations.googleapis.com/v1",
                O = 36e5;
            var D, P, A, M, E;
            const K = new i("installations", "Installations", {
                "missing-app-config-values": 'Missing App configuration value: "{$valueName}"',
                "not-registered": "Firebase Installation is not registered.",
                "installation-not-found": "Firebase Installation not found.",
                "request-failed": '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
                "app-offline": "Could not process request. Application offline.",
                "delete-pending-registration": "Can't delete installation while there is a pending registration request."
            });

            function N(e) {
                return e instanceof o && e.code.includes("request-failed")
            }

            function x({
                           projectId: e
                       }) {
                return `${j}/projects/${e}/installations`
            }

            function $(e) {
                return {
                    token: e.token,
                    requestStatus: 2,
                    expiresIn: (e = e.expiresIn, Number(e.replace("s", "000"))),
                    creationTime: Date.now()
                }
            }
            async function F(e, t) {
                var n = (await t.json()).error;
                return K.create("request-failed", {
                    requestName: e,
                    serverCode: n.code,
                    serverMessage: n.message,
                    serverStatus: n.status
                })
            }

            function B({
                           apiKey: e
                       }) {
                return new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "x-goog-api-key": e
                })
            }

            function q(e, {
                refreshToken: t
            }) {
                const n = B(e);
                return n.append("Authorization", (t = t, `${C} ${t}`)), n
            }
            async function L(e) {
                var t = await e();
                return 500 <= t.status && t.status < 600 ? e() : t
            }

            function V(t) {
                return new Promise(e => {
                    setTimeout(e, t)
                })
            }
            const R = /^[cdef][\w-]{21}$/,
                H = "";

            function W() {
                try {
                    const t = new Uint8Array(17),
                        n = self.crypto || self.msCrypto;
                    n.getRandomValues(t), t[0] = 112 + t[0] % 16;
                    var e = function(e) {
                        const t = function(e) {
                            const t = btoa(String.fromCharCode(...e));
                            return t.replace(/\+/g, "-").replace(/\//g, "_")
                        }(e);
                        return t.substr(0, 22)
                    }(t);
                    return R.test(e) ? e : H
                } catch (e) {
                    return H
                }
            }

            function U(e) {
                return `${e.appName}!${e.appId}`
            }
            const G = new Map;

            function J(e, t) {
                var n = U(e);
                z(n, t),
                    function(e, t) {
                        const n = function() {
                            !Y && "BroadcastChannel" in self && (Y = new BroadcastChannel("[Firebase] FID Change"), Y.onmessage = e => {
                                z(e.data.key, e.data.fid)
                            });
                            return Y
                        }();
                        n && n.postMessage({
                            key: e,
                            fid: t
                        });
                        0 === G.size && Y && (Y.close(), Y = null)
                    }(n, t)
            }

            function z(e, t) {
                var n = G.get(e);
                if (n)
                    for (const i of n) i(t)
            }
            let Y = null;
            const Q = "firebase-installations-store";
            let Z = null;

            function X() {
                return Z = Z || v("firebase-installations-database", 1, e => {
                    0 === e.oldVersion && e.createObjectStore(Q)
                }), Z
            }
            async function ee(e, t) {
                var n = U(e);
                const i = await X(),
                    a = i.transaction(Q, "readwrite"),
                    r = a.objectStore(Q);
                var o = await r.get(n);
                return await r.put(t, n), await a.complete, o && o.fid === t.fid || J(e, t.fid), t
            }
            async function te(e) {
                var t = U(e);
                const n = await X(),
                    i = n.transaction(Q, "readwrite");
                await i.objectStore(Q).delete(t), await i.complete
            }
            async function ne(e, t) {
                var n = U(e);
                const i = await X(),
                    a = i.transaction(Q, "readwrite"),
                    r = a.objectStore(Q);
                var o = await r.get(n),
                    s = t(o);
                return void 0 === s ? await r.delete(n) : await r.put(s, n), await a.complete, !s || o && o.fid === s.fid || J(e, s.fid), s
            }
            async function ie(n) {
                let i;
                var e = await ne(n, e => {
                    var t = re(e || {
                            fid: W(),
                            registrationStatus: 0
                        }),
                        t = function(e, t) {
                            {
                                if (0 !== t.registrationStatus) return 1 === t.registrationStatus ? {
                                    installationEntry: t,
                                    registrationPromise: async function(e) {
                                        let t = await ae(e);
                                        for (; 1 === t.registrationStatus;) await V(100), t = await ae(e);
                                        if (0 !== t.registrationStatus) return t;
                                        {
                                            var {
                                                installationEntry: n,
                                                registrationPromise: i
                                            } = await ie(e);
                                            return i || n
                                        }
                                    }(e)
                                } : {
                                    installationEntry: t
                                };
                                if (!navigator.onLine) {
                                    var n = Promise.reject(K.create("app-offline"));
                                    return {
                                        installationEntry: t,
                                        registrationPromise: n
                                    }
                                }
                                var i = {
                                        fid: t.fid,
                                        registrationStatus: 1,
                                        registrationTime: Date.now()
                                    },
                                    n = async function(t, n) {
                                        try {
                                            var e = await async function(e, {
                                                fid: t
                                            }) {
                                                const n = x(e);
                                                var i = B(e),
                                                    a = {
                                                        fid: t,
                                                        authVersion: C,
                                                        appId: e.appId,
                                                        sdkVersion: _
                                                    };
                                                const r = {
                                                        method: "POST",
                                                        headers: i,
                                                        body: JSON.stringify(a)
                                                    },
                                                    o = await L(() => fetch(n, r));
                                                if (o.ok) {
                                                    a = await o.json();
                                                    return {
                                                        fid: a.fid || t,
                                                        registrationStatus: 2,
                                                        refreshToken: a.refreshToken,
                                                        authToken: $(a.authToken)
                                                    }
                                                }
                                                throw await F("Create Installation", o)
                                            }(t, n);
                                            return ee(t, e)
                                        } catch (e) {
                                            throw N(e) && 409 === e.customData.serverCode ? await te(t) : await ee(t, {
                                                fid: n.fid,
                                                registrationStatus: 0
                                            }), e
                                        }
                                    }(e, i);
                                return {
                                    installationEntry: i,
                                    registrationPromise: n
                                }
                            }
                        }(n, t);
                    return i = t.registrationPromise, t.installationEntry
                });
                return e.fid === H ? {
                    installationEntry: await i
                } : {
                    installationEntry: e,
                    registrationPromise: i
                }
            }

            function ae(e) {
                return ne(e, e => {
                    if (!e) throw K.create("installation-not-found");
                    return re(e)
                })
            }

            function re(e) {
                return 1 === (t = e).registrationStatus && t.registrationTime + T < Date.now() ? {
                    fid: e.fid,
                    registrationStatus: 0
                } : e;
                var t
            }
            async function oe({
                                  appConfig: e,
                                  platformLoggerProvider: t
                              }, n) {
                const i = ([a, r] = [e, n["fid"]], `${x(a)}/${r}/authTokens:generate`);
                var a, r;
                const o = q(e, n),
                    s = t.getImmediate({
                        optional: !0
                    });
                s && o.append("x-firebase-client", s.getPlatformInfoString());
                var c = {
                    installation: {
                        sdkVersion: _
                    }
                };
                const u = {
                        method: "POST",
                        headers: o,
                        body: JSON.stringify(c)
                    },
                    p = await L(() => fetch(i, u));
                if (p.ok) return $(await p.json());
                throw await F("Generate Auth Token", p)
            }
            async function se(i, a = !1) {
                let r;
                var e = await ne(i.appConfig, e => {
                    if (!ue(e)) throw K.create("not-registered");
                    var t, n = e.authToken;
                    if (a || 2 !== (t = n).requestStatus || function(e) {
                        var t = Date.now();
                        return t < e.creationTime || e.creationTime + e.expiresIn < t + O
                    }(t)) {
                        if (1 === n.requestStatus) return r = async function(e, t) {
                            let n = await ce(e.appConfig);
                            for (; 1 === n.authToken.requestStatus;) await V(100), n = await ce(e.appConfig);
                            var i = n.authToken;
                            return 0 === i.requestStatus ? se(e, t) : i
                        }(i, a), e;
                        if (!navigator.onLine) throw K.create("app-offline");
                        n = (t = e, n = {
                            requestStatus: 1,
                            requestTime: Date.now()
                        }, Object.assign(Object.assign({}, t), {
                            authToken: n
                        }));
                        return r = async function(t, n) {
                            try {
                                var i = await oe(t, n),
                                    e = Object.assign(Object.assign({}, n), {
                                        authToken: i
                                    });
                                return await ee(t.appConfig, e), i
                            } catch (e) {
                                throw !N(e) || 401 !== e.customData.serverCode && 404 !== e.customData.serverCode ? (i = Object.assign(Object.assign({}, n), {
                                    authToken: {
                                        requestStatus: 0
                                    }
                                }), await ee(t.appConfig, i)) : await te(t.appConfig), e
                            }
                        }(i, n), n
                    }
                    return e
                });
                return r ? await r : e.authToken
            }

            function ce(e) {
                return ne(e, e => {
                    if (!ue(e)) throw K.create("not-registered");
                    var t, n = e.authToken;
                    return 1 === (t = n).requestStatus && t.requestTime + T < Date.now() ? Object.assign(Object.assign({}, e), {
                        authToken: {
                            requestStatus: 0
                        }
                    }) : e
                })
            }

            function ue(e) {
                return void 0 !== e && 2 === e.registrationStatus
            }
            async function pe(e, t = !1) {
                var n, i = e;
                return e = i.appConfig, await ((n = (await ie(e)).registrationPromise) && await n), (await se(i, t)).token
            }

            function de(e) {
                return K.create("missing-app-config-values", {
                    valueName: e
                })
            }
            const le = "installations",
                fe = e => {
                    var t = e.getProvider("app").getImmediate();
                    return {
                        app: t,
                        appConfig: function(e) {
                            if (!e || !e.options) throw de("App Configuration");
                            if (!e.name) throw de("App Name");
                            for (const t of ["projectId", "apiKey", "appId"])
                                if (!e.options[t]) throw de(t);
                            return {
                                appName: e.name,
                                projectId: e.options.projectId,
                                apiKey: e.options.apiKey,
                                appId: e.options.appId
                            }
                        }(t),
                        platformLoggerProvider: qt._getProvider(t, "platform-logger"),
                        _delete: () => Promise.resolve()
                    }
                },
                ge = e => {
                    var t = e.getProvider("app").getImmediate();
                    const n = qt._getProvider(t, le).getImmediate();
                    return {
                        getId: () => async function(e) {
                            var t = e;
                            const {
                                installationEntry: n,
                                registrationPromise: i
                            } = await ie(t.appConfig);
                            return (i || se(t)).catch(console.error), n.fid
                        }(n),
                        getToken: e => pe(n, e)
                    }
                };
            qt._registerComponent(new r(le, fe, "PUBLIC")), qt._registerComponent(new r("installations-internal", ge, "PRIVATE")), qt.registerVersion(I, S), qt.registerVersion(I, S, "esm2017");
            const he = "firebase-messaging-sw.js",
                we = "/firebase-cloud-messaging-push-scope",
                me = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",
                ye = "https://fcmregistrations.googleapis.com/v1",
                be = "google.c.a.c_id",
                ve = "google.c.a.e";

            function ke(e) {
                var t = new Uint8Array(e);
                const n = btoa(String.fromCharCode(...t));
                return n.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
            }(D = E = E || {})[D.DATA_MESSAGE = 1] = "DATA_MESSAGE", D[D.DISPLAY_NOTIFICATION = 3] = "DISPLAY_NOTIFICATION", (E = P = P || {}).PUSH_RECEIVED = "push-received", E.NOTIFICATION_CLICKED = "notification-clicked";
            const Ie = "fcm_token_details_db",
                Se = "fcm_token_object_Store";
            async function Te(r) {
                if ("databases" in indexedDB) {
                    const t = await indexedDB.databases(),
                        n = t.map(e => e.name);
                    if (!n.includes(Ie)) return null
                }
                let o = null;
                const e = await v(Ie, 5, async e => {
                    var t;
                    if (!(e.oldVersion < 2) && e.objectStoreNames.contains(Se)) {
                        const a = e.transaction.objectStore(Se);
                        var n, i = await a.index("fcmSenderId").get(r);
                        await a.clear(), i && (2 === e.oldVersion ? (n = i).auth && n.p256dh && n.endpoint && (o = {
                            token: n.fcmToken,
                            createTime: null !== (t = n.createTime) && void 0 !== t ? t : Date.now(),
                            subscriptionOptions: {
                                auth: n.auth,
                                p256dh: n.p256dh,
                                endpoint: n.endpoint,
                                swScope: n.swScope,
                                vapidKey: "string" == typeof n.vapidKey ? n.vapidKey : ke(n.vapidKey)
                            }
                        }) : 3 === e.oldVersion ? (n = i, o = {
                            token: n.fcmToken,
                            createTime: n.createTime,
                            subscriptionOptions: {
                                auth: ke(n.auth),
                                p256dh: ke(n.p256dh),
                                endpoint: n.endpoint,
                                swScope: n.swScope,
                                vapidKey: ke(n.vapidKey)
                            }
                        }) : 4 === e.oldVersion && (i = i, o = {
                            token: i.fcmToken,
                            createTime: i.createTime,
                            subscriptionOptions: {
                                auth: ke(i.auth),
                                p256dh: ke(i.p256dh),
                                endpoint: i.endpoint,
                                swScope: i.swScope,
                                vapidKey: ke(i.vapidKey)
                            }
                        }))
                    }
                });
                return e.close(), await k(Ie), await k("fcm_vapid_details_db"), await k("undefined"),
                    function(e) {
                        if (!e || !e.subscriptionOptions) return !1;
                        var t = e["subscriptionOptions"];
                        return "number" == typeof e.createTime && 0 < e.createTime && "string" == typeof e.token && 0 < e.token.length && "string" == typeof t.auth && 0 < t.auth.length && "string" == typeof t.p256dh && 0 < t.p256dh.length && "string" == typeof t.endpoint && 0 < t.endpoint.length && "string" == typeof t.swScope && 0 < t.swScope.length && "string" == typeof t.vapidKey && 0 < t.vapidKey.length
                    }(o) ? o : null
            }
            const _e = "firebase-messaging-database",
                Ce = 1,
                je = "firebase-messaging-store";
            let Oe = null;

            function De() {
                return Oe = Oe || v(_e, Ce, e => {
                    0 === e.oldVersion && e.createObjectStore(je)
                }), Oe
            }
            async function Pe(e) {
                var t = Me(e);
                const n = await De();
                t = await n.transaction(je).objectStore(je).get(t);
                if (t) return t;
                t = await Te(e.appConfig.senderId);
                return t ? (await Ae(e, t), t) : void 0
            }
            async function Ae(e, t) {
                var n = Me(e);
                const i = await De(),
                    a = i.transaction(je, "readwrite");
                return await a.objectStore(je).put(t, n), await a.complete, t
            }

            function Me({
                            appConfig: e
                        }) {
                return e.appId
            }
            const Ee = new i("messaging", "Messaging", {
                "missing-app-config-values": 'Missing App configuration value: "{$valueName}"',
                "only-available-in-window": "This method is available in a Window context.",
                "only-available-in-sw": "This method is available in a service worker context.",
                "permission-default": "The notification permission was not granted and dismissed instead.",
                "permission-blocked": "The notification permission was not granted and blocked instead.",
                "unsupported-browser": "This browser doesn't support the API's required to use the Firebase SDK.",
                "indexed-db-unsupported": "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
                "failed-service-worker-registration": "We are unable to register the default service worker. {$browserErrorMessage}",
                "token-subscribe-failed": "A problem occurred while subscribing the user to FCM: {$errorInfo}",
                "token-subscribe-no-token": "FCM returned no token when subscribing the user to push.",
                "token-unsubscribe-failed": "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
                "token-update-failed": "A problem occurred while updating the user from FCM: {$errorInfo}",
                "token-update-no-token": "FCM returned no token when updating the user to push.",
                "use-sw-after-get-token": "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
                "invalid-sw-registration": "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
                "invalid-bg-handler": "The input to setBackgroundMessageHandler() must be a function.",
                "invalid-vapid-key": "The public VAPID key must be a string.",
                "use-vapid-key-after-get-token": "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."
            });
            async function Ke(e, t) {
                var n = {
                    method: "DELETE",
                    headers: await xe(e)
                };
                try {
                    const r = await fetch(`${Ne(e.appConfig)}/${t}`, n);
                    var i = await r.json();
                    if (i.error) {
                        var a = i.error.message;
                        throw Ee.create("token-unsubscribe-failed", {
                            errorInfo: a
                        })
                    }
                } catch (e) {
                    throw Ee.create("token-unsubscribe-failed", {
                        errorInfo: e
                    })
                }
            }

            function Ne({
                            projectId: e
                        }) {
                return `${ye}/projects/${e}/registrations`
            }
            async function xe({
                                  appConfig: e,
                                  installations: t
                              }) {
                var n = await t.getToken();
                return new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "x-goog-api-key": e.apiKey,
                    "x-goog-firebase-installations-auth": `FIS ${n}`
                })
            }

            function $e({
                            p256dh: e,
                            auth: t,
                            endpoint: n,
                            vapidKey: i
                        }) {
                const a = {
                    web: {
                        endpoint: n,
                        auth: t,
                        p256dh: e
                    }
                };
                return i !== me && (a.web.applicationPubKey = i), a
            }
            const Fe = 6048e5;
            async function Be(e) {
                const t = await async function(e, t) {
                    var n = await e.pushManager.getSubscription();
                    if (n) return n;
                    return e.pushManager.subscribe({
                        userVisibleOnly: !0,
                        applicationServerKey: function(e) {
                            var t = (e + "=".repeat((4 - e.length % 4) % 4)).replace(/\-/g, "+").replace(/_/g, "/");
                            const n = atob(t),
                                i = new Uint8Array(n.length);
                            for (let a = 0; a < n.length; ++a) i[a] = n.charCodeAt(a);
                            return i
                        }(t)
                    })
                }(e.swRegistration, e.vapidKey);
                var n, i, a, r, o, s = {
                        vapidKey: e.vapidKey,
                        swScope: e.swRegistration.scope,
                        endpoint: t.endpoint,
                        auth: ke(t.getKey("auth")),
                        p256dh: ke(t.getKey("p256dh"))
                    },
                    c = await Pe(e.firebaseDependencies);
                if (c) {
                    if (n = c.subscriptionOptions, i = s.vapidKey === n.vapidKey, a = s.endpoint === n.endpoint, r = s.auth === n.auth, o = s.p256dh === n.p256dh, i && a && r && o) return Date.now() >= c.createTime + Fe ? async function(t, e) {
                        try {
                            var n = await async function(e, t) {
                                var n = await xe(e),
                                    i = $e(t.subscriptionOptions),
                                    i = {
                                        method: "PATCH",
                                        headers: n,
                                        body: JSON.stringify(i)
                                    };
                                let a;
                                try {
                                    const r = await fetch(`${Ne(e.appConfig)}/${t.token}`, i);
                                    a = await r.json()
                                } catch (e) {
                                    throw Ee.create("token-update-failed", {
                                        errorInfo: e
                                    })
                                }
                                if (a.error) {
                                    i = a.error.message;
                                    throw Ee.create("token-update-failed", {
                                        errorInfo: i
                                    })
                                }
                                if (!a.token) throw Ee.create("token-update-no-token");
                                return a.token
                            }(t.firebaseDependencies, e), i = Object.assign(Object.assign({}, e), {
                                token: n,
                                createTime: Date.now()
                            });
                            return await Ae(t.firebaseDependencies, i), n
                        } catch (e) {
                            throw await qe(t), e
                        }
                    }(e, {
                        token: c.token,
                        createTime: Date.now(),
                        subscriptionOptions: s
                    }): c.token;
                    try {
                        await Ke(e.firebaseDependencies, c.token)
                    } catch (e) {
                        console.warn(e)
                    }
                    return Le(e.firebaseDependencies, s)
                }
                return Le(e.firebaseDependencies, s)
            }
            async function qe(e) {
                var t = await Pe(e.firebaseDependencies);
                t && (await Ke(e.firebaseDependencies, t.token), await async function(e) {
                    var t = Me(e);
                    const n = await De(),
                        i = n.transaction(je, "readwrite");
                    await i.objectStore(je).delete(t), await i.complete
                }(e.firebaseDependencies));
                const n = await e.swRegistration.pushManager.getSubscription();
                return !n || n.unsubscribe()
            }
            async function Le(e, t) {
                var n = {
                    token: await async function(e, t) {
                        var n = await xe(e),
                            i = $e(t),
                            i = {
                                method: "POST",
                                headers: n,
                                body: JSON.stringify(i)
                            };
                        let a;
                        try {
                            const r = await fetch(Ne(e.appConfig), i);
                            a = await r.json()
                        } catch (e) {
                            throw Ee.create("token-subscribe-failed", {
                                errorInfo: e
                            })
                        }
                        if (a.error) {
                            i = a.error.message;
                            throw Ee.create("token-subscribe-failed", {
                                errorInfo: i
                            })
                        }
                        if (!a.token) throw Ee.create("token-subscribe-no-token");
                        return a.token
                    }(e, t),
                    createTime: Date.now(),
                    subscriptionOptions: t
                };
                return await Ae(e, n), n.token
            }

            function Ve(e) {
                var t, n, i, a = {
                    from: e.from,
                    collapseKey: e.collapse_key,
                    messageId: e.fcmMessageId
                };
                return n = a, (t = e).notification && (n.notification = {}, (i = t.notification.title) && (n.notification.title = i), (i = t.notification.body) && (n.notification.body = i), (i = t.notification.image) && (n.notification.image = i)), t = a, (n = e).data && (t.data = n.data), n = a, (e = e).fcmOptions && (n.fcmOptions = {}, (i = e.fcmOptions.link) && (n.fcmOptions.link = i), (i = e.fcmOptions.analytics_label) && (n.fcmOptions.analyticsLabel = i)), a
            }

            function Re(e, t) {
                const n = [];
                for (let i = 0; i < e.length; i++) n.push(e.charAt(i)), i < t.length && n.push(t.charAt(i));
                return n.join("")
            }

            function He(e) {
                return Ee.create("missing-app-config-values", {
                    valueName: e
                })
            }
            Re("hts/frbslgigp.ogepscmv/ieo/eaylg", "tp:/ieaeogn-agolai.o/1frlglgc/o"), Re("AzSCbw63g1R0nCw85jG8", "Iaya3yLKwmgvh7cF0q4");
            class We {
                constructor(e, t, n) {
                    this.deliveryMetricsExportedToBigQueryEnabled = !1, this.onBackgroundMessageHandler = null, this.onMessageHandler = null, this.logEvents = [], this.isLogServiceStarted = !1;
                    var i = function(e) {
                        if (!e || !e.options) throw He("App Configuration Object");
                        if (!e.name) throw He("App Name");
                        var t = e["options"];
                        for (const n of ["projectId", "apiKey", "appId", "messagingSenderId"])
                            if (!t[n]) throw He(n);
                        return {
                            appName: e.name,
                            projectId: t.projectId,
                            apiKey: t.apiKey,
                            appId: t.appId,
                            senderId: t.messagingSenderId
                        }
                    }(e);
                    this.firebaseDependencies = {
                        app: e,
                        appConfig: i,
                        installations: t,
                        analyticsProvider: n
                    }
                }
                _delete() {
                    return Promise.resolve()
                }
            }
            async function Ue(e) {
                try {
                    e.swRegistration = await navigator.serviceWorker.register(he, {
                        scope: we
                    }), e.swRegistration.update().catch(() => {})
                } catch (e) {
                    throw Ee.create("failed-service-worker-registration", {
                        browserErrorMessage: e.message
                    })
                }
            }
            async function Ge(e, t) {
                if (!navigator) throw Ee.create("only-available-in-window");
                if ("default" === Notification.permission && await Notification.requestPermission(), "granted" !== Notification.permission) throw Ee.create("permission-blocked");
                var n, i;
                return n = e, await ((i = null == t ? void 0 : t.vapidKey) ? n.vapidKey = i : n.vapidKey || (n.vapidKey = me)), await async function(e, t) {
                    if (t || e.swRegistration || await Ue(e), t || !e.swRegistration) {
                        if (!(t instanceof ServiceWorkerRegistration)) throw Ee.create("invalid-sw-registration");
                        e.swRegistration = t
                    }
                }(e, null == t ? void 0 : t.serviceWorkerRegistration), Be(e)
            }
            async function Je(e, t, n) {
                var i = function(e) {
                    switch (e) {
                        case P.NOTIFICATION_CLICKED:
                            return "notification_open";
                        case P.PUSH_RECEIVED:
                            return "notification_foreground";
                        default:
                            throw new Error
                    }
                }(t);
                const a = await e.firebaseDependencies.analyticsProvider.get();
                a.logEvent(i, {
                    message_id: n[be],
                    message_name: n["google.c.a.c_l"],
                    message_time: n["google.c.a.ts"],
                    message_device_time: Math.floor(Date.now() / 1e3)
                })
            }
            async function ze(e, t) {
                var n, i = t.data;
                i.isFirebaseMessaging && (e.onMessageHandler && i.messageType === P.PUSH_RECEIVED && ("function" == typeof e.onMessageHandler ? e.onMessageHandler(Ve(i)) : e.onMessageHandler.next(Ve(i))), n = i.data, "object" == typeof(t = n) && t && be in t && "1" === n[ve] && await Je(e, i.messageType, n))
            }
            const Ye = "@firebase/messaging",
                Qe = e => {
                    const t = new We(e.getProvider("app").getImmediate(), e.getProvider("installations-internal").getImmediate(), e.getProvider("analytics-internal"));
                    return navigator.serviceWorker.addEventListener("message", e => ze(t, e)), t
                },
                Ze = e => {
                    const t = e.getProvider("messaging").getImmediate();
                    return {
                        getToken: e => Ge(t, e)
                    }
                };

            function Xe(e) {
                return async function(e) {
                    if (!navigator) throw Ee.create("only-available-in-window");
                    return e.swRegistration || await Ue(e), qe(e)
                }(e = a(e))
            }

            function et(e, t) {
                return function(e, t) {
                    if (!navigator) throw Ee.create("only-available-in-window");
                    return e.onMessageHandler = t, () => {
                        e.onMessageHandler = null
                    }
                }(e = a(e), t)
            }
            qt._registerComponent(new r("messaging", Qe, "PUBLIC")), qt._registerComponent(new r("messaging-internal", Ze, "PRIVATE")), qt.registerVersion(Ye, "0.9.6"), qt.registerVersion(Ye, "0.9.6", "esm2017");
            const tt = "BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",
                nt = "https://fcmregistrations.googleapis.com/v1",
                it = "FCM_MSG",
                at = "google.c.a.c_id",
                rt = 3,
                ot = 1;

            function st(e) {
                var t = new Uint8Array(e);
                const n = btoa(String.fromCharCode(...t));
                return n.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
            }(E = A = A || {})[E.DATA_MESSAGE = 1] = "DATA_MESSAGE", E[E.DISPLAY_NOTIFICATION = 3] = "DISPLAY_NOTIFICATION", (E = M = M || {}).PUSH_RECEIVED = "push-received", E.NOTIFICATION_CLICKED = "notification-clicked";
            const ct = "fcm_token_details_db",
                ut = "fcm_token_object_Store";
            async function pt(r) {
                if ("databases" in indexedDB) {
                    const t = await indexedDB.databases(),
                        n = t.map(e => e.name);
                    if (!n.includes(ct)) return null
                }
                let o = null;
                const e = await v(ct, 5, async e => {
                    var t;
                    if (!(e.oldVersion < 2) && e.objectStoreNames.contains(ut)) {
                        const a = e.transaction.objectStore(ut);
                        var n, i = await a.index("fcmSenderId").get(r);
                        await a.clear(), i && (2 === e.oldVersion ? (n = i).auth && n.p256dh && n.endpoint && (o = {
                            token: n.fcmToken,
                            createTime: null !== (t = n.createTime) && void 0 !== t ? t : Date.now(),
                            subscriptionOptions: {
                                auth: n.auth,
                                p256dh: n.p256dh,
                                endpoint: n.endpoint,
                                swScope: n.swScope,
                                vapidKey: "string" == typeof n.vapidKey ? n.vapidKey : st(n.vapidKey)
                            }
                        }) : 3 === e.oldVersion ? (n = i, o = {
                            token: n.fcmToken,
                            createTime: n.createTime,
                            subscriptionOptions: {
                                auth: st(n.auth),
                                p256dh: st(n.p256dh),
                                endpoint: n.endpoint,
                                swScope: n.swScope,
                                vapidKey: st(n.vapidKey)
                            }
                        }) : 4 === e.oldVersion && (i = i, o = {
                            token: i.fcmToken,
                            createTime: i.createTime,
                            subscriptionOptions: {
                                auth: st(i.auth),
                                p256dh: st(i.p256dh),
                                endpoint: i.endpoint,
                                swScope: i.swScope,
                                vapidKey: st(i.vapidKey)
                            }
                        }))
                    }
                });
                return e.close(), await k(ct), await k("fcm_vapid_details_db"), await k("undefined"),
                    function(e) {
                        if (!e || !e.subscriptionOptions) return !1;
                        var t = e["subscriptionOptions"];
                        return "number" == typeof e.createTime && 0 < e.createTime && "string" == typeof e.token && 0 < e.token.length && "string" == typeof t.auth && 0 < t.auth.length && "string" == typeof t.p256dh && 0 < t.p256dh.length && "string" == typeof t.endpoint && 0 < t.endpoint.length && "string" == typeof t.swScope && 0 < t.swScope.length && "string" == typeof t.vapidKey && 0 < t.vapidKey.length
                    }(o) ? o : null
            }
            const dt = "firebase-messaging-database",
                lt = 1,
                ft = "firebase-messaging-store";
            let gt = null;

            function ht() {
                return gt = gt || v(dt, lt, e => {
                    0 === e.oldVersion && e.createObjectStore(ft)
                }), gt
            }
            async function wt(e) {
                var t = yt(e);
                const n = await ht();
                t = await n.transaction(ft).objectStore(ft).get(t);
                if (t) return t;
                t = await pt(e.appConfig.senderId);
                return t ? (await mt(e, t), t) : void 0
            }
            async function mt(e, t) {
                var n = yt(e);
                const i = await ht(),
                    a = i.transaction(ft, "readwrite");
                return await a.objectStore(ft).put(t, n), await a.complete, t
            }

            function yt({
                            appConfig: e
                        }) {
                return e.appId
            }
            const bt = new i("messaging", "Messaging", {
                "missing-app-config-values": 'Missing App configuration value: "{$valueName}"',
                "only-available-in-window": "This method is available in a Window context.",
                "only-available-in-sw": "This method is available in a service worker context.",
                "permission-default": "The notification permission was not granted and dismissed instead.",
                "permission-blocked": "The notification permission was not granted and blocked instead.",
                "unsupported-browser": "This browser doesn't support the API's required to use the Firebase SDK.",
                "indexed-db-unsupported": "This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)",
                "failed-service-worker-registration": "We are unable to register the default service worker. {$browserErrorMessage}",
                "token-subscribe-failed": "A problem occurred while subscribing the user to FCM: {$errorInfo}",
                "token-subscribe-no-token": "FCM returned no token when subscribing the user to push.",
                "token-unsubscribe-failed": "A problem occurred while unsubscribing the user from FCM: {$errorInfo}",
                "token-update-failed": "A problem occurred while updating the user from FCM: {$errorInfo}",
                "token-update-no-token": "FCM returned no token when updating the user to push.",
                "use-sw-after-get-token": "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.",
                "invalid-sw-registration": "The input to useServiceWorker() must be a ServiceWorkerRegistration.",
                "invalid-bg-handler": "The input to setBackgroundMessageHandler() must be a function.",
                "invalid-vapid-key": "The public VAPID key must be a string.",
                "use-vapid-key-after-get-token": "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."
            });
            async function vt(e, t) {
                var n = {
                    method: "DELETE",
                    headers: await It(e)
                };
                try {
                    const r = await fetch(`${kt(e.appConfig)}/${t}`, n);
                    var i = await r.json();
                    if (i.error) {
                        var a = i.error.message;
                        throw bt.create("token-unsubscribe-failed", {
                            errorInfo: a
                        })
                    }
                } catch (e) {
                    throw bt.create("token-unsubscribe-failed", {
                        errorInfo: e
                    })
                }
            }

            function kt({
                            projectId: e
                        }) {
                return `${nt}/projects/${e}/registrations`
            }
            async function It({
                                  appConfig: e,
                                  installations: t
                              }) {
                var n = await t.getToken();
                return new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "x-goog-api-key": e.apiKey,
                    "x-goog-firebase-installations-auth": `FIS ${n}`
                })
            }

            function St({
                            p256dh: e,
                            auth: t,
                            endpoint: n,
                            vapidKey: i
                        }) {
                const a = {
                    web: {
                        endpoint: n,
                        auth: t,
                        p256dh: e
                    }
                };
                return i !== tt && (a.web.applicationPubKey = i), a
            }
            async function Tt(e) {
                const t = await async function(e, t) {
                    var n = await e.pushManager.getSubscription();
                    if (n) return n;
                    return e.pushManager.subscribe({
                        userVisibleOnly: !0,
                        applicationServerKey: function(e) {
                            var t = (e + "=".repeat((4 - e.length % 4) % 4)).replace(/\-/g, "+").replace(/_/g, "/");
                            const n = atob(t),
                                i = new Uint8Array(n.length);
                            for (let a = 0; a < n.length; ++a) i[a] = n.charCodeAt(a);
                            return i
                        }(t)
                    })
                }(e.swRegistration, e.vapidKey);
                var n, i, a, r, o, s = {
                        vapidKey: e.vapidKey,
                        swScope: e.swRegistration.scope,
                        endpoint: t.endpoint,
                        auth: st(t.getKey("auth")),
                        p256dh: st(t.getKey("p256dh"))
                    },
                    c = await wt(e.firebaseDependencies);
                if (c) {
                    if (n = c.subscriptionOptions, i = s.vapidKey === n.vapidKey, a = s.endpoint === n.endpoint, r = s.auth === n.auth, o = s.p256dh === n.p256dh, i && a && r && o) return Date.now() >= c.createTime + 6048e5 ? async function(t, e) {
                        try {
                            var n = await async function(e, t) {
                                var n = await It(e),
                                    i = St(t.subscriptionOptions),
                                    i = {
                                        method: "PATCH",
                                        headers: n,
                                        body: JSON.stringify(i)
                                    };
                                let a;
                                try {
                                    const r = await fetch(`${kt(e.appConfig)}/${t.token}`, i);
                                    a = await r.json()
                                } catch (e) {
                                    throw bt.create("token-update-failed", {
                                        errorInfo: e
                                    })
                                }
                                if (a.error) {
                                    i = a.error.message;
                                    throw bt.create("token-update-failed", {
                                        errorInfo: i
                                    })
                                }
                                if (!a.token) throw bt.create("token-update-no-token");
                                return a.token
                            }(t.firebaseDependencies, e), i = Object.assign(Object.assign({}, e), {
                                token: n,
                                createTime: Date.now()
                            });
                            return await mt(t.firebaseDependencies, i), n
                        } catch (e) {
                            throw await _t(t), e
                        }
                    }(e, {
                        token: c.token,
                        createTime: Date.now(),
                        subscriptionOptions: s
                    }): c.token;
                    try {
                        await vt(e.firebaseDependencies, c.token)
                    } catch (e) {
                        console.warn(e)
                    }
                    return Ct(e.firebaseDependencies, s)
                }
                return Ct(e.firebaseDependencies, s)
            }
            async function _t(e) {
                var t = await wt(e.firebaseDependencies);
                t && (await vt(e.firebaseDependencies, t.token), await async function(e) {
                    var t = yt(e);
                    const n = await ht(),
                        i = n.transaction(ft, "readwrite");
                    await i.objectStore(ft).delete(t), await i.complete
                }(e.firebaseDependencies));
                const n = await e.swRegistration.pushManager.getSubscription();
                return !n || n.unsubscribe()
            }
            async function Ct(e, t) {
                var n = {
                    token: await async function(e, t) {
                        var n = await It(e),
                            i = St(t),
                            i = {
                                method: "POST",
                                headers: n,
                                body: JSON.stringify(i)
                            };
                        let a;
                        try {
                            const r = await fetch(kt(e.appConfig), i);
                            a = await r.json()
                        } catch (e) {
                            throw bt.create("token-subscribe-failed", {
                                errorInfo: e
                            })
                        }
                        if (a.error) {
                            i = a.error.message;
                            throw bt.create("token-subscribe-failed", {
                                errorInfo: i
                            })
                        }
                        if (!a.token) throw bt.create("token-subscribe-no-token");
                        return a.token
                    }(e, t),
                    createTime: Date.now(),
                    subscriptionOptions: t
                };
                return await mt(e, n), n.token
            }
            async function jt(e, t) {
                var n = function(e, t) {
                    var n;
                    const i = {};
                    e.from && (i.project_number = e.from);
                    e.fcmMessageId && (i.message_id = e.fcmMessageId);
                    i.instance_id = t, e.notification ? i.message_type = A.DISPLAY_NOTIFICATION.toString() : i.message_type = A.DATA_MESSAGE.toString();
                    i.sdk_platform = rt.toString(), i.package_name = self.origin.replace(/(^\w+:|^)\/\//, ""), e.collapse_key && (i.collapse_key = e.collapse_key);
                    i.event = ot.toString(), null !== (n = e.fcmOptions) && void 0 !== n && n.analytics_label && (i.analytics_label = null === (n = e.fcmOptions) || void 0 === n ? void 0 : n.analytics_label);
                    return i
                }(t, await e.firebaseDependencies.installations.getId());
                ! function(e, t) {
                    const n = {};
                    n.event_time_ms = Math.floor(Date.now()).toString(), n.source_extension_json_proto3 = JSON.stringify(t), e.logEvents.push(n)
                }(e, n)
            }

            function Ot(e, t) {
                const n = [];
                for (let i = 0; i < e.length; i++) n.push(e.charAt(i)), i < t.length && n.push(t.charAt(i));
                return n.join("")
            }
            async function Dt(e, t) {
                var n = function({
                                     data: e
                                 }) {
                    if (!e) return null;
                    try {
                        return e.json()
                    } catch (e) {
                        return null
                    }
                }(e);
                if (n) {
                    t.deliveryMetricsExportedToBigQueryEnabled && await jt(t, n);
                    var i, a, r = await At();
                    if (r.some(e => "visible" === e.visibilityState && !e.url.startsWith("chrome-extension://"))) return function(e, t) {
                        t.isFirebaseMessaging = !0, t.messageType = M.PUSH_RECEIVED;
                        for (const n of e) n.postMessage(t)
                    }(r, n);
                    n.notification && await
                        function(e) {
                            var t = e["actions"],
                                n = Notification["maxActions"];
                            t && n && t.length > n && console.warn(`This browser only supports ${n} actions. The remaining actions will not be displayed.`);
                            return self.registration.showNotification(null !== (n = e.title) && void 0 !== n ? n : "", e)
                        }(function(e) {
                            const t = Object.assign({}, e.notification);
                            return t.data = {
                                [it]: e
                            }, t
                        }(n)), t && t.onBackgroundMessageHandler && (r = {
                        from: (i = n).from,
                        collapseKey: i.collapse_key,
                        messageId: i.fcmMessageId
                    }, n = r, (e = i).notification && (n.notification = {}, (a = e.notification.title) && (n.notification.title = a), (a = e.notification.body) && (n.notification.body = a), (a = e.notification.image) && (n.notification.image = a)), e = r, (n = i).data && (e.data = n.data), n = r, (i = i).fcmOptions && (n.fcmOptions = {}, (a = i.fcmOptions.link) && (n.fcmOptions.link = a), (a = i.fcmOptions.analytics_label) && (n.fcmOptions.analyticsLabel = a)), r = r, "function" == typeof t.onBackgroundMessageHandler ? t.onBackgroundMessageHandler(r) : t.onBackgroundMessageHandler.next(r))
                }
            }
            async function Pt(e) {
                const t = null === (r = null === (a = e.notification) || void 0 === a ? void 0 : a.data) || void 0 === r ? void 0 : r[it];
                if (t && !e.action) {
                    e.stopImmediatePropagation(), e.notification.close();
                    var n = function(e) {
                        var t;
                        var n = null !== (t = null === (t = e.fcmOptions) || void 0 === t ? void 0 : t.link) && void 0 !== t ? t : null === (n = e.notification) || void 0 === n ? void 0 : n.click_action;
                        if (n) return n;
                        return function(e) {
                            return "object" == typeof e && e && at in e
                        }(e.data) ? self.location.origin : null
                    }(t);
                    if (n) {
                        var i, a = new URL(n, self.location.href),
                            r = new URL(self.location.origin);
                        if (a.host === r.host) {
                            let e = await async function(e) {
                                var t = await At();
                                for (const i of t) {
                                    var n = new URL(i.url, self.location.href);
                                    if (e.host === n.host) return i
                                }
                                return null
                            }(a);
                            if (e ? e = await e.focus() : (e = await self.clients.openWindow(n), i = 3e3, await new Promise(e => {
                                setTimeout(e, i)
                            })), e) return t.messageType = M.NOTIFICATION_CLICKED, t.isFirebaseMessaging = !0, e.postMessage(t)
                        }
                    }
                }
            }

            function At() {
                return self.clients.matchAll({
                    type: "window",
                    includeUncontrolled: !0
                })
            }

            function Mt(e) {
                return bt.create("missing-app-config-values", {
                    valueName: e
                })
            }
            Ot("hts/frbslgigp.ogepscmv/ieo/eaylg", "tp:/ieaeogn-agolai.o/1frlglgc/o"), Ot("AzSCbw63g1R0nCw85jG8", "Iaya3yLKwmgvh7cF0q4");
            class Et {
                constructor(e, t, n) {
                    this.deliveryMetricsExportedToBigQueryEnabled = !1, this.onBackgroundMessageHandler = null, this.onMessageHandler = null, this.logEvents = [], this.isLogServiceStarted = !1;
                    var i = function(e) {
                        if (!e || !e.options) throw Mt("App Configuration Object");
                        if (!e.name) throw Mt("App Name");
                        var t = e["options"];
                        for (const n of ["projectId", "apiKey", "appId", "messagingSenderId"])
                            if (!t[n]) throw Mt(n);
                        return {
                            appName: e.name,
                            projectId: t.projectId,
                            apiKey: t.apiKey,
                            appId: t.appId,
                            senderId: t.messagingSenderId
                        }
                    }(e);
                    this.firebaseDependencies = {
                        app: e,
                        appConfig: i,
                        installations: t,
                        analyticsProvider: n
                    }
                }
                _delete() {
                    return Promise.resolve()
                }
            }
            const Kt = e => {
                const t = new Et(e.getProvider("app").getImmediate(), e.getProvider("installations-internal").getImmediate(), e.getProvider("analytics-internal"));
                return self.addEventListener("push", e => {
                    e.waitUntil(Dt(e, t))
                }), self.addEventListener("pushsubscriptionchange", e => {
                    e.waitUntil(async function(e, t) {
                        var n;
                        (n = e["newSubscription"]) ? (n = await wt(t.firebaseDependencies), await _t(t), t.vapidKey = null !== (n = null === (n = null == n ? void 0 : n.subscriptionOptions) || void 0 === n ? void 0 : n.vapidKey) && void 0 !== n ? n : tt, await Tt(t)) : await _t(t)
                    }(e, t))
                }), self.addEventListener("notificationclick", e => {
                    e.waitUntil(Pt(e))
                }), t
            };

            function Nt(e, t) {
                return function(e, t) {
                    if (void 0 !== self.document) throw bt.create("only-available-in-sw");
                    return e.onBackgroundMessageHandler = t, () => {
                        e.onBackgroundMessageHandler = null
                    }
                }(e = a(e), t)
            }
            qt._registerComponent(new r("messaging-sw", Kt, "PUBLIC"));
            class xt {
                constructor(e, t) {
                    this.app = e, this._delegate = t, this.app = e, this._delegate = t
                }
                async getToken(e) {
                    return async function(e, t) {
                        return Ge(e = a(e), t)
                    }(this._delegate, e)
                }
                async deleteToken() {
                    return Xe(this._delegate)
                }
                onMessage(e) {
                    return et(this._delegate, e)
                }
                onBackgroundMessage(e) {
                    return Nt(this._delegate, e)
                }
            }
            const $t = e => self && "ServiceWorkerGlobalScope" in self ? new xt(e.getProvider("app-compat").getImmediate(), e.getProvider("messaging-sw").getImmediate()) : new xt(e.getProvider("app-compat").getImmediate(), e.getProvider("messaging").getImmediate()),
                Ft = {
                    isSupported: function() {
                        return self && "ServiceWorkerGlobalScope" in self ? n() && "PushManager" in self && "Notification" in self && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey") : "undefined" != typeof window && n() && !("undefined" == typeof navigator || !navigator.cookieEnabled) && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window && "fetch" in window && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey")
                    }
                };
            t.default.INTERNAL.registerComponent(new r("messaging-compat", $t, "PUBLIC").setServiceProps(Ft)), t.default.registerVersion("@firebase/messaging-compat", "0.1.6")
        }).apply(this, arguments)
    } catch (e) {
        throw console.error(e), new Error("Cannot instantiate firebase-messaging-compat.js - be sure to load firebase-app.js first.")
    }
});
//# sourceMappingURL=firebase-messaging-compat.js.map

function fnBrowserDetect() {

    let userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "1_ch";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "_fi";
    } else if (userAgent.match(/safari/i)) {
        browserName = "_sa";
    } else if (userAgent.match(/opr\//i)) {
        browserName = "_op";
    } else if (userAgent.match(/edg/i)) {
        browserName = "_ed";
    } else {
        browserName = "_no";
    }

    return browserName;
}

const CreateHash = async () => {
    const fpPromise = import('/node_modules/@pod-notification/web-push/fingerprintv3.js')
        .then(FingerprintJS => FingerprintJS.load())

    let res = "";
    await fpPromise
        .then(fp => fp.get())
        .then(result => {
            const visitorId = result.visitorId
            res = visitorId;
        })
    return res + fnBrowserDetect();
}

const registerDevice = (config) => {
    var url = "https://sandbox.sandpod.ir/srv/notif-sandbox/push/device/subscribe";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    if(localStorage.getItem("apiToken")) {
        xhr.setRequestHeader("Apitoken", localStorage.getItem("apiToken"));
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(config));
}

const sendStatus = (config) => {
    console.log("status sent:" + config.status);
    var url = "https://sandbox.sandpod.ir/srv/notif-sandbox/push/device/status";
    let data = {
        status: config.status,
        messageId: config.messageId,
        registrationToken: config.registrationToken
    }

    fetch(url, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

}

const configFireBase = (config) => {
    const firebaseConfig = {
        apiKey: "AIzaSyCd77oDdFact3bgoyixxfQTa8wWiJxMrVY",
        authDomain: "podnotification-88758.firebaseapp.com",
        databaseURL: "https://podnotification-88758-default-rtdb.firebaseio.com",
        projectId: "podnotification-88758",
        storageBucket: "podnotification-88758.appspot.com",
        messagingSenderId: "309762851928",
        appId: "1:309762851928:web:3bfb65cb74e353b553362d",
        measurementId: "G-D325BCEYEB"
    };
    const productionFirebaseConfig = {
        apiKey: "AIzaSyCqNkPWfTu2Apvhc5C4z0l3IGWpd5aP4IA",
        authDomain: "prodnotification-eba19.firebaseapp.com",
        databaseURL: "https://prodnotification-eba19-default-rtdb.firebaseio.com",
        projectId: "prodnotification-eba19",
        storageBucket: "prodnotification-eba19.appspot.com",
        messagingSenderId: "923291418261",
        appId: "1:923291418261:web:4fe138fc0ded175199659c",
        measurementId: "G-L8MSQXRRDE"
    };
    if(config.isProduction) {
        firebase.initializeApp(productionFirebaseConfig)
    } else {
        firebase.initializeApp(firebaseConfig);
    }
    return firebase.messaging();
}

const listen = (token, config) => {
    // queryParamInUrl();
    let messaging = configFireBase(config);
    messaging.onMessage((payload) => {
        // Update the UI to include the received message.
        sendStatus({
            status: PUSH_RECEIVED,
            messageId: payload.data.messageId,
            registrationToken: token,
            data: [],
        });
        const notification = new Notification(payload.data.title , {
            body: payload.data.body,
            icon: payload.data.icon,
            image: payload.data.image,
            dir: payload.data.dir,
            requireInteraction: payload.data.requireInteraction == "true" ? true : false
        });
        notification.addEventListener('click', () => {

            sendStatus({
                status: PUSH_SEEN,
                messageId: payload.data.messageId,
                registrationToken: token,
                data: [],

            });
            if (payload.data.link)
                window.open(payload.data.link);
        });
        notification.addEventListener('close', (e) => {
            sendStatus({
                status: PUSH_DISMISSED,
                messageId: payload.data.messageId,
                registrationToken: token,
                data: [],

            });
        });
        config.onGetData(payload.data)
    });
}

const subscribe = async (config) => {

    console.log("subscribe function ")
    let messaging = configFireBase(config);

    let token = ""
    return await messaging
        .getToken({
            vapidKey: config.isProduction ? "BHBlnK74Khi05gWPlHi1gxzOaP69CAj7zZh_P20h_ik7aMyJrfIEKwulsCgEsqbFZq_Q13ePDNViuMVJRGlRBBk" : "BKKqFoBjWi-Bg7pQF7y4W0kFQ-BB62o6Oo_ANzB8Lk8S1q_LH9U5V7DDSR4pRVeV84PQKllSw-WrP4f1G-F8tVE"
        })
        .then((currentToken) => {
            sendTokenToServer(currentToken);
            if (currentToken) {
                console.log("currentToken", currentToken);
                return currentToken;
            } else {
                console.log(
                    "No registration token available. Request permission to generate one."
                );
            }
        })
        .catch((err) => {
            console.log(err);
        });

}

function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
        console.log("Sending token to server...");
    } else {
        console.log(
            "Token already sent to server so won't send it again " +
            "unless it changes"
        );
    }
}

function isTokenSentToServer() {
    return window.localStorage.getItem("sentToServer") === "1";
}

function setTokenSentToServer(sent) {
    window.localStorage.setItem("sentToServer", sent ? "1" : "0");
}

async function requestPermission() {
    let state = false;
    await Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification permission granted.");
            state = true
        } else {
            console.log("Unable to get permission to notify.");
            state = false;
        }
    });
    return state;
}

async function deleteToken(currentToken) {
    // Delete registration token.
    let messaging = configFireBase();
    let t = await messaging
        .getToken()
        .then((currentToken) => {
            messaging
                .deleteToken(currentToken)
                .then(() => {
                    console.log("Token deleted.");
                    return;
                })
                .catch((err) => {
                    console.log("Unable to delete token. ", err);
                });
        })
        .catch((err) => {
            console.log(
                "Error retrieving registration token. ",
                err
            );
        });
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

let token;

const init = async function(config) {
    let permission = requestPermission();

    let hash = await CreateHash();
    let subscribeBefore = localStorage.getItem('subscribe');

    if (permission) {
        token = await subscribe(config);
        // deleteToken(token);
        if (token && hash && subscribeBefore == null) {
            if(config.apiToken && config.apiToken !== "") {
                localStorage.setItem("apiToken", config.apiToken);
            } else localStorage.removeItem("apiToken");
            config.registrationToken = token;
            config.platform = 'WEB';
            config.deviceId = hash;
            registerDevice(config);
            localStorage.setItem('subscribe', 'yes');
            getToken(token);
        }
        listen(token, config);
    }
};
