class ErrorView {
    static render(t, e) {
        const i = document.createElement("div");
        (i.id = "error-view"), (i.innerText = e), t.replaceChildren(i);
    }
}
class ValidateKeyPropertyView {
    static onLoad(t) {
        t.innerHTML = '<div id="large-loading-ring"></div>';
    }
    static createElements() {
        const t = document.createElement("div");
        return (t.id = "validate-property-key-view"), t;
    }
    static render(t, e, i) {
        const s = ValidateKeyPropertyView.createElements(),
            n = {
                onSuccess: e,
                onFail: ErrorView.render.bind(
                    this,
                    t,
                    "Your 'key' has failed authentication"
                ),
                onLoad: ValidateKeyPropertyView.onLoad.bind(this, s),
            };
        i.key && i.verifyKey(i.key, n), t.replaceChildren(s);
    }
}
class StyleUtils {
    static unsetStyle(t, e) {
        const i = Object.keys(e).reduce((t, e) => ((t[e] = ""), t), {});
        Object.assign(t.style, i);
    }
    static unsetActivityCSSMouseStates(t, e) {
        e.click && StyleUtils.unsetStyle(t, e.click),
            e.hover && StyleUtils.unsetStyle(t, e.hover);
    }
    static unsetAllCSSMouseStates(t, e) {
        StyleUtils.unsetActivityCSSMouseStates(t, e),
            e.default && StyleUtils.unsetStyle(t, e.default);
    }
    static processStateful(t, e, i) {
        const s = t.default || {},
            n = Object.assign(
                JSON.parse(JSON.stringify({ ...s, ...e })),
                null == t ? void 0 : t.hover
            );
        return {
            default: s,
            hover: n,
            click: Object.assign(
                JSON.parse(JSON.stringify({ ...n, ...i })),
                null == t ? void 0 : t.click
            ),
        };
    }
    static mergeStatefulStyles(t) {
        const e = { default: {}, hover: {}, click: {} };
        return (
            t.forEach((t) => {
                (e.default = Object.assign(e.default, t.default)),
                    (e.hover = Object.assign(e.hover, t.hover)),
                    (e.click = Object.assign(e.click, t.click));
            }),
            e
        );
    }
    static overwriteDefaultWithAlreadyApplied(t, e) {
        Object.keys(t.default || []).forEach((i) => {
            var s;
            const n = i;
            e.style[n] &&
                null != (s = t.default) &&
                s[n] &&
                (t.default[i] = e.style[n]);
        });
    }
    static applyToStyleIfNotDefined(t, e) {
        for (const i in e) {
            const s = e[i];
            "" === t[i] && s && (t[i] = s);
        }
    }
}
const _WebComponentStyleUtils = class t {
    static apply(e, i) {
        if (i)
            try {
                t.applyStyleSheet(e, i);
            } catch {
                t.addStyleElement(e, i);
            }
    }
    static applyStyleSheet(t, e) {
        const i = new CSSStyleSheet();
        i.replaceSync(t), e.adoptedStyleSheets.push(i);
    }
    static addStyleElement(t, e) {
        const i = document.createElement("style");
        (i.innerHTML = t), e.appendChild(i);
    }
    static applyDefaultStyleToComponent(e) {
        StyleUtils.applyToStyleIfNotDefined(e, t.DEFAULT_COMPONENT_STYLE);
    }
};
_WebComponentStyleUtils.DEFAULT_COMPONENT_STYLE = {
    height: "350px",
    width: "320px",
    border: "1px solid #cacaca",
    fontFamily: "'Inter', sans-serif, Avenir, Helvetica, Arial",
    fontSize: "0.9rem",
    backgroundColor: "white",
    position: "relative",
};
let WebComponentStyleUtils = _WebComponentStyleUtils;
var KEYBOARD_KEY = ((t) => (
    (t.ESCAPE = "Escape"),
    (t.ENTER = "Enter"),
    (t.TAB = "Tab"),
    (t.ARROW_UP = "ArrowUp"),
    (t.ARROW_DOWN = "ArrowDown"),
    (t.ARROW_RIGHT = "ArrowRight"),
    (t.ARROW_LEFT = "ArrowLeft"),
    (t.BACKSPACE = "Backspace"),
    (t.DELETE = "Delete"),
    (t.META = "Meta"),
    (t.CONTROL = "Control"),
    t
))(KEYBOARD_KEY || {});
let Browser$1 = class {};
(Browser$1.IS_SAFARI = /^((?!chrome|android).)*safari/i.test(
    navigator.userAgent
)),
    (Browser$1.IS_CHROMIUM = window.chrome);
class PasteUtils {
    static sanitizePastedTextContent(t) {
        var e, i;
        t.preventDefault();
        const s =
            null == (e = t.clipboardData) ? void 0 : e.getData("text/plain");
        null == (i = document.execCommand) ||
            i.call(document, "insertHTML", !1, s);
    }
}
const _InputLimit = class t {
    static add(e, i) {
        e.addEventListener("keydown", t.onKeyDown.bind(this, i)),
            (e.oninput = t.onInput.bind(this, i));
    }
    static onKeyDown(e, i) {
        const s = i.target.textContent;
        s &&
            s.length >= e &&
            !t.PERMITTED_KEYS.has(i.key) &&
            !t.isKeyCombinationPermitted(i) &&
            i.preventDefault();
    }
    static isKeyCombinationPermitted(t) {
        return "a" === t.key && (t.ctrlKey || t.metaKey);
    }
    static onInput(t, e) {
        const i = e.target,
            s = i.textContent;
        s &&
            s.length > t &&
            ((i.textContent = s.substring(0, t)),
            FocusUtils.focusEndOfInput(i));
    }
};
_InputLimit.PERMITTED_KEYS = new Set([
    KEYBOARD_KEY.BACKSPACE,
    KEYBOARD_KEY.DELETE,
    KEYBOARD_KEY.ARROW_RIGHT,
    KEYBOARD_KEY.ARROW_LEFT,
    KEYBOARD_KEY.ARROW_DOWN,
    KEYBOARD_KEY.ARROW_UP,
    KEYBOARD_KEY.META,
    KEYBOARD_KEY.CONTROL,
    KEYBOARD_KEY.ENTER,
]);
let InputLimit = _InputLimit;
const _TextInputEl = class t {
    constructor(e, i) {
        var s;
        const n = t.processConfig(e, i);
        (this.elementRef = t.createContainerElement(
            null == (s = null == n ? void 0 : n.styles) ? void 0 : s.container
        )),
            (this.inputElementRef = this.createInputElement(n)),
            (this._config = n),
            this.elementRef.appendChild(this.inputElementRef),
            null != i &&
                i.characterLimit &&
                InputLimit.add(
                    this.inputElementRef,
                    null == i ? void 0 : i.characterLimit
                );
    }
    static processConfig(t, e) {
        var i;
        return (
            e ?? (e = {}),
            e.disabled ?? (e.disabled = t.isTextInputDisabled),
            e.placeholder ?? (e.placeholder = {}),
            (i = e.placeholder).text ?? (i.text = t.textInputPlaceholderText),
            e
        );
    }
    static preventAutomaticScrollUpOnNewLine(t) {
        let e;
        t.addEventListener("keydown", () => {
            e = window.scrollY;
        }),
            t.addEventListener("input", () => {
                e !== window.scrollY && window.scrollTo({ top: e });
            });
    }
    static clear(t) {
        const e = window.scrollY;
        t.classList.contains("text-input-disabled") || (t.textContent = ""),
            Browser$1.IS_CHROMIUM && window.scrollTo({ top: e });
    }
    createInputElement(e) {
        var i, s, n;
        const o = document.createElement("div");
        return (
            (o.id = t.TEXT_INPUT_ID),
            o.classList.add("text-input-styling", "text-input-placeholder"),
            (o.innerText =
                (null == (i = null == e ? void 0 : e.placeholder)
                    ? void 0
                    : i.text) || "Ask me anything!"),
            Browser$1.IS_CHROMIUM && t.preventAutomaticScrollUpOnNewLine(o),
            "boolean" == typeof (null == e ? void 0 : e.disabled) &&
            !0 === e.disabled
                ? ((o.contentEditable = "false"),
                  o.classList.add("text-input-disabled"))
                : ((o.contentEditable = "true"), this.addEventListeners(o, e)),
            Object.assign(
                o.style,
                null == (s = null == e ? void 0 : e.styles) ? void 0 : s.text
            ),
            Object.assign(
                o.style,
                null == (n = null == e ? void 0 : e.placeholder)
                    ? void 0
                    : n.style
            ),
            o
        );
    }
    removeTextIfPlaceholder() {
        var e, i, s, n;
        this.inputElementRef.classList.contains("text-input-placeholder") &&
            !this.inputElementRef.classList.contains("text-input-disabled") &&
            (null != (e = this._config.placeholder) &&
                e.style &&
                (StyleUtils.unsetStyle(
                    this.inputElementRef,
                    null == (i = this._config.placeholder) ? void 0 : i.style
                ),
                Object.assign(
                    this.inputElementRef.style,
                    null == (n = null == (s = this._config) ? void 0 : s.styles)
                        ? void 0
                        : n.text
                )),
            t.clear(this.inputElementRef),
            this.inputElementRef.classList.remove("text-input-placeholder"));
    }
    static toggleEditability(t, e) {
        t.contentEditable = e ? "true" : "false";
    }
    addEventListeners(t, e) {
        var i, s, n;
        (t.onfocus = this.onFocus.bind(
            this,
            null == (i = null == e ? void 0 : e.styles) ? void 0 : i.focus
        )),
            null != (s = null == e ? void 0 : e.styles) &&
                s.focus &&
                (t.onblur = this.onBlur.bind(
                    this,
                    e.styles.focus,
                    null == (n = null == e ? void 0 : e.styles)
                        ? void 0
                        : n.container
                )),
            t.addEventListener("keydown", this.onKeydown.bind(this)),
            (t.onpaste = PasteUtils.sanitizePastedTextContent);
    }
    onFocus(t) {
        Browser$1.IS_SAFARI
            ? setTimeout(() => {
                  this.removeTextIfPlaceholder();
              })
            : this.removeTextIfPlaceholder(),
            Object.assign(this.elementRef.style, t);
    }
    onBlur(t, e) {
        StyleUtils.unsetStyle(this.elementRef, t),
            e && Object.assign(this.elementRef.style, e);
    }
    static createContainerElement(t) {
        const e = document.createElement("div");
        return (e.id = "text-input-container"), Object.assign(e.style, t), e;
    }
    onKeydown(t) {
        var e;
        t.key === KEYBOARD_KEY.ENTER &&
            !t.ctrlKey &&
            !t.shiftKey &&
            (t.preventDefault(), null == (e = this.submit) || e.call(this));
    }
};
_TextInputEl.TEXT_INPUT_ID = "text-input";
let TextInputEl = _TextInputEl;
class FocusUtils {
    static focusEndOfInput(t) {
        const e = document.createRange();
        e.selectNodeContents(t), e.collapse(!1);
        const i = window.getSelection();
        null == i || i.removeAllRanges(), null == i || i.addRange(e);
    }
    static focusFromParentElement(t) {
        const e = t.querySelector(`#${TextInputEl.TEXT_INPUT_ID}`);
        e && FocusUtils.focusEndOfInput(e);
    }
}
function capitalizeFirstLetter(t) {
    return t.charAt(0).toUpperCase() + t.slice(1);
}
function getInterceptorMessage(t) {
    return t && JSON.stringify(t);
}
function getInvalidResponseMessage(t, e, i, s) {
    return `${
        `\n${capitalizeFirstLetter(e)} message: ${JSON.stringify(t)} \n` +
        (i
            ? `${capitalizeFirstLetter(
                  e
              )} message after interceptor: ${getInterceptorMessage(s)} \n`
            : "")
    }Make sure the ${e} message is using the Response format: https://deepchat.dev/docs/connect/#Response \n You can also augment it using the responseInterceptor property: https://deepchat.dev/docs/interceptors#responseInterceptor`;
}
const ErrorMessages = {
        INVALID_KEY: "Invalid API Key",
        CONNECTION_FAILED: "Failed to connect",
        INVALID_RESPONSE: getInvalidResponseMessage,
        INVALID_STREAM_RESPONSE:
            "Make sure the events are using the Response format: https://deepchat.dev/docs/connect/#Response \nYou can also augment them using the responseInterceptor property: https://deepchat.dev/docs/interceptors#responseInterceptor",
    },
    _RequestUtils = class t {
        static async temporarilyRemoveHeader(e, i, s) {
            if (null == e || !e.headers)
                throw new Error("Request settings have not been set up");
            const n = e.headers[t.CONTENT_TYPE];
            delete e.headers[t.CONTENT_TYPE],
                await i(s),
                (e.headers[t.CONTENT_TYPE] = n);
        }
        static displayError(t, e, i = "Service error, please try again.") {
            if ((console.error(e), "object" == typeof e))
                return 0 === Object.keys(e).length
                    ? t.addNewErrorMessage("service", i)
                    : t.addNewErrorMessage("service", JSON.stringify(e));
            t.addNewErrorMessage("service", e);
        }
        static processResponseByType(t) {
            const e = t.headers.get("content-type");
            return null != e && e.includes("application/json")
                ? t.json()
                : (null != e && e.includes("text/plain")) || !e
                ? t
                : t.blob();
        }
        static async processRequestInterceptor(t, e) {
            var i;
            const s =
                    (await (null == (i = t.requestInterceptor)
                        ? void 0
                        : i.call(t, e))) || e,
                n = s,
                o = s;
            return { body: n.body, headers: n.headers, error: o.error };
        }
        static validateResponseFormat(t) {
            return (
                t &&
                "object" == typeof t &&
                ("string" == typeof t.error ||
                    "string" == typeof t.text ||
                    "string" == typeof t.html ||
                    "object" == typeof t.files)
            );
        }
    };
_RequestUtils.CONTENT_TYPE = "Content-Type";
let RequestUtils = _RequestUtils;
async function getBytes(t, e) {
    const i = t.getReader();
    let s;
    for (; !(s = await i.read()).done; ) e(s.value);
}
function getLines(t) {
    let e,
        i,
        s,
        n = !1;
    return function (o) {
        void 0 === e ? ((e = o), (i = 0), (s = -1)) : (e = concat(e, o));
        const r = e.length;
        let a = 0;
        for (; i < r; ) {
            n && (10 === e[i] && (a = ++i), (n = !1));
            let o = -1;
            for (; i < r && -1 === o; ++i)
                switch (e[i]) {
                    case 58:
                        -1 === s && (s = i - a);
                        break;
                    case 13:
                        n = !0;
                    case 10:
                        o = i;
                }
            if (-1 === o) break;
            t(e.subarray(a, o), s), (a = i), (s = -1);
        }
        a === r ? (e = void 0) : 0 !== a && ((e = e.subarray(a)), (i -= a));
    };
}
function getMessages(t, e, i) {
    let s = newMessage();
    const n = new TextDecoder();
    return function (o, r) {
        if (0 === o.length) null == i || i(s), (s = newMessage());
        else if (r > 0) {
            const i = n.decode(o.subarray(0, r)),
                a = r + (32 === o[r + 1] ? 2 : 1),
                l = n.decode(o.subarray(a));
            switch (i) {
                case "data":
                    s.data = s.data ? s.data + "\n" + l : l;
                    break;
                case "event":
                    s.event = l;
                    break;
                case "id":
                    t((s.id = l));
                    break;
                case "retry":
                    const i = parseInt(l, 10);
                    isNaN(i) || e((s.retry = i));
            }
        }
    };
}
function concat(t, e) {
    const i = new Uint8Array(t.length + e.length);
    return i.set(t), i.set(e, t.length), i;
}
function newMessage() {
    return { data: "", event: "", id: "", retry: void 0 };
}
var __rest =
    (globalThis && globalThis.__rest) ||
    function (t, e) {
        var i = {};
        for (var s in t)
            Object.prototype.hasOwnProperty.call(t, s) &&
                e.indexOf(s) < 0 &&
                (i[s] = t[s]);
        if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
            var n = 0;
            for (s = Object.getOwnPropertySymbols(t); n < s.length; n++)
                e.indexOf(s[n]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(t, s[n]) &&
                    (i[s[n]] = t[s[n]]);
        }
        return i;
    };
const EventStreamContentType = "text/event-stream",
    DefaultRetryInterval = 1e3,
    LastEventId = "last-event-id";
function fetchEventSource(t, e) {
    var {
            signal: i,
            headers: s,
            onopen: n,
            onmessage: o,
            onclose: r,
            onerror: a,
            openWhenHidden: l,
            fetch: c,
        } = e,
        u = __rest(e, [
            "signal",
            "headers",
            "onopen",
            "onmessage",
            "onclose",
            "onerror",
            "openWhenHidden",
            "fetch",
        ]);
    return new Promise((e, h) => {
        const d = Object.assign({}, s);
        let p;
        function m() {
            p.abort(), document.hidden || w();
        }
        d.accept || (d.accept = EventStreamContentType),
            l || document.addEventListener("visibilitychange", m);
        let g = DefaultRetryInterval,
            v = 0;
        function f() {
            document.removeEventListener("visibilitychange", m),
                window.clearTimeout(v),
                p.abort();
        }
        null == i ||
            i.addEventListener("abort", () => {
                f(), e();
            });
        const b = c ?? window.fetch,
            y = n ?? defaultOnOpen;
        async function w() {
            var i;
            p = new AbortController();
            try {
                const i = await b(
                    t,
                    Object.assign(Object.assign({}, u), {
                        headers: d,
                        signal: p.signal,
                    })
                );
                await y(i),
                    await getBytes(
                        i.body,
                        getLines(
                            getMessages(
                                (t) => {
                                    t
                                        ? (d[LastEventId] = t)
                                        : delete d[LastEventId];
                                },
                                (t) => {
                                    g = t;
                                },
                                o
                            )
                        )
                    ),
                    null == r || r(),
                    f(),
                    e();
            } catch (t) {
                if (!p.signal.aborted)
                    try {
                        const e =
                            null !== (i = null == a ? void 0 : a(t)) &&
                            void 0 !== i
                                ? i
                                : g;
                        window.clearTimeout(v), (v = window.setTimeout(w, e));
                    } catch (t) {
                        f(), h(t);
                    }
            }
        }
        w();
    });
}
function defaultOnOpen(t) {
    const e = t.headers.get("content-type");
    if (null == e || !e.startsWith(EventStreamContentType))
        throw new Error(
            `Expected content-type to be ${EventStreamContentType}, Actual: ${e}`
        );
}
const _Demo = class t {
    static generateResponse(t) {
        const e = t.messages[t.messages.length - 1];
        if (e.files && e.files.length > 0) {
            if (e.files.length > 1) return "These are interesting files!";
            const t = e.files[0];
            return t.src && t.src.startsWith("data:image/gif")
                ? "That is a nice gif!"
                : "image" === t.type
                ? "That is a nice image!"
                : "audio" === t.type
                ? "I like the sound of that!"
                : "That is an interesting file!";
        }
        if (e.text) {
            if ("?" === e.text.charAt(e.text.length - 1))
                return "I'm sorry but I can't answer that question...";
            if (e.text.includes("updog")) return "What's updog?";
        }
        return "Hi there! This is a demo response!";
    }
    static getCustomResponse(t, e) {
        return "function" == typeof t ? t(e) : t;
    }
    static getResponse(e) {
        return e.customDemoResponse
            ? t.getCustomResponse(
                  e.customDemoResponse,
                  e.messages[e.messages.length - 1]
              )
            : { text: t.generateResponse(e) };
    }
    static request(e, i, s) {
        const n = t.getResponse(e);
        setTimeout(async () => {
            const t = (await (null == s ? void 0 : s(n))) || n;
            t.error
                ? e.addNewErrorMessage("service", t.error)
                : e.addNewMessage(t, !0),
                i();
        }, 400);
    }
    static requestStream(e, i) {
        setTimeout(() => {
            var s;
            const n = null == (s = t.getResponse(e)) ? void 0 : s.text;
            Stream.simulate(e, i, n);
        }, 400);
    }
};
_Demo.URL = "deep-chat-demo";
let Demo = _Demo;
class Stream {
    static async request(t, e, i, s = !0) {
        var n, o, r, a, l;
        const c = {
                body: e,
                headers: null == (n = t.requestSettings) ? void 0 : n.headers,
            },
            {
                body: u,
                headers: h,
                error: d,
            } = await RequestUtils.processRequestInterceptor(t.deepChat, c),
            { onOpen: p, onClose: m, abortStream: g } = t.streamHandlers;
        if (d) return Stream.onInterceptorError(i, d, m);
        if (null != (o = t.requestSettings) && o.handler)
            return CustomHandler.stream(t, u, i);
        if ((null == (r = t.requestSettings) ? void 0 : r.url) === Demo.URL)
            return Demo.requestStream(i, t.streamHandlers);
        let v = null;
        fetchEventSource(
            (null == (a = t.requestSettings) ? void 0 : a.url) || t.url || "",
            {
                method:
                    (null == (l = t.requestSettings) ? void 0 : l.method) ||
                    "POST",
                headers: h,
                body: s ? JSON.stringify(u) : u,
                openWhenHidden: !0,
                async onopen(t) {
                    if (t.ok) return (v = i.addNewStreamedMessage()), p();
                    throw await RequestUtils.processResponseByType(t);
                },
                onmessage(e) {
                    var s;
                    if (JSON.stringify(e.data) !== JSON.stringify("[DONE]")) {
                        const n = JSON.parse(e.data);
                        null == (s = t.extractResultData) ||
                            s
                                .call(t, n)
                                .then((t) => {
                                    void 0 === (null == t ? void 0 : t.text)
                                        ? console.error(
                                              `Response data: ${e.data} \n ${ErrorMessages.INVALID_STREAM_RESPONSE}`
                                          )
                                        : v &&
                                          i.updateStreamedMessage(t.text, v);
                                })
                                .catch((t) => RequestUtils.displayError(i, t));
                    }
                },
                onerror(t) {
                    throw (m(), t);
                },
                onclose() {
                    i.finaliseStreamedMessage(), m();
                },
                signal: g.signal,
            }
        ).catch((e) => {
            var s;
            null == (s = t.extractResultData) ||
                s
                    .call(t, e)
                    .then(() => {
                        RequestUtils.displayError(i, e);
                    })
                    .catch((t) => {
                        RequestUtils.displayError(i, t);
                    });
        });
    }
    static onInterceptorError(t, e, i) {
        t.addNewErrorMessage("service", e), null == i || i();
    }
    static simulate(t, e, i) {
        const s = e,
            n = (null == i ? void 0 : i.split(" ")) || [],
            o = t.addNewStreamedMessage();
        e.onOpen(), Stream.populateMessages(o, n, t, s);
    }
    static populateMessages(t, e, i, s, n = 0) {
        const o = e[n];
        if (o) {
            i.updateStreamedMessage(`${o} `, t);
            const r = setTimeout(() => {
                Stream.populateMessages(t, e, i, s, n + 1);
            }, s.simulationInterim || 70);
            s.abortStream.abort = () => Stream.abort(r, i, s.onClose);
        } else i.finaliseStreamedMessage(), s.onClose();
    }
    static abort(t, e, i) {
        clearTimeout(t), e.finaliseStreamedMessage(), i();
    }
}
class CustomHandler {
    static async request(t, e, i) {
        var s, n;
        let o = !0;
        const r = CustomHandler.generateOptionalSignals();
        null == (n = (s = t.requestSettings).handler) ||
            n.call(s, e, {
                ...r,
                onResponse: async (e) => {
                    var s, n;
                    if (!o) return;
                    o = !1;
                    const r =
                        (await (null ==
                        (n = (s = t.deepChat).responseInterceptor)
                            ? void 0
                            : n.call(s, e))) || e;
                    RequestUtils.validateResponseFormat(r)
                        ? "string" == typeof r.error
                            ? (console.error(r.error),
                              i.addNewErrorMessage("service", r.error),
                              t.completionsHandlers.onFinish())
                            : t.deepChat.stream && r.text
                            ? Stream.simulate(i, t.streamHandlers, r.text)
                            : (i.addNewMessage(r, !0),
                              t.completionsHandlers.onFinish())
                        : (console.error(
                              ErrorMessages.INVALID_RESPONSE(
                                  e,
                                  "server",
                                  !!t.deepChat.responseInterceptor,
                                  r
                              )
                          ),
                          i.addNewErrorMessage(
                              "service",
                              "Error in server message"
                          ),
                          t.completionsHandlers.onFinish());
                },
            });
    }
    static stream(t, e, i) {
        var s, n;
        let o = !0,
            r = !1,
            a = null;
        t.streamHandlers.abortStream.abort = () => {
            i.finaliseStreamedMessage(), t.streamHandlers.onClose(), (o = !1);
        };
        const l = CustomHandler.generateOptionalSignals();
        null == (n = (s = t.requestSettings).handler) ||
            n.call(s, e, {
                ...l,
                onOpen: () => {
                    r ||
                        !o ||
                        ((a = i.addNewStreamedMessage()),
                        t.streamHandlers.onOpen(),
                        (r = !0));
                },
                onResponse: (e) => {
                    o &&
                        (!e ||
                        "object" != typeof e ||
                        ("string" != typeof e.error &&
                            "string" != typeof e.text)
                            ? console.error(
                                  ErrorMessages.INVALID_RESPONSE(
                                      e,
                                      "server",
                                      !1
                                  )
                              )
                            : e.error
                            ? (console.error(e.error),
                              i.finaliseStreamedMessage(),
                              t.streamHandlers.onClose(),
                              i.addNewErrorMessage("service", e.error),
                              (o = !1))
                            : e.text &&
                              a &&
                              i.updateStreamedMessage(e.text, a));
                },
                onClose: () => {
                    o &&
                        (i.finaliseStreamedMessage(),
                        t.streamHandlers.onClose(),
                        (o = !1));
                },
                stopClicked: t.streamHandlers.stopClicked,
            });
    }
    static websocket(t, e) {
        var i, s;
        const n = { isOpen: !1, newUserMessage: { listener: () => {} } };
        t.websocket = n;
        const o = CustomHandler.generateOptionalSignals();
        null == (s = (i = t.requestSettings).handler) ||
            s.call(i, void 0, {
                ...o,
                onOpen: () => {
                    e.removeError(), (n.isOpen = !0);
                },
                onResponse: async (i) => {
                    var s, o;
                    if (!n.isOpen) return;
                    const r =
                        (await (null ==
                        (o = (s = t.deepChat).responseInterceptor)
                            ? void 0
                            : o.call(s, i))) || i;
                    RequestUtils.validateResponseFormat(r)
                        ? "string" == typeof r.error
                            ? (console.error(r.error),
                              e.isLastMessageError() ||
                                  e.addNewErrorMessage("service", r.error))
                            : t.deepChat.stream
                            ? Stream.simulate(e, t.streamHandlers, r.text)
                            : e.addNewMessage(r, !0)
                        : (console.error(
                              ErrorMessages.INVALID_RESPONSE(
                                  i,
                                  "server",
                                  !!t.deepChat.responseInterceptor,
                                  r
                              )
                          ),
                          e.addNewErrorMessage(
                              "service",
                              "Error in server message"
                          ));
                },
                onClose: () => {
                    n.isOpen = !1;
                },
                newUserMessage: n.newUserMessage,
            });
    }
    static generateOptionalSignals() {
        return {
            onClose: () => {},
            onOpen: () => {},
            stopClicked: { listener: () => {} },
            newUserMessage: { listener: () => {} },
        };
    }
}
class HTTPRequest {
    static async request(t, e, i, s = !0) {
        var n, o, r, a, l;
        const c = {
                body: e,
                headers: null == (n = t.requestSettings) ? void 0 : n.headers,
            },
            {
                body: u,
                headers: h,
                error: d,
            } = await RequestUtils.processRequestInterceptor(t.deepChat, c),
            { onFinish: p } = t.completionsHandlers;
        if (d) return HTTPRequest.onInterceptorError(i, d, p);
        if (null != (o = t.requestSettings) && o.handler)
            return CustomHandler.request(t, u, i);
        if ((null == (r = t.requestSettings) ? void 0 : r.url) === Demo.URL)
            return Demo.request(i, p, t.deepChat.responseInterceptor);
        let m = !0;
        fetch(
            (null == (a = t.requestSettings) ? void 0 : a.url) || t.url || "",
            {
                method:
                    (null == (l = t.requestSettings) ? void 0 : l.method) ||
                    "POST",
                headers: h,
                body: s ? JSON.stringify(u) : u,
            }
        )
            .then((t) => ((m = !!t.ok), t))
            .then((t) => RequestUtils.processResponseByType(t))
            .then(async (e) => {
                var s, n;
                if (!t.extractResultData) return;
                const o =
                        (await (null ==
                        (n = (s = t.deepChat).responseInterceptor)
                            ? void 0
                            : n.call(s, e))) || e,
                    r = await t.extractResultData(o);
                if (!m) throw e;
                if (!r || "object" != typeof r)
                    throw Error(
                        ErrorMessages.INVALID_RESPONSE(
                            e,
                            "response",
                            !!t.deepChat.responseInterceptor,
                            o
                        )
                    );
                r.pollingInAnotherRequest ||
                    (t.deepChat.stream && r.text
                        ? Stream.simulate(i, t.streamHandlers, r.text)
                        : (i.addNewMessage(r, !0), p()));
            })
            .catch((t) => {
                RequestUtils.displayError(i, t), p();
            });
    }
    static executePollRequest(t, e, i, s) {
        console.log("polling");
        const { onFinish: n } = t.completionsHandlers;
        fetch(e, i)
            .then((t) => t.json())
            .then(async (o) => {
                var r, a;
                if (!t.extractPollResultData) return;
                const l = await t.extractPollResultData(
                    (await (null == (a = (r = t.deepChat).responseInterceptor)
                        ? void 0
                        : a.call(r, o))) || o
                );
                l.timeoutMS
                    ? setTimeout(() => {
                          HTTPRequest.executePollRequest(t, e, i, s);
                      }, l.timeoutMS)
                    : (console.log("finished polling"),
                      s.addNewMessage(l, !0),
                      n());
            })
            .catch((t) => {
                RequestUtils.displayError(s, t), n();
            });
    }
    static async poll(t, e, i, s = !0) {
        var n, o, r;
        const a = {
                body: e,
                headers: null == (n = t.requestSettings) ? void 0 : n.headers,
            },
            {
                body: l,
                headers: c,
                error: u,
            } = await RequestUtils.processRequestInterceptor(t.deepChat, a);
        if (u) return HTTPRequest.onInterceptorError(i, u);
        const h =
                (null == (o = t.requestSettings) ? void 0 : o.url) ||
                t.url ||
                "",
            d = {
                method:
                    (null == (r = t.requestSettings) ? void 0 : r.method) ||
                    "POST",
                body: s ? JSON.stringify(l) : l,
                headers: c,
            };
        HTTPRequest.executePollRequest(t, h, d, i);
    }
    static onInterceptorError(t, e, i) {
        t.addNewErrorMessage("service", e), null == i || i();
    }
    static verifyKey(t, e, i, s, n, o, r, a, l) {
        if ("" === t) return o(ErrorMessages.INVALID_KEY);
        r(),
            fetch(e, { method: s, headers: i, body: l || null })
                .then((t) => RequestUtils.processResponseByType(t))
                .then((e) => {
                    a(e, t, n, o);
                })
                .catch((t) => {
                    o(ErrorMessages.CONNECTION_FAILED), console.error(t);
                });
    }
}
class MessageLimitUtils {
    static getCharacterLimitMessages(t, e) {
        var i;
        let s = 0,
            n = t.length - 1;
        for (; n >= 0; n -= 1) {
            const o = null == (i = t[n]) ? void 0 : i.text;
            if (void 0 !== o && ((s += o.length), s > e)) {
                t[n].text = o.substring(0, o.length - (s - e));
                break;
            }
        }
        return t.slice(Math.max(n, 0));
    }
    static getMaxMessages(t, e) {
        return t.slice(Math.max(t.length - e, 0));
    }
    static processMessages(t, e, i) {
        return (
            void 0 !== e
                ? e > 0 && (t = MessageLimitUtils.getMaxMessages(t, e))
                : (t = [t[t.length - 1]]),
            (t = JSON.parse(JSON.stringify(t))),
            void 0 === i ? t : MessageLimitUtils.getCharacterLimitMessages(t, i)
        );
    }
}
class Websocket {
    static setup(t) {
        t.requestSettings.url !== Demo.URL &&
            ((t.permittedErrorPrefixes = [
                "Connection error",
                "Error in server message",
            ]),
            (t.websocket = "pending"));
    }
    static createConnection(t, e) {
        if (!document.body.contains(t.deepChat)) return;
        const i = t.requestSettings.websocket;
        if (i) {
            if (t.requestSettings.handler) return CustomHandler.websocket(t, e);
            try {
                const s = "boolean" != typeof i ? i : void 0,
                    n = new WebSocket(t.requestSettings.url || "", s);
                (t.websocket = n),
                    (t.websocket.onopen = () => {
                        e.removeError(),
                            t.websocket &&
                                "object" == typeof t.websocket &&
                                Websocket.assignListeners(t, n, e);
                    }),
                    (t.websocket.onerror = (i) => {
                        console.error(i), Websocket.retryConnection(t, e);
                    });
            } catch (i) {
                console.error(i), Websocket.retryConnection(t, e);
            }
        }
    }
    static retryConnection(t, e) {
        document.body.contains(t.deepChat) &&
            ((t.websocket = "pending"),
            e.isLastMessageError() ||
                e.addNewErrorMessage("service", "Connection error"),
            setTimeout(() => {
                Websocket.createConnection(t, e);
            }, 5e3));
    }
    static assignListeners(t, e, i) {
        (e.onmessage = async (e) => {
            var s, n;
            if (t.extractResultData)
                try {
                    const o = JSON.parse(e.data),
                        r =
                            (await (null ==
                            (n = (s = t.deepChat).responseInterceptor)
                                ? void 0
                                : n.call(s, o))) || o,
                        a = await t.extractResultData(r);
                    if (!a || "object" != typeof a)
                        throw Error(
                            ErrorMessages.INVALID_RESPONSE(
                                o,
                                "server",
                                !!t.deepChat.responseInterceptor,
                                r
                            )
                        );
                    t.deepChat.stream && a.text
                        ? Stream.simulate(i, t.streamHandlers, a.text)
                        : i.addNewMessage(a, !0);
                } catch (t) {
                    RequestUtils.displayError(i, t, "Error in server message");
                }
        }),
            (e.onclose = () => {
                console.error("Connection closed"),
                    i.isLastMessageError() ||
                        i.addNewErrorMessage("service", "Connection error"),
                    Websocket.createConnection(t, i);
            });
    }
    static async sendWebsocket(t, e, i, s = !0) {
        var n, o;
        const r = t.websocket;
        if (!r || "pending" === r) return;
        const a = {
                body: e,
                headers: null == (n = t.requestSettings) ? void 0 : n.headers,
            },
            { body: l, error: c } =
                await RequestUtils.processRequestInterceptor(t.deepChat, a);
        if (c) return i.addNewErrorMessage("service", c);
        if (!Websocket.isWebSocket(r)) return r.newUserMessage.listener(l);
        const u = s ? JSON.stringify(l) : l;
        if ((null == (o = t.requestSettings) ? void 0 : o.url) === Demo.URL)
            return Demo.request(
                i,
                t.completionsHandlers.onFinish,
                t.deepChat.responseInterceptor
            );
        void 0 === r.readyState || r.readyState !== r.OPEN
            ? (console.error("Connection is not open"),
              i.isLastMessageError() ||
                  i.addNewErrorMessage("service", "Connection error"))
            : r.send(JSON.stringify(u));
    }
    static canSendMessage(t) {
        return (
            !t ||
            ("pending" !== t &&
                (Websocket.isWebSocket(t)
                    ? void 0 !== t.readyState && t.readyState === t.OPEN
                    : t.isOpen))
        );
    }
    static isWebSocket(t) {
        return void 0 !== t.send;
    }
}
class Legacy {
    static checkForContainerStyles(t, e) {
        const i = t.containerStyle;
        i &&
            (Object.assign(e.style, i),
            console.error(
                "The containerStyle property is deprecated since version 1.3.14."
            ),
            console.error(
                "Please change to using the style property instead: https://deepchat.dev/docs/styles#style"
            ));
    }
    static handleResponseProperty(t) {
        return (
            console.error(
                "The {result: ....} response object type is deprecated since version 1.3.0."
            ),
            console.error(
                "Please change to using the new response object: https://deepchat.dev/docs/connect#Response"
            ),
            t.result
        );
    }
    static processInitialMessageFile(t) {
        const e = t.file;
        e &&
            (console.error(
                "The file property in MessageContent is deprecated since version 1.3.17."
            ),
            console.error(
                "Please change to using the files array property: https://deepchat.dev/docs/messages/#MessageContent"
            ),
            (t.files = [e]));
    }
}
var textarea;
function decodeEntity(t) {
    return (
        ((textarea = textarea || document.createElement("textarea")).innerHTML =
            "&" + t + ";"),
        textarea.value
    );
}
var hasOwn = Object.prototype.hasOwnProperty;
function has(t, e) {
    return !!t && hasOwn.call(t, e);
}
function assign(t) {
    return (
        [].slice.call(arguments, 1).forEach(function (e) {
            if (e) {
                if ("object" != typeof e)
                    throw new TypeError(e + "must be object");
                Object.keys(e).forEach(function (i) {
                    t[i] = e[i];
                });
            }
        }),
        t
    );
}
var UNESCAPE_MD_RE = /\\([\\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
function unescapeMd(t) {
    return t.indexOf("\\") < 0 ? t : t.replace(UNESCAPE_MD_RE, "$1");
}
function isValidEntityCode(t) {
    return !(
        (t >= 55296 && t <= 57343) ||
        (t >= 64976 && t <= 65007) ||
        65535 == (65535 & t) ||
        65534 == (65535 & t) ||
        (t >= 0 && t <= 8) ||
        11 === t ||
        (t >= 14 && t <= 31) ||
        (t >= 127 && t <= 159) ||
        t > 1114111
    );
}
function fromCodePoint(t) {
    if (t > 65535) {
        var e = 55296 + ((t -= 65536) >> 10),
            i = 56320 + (1023 & t);
        return String.fromCharCode(e, i);
    }
    return String.fromCharCode(t);
}
var NAMED_ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi,
    DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;
function replaceEntityPattern(t, e) {
    var i = 0,
        s = decodeEntity(e);
    return e !== s
        ? s
        : 35 === e.charCodeAt(0) &&
          DIGITAL_ENTITY_TEST_RE.test(e) &&
          isValidEntityCode(
              (i =
                  "x" === e[1].toLowerCase()
                      ? parseInt(e.slice(2), 16)
                      : parseInt(e.slice(1), 10))
          )
        ? fromCodePoint(i)
        : t;
}
function replaceEntities(t) {
    return t.indexOf("&") < 0
        ? t
        : t.replace(NAMED_ENTITY_RE, replaceEntityPattern);
}
var HTML_ESCAPE_TEST_RE = /[&<>"]/,
    HTML_ESCAPE_REPLACE_RE = /[&<>"]/g,
    HTML_REPLACEMENTS = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
    };
function replaceUnsafeChar(t) {
    return HTML_REPLACEMENTS[t];
}
function escapeHtml(t) {
    return HTML_ESCAPE_TEST_RE.test(t)
        ? t.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar)
        : t;
}
var rules = {};
function nextToken(t, e) {
    return ++e >= t.length - 2
        ? e
        : "paragraph_open" === t[e].type &&
          t[e].tight &&
          "inline" === t[e + 1].type &&
          0 === t[e + 1].content.length &&
          "paragraph_close" === t[e + 2].type &&
          t[e + 2].tight
        ? nextToken(t, e + 2)
        : e;
}
(rules.blockquote_open = function () {
    return "<blockquote>\n";
}),
    (rules.blockquote_close = function (t, e) {
        return "</blockquote>" + getBreak(t, e);
    }),
    (rules.code = function (t, e) {
        return t[e].block
            ? "<pre><code>" +
                  escapeHtml(t[e].content) +
                  "</code></pre>" +
                  getBreak(t, e)
            : "<code>" + escapeHtml(t[e].content) + "</code>";
    }),
    (rules.fence = function (t, e, i, s, n) {
        var o,
            r,
            a = t[e],
            l = "",
            c = i.langPrefix;
        if (a.params) {
            if (
                ((r = (o = a.params.split(/\s+/g)).join(" ")),
                has(n.rules.fence_custom, o[0]))
            )
                return n.rules.fence_custom[o[0]](t, e, i, s, n);
            l =
                ' class="' +
                c +
                escapeHtml(replaceEntities(unescapeMd(r))) +
                '"';
        }
        return (
            "<pre><code" +
            l +
            ">" +
            ((i.highlight &&
                i.highlight.apply(i.highlight, [a.content].concat(o))) ||
                escapeHtml(a.content)) +
            "</code></pre>" +
            getBreak(t, e)
        );
    }),
    (rules.fence_custom = {}),
    (rules.heading_open = function (t, e) {
        return "<h" + t[e].hLevel + ">";
    }),
    (rules.heading_close = function (t, e) {
        return "</h" + t[e].hLevel + ">\n";
    }),
    (rules.hr = function (t, e, i) {
        return (i.xhtmlOut ? "<hr />" : "<hr>") + getBreak(t, e);
    }),
    (rules.bullet_list_open = function () {
        return "<ul>\n";
    }),
    (rules.bullet_list_close = function (t, e) {
        return "</ul>" + getBreak(t, e);
    }),
    (rules.list_item_open = function () {
        return "<li>";
    }),
    (rules.list_item_close = function () {
        return "</li>\n";
    }),
    (rules.ordered_list_open = function (t, e) {
        var i = t[e];
        return "<ol" + (i.order > 1 ? ' start="' + i.order + '"' : "") + ">\n";
    }),
    (rules.ordered_list_close = function (t, e) {
        return "</ol>" + getBreak(t, e);
    }),
    (rules.paragraph_open = function (t, e) {
        return t[e].tight ? "" : "<p>";
    }),
    (rules.paragraph_close = function (t, e) {
        var i = !(
            t[e].tight &&
            e &&
            "inline" === t[e - 1].type &&
            !t[e - 1].content
        );
        return (t[e].tight ? "" : "</p>") + (i ? getBreak(t, e) : "");
    }),
    (rules.link_open = function (t, e, i) {
        var s = t[e].title
                ? ' title="' + escapeHtml(replaceEntities(t[e].title)) + '"'
                : "",
            n = i.linkTarget ? ' target="' + i.linkTarget + '"' : "";
        return '<a href="' + escapeHtml(t[e].href) + '"' + s + n + ">";
    }),
    (rules.link_close = function () {
        return "</a>";
    }),
    (rules.image = function (t, e, i) {
        var s = ' src="' + escapeHtml(t[e].src) + '"',
            n = t[e].title
                ? ' title="' + escapeHtml(replaceEntities(t[e].title)) + '"'
                : "";
        return (
            "<img" +
            s +
            (' alt="' +
                (t[e].alt
                    ? escapeHtml(replaceEntities(unescapeMd(t[e].alt)))
                    : "") +
                '"') +
            n +
            (i.xhtmlOut ? " /" : "") +
            ">"
        );
    }),
    (rules.table_open = function () {
        return "<table>\n";
    }),
    (rules.table_close = function () {
        return "</table>\n";
    }),
    (rules.thead_open = function () {
        return "<thead>\n";
    }),
    (rules.thead_close = function () {
        return "</thead>\n";
    }),
    (rules.tbody_open = function () {
        return "<tbody>\n";
    }),
    (rules.tbody_close = function () {
        return "</tbody>\n";
    }),
    (rules.tr_open = function () {
        return "<tr>";
    }),
    (rules.tr_close = function () {
        return "</tr>\n";
    }),
    (rules.th_open = function (t, e) {
        var i = t[e];
        return (
            "<th" + (i.align ? ' style="text-align:' + i.align + '"' : "") + ">"
        );
    }),
    (rules.th_close = function () {
        return "</th>";
    }),
    (rules.td_open = function (t, e) {
        var i = t[e];
        return (
            "<td" + (i.align ? ' style="text-align:' + i.align + '"' : "") + ">"
        );
    }),
    (rules.td_close = function () {
        return "</td>";
    }),
    (rules.strong_open = function () {
        return "<strong>";
    }),
    (rules.strong_close = function () {
        return "</strong>";
    }),
    (rules.em_open = function () {
        return "<em>";
    }),
    (rules.em_close = function () {
        return "</em>";
    }),
    (rules.del_open = function () {
        return "<del>";
    }),
    (rules.del_close = function () {
        return "</del>";
    }),
    (rules.ins_open = function () {
        return "<ins>";
    }),
    (rules.ins_close = function () {
        return "</ins>";
    }),
    (rules.mark_open = function () {
        return "<mark>";
    }),
    (rules.mark_close = function () {
        return "</mark>";
    }),
    (rules.sub = function (t, e) {
        return "<sub>" + escapeHtml(t[e].content) + "</sub>";
    }),
    (rules.sup = function (t, e) {
        return "<sup>" + escapeHtml(t[e].content) + "</sup>";
    }),
    (rules.hardbreak = function (t, e, i) {
        return i.xhtmlOut ? "<br />\n" : "<br>\n";
    }),
    (rules.softbreak = function (t, e, i) {
        return i.breaks ? (i.xhtmlOut ? "<br />\n" : "<br>\n") : "\n";
    }),
    (rules.text = function (t, e) {
        return escapeHtml(t[e].content);
    }),
    (rules.htmlblock = function (t, e) {
        return t[e].content;
    }),
    (rules.htmltag = function (t, e) {
        return t[e].content;
    }),
    (rules.abbr_open = function (t, e) {
        return '<abbr title="' + escapeHtml(replaceEntities(t[e].title)) + '">';
    }),
    (rules.abbr_close = function () {
        return "</abbr>";
    }),
    (rules.footnote_ref = function (t, e) {
        var i = Number(t[e].id + 1).toString(),
            s = "fnref" + i;
        return (
            t[e].subId > 0 && (s += ":" + t[e].subId),
            '<sup class="footnote-ref"><a href="#fn' +
                i +
                '" id="' +
                s +
                '">[' +
                i +
                "]</a></sup>"
        );
    }),
    (rules.footnote_block_open = function (t, e, i) {
        return (
            (i.xhtmlOut
                ? '<hr class="footnotes-sep" />\n'
                : '<hr class="footnotes-sep">\n') +
            '<section class="footnotes">\n<ol class="footnotes-list">\n'
        );
    }),
    (rules.footnote_block_close = function () {
        return "</ol>\n</section>\n";
    }),
    (rules.footnote_open = function (t, e) {
        return (
            '<li id="fn' +
            Number(t[e].id + 1).toString() +
            '"  class="footnote-item">'
        );
    }),
    (rules.footnote_close = function () {
        return "</li>\n";
    }),
    (rules.footnote_anchor = function (t, e) {
        var i = "fnref" + Number(t[e].id + 1).toString();
        return (
            t[e].subId > 0 && (i += ":" + t[e].subId),
            ' <a href="#' + i + '" class="footnote-backref">↩</a>'
        );
    }),
    (rules.dl_open = function () {
        return "<dl>\n";
    }),
    (rules.dt_open = function () {
        return "<dt>";
    }),
    (rules.dd_open = function () {
        return "<dd>";
    }),
    (rules.dl_close = function () {
        return "</dl>\n";
    }),
    (rules.dt_close = function () {
        return "</dt>\n";
    }),
    (rules.dd_close = function () {
        return "</dd>\n";
    });
var getBreak = (rules.getBreak = function (t, e) {
    return (e = nextToken(t, e)) < t.length && "list_item_close" === t[e].type
        ? ""
        : "\n";
});
function Renderer() {
    (this.rules = assign({}, rules)), (this.getBreak = rules.getBreak);
}
function Ruler() {
    (this.t = []), (this.i = null);
}
function block(t) {
    t.inlineMode
        ? t.tokens.push({
              type: "inline",
              content: t.src.replace(/\n/g, " ").trim(),
              level: 0,
              lines: [0, 1],
              children: [],
          })
        : t.block.parse(t.src, t.options, t.env, t.tokens);
}
function StateInline(t, e, i, s, n) {
    (this.src = t),
        (this.env = s),
        (this.options = i),
        (this.parser = e),
        (this.tokens = n),
        (this.pos = 0),
        (this.posMax = this.src.length),
        (this.level = 0),
        (this.pending = ""),
        (this.pendingLevel = 0),
        (this.cache = []),
        (this.isInLabel = !1),
        (this.linkLevel = 0),
        (this.linkContent = ""),
        (this.labelUnmatchedScopes = 0);
}
function parseLinkLabel(t, e) {
    var i,
        s,
        n,
        o = -1,
        r = t.posMax,
        a = t.pos,
        l = t.isInLabel;
    if (t.isInLabel) return -1;
    if (t.labelUnmatchedScopes) return t.labelUnmatchedScopes--, -1;
    for (t.pos = e + 1, t.isInLabel = !0, i = 1; t.pos < r; ) {
        if (91 === (n = t.src.charCodeAt(t.pos))) i++;
        else if (93 === n && 0 === --i) {
            s = !0;
            break;
        }
        t.parser.skipToken(t);
    }
    return (
        s
            ? ((o = t.pos), (t.labelUnmatchedScopes = 0))
            : (t.labelUnmatchedScopes = i - 1),
        (t.pos = a),
        (t.isInLabel = l),
        o
    );
}
function parseAbbr(t, e, i, s) {
    var n, o, r, a, l, c;
    if (
        42 !== t.charCodeAt(0) ||
        91 !== t.charCodeAt(1) ||
        -1 === t.indexOf("]:") ||
        (o = parseLinkLabel((n = new StateInline(t, e, i, s, [])), 1)) < 0 ||
        58 !== t.charCodeAt(o + 1)
    )
        return -1;
    for (a = n.posMax, r = o + 2; r < a && 10 !== n.src.charCodeAt(r); r++);
    return (
        (l = t.slice(2, o)),
        0 === (c = t.slice(o + 2, r).trim()).length
            ? -1
            : (s.abbreviations || (s.abbreviations = {}),
              typeof s.abbreviations[":" + l] > "u" &&
                  (s.abbreviations[":" + l] = c),
              r)
    );
}
function abbr(t) {
    var e,
        i,
        s,
        n,
        o = t.tokens;
    if (!t.inlineMode)
        for (e = 1, i = o.length - 1; e < i; e++)
            if (
                "paragraph_open" === o[e - 1].type &&
                "inline" === o[e].type &&
                "paragraph_close" === o[e + 1].type
            ) {
                for (
                    s = o[e].content;
                    s.length &&
                    !((n = parseAbbr(s, t.inline, t.options, t.env)) < 0);

                )
                    s = s.slice(n).trim();
                (o[e].content = s),
                    s.length || ((o[e - 1].tight = !0), (o[e + 1].tight = !0));
            }
}
function normalizeLink(t) {
    var e = replaceEntities(t);
    try {
        e = decodeURI(e);
    } catch {}
    return encodeURI(e);
}
function parseLinkDestination(t, e) {
    var i,
        s,
        n,
        o = e,
        r = t.posMax;
    if (60 === t.src.charCodeAt(e)) {
        for (e++; e < r; ) {
            if (10 === (i = t.src.charCodeAt(e))) return !1;
            if (62 === i)
                return (
                    (n = normalizeLink(unescapeMd(t.src.slice(o + 1, e)))),
                    !!t.parser.validateLink(n) &&
                        ((t.pos = e + 1), (t.linkContent = n), !0)
                );
            92 === i && e + 1 < r ? (e += 2) : e++;
        }
        return !1;
    }
    for (
        s = 0;
        e < r && !(32 === (i = t.src.charCodeAt(e)) || i < 32 || 127 === i);

    )
        if (92 === i && e + 1 < r) e += 2;
        else {
            if ((40 === i && ++s > 1) || (41 === i && --s < 0)) break;
            e++;
        }
    return (
        !(
            o === e ||
            ((n = unescapeMd(t.src.slice(o, e))), !t.parser.validateLink(n))
        ) && ((t.linkContent = n), (t.pos = e), !0)
    );
}
function parseLinkTitle(t, e) {
    var i,
        s = e,
        n = t.posMax,
        o = t.src.charCodeAt(e);
    if (34 !== o && 39 !== o && 40 !== o) return !1;
    for (e++, 40 === o && (o = 41); e < n; ) {
        if ((i = t.src.charCodeAt(e)) === o)
            return (
                (t.pos = e + 1),
                (t.linkContent = unescapeMd(t.src.slice(s + 1, e))),
                !0
            );
        92 === i && e + 1 < n ? (e += 2) : e++;
    }
    return !1;
}
function normalizeReference(t) {
    return t.trim().replace(/\s+/g, " ").toUpperCase();
}
function parseReference(t, e, i, s) {
    var n, o, r, a, l, c, u, h, d;
    if (
        91 !== t.charCodeAt(0) ||
        -1 === t.indexOf("]:") ||
        (o = parseLinkLabel((n = new StateInline(t, e, i, s, [])), 0)) < 0 ||
        58 !== t.charCodeAt(o + 1)
    )
        return -1;
    for (
        a = n.posMax, r = o + 2;
        r < a && (32 === (l = n.src.charCodeAt(r)) || 10 === l);
        r++
    );
    if (!parseLinkDestination(n, r)) return -1;
    for (
        u = n.linkContent, c = r = n.pos, r += 1;
        r < a && (32 === (l = n.src.charCodeAt(r)) || 10 === l);
        r++
    );
    for (
        r < a && c !== r && parseLinkTitle(n, r)
            ? ((h = n.linkContent), (r = n.pos))
            : ((h = ""), (r = c));
        r < a && 32 === n.src.charCodeAt(r);

    )
        r++;
    return r < a && 10 !== n.src.charCodeAt(r)
        ? -1
        : ((d = normalizeReference(t.slice(1, o))),
          typeof s.references[d] > "u" &&
              (s.references[d] = { title: h, href: u }),
          r);
}
function references(t) {
    var e,
        i,
        s,
        n,
        o = t.tokens;
    if (((t.env.references = t.env.references || {}), !t.inlineMode))
        for (e = 1, i = o.length - 1; e < i; e++)
            if (
                "inline" === o[e].type &&
                "paragraph_open" === o[e - 1].type &&
                "paragraph_close" === o[e + 1].type
            ) {
                for (
                    s = o[e].content;
                    s.length &&
                    !((n = parseReference(s, t.inline, t.options, t.env)) < 0);

                )
                    s = s.slice(n).trim();
                (o[e].content = s),
                    s.length || ((o[e - 1].tight = !0), (o[e + 1].tight = !0));
            }
}
function inline(t) {
    var e,
        i,
        s,
        n = t.tokens;
    for (i = 0, s = n.length; i < s; i++)
        "inline" === (e = n[i]).type &&
            t.inline.parse(e.content, t.options, t.env, e.children);
}
function footnote_block(t) {
    var e,
        i,
        s,
        n,
        o,
        r,
        a,
        l,
        c,
        u = 0,
        h = !1,
        d = {};
    if (
        t.env.footnotes &&
        ((t.tokens = t.tokens.filter(function (t) {
            return "footnote_reference_open" === t.type
                ? ((h = !0), (l = []), (c = t.label), !1)
                : "footnote_reference_close" === t.type
                ? ((h = !1), (d[":" + c] = l), !1)
                : (h && l.push(t), !h);
        })),
        t.env.footnotes.list)
    ) {
        for (
            r = t.env.footnotes.list,
                t.tokens.push({ type: "footnote_block_open", level: u++ }),
                e = 0,
                i = r.length;
            e < i;
            e++
        ) {
            for (
                t.tokens.push({ type: "footnote_open", id: e, level: u++ }),
                    r[e].tokens
                        ? ((a = []).push({
                              type: "paragraph_open",
                              tight: !1,
                              level: u++,
                          }),
                          a.push({
                              type: "inline",
                              content: "",
                              level: u,
                              children: r[e].tokens,
                          }),
                          a.push({
                              type: "paragraph_close",
                              tight: !1,
                              level: --u,
                          }))
                        : r[e].label && (a = d[":" + r[e].label]),
                    t.tokens = t.tokens.concat(a),
                    o =
                        "paragraph_close" === t.tokens[t.tokens.length - 1].type
                            ? t.tokens.pop()
                            : null,
                    n = r[e].count > 0 ? r[e].count : 1,
                    s = 0;
                s < n;
                s++
            )
                t.tokens.push({
                    type: "footnote_anchor",
                    id: e,
                    subId: s,
                    level: u,
                });
            o && t.tokens.push(o),
                t.tokens.push({ type: "footnote_close", level: --u });
        }
        t.tokens.push({ type: "footnote_block_close", level: --u });
    }
}
(Renderer.prototype.renderInline = function (t, e, i) {
    for (var s = this.rules, n = t.length, o = 0, r = ""; n--; )
        r += s[t[o].type](t, o++, e, i, this);
    return r;
}),
    (Renderer.prototype.render = function (t, e, i) {
        for (var s = this.rules, n = t.length, o = -1, r = ""; ++o < n; )
            "inline" === t[o].type
                ? (r += this.renderInline(t[o].children, e, i))
                : (r += s[t[o].type](t, o, e, i, this));
        return r;
    }),
    (Ruler.prototype.o = function (t) {
        for (var e = this.t.length, i = -1; e--; )
            if (this.t[++i].name === t) return i;
        return -1;
    }),
    (Ruler.prototype.l = function () {
        var t = this,
            e = [""];
        t.t.forEach(function (t) {
            t.enabled &&
                t.alt.forEach(function (t) {
                    e.indexOf(t) < 0 && e.push(t);
                });
        }),
            (t.i = {}),
            e.forEach(function (e) {
                (t.i[e] = []),
                    t.t.forEach(function (i) {
                        i.enabled &&
                            ((e && i.alt.indexOf(e) < 0) || t.i[e].push(i.fn));
                    });
            });
    }),
    (Ruler.prototype.at = function (t, e, i) {
        var s = this.o(t),
            n = i || {};
        if (-1 === s) throw new Error("Parser rule not found: " + t);
        (this.t[s].fn = e), (this.t[s].alt = n.alt || []), (this.i = null);
    }),
    (Ruler.prototype.before = function (t, e, i, s) {
        var n = this.o(t),
            o = s || {};
        if (-1 === n) throw new Error("Parser rule not found: " + t);
        this.t.splice(n, 0, { name: e, enabled: !0, fn: i, alt: o.alt || [] }),
            (this.i = null);
    }),
    (Ruler.prototype.after = function (t, e, i, s) {
        var n = this.o(t),
            o = s || {};
        if (-1 === n) throw new Error("Parser rule not found: " + t);
        this.t.splice(n + 1, 0, {
            name: e,
            enabled: !0,
            fn: i,
            alt: o.alt || [],
        }),
            (this.i = null);
    }),
    (Ruler.prototype.push = function (t, e, i) {
        var s = i || {};
        this.t.push({ name: t, enabled: !0, fn: e, alt: s.alt || [] }),
            (this.i = null);
    }),
    (Ruler.prototype.enable = function (t, e) {
        (t = Array.isArray(t) ? t : [t]),
            e &&
                this.t.forEach(function (t) {
                    t.enabled = !1;
                }),
            t.forEach(function (t) {
                var e = this.o(t);
                if (e < 0)
                    throw new Error("Rules manager: invalid rule name " + t);
                this.t[e].enabled = !0;
            }, this),
            (this.i = null);
    }),
    (Ruler.prototype.disable = function (t) {
        (t = Array.isArray(t) ? t : [t]).forEach(function (t) {
            var e = this.o(t);
            if (e < 0) throw new Error("Rules manager: invalid rule name " + t);
            this.t[e].enabled = !1;
        }, this),
            (this.i = null);
    }),
    (Ruler.prototype.getRules = function (t) {
        return null === this.i && this.l(), this.i[t] || [];
    }),
    (StateInline.prototype.pushPending = function () {
        this.tokens.push({
            type: "text",
            content: this.pending,
            level: this.pendingLevel,
        }),
            (this.pending = "");
    }),
    (StateInline.prototype.push = function (t) {
        this.pending && this.pushPending(),
            this.tokens.push(t),
            (this.pendingLevel = this.level);
    }),
    (StateInline.prototype.cacheSet = function (t, e) {
        for (var i = this.cache.length; i <= t; i++) this.cache.push(0);
        this.cache[t] = e;
    }),
    (StateInline.prototype.cacheGet = function (t) {
        return t < this.cache.length ? this.cache[t] : 0;
    });
var PUNCT_CHARS = " \n()[]'\".,!?-";
function regEscape(t) {
    return t.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1");
}
function abbr2(t) {
    var e,
        i,
        s,
        n,
        o,
        r,
        a,
        l,
        c,
        u,
        h,
        d,
        p = t.tokens;
    if (t.env.abbreviations)
        for (
            t.env.abbrRegExp ||
                ((d =
                    "(^|[" +
                    PUNCT_CHARS.split("").map(regEscape).join("") +
                    "])(" +
                    Object.keys(t.env.abbreviations)
                        .map(function (t) {
                            return t.substr(1);
                        })
                        .sort(function (t, e) {
                            return e.length - t.length;
                        })
                        .map(regEscape)
                        .join("|") +
                    ")($|[" +
                    PUNCT_CHARS.split("").map(regEscape).join("") +
                    "])"),
                (t.env.abbrRegExp = new RegExp(d, "g"))),
                u = t.env.abbrRegExp,
                i = 0,
                s = p.length;
            i < s;
            i++
        )
            if ("inline" === p[i].type)
                for (e = (n = p[i].children).length - 1; e >= 0; e--)
                    if ("text" === (o = n[e]).type) {
                        for (
                            l = 0,
                                r = o.content,
                                u.lastIndex = 0,
                                c = o.level,
                                a = [];
                            (h = u.exec(r));

                        )
                            u.lastIndex > l &&
                                a.push({
                                    type: "text",
                                    content: r.slice(l, h.index + h[1].length),
                                    level: c,
                                }),
                                a.push({
                                    type: "abbr_open",
                                    title: t.env.abbreviations[":" + h[2]],
                                    level: c++,
                                }),
                                a.push({
                                    type: "text",
                                    content: h[2],
                                    level: c,
                                }),
                                a.push({ type: "abbr_close", level: --c }),
                                (l = u.lastIndex - h[3].length);
                        a.length &&
                            (l < r.length &&
                                a.push({
                                    type: "text",
                                    content: r.slice(l),
                                    level: c,
                                }),
                            (p[i].children = n =
                                [].concat(n.slice(0, e), a, n.slice(e + 1))));
                    }
}
var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/,
    SCOPED_ABBR_RE = /\((c|tm|r|p)\)/gi,
    SCOPED_ABBR = { c: "©", r: "®", p: "§", tm: "™" };
function replaceScopedAbbr(t) {
    return t.indexOf("(") < 0
        ? t
        : t.replace(SCOPED_ABBR_RE, function (t, e) {
              return SCOPED_ABBR[e.toLowerCase()];
          });
}
function replace(t) {
    var e, i, s, n, o;
    if (t.options.typographer)
        for (o = t.tokens.length - 1; o >= 0; o--)
            if ("inline" === t.tokens[o].type)
                for (e = (n = t.tokens[o].children).length - 1; e >= 0; e--)
                    "text" === (i = n[e]).type &&
                        ((s = replaceScopedAbbr((s = i.content))),
                        RARE_RE.test(s) &&
                            (s = s
                                .replace(/\+-/g, "±")
                                .replace(/\.{2,}/g, "…")
                                .replace(/([?!])…/g, "$1..")
                                .replace(/([?!]){4,}/g, "$1$1$1")
                                .replace(/,{2,}/g, ",")
                                .replace(/(^|[^-])---([^-]|$)/gm, "$1—$2")
                                .replace(/(^|\s)--(\s|$)/gm, "$1–$2")
                                .replace(/(^|[^-\s])--([^-\s]|$)/gm, "$1–$2")),
                        (i.content = s));
}
var QUOTE_TEST_RE = /['"]/,
    QUOTE_RE = /['"]/g,
    PUNCT_RE = /[-\s()\[\]]/,
    APOSTROPHE = "’";
function isLetter(t, e) {
    return !(e < 0 || e >= t.length) && !PUNCT_RE.test(t[e]);
}
function replaceAt(t, e, i) {
    return t.substr(0, e) + i + t.substr(e + 1);
}
function smartquotes(t) {
    var e, i, s, n, o, r, a, l, c, u, h, d, p, m, g, v, f;
    if (t.options.typographer)
        for (f = [], g = t.tokens.length - 1; g >= 0; g--)
            if ("inline" === t.tokens[g].type)
                for (
                    v = t.tokens[g].children, f.length = 0, e = 0;
                    e < v.length;
                    e++
                )
                    if (
                        "text" === (i = v[e]).type &&
                        !QUOTE_TEST_RE.test(i.text)
                    ) {
                        for (
                            a = v[e].level, p = f.length - 1;
                            p >= 0 && !(f[p].level <= a);
                            p--
                        );
                        (f.length = p + 1),
                            (o = 0),
                            (r = (s = i.content).length);
                        t: for (
                            ;
                            o < r &&
                            ((QUOTE_RE.lastIndex = o),
                            (n = QUOTE_RE.exec(s)),
                            n);

                        )
                            if (
                                ((l = !isLetter(s, n.index - 1)),
                                (o = n.index + 1),
                                (m = "'" === n[0]),
                                (c = !isLetter(s, o)) || l)
                            ) {
                                if (((h = !c), (d = !l)))
                                    for (
                                        p = f.length - 1;
                                        p >= 0 &&
                                        ((u = f[p]), !(f[p].level < a));
                                        p--
                                    )
                                        if (
                                            u.single === m &&
                                            f[p].level === a
                                        ) {
                                            (u = f[p]),
                                                m
                                                    ? ((v[u.token].content =
                                                          replaceAt(
                                                              v[u.token]
                                                                  .content,
                                                              u.pos,
                                                              t.options
                                                                  .quotes[2]
                                                          )),
                                                      (i.content = replaceAt(
                                                          i.content,
                                                          n.index,
                                                          t.options.quotes[3]
                                                      )))
                                                    : ((v[u.token].content =
                                                          replaceAt(
                                                              v[u.token]
                                                                  .content,
                                                              u.pos,
                                                              t.options
                                                                  .quotes[0]
                                                          )),
                                                      (i.content = replaceAt(
                                                          i.content,
                                                          n.index,
                                                          t.options.quotes[1]
                                                      ))),
                                                (f.length = p);
                                            continue t;
                                        }
                                h
                                    ? f.push({
                                          token: e,
                                          pos: n.index,
                                          single: m,
                                          level: a,
                                      })
                                    : d &&
                                      m &&
                                      (i.content = replaceAt(
                                          i.content,
                                          n.index,
                                          APOSTROPHE
                                      ));
                            } else
                                m &&
                                    (i.content = replaceAt(
                                        i.content,
                                        n.index,
                                        APOSTROPHE
                                    ));
                    }
}
var _rules = [
    ["block", block],
    ["abbr", abbr],
    ["references", references],
    ["inline", inline],
    ["footnote_tail", footnote_block],
    ["abbr2", abbr2],
    ["replacements", replace],
    ["smartquotes", smartquotes],
];
function Core() {
    (this.options = {}), (this.ruler = new Ruler());
    for (var t = 0; t < _rules.length; t++)
        this.ruler.push(_rules[t][0], _rules[t][1]);
}
function StateBlock(t, e, i, s, n) {
    var o, r, a, l, c, u, h;
    for (
        this.src = t,
            this.parser = e,
            this.options = i,
            this.env = s,
            this.tokens = n,
            this.bMarks = [],
            this.eMarks = [],
            this.tShift = [],
            this.blkIndent = 0,
            this.line = 0,
            this.lineMax = 0,
            this.tight = !1,
            this.parentType = "root",
            this.ddIndent = -1,
            this.level = 0,
            this.result = "",
            u = 0,
            h = !1,
            a = l = u = 0,
            c = (r = this.src).length;
        l < c;
        l++
    ) {
        if (((o = r.charCodeAt(l)), !h)) {
            if (32 === o) {
                u++;
                continue;
            }
            h = !0;
        }
        (10 === o || l === c - 1) &&
            (10 !== o && l++,
            this.bMarks.push(a),
            this.eMarks.push(l),
            this.tShift.push(u),
            (h = !1),
            (u = 0),
            (a = l + 1));
    }
    this.bMarks.push(r.length),
        this.eMarks.push(r.length),
        this.tShift.push(0),
        (this.lineMax = this.bMarks.length - 1);
}
function code(t, e, i) {
    var s, n;
    if (t.tShift[e] - t.blkIndent < 4) return !1;
    for (n = s = e + 1; s < i; )
        if (t.isEmpty(s)) s++;
        else {
            if (!(t.tShift[s] - t.blkIndent >= 4)) break;
            n = ++s;
        }
    return (
        (t.line = s),
        t.tokens.push({
            type: "code",
            content: t.getLines(e, n, 4 + t.blkIndent, !0),
            block: !0,
            lines: [e, t.line],
            level: t.level,
        }),
        !0
    );
}
function fences(t, e, i, s) {
    var n,
        o,
        r,
        a,
        l,
        c = !1,
        u = t.bMarks[e] + t.tShift[e],
        h = t.eMarks[e];
    if (
        u + 3 > h ||
        (126 !== (n = t.src.charCodeAt(u)) && 96 !== n) ||
        ((l = u), (o = (u = t.skipChars(u, n)) - l) < 3) ||
        (r = t.src.slice(u, h).trim()).indexOf("`") >= 0
    )
        return !1;
    if (s) return !0;
    for (
        a = e;
        !(
            ++a >= i ||
            ((u = l = t.bMarks[a] + t.tShift[a]),
            (h = t.eMarks[a]),
            u < h && t.tShift[a] < t.blkIndent)
        );

    )
        if (
            !(
                t.src.charCodeAt(u) !== n ||
                t.tShift[a] - t.blkIndent >= 4 ||
                ((u = t.skipChars(u, n)),
                u - l < o || ((u = t.skipSpaces(u)), u < h))
            )
        ) {
            c = !0;
            break;
        }
    return (
        (o = t.tShift[e]),
        (t.line = a + (c ? 1 : 0)),
        t.tokens.push({
            type: "fence",
            params: r,
            content: t.getLines(e + 1, a, o, !0),
            lines: [e, t.line],
            level: t.level,
        }),
        !0
    );
}
function blockquote(t, e, i, s) {
    var n,
        o,
        r,
        a,
        l,
        c,
        u,
        h,
        d,
        p,
        m,
        g = t.bMarks[e] + t.tShift[e],
        v = t.eMarks[e];
    if (
        g > v ||
        62 !== t.src.charCodeAt(g++) ||
        t.level >= t.options.maxNesting
    )
        return !1;
    if (s) return !0;
    for (
        32 === t.src.charCodeAt(g) && g++,
            l = t.blkIndent,
            t.blkIndent = 0,
            a = [t.bMarks[e]],
            t.bMarks[e] = g,
            o = (g = g < v ? t.skipSpaces(g) : g) >= v,
            r = [t.tShift[e]],
            t.tShift[e] = g - t.bMarks[e],
            h = t.parser.ruler.getRules("blockquote"),
            n = e + 1;
        n < i && !((g = t.bMarks[n] + t.tShift[n]) >= (v = t.eMarks[n]));
        n++
    )
        if (62 !== t.src.charCodeAt(g++)) {
            if (o) break;
            for (m = !1, d = 0, p = h.length; d < p; d++)
                if (h[d](t, n, i, !0)) {
                    m = !0;
                    break;
                }
            if (m) break;
            a.push(t.bMarks[n]), r.push(t.tShift[n]), (t.tShift[n] = -1337);
        } else
            32 === t.src.charCodeAt(g) && g++,
                a.push(t.bMarks[n]),
                (t.bMarks[n] = g),
                (o = (g = g < v ? t.skipSpaces(g) : g) >= v),
                r.push(t.tShift[n]),
                (t.tShift[n] = g - t.bMarks[n]);
    for (
        c = t.parentType,
            t.parentType = "blockquote",
            t.tokens.push({
                type: "blockquote_open",
                lines: (u = [e, 0]),
                level: t.level++,
            }),
            t.parser.tokenize(t, e, n),
            t.tokens.push({ type: "blockquote_close", level: --t.level }),
            t.parentType = c,
            u[1] = t.line,
            d = 0;
        d < r.length;
        d++
    )
        (t.bMarks[d + e] = a[d]), (t.tShift[d + e] = r[d]);
    return (t.blkIndent = l), !0;
}
function hr(t, e, i, s) {
    var n,
        o,
        r,
        a = t.bMarks[e],
        l = t.eMarks[e];
    if (
        (a += t.tShift[e]) > l ||
        (42 !== (n = t.src.charCodeAt(a++)) && 45 !== n && 95 !== n)
    )
        return !1;
    for (o = 1; a < l; ) {
        if ((r = t.src.charCodeAt(a++)) !== n && 32 !== r) return !1;
        r === n && o++;
    }
    return (
        !(o < 3) &&
        (s ||
            ((t.line = e + 1),
            t.tokens.push({ type: "hr", lines: [e, t.line], level: t.level })),
        !0)
    );
}
function skipBulletListMarker(t, e) {
    var i, s, n;
    return (s = t.bMarks[e] + t.tShift[e]) >= (n = t.eMarks[e]) ||
        (42 !== (i = t.src.charCodeAt(s++)) && 45 !== i && 43 !== i) ||
        (s < n && 32 !== t.src.charCodeAt(s))
        ? -1
        : s;
}
function skipOrderedListMarker(t, e) {
    var i,
        s = t.bMarks[e] + t.tShift[e],
        n = t.eMarks[e];
    if (s + 1 >= n || (i = t.src.charCodeAt(s++)) < 48 || i > 57) return -1;
    for (;;) {
        if (s >= n) return -1;
        if (!((i = t.src.charCodeAt(s++)) >= 48 && i <= 57)) {
            if (41 === i || 46 === i) break;
            return -1;
        }
    }
    return s < n && 32 !== t.src.charCodeAt(s) ? -1 : s;
}
function markTightParagraphs(t, e) {
    var i,
        s,
        n = t.level + 2;
    for (i = e + 2, s = t.tokens.length - 2; i < s; i++)
        t.tokens[i].level === n &&
            "paragraph_open" === t.tokens[i].type &&
            ((t.tokens[i + 2].tight = !0), (t.tokens[i].tight = !0), (i += 2));
}
function list(t, e, i, s) {
    var n,
        o,
        r,
        a,
        l,
        c,
        u,
        h,
        d,
        p,
        m,
        g,
        v,
        f,
        b,
        y,
        w,
        S,
        x,
        I,
        T,
        _ = !0;
    if ((h = skipOrderedListMarker(t, e)) >= 0) g = !0;
    else {
        if (!((h = skipBulletListMarker(t, e)) >= 0)) return !1;
        g = !1;
    }
    if (t.level >= t.options.maxNesting) return !1;
    if (((m = t.src.charCodeAt(h - 1)), s)) return !0;
    for (
        f = t.tokens.length,
            g
                ? ((u = t.bMarks[e] + t.tShift[e]),
                  (p = Number(t.src.substr(u, h - u - 1))),
                  t.tokens.push({
                      type: "ordered_list_open",
                      order: p,
                      lines: (y = [e, 0]),
                      level: t.level++,
                  }))
                : t.tokens.push({
                      type: "bullet_list_open",
                      lines: (y = [e, 0]),
                      level: t.level++,
                  }),
            n = e,
            b = !1,
            S = t.parser.ruler.getRules("list");
        n < i &&
        ((d = (v = t.skipSpaces(h)) >= t.eMarks[n] ? 1 : v - h) > 4 && (d = 1),
        d < 1 && (d = 1),
        (o = h - t.bMarks[n] + d),
        t.tokens.push({
            type: "list_item_open",
            lines: (w = [e, 0]),
            level: t.level++,
        }),
        (a = t.blkIndent),
        (l = t.tight),
        (r = t.tShift[e]),
        (c = t.parentType),
        (t.tShift[e] = v - t.bMarks[e]),
        (t.blkIndent = o),
        (t.tight = !0),
        (t.parentType = "list"),
        t.parser.tokenize(t, e, i, !0),
        (!t.tight || b) && (_ = !1),
        (b = t.line - e > 1 && t.isEmpty(t.line - 1)),
        (t.blkIndent = a),
        (t.tShift[e] = r),
        (t.tight = l),
        (t.parentType = c),
        t.tokens.push({ type: "list_item_close", level: --t.level }),
        (n = e = t.line),
        (w[1] = n),
        (v = t.bMarks[e]),
        !(n >= i || t.isEmpty(n) || t.tShift[n] < t.blkIndent));

    ) {
        for (T = !1, x = 0, I = S.length; x < I; x++)
            if (S[x](t, n, i, !0)) {
                T = !0;
                break;
            }
        if (T) break;
        if (g) {
            if ((h = skipOrderedListMarker(t, n)) < 0) break;
        } else if ((h = skipBulletListMarker(t, n)) < 0) break;
        if (m !== t.src.charCodeAt(h - 1)) break;
    }
    return (
        t.tokens.push({
            type: g ? "ordered_list_close" : "bullet_list_close",
            level: --t.level,
        }),
        (y[1] = n),
        (t.line = n),
        _ && markTightParagraphs(t, f),
        !0
    );
}
function footnote(t, e, i, s) {
    var n,
        o,
        r,
        a,
        l,
        c = t.bMarks[e] + t.tShift[e],
        u = t.eMarks[e];
    if (
        c + 4 > u ||
        91 !== t.src.charCodeAt(c) ||
        94 !== t.src.charCodeAt(c + 1) ||
        t.level >= t.options.maxNesting
    )
        return !1;
    for (a = c + 2; a < u; a++) {
        if (32 === t.src.charCodeAt(a)) return !1;
        if (93 === t.src.charCodeAt(a)) break;
    }
    return (
        !(a === c + 2 || a + 1 >= u || 58 !== t.src.charCodeAt(++a)) &&
        (s ||
            (a++,
            t.env.footnotes || (t.env.footnotes = {}),
            t.env.footnotes.refs || (t.env.footnotes.refs = {}),
            (l = t.src.slice(c + 2, a - 2)),
            (t.env.footnotes.refs[":" + l] = -1),
            t.tokens.push({
                type: "footnote_reference_open",
                label: l,
                level: t.level++,
            }),
            (n = t.bMarks[e]),
            (o = t.tShift[e]),
            (r = t.parentType),
            (t.tShift[e] = t.skipSpaces(a) - a),
            (t.bMarks[e] = a),
            (t.blkIndent += 4),
            (t.parentType = "footnote"),
            t.tShift[e] < t.blkIndent &&
                ((t.tShift[e] += t.blkIndent), (t.bMarks[e] -= t.blkIndent)),
            t.parser.tokenize(t, e, i, !0),
            (t.parentType = r),
            (t.blkIndent -= 4),
            (t.tShift[e] = o),
            (t.bMarks[e] = n),
            t.tokens.push({
                type: "footnote_reference_close",
                level: --t.level,
            })),
        !0)
    );
}
function heading(t, e, i, s) {
    var n,
        o,
        r,
        a = t.bMarks[e] + t.tShift[e],
        l = t.eMarks[e];
    if (a >= l || 35 !== (n = t.src.charCodeAt(a)) || a >= l) return !1;
    for (o = 1, n = t.src.charCodeAt(++a); 35 === n && a < l && o <= 6; )
        o++, (n = t.src.charCodeAt(++a));
    return (
        !(o > 6 || (a < l && 32 !== n)) &&
        (s ||
            ((l = t.skipCharsBack(l, 32, a)),
            (r = t.skipCharsBack(l, 35, a)) > a &&
                32 === t.src.charCodeAt(r - 1) &&
                (l = r),
            (t.line = e + 1),
            t.tokens.push({
                type: "heading_open",
                hLevel: o,
                lines: [e, t.line],
                level: t.level,
            }),
            a < l &&
                t.tokens.push({
                    type: "inline",
                    content: t.src.slice(a, l).trim(),
                    level: t.level + 1,
                    lines: [e, t.line],
                    children: [],
                }),
            t.tokens.push({
                type: "heading_close",
                hLevel: o,
                level: t.level,
            })),
        !0)
    );
}
function lheading(t, e, i) {
    var s,
        n,
        o,
        r = e + 1;
    return (
        !(
            r >= i ||
            t.tShift[r] < t.blkIndent ||
            t.tShift[r] - t.blkIndent > 3 ||
            ((n = t.bMarks[r] + t.tShift[r]), (o = t.eMarks[r]), n >= o) ||
            ((s = t.src.charCodeAt(n)), 45 !== s && 61 !== s) ||
            ((n = t.skipChars(n, s)), (n = t.skipSpaces(n)), n < o)
        ) &&
        ((n = t.bMarks[e] + t.tShift[e]),
        (t.line = r + 1),
        t.tokens.push({
            type: "heading_open",
            hLevel: 61 === s ? 1 : 2,
            lines: [e, t.line],
            level: t.level,
        }),
        t.tokens.push({
            type: "inline",
            content: t.src.slice(n, t.eMarks[e]).trim(),
            level: t.level + 1,
            lines: [e, t.line - 1],
            children: [],
        }),
        t.tokens.push({
            type: "heading_close",
            hLevel: 61 === s ? 1 : 2,
            level: t.level,
        }),
        !0)
    );
}
(Core.prototype.process = function (t) {
    var e, i, s;
    for (e = 0, i = (s = this.ruler.getRules("")).length; e < i; e++) s[e](t);
}),
    (StateBlock.prototype.isEmpty = function (t) {
        return this.bMarks[t] + this.tShift[t] >= this.eMarks[t];
    }),
    (StateBlock.prototype.skipEmptyLines = function (t) {
        for (
            var e = this.lineMax;
            t < e && !(this.bMarks[t] + this.tShift[t] < this.eMarks[t]);
            t++
        );
        return t;
    }),
    (StateBlock.prototype.skipSpaces = function (t) {
        for (
            var e = this.src.length;
            t < e && 32 === this.src.charCodeAt(t);
            t++
        );
        return t;
    }),
    (StateBlock.prototype.skipChars = function (t, e) {
        for (
            var i = this.src.length;
            t < i && this.src.charCodeAt(t) === e;
            t++
        );
        return t;
    }),
    (StateBlock.prototype.skipCharsBack = function (t, e, i) {
        if (t <= i) return t;
        for (; t > i; ) if (e !== this.src.charCodeAt(--t)) return t + 1;
        return t;
    }),
    (StateBlock.prototype.getLines = function (t, e, i, s) {
        var n,
            o,
            r,
            a,
            l,
            c = t;
        if (t >= e) return "";
        if (c + 1 === e)
            return (
                (o = this.bMarks[c] + Math.min(this.tShift[c], i)),
                (r = s ? this.eMarks[c] + 1 : this.eMarks[c]),
                this.src.slice(o, r)
            );
        for (a = new Array(e - t), n = 0; c < e; c++, n++)
            (l = this.tShift[c]) > i && (l = i),
                l < 0 && (l = 0),
                (o = this.bMarks[c] + l),
                (r = c + 1 < e || s ? this.eMarks[c] + 1 : this.eMarks[c]),
                (a[n] = this.src.slice(o, r));
        return a.join("");
    });
var html_blocks = {};
[
    "article",
    "aside",
    "button",
    "blockquote",
    "body",
    "canvas",
    "caption",
    "col",
    "colgroup",
    "dd",
    "div",
    "dl",
    "dt",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "hr",
    "iframe",
    "li",
    "map",
    "object",
    "ol",
    "output",
    "p",
    "pre",
    "progress",
    "script",
    "section",
    "style",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "tr",
    "thead",
    "ul",
    "video",
].forEach(function (t) {
    html_blocks[t] = !0;
});
var HTML_TAG_OPEN_RE = /^<([a-zA-Z]{1,15})[\s\/>]/,
    HTML_TAG_CLOSE_RE = /^<\/([a-zA-Z]{1,15})[\s>]/;
function isLetter$1(t) {
    var e = 32 | t;
    return e >= 97 && e <= 122;
}
function htmlblock(t, e, i, s) {
    var n,
        o,
        r,
        a = t.bMarks[e],
        l = t.eMarks[e],
        c = t.tShift[e];
    if (
        ((a += c),
        !t.options.html || c > 3 || a + 2 >= l || 60 !== t.src.charCodeAt(a))
    )
        return !1;
    if (33 === (n = t.src.charCodeAt(a + 1)) || 63 === n) {
        if (s) return !0;
    } else {
        if (47 !== n && !isLetter$1(n)) return !1;
        if (47 === n) {
            if (!(o = t.src.slice(a, l).match(HTML_TAG_CLOSE_RE))) return !1;
        } else if (!(o = t.src.slice(a, l).match(HTML_TAG_OPEN_RE))) return !1;
        if (!0 !== html_blocks[o[1].toLowerCase()]) return !1;
        if (s) return !0;
    }
    for (r = e + 1; r < t.lineMax && !t.isEmpty(r); ) r++;
    return (
        (t.line = r),
        t.tokens.push({
            type: "htmlblock",
            level: t.level,
            lines: [e, t.line],
            content: t.getLines(e, r, 0, !0),
        }),
        !0
    );
}
function getLine(t, e) {
    var i = t.bMarks[e] + t.blkIndent,
        s = t.eMarks[e];
    return t.src.substr(i, s - i);
}
function table(t, e, i, s) {
    var n, o, r, a, l, c, u, h, d, p, m;
    if (
        e + 2 > i ||
        ((l = e + 1), t.tShift[l] < t.blkIndent) ||
        (r = t.bMarks[l] + t.tShift[l]) >= t.eMarks[l] ||
        (124 !== (n = t.src.charCodeAt(r)) && 45 !== n && 58 !== n) ||
        ((o = getLine(t, e + 1)), !/^[-:| ]+$/.test(o)) ||
        (c = o.split("|")) <= 2
    )
        return !1;
    for (h = [], a = 0; a < c.length; a++) {
        if (!(d = c[a].trim())) {
            if (0 === a || a === c.length - 1) continue;
            return !1;
        }
        if (!/^:?-+:?$/.test(d)) return !1;
        58 === d.charCodeAt(d.length - 1)
            ? h.push(58 === d.charCodeAt(0) ? "center" : "right")
            : 58 === d.charCodeAt(0)
            ? h.push("left")
            : h.push("");
    }
    if (
        -1 === (o = getLine(t, e).trim()).indexOf("|") ||
        ((c = o.replace(/^\||\|$/g, "").split("|")), h.length !== c.length)
    )
        return !1;
    if (s) return !0;
    for (
        t.tokens.push({
            type: "table_open",
            lines: (p = [e, 0]),
            level: t.level++,
        }),
            t.tokens.push({
                type: "thead_open",
                lines: [e, e + 1],
                level: t.level++,
            }),
            t.tokens.push({
                type: "tr_open",
                lines: [e, e + 1],
                level: t.level++,
            }),
            a = 0;
        a < c.length;
        a++
    )
        t.tokens.push({
            type: "th_open",
            align: h[a],
            lines: [e, e + 1],
            level: t.level++,
        }),
            t.tokens.push({
                type: "inline",
                content: c[a].trim(),
                lines: [e, e + 1],
                level: t.level,
                children: [],
            }),
            t.tokens.push({ type: "th_close", level: --t.level });
    for (
        t.tokens.push({ type: "tr_close", level: --t.level }),
            t.tokens.push({ type: "thead_close", level: --t.level }),
            t.tokens.push({
                type: "tbody_open",
                lines: (m = [e + 2, 0]),
                level: t.level++,
            }),
            l = e + 2;
        l < i &&
        !(
            t.tShift[l] < t.blkIndent ||
            ((o = getLine(t, l).trim()), -1 === o.indexOf("|"))
        );
        l++
    ) {
        for (
            c = o.replace(/^\||\|$/g, "").split("|"),
                t.tokens.push({ type: "tr_open", level: t.level++ }),
                a = 0;
            a < c.length;
            a++
        )
            t.tokens.push({ type: "td_open", align: h[a], level: t.level++ }),
                (u = c[a]
                    .substring(
                        124 === c[a].charCodeAt(0) ? 1 : 0,
                        124 === c[a].charCodeAt(c[a].length - 1)
                            ? c[a].length - 1
                            : c[a].length
                    )
                    .trim()),
                t.tokens.push({
                    type: "inline",
                    content: u,
                    level: t.level,
                    children: [],
                }),
                t.tokens.push({ type: "td_close", level: --t.level });
        t.tokens.push({ type: "tr_close", level: --t.level });
    }
    return (
        t.tokens.push({ type: "tbody_close", level: --t.level }),
        t.tokens.push({ type: "table_close", level: --t.level }),
        (p[1] = m[1] = l),
        (t.line = l),
        !0
    );
}
function skipMarker(t, e) {
    var i,
        s,
        n = t.bMarks[e] + t.tShift[e],
        o = t.eMarks[e];
    return n >= o ||
        (126 !== (s = t.src.charCodeAt(n++)) && 58 !== s) ||
        n === (i = t.skipSpaces(n)) ||
        i >= o
        ? -1
        : i;
}
function markTightParagraphs$1(t, e) {
    var i,
        s,
        n = t.level + 2;
    for (i = e + 2, s = t.tokens.length - 2; i < s; i++)
        t.tokens[i].level === n &&
            "paragraph_open" === t.tokens[i].type &&
            ((t.tokens[i + 2].tight = !0), (t.tokens[i].tight = !0), (i += 2));
}
function deflist(t, e, i, s) {
    var n, o, r, a, l, c, u, h, d, p, m, g, v, f;
    if (s) return !(t.ddIndent < 0) && skipMarker(t, e) >= 0;
    if (
        ((u = e + 1),
        (t.isEmpty(u) && ++u > i) ||
            t.tShift[u] < t.blkIndent ||
            (n = skipMarker(t, u)) < 0 ||
            t.level >= t.options.maxNesting)
    )
        return !1;
    (c = t.tokens.length),
        t.tokens.push({
            type: "dl_open",
            lines: (l = [e, 0]),
            level: t.level++,
        }),
        (r = e),
        (o = u);
    t: for (;;) {
        for (
            f = !0,
                v = !1,
                t.tokens.push({
                    type: "dt_open",
                    lines: [r, r],
                    level: t.level++,
                }),
                t.tokens.push({
                    type: "inline",
                    content: t.getLines(r, r + 1, t.blkIndent, !1).trim(),
                    level: t.level + 1,
                    lines: [r, r],
                    children: [],
                }),
                t.tokens.push({ type: "dt_close", level: --t.level });
            ;

        ) {
            if (
                (t.tokens.push({
                    type: "dd_open",
                    lines: (a = [u, 0]),
                    level: t.level++,
                }),
                (g = t.tight),
                (d = t.ddIndent),
                (h = t.blkIndent),
                (m = t.tShift[o]),
                (p = t.parentType),
                (t.blkIndent = t.ddIndent = t.tShift[o] + 2),
                (t.tShift[o] = n - t.bMarks[o]),
                (t.tight = !0),
                (t.parentType = "deflist"),
                t.parser.tokenize(t, o, i, !0),
                (!t.tight || v) && (f = !1),
                (v = t.line - o > 1 && t.isEmpty(t.line - 1)),
                (t.tShift[o] = m),
                (t.tight = g),
                (t.parentType = p),
                (t.blkIndent = h),
                (t.ddIndent = d),
                t.tokens.push({ type: "dd_close", level: --t.level }),
                (a[1] = u = t.line),
                u >= i || t.tShift[u] < t.blkIndent)
            )
                break t;
            if ((n = skipMarker(t, u)) < 0) break;
            o = u;
        }
        if (
            u >= i ||
            ((r = u), t.isEmpty(r)) ||
            t.tShift[r] < t.blkIndent ||
            (o = r + 1) >= i ||
            (t.isEmpty(o) && o++, o >= i) ||
            t.tShift[o] < t.blkIndent ||
            (n = skipMarker(t, o)) < 0
        )
            break;
    }
    return (
        t.tokens.push({ type: "dl_close", level: --t.level }),
        (l[1] = u),
        (t.line = u),
        f && markTightParagraphs$1(t, c),
        !0
    );
}
function paragraph(t, e) {
    var i,
        s,
        n,
        o,
        r,
        a,
        l = e + 1;
    if (l < (i = t.lineMax) && !t.isEmpty(l))
        for (
            a = t.parser.ruler.getRules("paragraph");
            l < i && !t.isEmpty(l);
            l++
        )
            if (!(t.tShift[l] - t.blkIndent > 3)) {
                for (n = !1, o = 0, r = a.length; o < r; o++)
                    if (a[o](t, l, i, !0)) {
                        n = !0;
                        break;
                    }
                if (n) break;
            }
    return (
        (s = t.getLines(e, l, t.blkIndent, !1).trim()),
        (t.line = l),
        s.length &&
            (t.tokens.push({
                type: "paragraph_open",
                tight: !1,
                lines: [e, t.line],
                level: t.level,
            }),
            t.tokens.push({
                type: "inline",
                content: s,
                level: t.level + 1,
                lines: [e, t.line],
                children: [],
            }),
            t.tokens.push({
                type: "paragraph_close",
                tight: !1,
                level: t.level,
            })),
        !0
    );
}
var _rules$1 = [
    ["code", code],
    ["fences", fences, ["paragraph", "blockquote", "list"]],
    ["blockquote", blockquote, ["paragraph", "blockquote", "list"]],
    ["hr", hr, ["paragraph", "blockquote", "list"]],
    ["list", list, ["paragraph", "blockquote"]],
    ["footnote", footnote, ["paragraph"]],
    ["heading", heading, ["paragraph", "blockquote"]],
    ["lheading", lheading],
    ["htmlblock", htmlblock, ["paragraph", "blockquote"]],
    ["table", table, ["paragraph"]],
    ["deflist", deflist, ["paragraph"]],
    ["paragraph", paragraph],
];
function ParserBlock() {
    this.ruler = new Ruler();
    for (var t = 0; t < _rules$1.length; t++)
        this.ruler.push(_rules$1[t][0], _rules$1[t][1], {
            alt: (_rules$1[t][2] || []).slice(),
        });
}
ParserBlock.prototype.tokenize = function (t, e, i) {
    for (
        var s, n = this.ruler.getRules(""), o = n.length, r = e, a = !1;
        r < i &&
        ((t.line = r = t.skipEmptyLines(r)),
        !(r >= i || t.tShift[r] < t.blkIndent));

    ) {
        for (s = 0; s < o && !n[s](t, r, i, !1); s++);
        if (
            ((t.tight = !a),
            t.isEmpty(t.line - 1) && (a = !0),
            (r = t.line) < i && t.isEmpty(r))
        ) {
            if (((a = !0), ++r < i && "list" === t.parentType && t.isEmpty(r)))
                break;
            t.line = r;
        }
    }
};
var TABS_SCAN_RE = /[\n\t]/g,
    NEWLINES_RE = /\r[\n\u0085]|[\u2424\u2028\u0085]/g,
    SPACES_RE = /\u00a0/g;
function isTerminatorChar(t) {
    switch (t) {
        case 10:
        case 92:
        case 96:
        case 42:
        case 95:
        case 94:
        case 91:
        case 93:
        case 33:
        case 38:
        case 60:
        case 62:
        case 123:
        case 125:
        case 36:
        case 37:
        case 64:
        case 126:
        case 43:
        case 61:
        case 58:
            return !0;
        default:
            return !1;
    }
}
function text$1(t, e) {
    for (
        var i = t.pos;
        i < t.posMax && !isTerminatorChar(t.src.charCodeAt(i));

    )
        i++;
    return (
        i !== t.pos &&
        (e || (t.pending += t.src.slice(t.pos, i)), (t.pos = i), !0)
    );
}
function newline(t, e) {
    var i,
        s,
        n = t.pos;
    if (10 !== t.src.charCodeAt(n)) return !1;
    if (((i = t.pending.length - 1), (s = t.posMax), !e))
        if (i >= 0 && 32 === t.pending.charCodeAt(i))
            if (i >= 1 && 32 === t.pending.charCodeAt(i - 1)) {
                for (var o = i - 2; o >= 0; o--)
                    if (32 !== t.pending.charCodeAt(o)) {
                        t.pending = t.pending.substring(0, o + 1);
                        break;
                    }
                t.push({ type: "hardbreak", level: t.level });
            } else
                (t.pending = t.pending.slice(0, -1)),
                    t.push({ type: "softbreak", level: t.level });
        else t.push({ type: "softbreak", level: t.level });
    for (n++; n < s && 32 === t.src.charCodeAt(n); ) n++;
    return (t.pos = n), !0;
}
ParserBlock.prototype.parse = function (t, e, i, s) {
    var n,
        o = 0,
        r = 0;
    if (!t) return [];
    (t = (t = t.replace(SPACES_RE, " ")).replace(NEWLINES_RE, "\n")).indexOf(
        "\t"
    ) >= 0 &&
        (t = t.replace(TABS_SCAN_RE, function (e, i) {
            var s;
            return 10 === t.charCodeAt(i)
                ? ((o = i + 1), (r = 0), e)
                : ((s = "    ".slice((i - o - r) % 4)), (r = i - o + 1), s);
        })),
        (n = new StateBlock(t, this, e, i, s)),
        this.tokenize(n, n.line, n.lineMax);
};
for (var ESCAPED = [], i = 0; i < 256; i++) ESCAPED.push(0);
function escape(t, e) {
    var i,
        s = t.pos,
        n = t.posMax;
    if (92 !== t.src.charCodeAt(s)) return !1;
    if (++s < n) {
        if ((i = t.src.charCodeAt(s)) < 256 && 0 !== ESCAPED[i])
            return e || (t.pending += t.src[s]), (t.pos += 2), !0;
        if (10 === i) {
            for (
                e || t.push({ type: "hardbreak", level: t.level }), s++;
                s < n && 32 === t.src.charCodeAt(s);

            )
                s++;
            return (t.pos = s), !0;
        }
    }
    return e || (t.pending += "\\"), t.pos++, !0;
}
function backticks(t, e) {
    var i,
        s,
        n,
        o,
        r,
        a = t.pos;
    if (96 !== t.src.charCodeAt(a)) return !1;
    for (i = a, a++, s = t.posMax; a < s && 96 === t.src.charCodeAt(a); ) a++;
    for (
        n = t.src.slice(i, a), o = r = a;
        -1 !== (o = t.src.indexOf("`", r));

    ) {
        for (r = o + 1; r < s && 96 === t.src.charCodeAt(r); ) r++;
        if (r - o === n.length)
            return (
                e ||
                    t.push({
                        type: "code",
                        content: t.src
                            .slice(a, o)
                            .replace(/[ \n]+/g, " ")
                            .trim(),
                        block: !1,
                        level: t.level,
                    }),
                (t.pos = r),
                !0
            );
    }
    return e || (t.pending += n), (t.pos += n.length), !0;
}
function del(t, e) {
    var i,
        s,
        n,
        o,
        r,
        a = t.posMax,
        l = t.pos;
    if (
        126 !== t.src.charCodeAt(l) ||
        e ||
        l + 4 >= a ||
        126 !== t.src.charCodeAt(l + 1) ||
        t.level >= t.options.maxNesting ||
        ((o = l > 0 ? t.src.charCodeAt(l - 1) : -1),
        (r = t.src.charCodeAt(l + 2)),
        126 === o) ||
        126 === r ||
        32 === r ||
        10 === r
    )
        return !1;
    for (s = l + 2; s < a && 126 === t.src.charCodeAt(s); ) s++;
    if (s > l + 3)
        return (t.pos += s - l), e || (t.pending += t.src.slice(l, s)), !0;
    for (t.pos = l + 2, n = 1; t.pos + 1 < a; ) {
        if (
            126 === t.src.charCodeAt(t.pos) &&
            126 === t.src.charCodeAt(t.pos + 1) &&
            ((o = t.src.charCodeAt(t.pos - 1)),
            126 !== (r = t.pos + 2 < a ? t.src.charCodeAt(t.pos + 2) : -1) &&
                126 !== o &&
                (32 !== o && 10 !== o ? n-- : 32 !== r && 10 !== r && n++,
                n <= 0))
        ) {
            i = !0;
            break;
        }
        t.parser.skipToken(t);
    }
    return i
        ? ((t.posMax = t.pos),
          (t.pos = l + 2),
          e ||
              (t.push({ type: "del_open", level: t.level++ }),
              t.parser.tokenize(t),
              t.push({ type: "del_close", level: --t.level })),
          (t.pos = t.posMax + 2),
          (t.posMax = a),
          !0)
        : ((t.pos = l), !1);
}
function ins(t, e) {
    var i,
        s,
        n,
        o,
        r,
        a = t.posMax,
        l = t.pos;
    if (
        43 !== t.src.charCodeAt(l) ||
        e ||
        l + 4 >= a ||
        43 !== t.src.charCodeAt(l + 1) ||
        t.level >= t.options.maxNesting ||
        ((o = l > 0 ? t.src.charCodeAt(l - 1) : -1),
        (r = t.src.charCodeAt(l + 2)),
        43 === o) ||
        43 === r ||
        32 === r ||
        10 === r
    )
        return !1;
    for (s = l + 2; s < a && 43 === t.src.charCodeAt(s); ) s++;
    if (s !== l + 2)
        return (t.pos += s - l), e || (t.pending += t.src.slice(l, s)), !0;
    for (t.pos = l + 2, n = 1; t.pos + 1 < a; ) {
        if (
            43 === t.src.charCodeAt(t.pos) &&
            43 === t.src.charCodeAt(t.pos + 1) &&
            ((o = t.src.charCodeAt(t.pos - 1)),
            43 !== (r = t.pos + 2 < a ? t.src.charCodeAt(t.pos + 2) : -1) &&
                43 !== o &&
                (32 !== o && 10 !== o ? n-- : 32 !== r && 10 !== r && n++,
                n <= 0))
        ) {
            i = !0;
            break;
        }
        t.parser.skipToken(t);
    }
    return i
        ? ((t.posMax = t.pos),
          (t.pos = l + 2),
          e ||
              (t.push({ type: "ins_open", level: t.level++ }),
              t.parser.tokenize(t),
              t.push({ type: "ins_close", level: --t.level })),
          (t.pos = t.posMax + 2),
          (t.posMax = a),
          !0)
        : ((t.pos = l), !1);
}
function mark(t, e) {
    var i,
        s,
        n,
        o,
        r,
        a = t.posMax,
        l = t.pos;
    if (
        61 !== t.src.charCodeAt(l) ||
        e ||
        l + 4 >= a ||
        61 !== t.src.charCodeAt(l + 1) ||
        t.level >= t.options.maxNesting ||
        ((o = l > 0 ? t.src.charCodeAt(l - 1) : -1),
        (r = t.src.charCodeAt(l + 2)),
        61 === o) ||
        61 === r ||
        32 === r ||
        10 === r
    )
        return !1;
    for (s = l + 2; s < a && 61 === t.src.charCodeAt(s); ) s++;
    if (s !== l + 2)
        return (t.pos += s - l), e || (t.pending += t.src.slice(l, s)), !0;
    for (t.pos = l + 2, n = 1; t.pos + 1 < a; ) {
        if (
            61 === t.src.charCodeAt(t.pos) &&
            61 === t.src.charCodeAt(t.pos + 1) &&
            ((o = t.src.charCodeAt(t.pos - 1)),
            61 !== (r = t.pos + 2 < a ? t.src.charCodeAt(t.pos + 2) : -1) &&
                61 !== o &&
                (32 !== o && 10 !== o ? n-- : 32 !== r && 10 !== r && n++,
                n <= 0))
        ) {
            i = !0;
            break;
        }
        t.parser.skipToken(t);
    }
    return i
        ? ((t.posMax = t.pos),
          (t.pos = l + 2),
          e ||
              (t.push({ type: "mark_open", level: t.level++ }),
              t.parser.tokenize(t),
              t.push({ type: "mark_close", level: --t.level })),
          (t.pos = t.posMax + 2),
          (t.posMax = a),
          !0)
        : ((t.pos = l), !1);
}
function isAlphaNum(t) {
    return (
        (t >= 48 && t <= 57) || (t >= 65 && t <= 90) || (t >= 97 && t <= 122)
    );
}
function scanDelims(t, e) {
    var i,
        s,
        n,
        o = e,
        r = !0,
        a = !0,
        l = t.posMax,
        c = t.src.charCodeAt(e);
    for (
        i = e > 0 ? t.src.charCodeAt(e - 1) : -1;
        o < l && t.src.charCodeAt(o) === c;

    )
        o++;
    return (
        o >= l && (r = !1),
        (n = o - e) >= 4
            ? (r = a = !1)
            : ((32 === (s = o < l ? t.src.charCodeAt(o) : -1) || 10 === s) &&
                  (r = !1),
              (32 === i || 10 === i) && (a = !1),
              95 === c &&
                  (isAlphaNum(i) && (r = !1), isAlphaNum(s) && (a = !1))),
        { can_open: r, can_close: a, delims: n }
    );
}
function emphasis(t, e) {
    var i,
        s,
        n,
        o,
        r,
        a,
        l,
        c = t.posMax,
        u = t.pos,
        h = t.src.charCodeAt(u);
    if ((95 !== h && 42 !== h) || e) return !1;
    if (((i = (l = scanDelims(t, u)).delims), !l.can_open))
        return (t.pos += i), e || (t.pending += t.src.slice(u, t.pos)), !0;
    if (t.level >= t.options.maxNesting) return !1;
    for (t.pos = u + i, a = [i]; t.pos < c; )
        if (t.src.charCodeAt(t.pos) !== h) t.parser.skipToken(t);
        else {
            if (((s = (l = scanDelims(t, t.pos)).delims), l.can_close)) {
                for (o = a.pop(), r = s; o !== r; ) {
                    if (r < o) {
                        a.push(o - r);
                        break;
                    }
                    if (((r -= o), 0 === a.length)) break;
                    (t.pos += o), (o = a.pop());
                }
                if (0 === a.length) {
                    (i = o), (n = !0);
                    break;
                }
                t.pos += s;
                continue;
            }
            l.can_open && a.push(s), (t.pos += s);
        }
    return n
        ? ((t.posMax = t.pos),
          (t.pos = u + i),
          e ||
              ((2 === i || 3 === i) &&
                  t.push({ type: "strong_open", level: t.level++ }),
              (1 === i || 3 === i) &&
                  t.push({ type: "em_open", level: t.level++ }),
              t.parser.tokenize(t),
              (1 === i || 3 === i) &&
                  t.push({ type: "em_close", level: --t.level }),
              (2 === i || 3 === i) &&
                  t.push({ type: "strong_close", level: --t.level })),
          (t.pos = t.posMax + i),
          (t.posMax = c),
          !0)
        : ((t.pos = u), !1);
}
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function (t) {
    ESCAPED[t.charCodeAt(0)] = 1;
});
var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
function sub(t, e) {
    var i,
        s,
        n = t.posMax,
        o = t.pos;
    if (
        126 !== t.src.charCodeAt(o) ||
        e ||
        o + 2 >= n ||
        t.level >= t.options.maxNesting
    )
        return !1;
    for (t.pos = o + 1; t.pos < n; ) {
        if (126 === t.src.charCodeAt(t.pos)) {
            i = !0;
            break;
        }
        t.parser.skipToken(t);
    }
    return !i ||
        o + 1 === t.pos ||
        (s = t.src.slice(o + 1, t.pos)).match(/(^|[^\\])(\\\\)*\s/)
        ? ((t.pos = o), !1)
        : ((t.posMax = t.pos),
          (t.pos = o + 1),
          e ||
              t.push({
                  type: "sub",
                  level: t.level,
                  content: s.replace(UNESCAPE_RE, "$1"),
              }),
          (t.pos = t.posMax + 1),
          (t.posMax = n),
          !0);
}
var UNESCAPE_RE$1 = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
function sup(t, e) {
    var i,
        s,
        n = t.posMax,
        o = t.pos;
    if (
        94 !== t.src.charCodeAt(o) ||
        e ||
        o + 2 >= n ||
        t.level >= t.options.maxNesting
    )
        return !1;
    for (t.pos = o + 1; t.pos < n; ) {
        if (94 === t.src.charCodeAt(t.pos)) {
            i = !0;
            break;
        }
        t.parser.skipToken(t);
    }
    return !i ||
        o + 1 === t.pos ||
        (s = t.src.slice(o + 1, t.pos)).match(/(^|[^\\])(\\\\)*\s/)
        ? ((t.pos = o), !1)
        : ((t.posMax = t.pos),
          (t.pos = o + 1),
          e ||
              t.push({
                  type: "sup",
                  level: t.level,
                  content: s.replace(UNESCAPE_RE$1, "$1"),
              }),
          (t.pos = t.posMax + 1),
          (t.posMax = n),
          !0);
}
function links(t, e) {
    var i,
        s,
        n,
        o,
        r,
        a,
        l,
        c,
        u = !1,
        h = t.pos,
        d = t.posMax,
        p = t.pos,
        m = t.src.charCodeAt(p);
    if (
        (33 === m && ((u = !0), (m = t.src.charCodeAt(++p))),
        91 !== m ||
            t.level >= t.options.maxNesting ||
            ((i = p + 1), (s = parseLinkLabel(t, p)) < 0))
    )
        return !1;
    if ((a = s + 1) < d && 40 === t.src.charCodeAt(a)) {
        for (a++; a < d && (32 === (c = t.src.charCodeAt(a)) || 10 === c); a++);
        if (a >= d) return !1;
        for (
            p = a,
                parseLinkDestination(t, a)
                    ? ((o = t.linkContent), (a = t.pos))
                    : (o = ""),
                p = a;
            a < d && (32 === (c = t.src.charCodeAt(a)) || 10 === c);
            a++
        );
        if (a < d && p !== a && parseLinkTitle(t, a))
            for (
                r = t.linkContent, a = t.pos;
                a < d && (32 === (c = t.src.charCodeAt(a)) || 10 === c);
                a++
            );
        else r = "";
        if (a >= d || 41 !== t.src.charCodeAt(a)) return (t.pos = h), !1;
        a++;
    } else {
        if (t.linkLevel > 0) return !1;
        for (; a < d && (32 === (c = t.src.charCodeAt(a)) || 10 === c); a++);
        if (
            (a < d &&
                91 === t.src.charCodeAt(a) &&
                ((p = a + 1),
                (a = parseLinkLabel(t, a)) >= 0
                    ? (n = t.src.slice(p, a++))
                    : (a = p - 1)),
            n || (typeof n > "u" && (a = s + 1), (n = t.src.slice(i, s))),
            !(l = t.env.references[normalizeReference(n)]))
        )
            return (t.pos = h), !1;
        (o = l.href), (r = l.title);
    }
    return (
        e ||
            ((t.pos = i),
            (t.posMax = s),
            u
                ? t.push({
                      type: "image",
                      src: o,
                      title: r,
                      alt: t.src.substr(i, s - i),
                      level: t.level,
                  })
                : (t.push({
                      type: "link_open",
                      href: o,
                      title: r,
                      level: t.level++,
                  }),
                  t.linkLevel++,
                  t.parser.tokenize(t),
                  t.linkLevel--,
                  t.push({ type: "link_close", level: --t.level }))),
        (t.pos = a),
        (t.posMax = d),
        !0
    );
}
function footnote_inline(t, e) {
    var i,
        s,
        n,
        o,
        r = t.posMax,
        a = t.pos;
    return (
        !(
            a + 2 >= r ||
            94 !== t.src.charCodeAt(a) ||
            91 !== t.src.charCodeAt(a + 1) ||
            t.level >= t.options.maxNesting ||
            ((i = a + 2), (s = parseLinkLabel(t, a + 1)), s < 0)
        ) &&
        (e ||
            (t.env.footnotes || (t.env.footnotes = {}),
            t.env.footnotes.list || (t.env.footnotes.list = []),
            (n = t.env.footnotes.list.length),
            (t.pos = i),
            (t.posMax = s),
            t.push({ type: "footnote_ref", id: n, level: t.level }),
            t.linkLevel++,
            (o = t.tokens.length),
            t.parser.tokenize(t),
            (t.env.footnotes.list[n] = { tokens: t.tokens.splice(o) }),
            t.linkLevel--),
        (t.pos = s + 1),
        (t.posMax = r),
        !0)
    );
}
function footnote_ref(t, e) {
    var i,
        s,
        n,
        o,
        r = t.posMax,
        a = t.pos;
    if (
        a + 3 > r ||
        !t.env.footnotes ||
        !t.env.footnotes.refs ||
        91 !== t.src.charCodeAt(a) ||
        94 !== t.src.charCodeAt(a + 1) ||
        t.level >= t.options.maxNesting
    )
        return !1;
    for (s = a + 2; s < r; s++) {
        if (32 === t.src.charCodeAt(s) || 10 === t.src.charCodeAt(s)) return !1;
        if (93 === t.src.charCodeAt(s)) break;
    }
    return (
        !(
            s === a + 2 ||
            s >= r ||
            (s++,
            (i = t.src.slice(a + 2, s - 1)),
            typeof t.env.footnotes.refs[":" + i] > "u")
        ) &&
        (e ||
            (t.env.footnotes.list || (t.env.footnotes.list = []),
            t.env.footnotes.refs[":" + i] < 0
                ? ((n = t.env.footnotes.list.length),
                  (t.env.footnotes.list[n] = { label: i, count: 0 }),
                  (t.env.footnotes.refs[":" + i] = n))
                : (n = t.env.footnotes.refs[":" + i]),
            (o = t.env.footnotes.list[n].count),
            t.env.footnotes.list[n].count++,
            t.push({ type: "footnote_ref", id: n, subId: o, level: t.level })),
        (t.pos = s),
        (t.posMax = r),
        !0)
    );
}
var url_schemas = [
        "coap",
        "doi",
        "javascript",
        "aaa",
        "aaas",
        "about",
        "acap",
        "cap",
        "cid",
        "crid",
        "data",
        "dav",
        "dict",
        "dns",
        "file",
        "ftp",
        "geo",
        "go",
        "gopher",
        "h323",
        "http",
        "https",
        "iax",
        "icap",
        "im",
        "imap",
        "info",
        "ipp",
        "iris",
        "iris.beep",
        "iris.xpc",
        "iris.xpcs",
        "iris.lwz",
        "ldap",
        "mailto",
        "mid",
        "msrp",
        "msrps",
        "mtqp",
        "mupdate",
        "news",
        "nfs",
        "ni",
        "nih",
        "nntp",
        "opaquelocktoken",
        "pop",
        "pres",
        "rtsp",
        "service",
        "session",
        "shttp",
        "sieve",
        "sip",
        "sips",
        "sms",
        "snmp",
        "soap.beep",
        "soap.beeps",
        "tag",
        "tel",
        "telnet",
        "tftp",
        "thismessage",
        "tn3270",
        "tip",
        "tv",
        "urn",
        "vemmi",
        "ws",
        "wss",
        "xcon",
        "xcon-userid",
        "xmlrpc.beep",
        "xmlrpc.beeps",
        "xmpp",
        "z39.50r",
        "z39.50s",
        "adiumxtra",
        "afp",
        "afs",
        "aim",
        "apt",
        "attachment",
        "aw",
        "beshare",
        "bitcoin",
        "bolo",
        "callto",
        "chrome",
        "chrome-extension",
        "com-eventbrite-attendee",
        "content",
        "cvs",
        "dlna-playsingle",
        "dlna-playcontainer",
        "dtn",
        "dvb",
        "ed2k",
        "facetime",
        "feed",
        "finger",
        "fish",
        "gg",
        "git",
        "gizmoproject",
        "gtalk",
        "hcp",
        "icon",
        "ipn",
        "irc",
        "irc6",
        "ircs",
        "itms",
        "jar",
        "jms",
        "keyparc",
        "lastfm",
        "ldaps",
        "magnet",
        "maps",
        "market",
        "message",
        "mms",
        "ms-help",
        "msnim",
        "mumble",
        "mvn",
        "notes",
        "oid",
        "palm",
        "paparazzi",
        "platform",
        "proxy",
        "psyc",
        "query",
        "res",
        "resource",
        "rmi",
        "rsync",
        "rtmp",
        "secondlife",
        "sftp",
        "sgn",
        "skype",
        "smb",
        "soldat",
        "spotify",
        "ssh",
        "steam",
        "svn",
        "teamspeak",
        "things",
        "udp",
        "unreal",
        "ut2004",
        "ventrilo",
        "view-source",
        "webcal",
        "wtai",
        "wyciwyg",
        "xfire",
        "xri",
        "ymsgr",
    ],
    EMAIL_RE =
        /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/,
    AUTOLINK_RE = /^<([a-zA-Z.\-]{1,25}):([^<>\x00-\x20]*)>/;
function autolink(t, e) {
    var i,
        s,
        n,
        o,
        r,
        a = t.pos;
    return (
        !(
            60 !== t.src.charCodeAt(a) ||
            ((i = t.src.slice(a)), i.indexOf(">") < 0)
        ) &&
        ((s = i.match(AUTOLINK_RE))
            ? !(
                  url_schemas.indexOf(s[1].toLowerCase()) < 0 ||
                  ((o = s[0].slice(1, -1)),
                  (r = normalizeLink(o)),
                  !t.parser.validateLink(o))
              ) &&
              (e ||
                  (t.push({ type: "link_open", href: r, level: t.level }),
                  t.push({ type: "text", content: o, level: t.level + 1 }),
                  t.push({ type: "link_close", level: t.level })),
              (t.pos += s[0].length),
              !0)
            : !!(n = i.match(EMAIL_RE)) &&
              ((r = normalizeLink("mailto:" + (o = n[0].slice(1, -1)))),
              !!t.parser.validateLink(r) &&
                  (e ||
                      (t.push({ type: "link_open", href: r, level: t.level }),
                      t.push({ type: "text", content: o, level: t.level + 1 }),
                      t.push({ type: "link_close", level: t.level })),
                  (t.pos += n[0].length),
                  !0)))
    );
}
function replace$1(t, e) {
    return (
        (t = t.source),
        (e = e || ""),
        function i(s, n) {
            return s
                ? ((n = n.source || n), (t = t.replace(s, n)), i)
                : new RegExp(t, e);
        }
    );
}
var attr_name = /[a-zA-Z_:][a-zA-Z0-9:._-]*/,
    unquoted = /[^"'=<>`\x00-\x20]+/,
    single_quoted = /'[^']*'/,
    double_quoted = /"[^"]*"/,
    attr_value = replace$1(/(?:unquoted|single_quoted|double_quoted)/)(
        "unquoted",
        unquoted
    )("single_quoted", single_quoted)("double_quoted", double_quoted)(),
    attribute = replace$1(/(?:\s+attr_name(?:\s*=\s*attr_value)?)/)(
        "attr_name",
        attr_name
    )("attr_value", attr_value)(),
    open_tag = replace$1(/<[A-Za-z][A-Za-z0-9]*attribute*\s*\/?>/)(
        "attribute",
        attribute
    )(),
    close_tag = /<\/[A-Za-z][A-Za-z0-9]*\s*>/,
    comment = /<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->/,
    processing = /<[?].*?[?]>/,
    declaration = /<![A-Z]+\s+[^>]*>/,
    cdata = /<!\[CDATA\[[\s\S]*?\]\]>/,
    HTML_TAG_RE = replace$1(
        /^(?:open_tag|close_tag|comment|processing|declaration|cdata)/
    )("open_tag", open_tag)("close_tag", close_tag)("comment", comment)(
        "processing",
        processing
    )("declaration", declaration)("cdata", cdata)();
function isLetter$2(t) {
    var e = 32 | t;
    return e >= 97 && e <= 122;
}
function htmltag(t, e) {
    var i,
        s,
        n,
        o = t.pos;
    return (
        !(
            !t.options.html ||
            ((n = t.posMax), 60 !== t.src.charCodeAt(o) || o + 2 >= n) ||
            ((i = t.src.charCodeAt(o + 1)),
            33 !== i && 63 !== i && 47 !== i && !isLetter$2(i)) ||
            ((s = t.src.slice(o).match(HTML_TAG_RE)), !s)
        ) &&
        (e ||
            t.push({
                type: "htmltag",
                content: t.src.slice(o, o + s[0].length),
                level: t.level,
            }),
        (t.pos += s[0].length),
        !0)
    );
}
var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i,
    NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
function entity(t, e) {
    var i,
        s,
        n = t.pos,
        o = t.posMax;
    if (38 !== t.src.charCodeAt(n)) return !1;
    if (n + 1 < o)
        if (35 === t.src.charCodeAt(n + 1)) {
            if ((s = t.src.slice(n).match(DIGITAL_RE)))
                return (
                    e ||
                        ((i =
                            "x" === s[1][0].toLowerCase()
                                ? parseInt(s[1].slice(1), 16)
                                : parseInt(s[1], 10)),
                        (t.pending += isValidEntityCode(i)
                            ? fromCodePoint(i)
                            : fromCodePoint(65533))),
                    (t.pos += s[0].length),
                    !0
                );
        } else if ((s = t.src.slice(n).match(NAMED_RE))) {
            var r = decodeEntity(s[1]);
            if (s[1] !== r)
                return e || (t.pending += r), (t.pos += s[0].length), !0;
        }
    return e || (t.pending += "&"), t.pos++, !0;
}
var _rules$2 = [
    ["text", text$1],
    ["newline", newline],
    ["escape", escape],
    ["backticks", backticks],
    ["del", del],
    ["ins", ins],
    ["mark", mark],
    ["emphasis", emphasis],
    ["sub", sub],
    ["sup", sup],
    ["links", links],
    ["footnote_inline", footnote_inline],
    ["footnote_ref", footnote_ref],
    ["autolink", autolink],
    ["htmltag", htmltag],
    ["entity", entity],
];
function ParserInline() {
    this.ruler = new Ruler();
    for (var t = 0; t < _rules$2.length; t++)
        this.ruler.push(_rules$2[t][0], _rules$2[t][1]);
    this.validateLink = validateLink;
}
function validateLink(t) {
    var e = t.trim().toLowerCase();
    return !(
        -1 !== (e = replaceEntities(e)).indexOf(":") &&
        -1 !==
            ["vbscript", "javascript", "file", "data"].indexOf(e.split(":")[0])
    );
}
(ParserInline.prototype.skipToken = function (t) {
    var e,
        i,
        s = this.ruler.getRules(""),
        n = s.length,
        o = t.pos;
    if ((i = t.cacheGet(o)) > 0) t.pos = i;
    else {
        for (e = 0; e < n; e++)
            if (s[e](t, !0)) return void t.cacheSet(o, t.pos);
        t.pos++, t.cacheSet(o, t.pos);
    }
}),
    (ParserInline.prototype.tokenize = function (t) {
        for (
            var e, i, s = this.ruler.getRules(""), n = s.length, o = t.posMax;
            t.pos < o;

        ) {
            for (i = 0; i < n && !(e = s[i](t, !1)); i++);
            if (e) {
                if (t.pos >= o) break;
            } else t.pending += t.src[t.pos++];
        }
        t.pending && t.pushPending();
    }),
    (ParserInline.prototype.parse = function (t, e, i, s) {
        var n = new StateInline(t, this, e, i, s);
        this.tokenize(n);
    });
var defaultConfig = {
        options: {
            html: !1,
            xhtmlOut: !1,
            breaks: !1,
            langPrefix: "language-",
            linkTarget: "",
            typographer: !1,
            quotes: "“”‘’",
            highlight: null,
            maxNesting: 20,
        },
        components: {
            core: {
                rules: [
                    "block",
                    "inline",
                    "references",
                    "replacements",
                    "smartquotes",
                    "references",
                    "abbr2",
                    "footnote_tail",
                ],
            },
            block: {
                rules: [
                    "blockquote",
                    "code",
                    "fences",
                    "footnote",
                    "heading",
                    "hr",
                    "htmlblock",
                    "lheading",
                    "list",
                    "paragraph",
                    "table",
                ],
            },
            inline: {
                rules: [
                    "autolink",
                    "backticks",
                    "del",
                    "emphasis",
                    "entity",
                    "escape",
                    "footnote_ref",
                    "htmltag",
                    "links",
                    "newline",
                    "text",
                ],
            },
        },
    },
    fullConfig = {
        options: {
            html: !1,
            xhtmlOut: !1,
            breaks: !1,
            langPrefix: "language-",
            linkTarget: "",
            typographer: !1,
            quotes: "“”‘’",
            highlight: null,
            maxNesting: 20,
        },
        components: { core: {}, block: {}, inline: {} },
    },
    commonmarkConfig = {
        options: {
            html: !0,
            xhtmlOut: !0,
            breaks: !1,
            langPrefix: "language-",
            linkTarget: "",
            typographer: !1,
            quotes: "“”‘’",
            highlight: null,
            maxNesting: 20,
        },
        components: {
            core: { rules: ["block", "inline", "references", "abbr2"] },
            block: {
                rules: [
                    "blockquote",
                    "code",
                    "fences",
                    "heading",
                    "hr",
                    "htmlblock",
                    "lheading",
                    "list",
                    "paragraph",
                ],
            },
            inline: {
                rules: [
                    "autolink",
                    "backticks",
                    "emphasis",
                    "entity",
                    "escape",
                    "htmltag",
                    "links",
                    "newline",
                    "text",
                ],
            },
        },
    },
    config = {
        default: defaultConfig,
        full: fullConfig,
        commonmark: commonmarkConfig,
    };
function StateCore(t, e, i) {
    (this.src = e),
        (this.env = i),
        (this.options = t.options),
        (this.tokens = []),
        (this.inlineMode = !1),
        (this.inline = t.inline),
        (this.block = t.block),
        (this.renderer = t.renderer),
        (this.typographer = t.typographer);
}
function Remarkable(t, e) {
    "string" != typeof t && ((e = t), (t = "default")),
        e &&
            null != e.linkify &&
            console.warn(
                "linkify option is removed. Use linkify plugin instead:\n\nimport Remarkable from 'remarkable';\nimport linkify from 'remarkable/linkify';\nnew Remarkable().use(linkify)\n"
            ),
        (this.inline = new ParserInline()),
        (this.block = new ParserBlock()),
        (this.core = new Core()),
        (this.renderer = new Renderer()),
        (this.ruler = new Ruler()),
        (this.options = {}),
        this.configure(config[t]),
        this.set(e || {});
}
(Remarkable.prototype.set = function (t) {
    assign(this.options, t);
}),
    (Remarkable.prototype.configure = function (t) {
        var e = this;
        if (!t)
            throw new Error("Wrong `remarkable` preset, check name/content");
        t.options && e.set(t.options),
            t.components &&
                Object.keys(t.components).forEach(function (i) {
                    t.components[i].rules &&
                        e[i].ruler.enable(t.components[i].rules, !0);
                });
    }),
    (Remarkable.prototype.use = function (t, e) {
        return t(this, e), this;
    }),
    (Remarkable.prototype.parse = function (t, e) {
        var i = new StateCore(this, t, e);
        return this.core.process(i), i.tokens;
    }),
    (Remarkable.prototype.render = function (t, e) {
        return (
            (e = e || {}),
            this.renderer.render(this.parse(t, e), this.options, e)
        );
    }),
    (Remarkable.prototype.parseInline = function (t, e) {
        var i = new StateCore(this, t, e);
        return (i.inlineMode = !0), this.core.process(i), i.tokens;
    }),
    (Remarkable.prototype.renderInline = function (t, e) {
        return (
            (e = e || {}),
            this.renderer.render(this.parseInline(t, e), this.options, e)
        );
    });
class RemarkableConfig {
    static createNew() {
        const t = window.hljs;
        return new Remarkable(
            t
                ? {
                      highlight: function (e, i) {
                          if (i && t.getLanguage(i))
                              try {
                                  return t.highlight(i, e).value;
                              } catch {
                                  console.error(
                                      "failed to setup the highlight dependency"
                                  );
                              }
                          try {
                              return t.highlightAuto(e).value;
                          } catch {
                              console.error(
                                  "failed to automatically highlight messages"
                              );
                          }
                          return "";
                      },
                      html: !1,
                      xhtmlOut: !1,
                      breaks: !1,
                      langPrefix: "language-",
                      linkTarget: "_blank",
                      typographer: !0,
                  }
                : { highlight: (t) => t, linkTarget: "_blank" }
        );
    }
}
class SetFileTypes {
    static parseConfig(t, e, i, s) {
        var n;
        const o = { files: e };
        if ("object" == typeof s) {
            const { files: e, request: r, button: a } = s;
            e &&
                (e.infoModal &&
                    ((o.files.infoModal = e.infoModal),
                    null != (n = e.infoModal) &&
                        n.textMarkDown &&
                        (o.infoModalTextMarkUp = i.render(
                            e.infoModal.textMarkDown
                        ))),
                e.acceptedFormats &&
                    (o.files.acceptedFormats = e.acceptedFormats),
                e.maxNumberOfFiles &&
                    (o.files.maxNumberOfFiles = e.maxNumberOfFiles)),
                (o.button = a),
                r &&
                    (r.headers ||
                        r.method ||
                        r.url ||
                        t.headers ||
                        t.method ||
                        t.url) &&
                    (o.request = {
                        headers: (null == r ? void 0 : r.headers) || t.headers,
                        method: (null == r ? void 0 : r.method) || t.method,
                        url: (null == r ? void 0 : r.url) || t.url,
                    });
        }
        return o;
    }
    static processMixedFiles(t, e, i) {
        if (i) {
            const s = { acceptedFormats: "" };
            t.fileTypes.mixedFiles = SetFileTypes.parseConfig(
                t.requestSettings,
                s,
                e,
                i
            );
        }
    }
    static processMicrophone(t, e, i, s) {
        var n, o, r, a, l, c;
        const u = {
            acceptedFormats: "audio/*",
            ...((null == (n = t.fileTypes.audio) ? void 0 : n.files) || {}),
        };
        i &&
            (void 0 !== navigator.mediaDevices.getUserMedia
                ? ((t.recordAudio = SetFileTypes.parseConfig(
                      t.requestSettings,
                      u,
                      e,
                      i
                  )),
                  "object" == typeof i &&
                      i.files &&
                      ((o = t.recordAudio).files ?? (o.files = {}),
                      (t.recordAudio.files.format =
                          null == (r = i.files) ? void 0 : r.format),
                      (t.recordAudio.files.maxDurationSeconds =
                          null == (a = i.files)
                              ? void 0
                              : a.maxDurationSeconds),
                      null != (l = t.fileTypes.audio) &&
                          l.files &&
                          ((c = t.fileTypes.audio.files).maxNumberOfFiles ??
                              (c.maxNumberOfFiles = i.files.maxNumberOfFiles))))
                : s ||
                  (t.fileTypes.audio = SetFileTypes.parseConfig(
                      t.requestSettings,
                      u,
                      e,
                      i
                  )));
    }
    static processAudioConfig(t, e, i, s) {
        if (!i && !s) return;
        const n = {
            acceptedFormats: "audio/*",
            ...((null == s ? void 0 : s.files) || {}),
        };
        t.fileTypes.audio = SetFileTypes.parseConfig(
            t.requestSettings,
            n,
            e,
            i
        );
    }
    static processGifConfig(t, e, i, s) {
        if (!i && !s) return;
        const n = {
            acceptedFormats: "image/gif",
            ...((null == s ? void 0 : s.files) || {}),
        };
        t.fileTypes.gifs = SetFileTypes.parseConfig(t.requestSettings, n, e, i);
    }
    static processCamera(t, e, i, s) {
        var n, o, r, a;
        const l = {
            acceptedFormats: "image/*",
            ...((null == (n = t.fileTypes.images) ? void 0 : n.files) || {}),
        };
        i &&
            (void 0 !== navigator.mediaDevices.getUserMedia
                ? ((t.camera = SetFileTypes.parseConfig(
                      t.requestSettings,
                      l,
                      e,
                      i
                  )),
                  "object" == typeof i &&
                      ((t.camera.modalContainerStyle = i.modalContainerStyle),
                      i.files &&
                          ((o = t.camera).files ?? (o.files = {}),
                          (t.camera.files.format =
                              null == (r = i.files) ? void 0 : r.format),
                          (t.camera.files.dimensions =
                              null == (a = i.files) ? void 0 : a.dimensions))))
                : s ||
                  (t.fileTypes.images = SetFileTypes.parseConfig(
                      t.requestSettings,
                      l,
                      e,
                      i
                  )));
    }
    static processImagesConfig(t, e, i, s) {
        if (!i && !s) return;
        const n = {
            acceptedFormats: "image/*",
            ...((null == s ? void 0 : s.files) || {}),
        };
        t.fileTypes.images = SetFileTypes.parseConfig(
            t.requestSettings,
            n,
            e,
            i
        );
    }
    static populateDefaultFileIO(t, e) {
        var i, s;
        t &&
            (t.files ?? (t.files = {}),
            (i = t.files).acceptedFormats ?? (i.acceptedFormats = e),
            (s = t.files).maxNumberOfFiles ?? (s.maxNumberOfFiles = 1));
    }
    static set(t, e, i) {
        SetFileTypes.populateDefaultFileIO(
            null == i ? void 0 : i.audio,
            ".4a,.mp3,.webm,.mp4,.mpga,.wav,.mpeg,.m4a"
        ),
            SetFileTypes.populateDefaultFileIO(
                null == i ? void 0 : i.images,
                ".png,.jpg"
            );
        const s = RemarkableConfig.createNew();
        SetFileTypes.processImagesConfig(
            e,
            s,
            t.images,
            null == i ? void 0 : i.images
        ),
            SetFileTypes.processCamera(e, s, t.camera, t.images),
            SetFileTypes.processGifConfig(
                e,
                s,
                t.gifs,
                null == i ? void 0 : i.gifs
            ),
            SetFileTypes.processAudioConfig(
                e,
                s,
                t.audio,
                null == i ? void 0 : i.audio
            ),
            SetFileTypes.processMicrophone(e, s, t.microphone, t.audio),
            SetFileTypes.processMixedFiles(e, s, t.mixedFiles);
    }
}
class BaseServiceIO {
    constructor(t, e, i) {
        var s, n, o, r;
        (this.rawBody = {}),
            (this.validateConfigKey = !1),
            (this.canSendMessage = BaseServiceIO.canSendMessage),
            (this.requestSettings = {}),
            (this.fileTypes = {}),
            (this.completionsHandlers = {}),
            (this.streamHandlers = {}),
            (this.deepChat = t),
            (this.demo = i),
            Object.assign(
                this.rawBody,
                null == (s = t.request) ? void 0 : s.additionalBodyProps
            ),
            (this.totalMessagesMaxCharLength =
                null == (n = null == t ? void 0 : t.requestBodyLimits)
                    ? void 0
                    : n.totalMessagesMaxCharLength),
            (this.maxMessages =
                null == (o = null == t ? void 0 : t.requestBodyLimits)
                    ? void 0
                    : o.maxMessages),
            SetFileTypes.set(t, this, e),
            t.request && (this.requestSettings = t.request),
            this.demo && ((r = this.requestSettings).url ?? (r.url = Demo.URL)),
            (this._directServiceRequiresFiles =
                !!e && Object.keys(e).length > 0),
            this.requestSettings.websocket && Websocket.setup(this);
    }
    static canSendMessage(t, e) {
        return !(!t || "" === t.trim()) || !!(e && e.length > 0);
    }
    verifyKey(t, e) {}
    static createCustomFormDataBody(t, e, i) {
        const s = new FormData();
        i.forEach((t) => s.append("files", t)),
            Object.keys(t).forEach((e) => s.append(e, String(t[e])));
        let n = 0;
        e.slice(0, e.length - 1).forEach((t) => {
            s.append(`message${(n += 1)}`, JSON.stringify(t));
        });
        const o = e[e.length - 1];
        return (
            o.text &&
                (delete o.files,
                s.append(`message${(n += 1)}`, JSON.stringify(o))),
            s
        );
    }
    getServiceIOByType(t) {
        if (t.type.startsWith("audio") && this.fileTypes.audio)
            return this.fileTypes.audio;
        if (t.type.startsWith("image")) {
            if (this.fileTypes.gifs && t.type.endsWith("/gif"))
                return this.fileTypes.gifs;
            if (this.fileTypes.images) return this.fileTypes.images;
            if (this.camera) return this.camera;
        }
        return this.fileTypes.mixedFiles;
    }
    async request(t, e, i = !0) {
        const { stream: s } = this.deepChat;
        return !s || (!this.demo && "object" == typeof s && s.simulation)
            ? HTTPRequest.request(this, t, e, i)
            : Stream.request(this, t, e);
    }
    async callServiceAPI(t, e, i) {
        var s, n, o, r;
        const a = { messages: e, ...this.rawBody };
        let l = !1;
        (null != (s = this.requestSettings.headers) && s["Content-Type"]) ||
            ((n = this.requestSettings).headers ?? (n.headers = {}),
            (o = this.requestSettings.headers)["Content-Type"] ??
                (o["Content-Type"] = "application/json"),
            (l = !0)),
            await this.request(a, t),
            l &&
                (null == (r = this.requestSettings.headers) ||
                    delete r["Content-Type"]);
    }
    async callApiWithFiles(t, e, i, s) {
        const n = BaseServiceIO.createCustomFormDataBody(t, i, s),
            o = this.requestSettings,
            r = this.getServiceIOByType(s[0]);
        (this.requestSettings =
            (null == r ? void 0 : r.request) || this.requestSettings),
            await this.request(n, e, !1),
            (this.requestSettings = o);
    }
    async callAPI(t, e) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const i = MessageLimitUtils.processMessages(
            e.messages,
            this.maxMessages,
            this.totalMessagesMaxCharLength
        );
        if (this.requestSettings.websocket) {
            const t = { messages: i, ...this.rawBody };
            Websocket.sendWebsocket(this, t, e, !1);
        } else
            t.files && !this._directServiceRequiresFiles
                ? this.callApiWithFiles(this.rawBody, e, i, t.files)
                : this.callServiceAPI(e, i, t.files);
    }
    async extractResultData(t) {
        if (t.error) throw t.error;
        return t.result ? Legacy.handleResponseProperty(t) : t;
    }
    isDirectConnection() {
        return !1;
    }
}
class DirectServiceIO extends BaseServiceIO {
    constructor(t, e, i, s, n) {
        var o;
        super(t, n),
            (this.insertKeyPlaceholderText = "API Key"),
            (this.getKeyLink = ""),
            Object.assign(
                this.rawBody,
                null == (o = t.request) ? void 0 : o.additionalBodyProps
            ),
            (this.keyVerificationDetails = e),
            (this.buildHeadersFunc = i),
            s && this.setApiKeyProperties(s),
            (this.requestSettings = this.buildRequestSettings(
                this.key || "",
                t.request
            ));
    }
    setApiKeyProperties(t) {
        (this.key = t.key),
            t.validateKeyProperty &&
                (this.validateConfigKey = t.validateKeyProperty);
    }
    buildRequestSettings(t, e) {
        const i = e ?? {};
        return (i.headers = this.buildHeadersFunc(t)), i;
    }
    keyAuthenticated(t, e) {
        (this.requestSettings = this.buildRequestSettings(
            e,
            this.requestSettings
        )),
            (this.key = e),
            t();
    }
    verifyKey(t, e) {
        const {
                url: i,
                method: s,
                handleVerificationResult: n,
                createHeaders: o,
                body: r,
            } = this.keyVerificationDetails,
            a = (null == o ? void 0 : o(t)) || this.buildHeadersFunc(t);
        HTTPRequest.verifyKey(
            t,
            i,
            a,
            s,
            this.keyAuthenticated.bind(this, e.onSuccess),
            e.onFail,
            e.onLoad,
            n,
            r
        );
    }
    isDirectConnection() {
        return !0;
    }
}
class RenderControl {
    static waitForPropertiesToBeUpdatedBeforeRender(t) {
        (t._propUpdated_ = !1),
            setTimeout(() => {
                t._propUpdated_
                    ? RenderControl.waitForPropertiesToBeUpdatedBeforeRender(t)
                    : ((t._waitingToRender_ = !1), t.onRender());
            });
    }
    static attemptRender(t) {
        (t._propUpdated_ = !0),
            t._waitingToRender_ ||
                ((t._waitingToRender_ = !0),
                RenderControl.waitForPropertiesToBeUpdatedBeforeRender(t));
    }
}
const _InternalHTML = class t extends HTMLElement {
    constructor() {
        super(),
            (this._waitingToRender_ = !1),
            (this._propUpdated_ = !1),
            Object.keys(t._attributeToProperty_).forEach((e) => {
                const i = t._attributeToProperty_[e];
                this.constructPropertyAccessors(i),
                    this.hasOwnProperty(e) ||
                        this.constructPropertyAccessors(i, e);
            });
    }
    static get observedAttributes() {
        return Object.keys(t._attributes_) || [];
    }
    constructPropertyAccessors(t, e) {
        let i;
        Object.defineProperty(this, e || t, {
            get: function () {
                return i;
            },
            set: function (s) {
                (i = s), e ? (this[t] = s) : RenderControl.attemptRender(this);
            },
        });
    }
    attributeChangedCallback(e, i, s) {
        if (i === s) return;
        const n = t._attributes_[e](s);
        this[t._attributeToProperty_[e]] = n;
    }
    onRender() {}
};
(_InternalHTML._attributes_ = {}), (_InternalHTML._attributeToProperty_ = {});
let InternalHTML = _InternalHTML;
const NOT_VISIBLE_ICON_STRING =
        '<?xml version="1.0" standalone="no"?>\n<svg version="1.1"\n\txmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n\txmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0.9em" height="0.9em"\n\tviewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200">\n\t\t<path d="\n\t\t\tM669.727,273.516c-22.891-2.476-46.15-3.895-69.727-4.248c-103.025,0.457-209.823,25.517-310.913,73.536\n\t\t\tc-75.058,37.122-148.173,89.529-211.67,154.174C46.232,529.978,6.431,577.76,0,628.74c0.76,44.162,48.153,98.67,77.417,131.764\n\t\t\tc59.543,62.106,130.754,113.013,211.67,154.174c2.75,1.335,5.51,2.654,8.276,3.955l-75.072,131.102l102.005,60.286l551.416-960.033\n\t\t\tl-98.186-60.008L669.727,273.516z M902.563,338.995l-74.927,129.857c34.47,44.782,54.932,100.006,54.932,159.888\n\t\t\tc0,149.257-126.522,270.264-282.642,270.264c-6.749,0-13.29-0.728-19.922-1.172l-49.585,85.84c22.868,2.449,45.99,4.233,69.58,4.541\n\t\t\tc103.123-0.463,209.861-25.812,310.84-73.535c75.058-37.122,148.246-89.529,211.743-154.174\n\t\t\tc31.186-32.999,70.985-80.782,77.417-131.764c-0.76-44.161-48.153-98.669-77.417-131.763\n\t\t\tc-59.543-62.106-130.827-113.013-211.743-154.175C908.108,341.478,905.312,340.287,902.563,338.995L902.563,338.995z\n\t\t\tM599.927,358.478c6.846,0,13.638,0.274,20.361,0.732l-58.081,100.561c-81.514,16.526-142.676,85.88-142.676,168.897\n\t\t\tc0,20.854,3.841,40.819,10.913,59.325c0.008,0.021-0.008,0.053,0,0.074l-58.228,100.854\n\t\t\tc-34.551-44.823-54.932-100.229-54.932-160.182C317.285,479.484,443.808,358.477,599.927,358.478L599.927,358.478z M768.896,570.513\n\t\t\tL638.013,797.271c81.076-16.837,141.797-85.875,141.797-168.603C779.81,608.194,775.724,588.729,768.896,570.513L768.896,570.513z"\n\t\t\t/>\n</svg>\n',
    VISIBLE_ICON_STRING =
        '<?xml version="1.0" standalone="no"?>\n<svg version="1.1"\n\txmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n\txmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0.9em" height="0.9em"\n\tviewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200">\n\t\t<path id="path6686" inkscape:connector-curvature="0" d="M779.843,599.925c0,95.331-80.664,172.612-180.169,172.612\n\t\t\tc-99.504,0-180.168-77.281-180.168-172.612c0-95.332,80.664-172.612,180.168-172.612\n\t\t\tC699.179,427.312,779.843,504.594,779.843,599.925z M600,240.521c-103.025,0.457-209.814,25.538-310.904,73.557\n\t\t\tc-75.058,37.122-148.206,89.496-211.702,154.141C46.208,501.218,6.431,549,0,599.981c0.76,44.161,48.13,98.669,77.394,131.763\n\t\t\tc59.543,62.106,130.786,113.018,211.702,154.179c94.271,45.751,198.616,72.092,310.904,73.557\n\t\t\tc103.123-0.464,209.888-25.834,310.866-73.557c75.058-37.122,148.243-89.534,211.74-154.179\n\t\t\tc31.185-32.999,70.962-80.782,77.394-131.763c-0.76-44.161-48.13-98.671-77.394-131.764\n\t\t\tc-59.543-62.106-130.824-112.979-211.74-154.141C816.644,268.36,712.042,242.2,600,240.521z M599.924,329.769\n\t\t\tc156.119,0,282.675,120.994,282.675,270.251c0,149.256-126.556,270.25-282.675,270.25S317.249,749.275,317.249,600.02\n\t\t\tC317.249,450.763,443.805,329.769,599.924,329.769L599.924,329.769z"/>\n</svg>\n';
class SVGIconUtils {
    static createSVGElement(t) {
        return new DOMParser().parseFromString(t, "image/svg+xml")
            .documentElement;
    }
}
const _VisibilityIcon = class t {
    static changeVisibility(e, i, s, n) {
        n.target.id === t.VISIBLE_ICON_ID
            ? ((i.style.display = "none"),
              (s.style.display = "block"),
              (e.type = "password"))
            : ((i.style.display = "block"),
              (s.style.display = "none"),
              (e.type = "text"));
    }
    static createIconElement(t, e) {
        const i = SVGIconUtils.createSVGElement(t);
        return (i.id = e), i.classList.add("visibility-icon"), i;
    }
    static create(e) {
        const i = document.createElement("div");
        i.id = "visibility-icon-container";
        const s = t.createIconElement(VISIBLE_ICON_STRING, t.VISIBLE_ICON_ID);
        (s.style.display = "none"), i.appendChild(s);
        const n = t.createIconElement(
            NOT_VISIBLE_ICON_STRING,
            "not-visible-icon"
        );
        return (
            i.appendChild(n),
            (i.onclick = t.changeVisibility.bind(this, e, s, n)),
            i
        );
    }
};
_VisibilityIcon.VISIBLE_ICON_ID = "visible-icon";
let VisibilityIcon = _VisibilityIcon;
class InsertKeyView {
    static createCautionText() {
        const t = document.createElement("a");
        return (
            t.classList.add("insert-key-input-help-text"),
            (t.innerText =
                "Please exercise CAUTION when inserting your API key outside of deepchat.dev or localhost!!"),
            t
        );
    }
    static createHelpLink(t) {
        const e = document.createElement("a");
        return (
            e.classList.add("insert-key-input-help-text"),
            (e.href = t),
            (e.innerText = "Find more info here"),
            (e.target = "_blank"),
            e
        );
    }
    static createFailText() {
        const t = document.createElement("div");
        return (
            (t.id = "insert-key-input-invalid-text"),
            (t.style.display = "none"),
            t
        );
    }
    static createHelpTextContainer(t) {
        const e = document.createElement("div");
        e.id = "insert-key-help-text-container";
        const i = document.createElement("div");
        i.id = "insert-key-help-text-contents";
        const s = InsertKeyView.createFailText();
        if ((i.appendChild(s), t)) {
            const e = InsertKeyView.createHelpLink(t);
            i.appendChild(e);
        }
        const n = InsertKeyView.createCautionText();
        return (
            i.appendChild(n),
            e.appendChild(i),
            { helpTextContainerElement: e, failTextElement: s }
        );
    }
    static onFail(t, e, i, s) {
        t.classList.replace(
            "insert-key-input-valid",
            "insert-key-input-invalid"
        ),
            (i.innerText = s),
            (i.style.display = "block"),
            (e.innerText = "Start"),
            t.classList.remove("loading");
    }
    static onLoad(t, e) {
        t.classList.add("loading"),
            (e.innerHTML = '<div id="loading-ring"></div>');
    }
    static verifyKey(t, e, i) {
        const s = t.value.trim();
        i.verifyKey(s, e);
    }
    static addVerificationEvents(t, e, i, s, n) {
        const o = {
                onSuccess: s,
                onFail: InsertKeyView.onFail.bind(this, t, e, i),
                onLoad: InsertKeyView.onLoad.bind(this, t, e),
            },
            r = InsertKeyView.verifyKey.bind(this, t, o, n);
        (e.onclick = r),
            (t.onkeydown = (e) => {
                !t.classList.contains("loading") &&
                    e.key === KEYBOARD_KEY.ENTER &&
                    r();
            });
    }
    static createStartButton() {
        const t = document.createElement("div");
        return (t.id = "start-button"), (t.innerText = "Start"), t;
    }
    static onInputFocus(t) {
        t.target.classList.replace(
            "insert-key-input-invalid",
            "insert-key-input-valid"
        );
    }
    static createInput(t) {
        const e = document.createElement("div");
        e.id = "insert-key-input-container";
        const i = document.createElement("input");
        return (
            (i.id = "insert-key-input"),
            (i.placeholder = t || "API Key"),
            (i.type = "password"),
            i.classList.add("insert-key-input-valid"),
            (i.onfocus = InsertKeyView.onInputFocus),
            e.appendChild(i),
            e
        );
    }
    static createContents(t, e) {
        const i = document.createElement("div");
        i.id = "insert-key-contents";
        const s = InsertKeyView.createInput(e.insertKeyPlaceholderText),
            n = s.children[0],
            o = VisibilityIcon.create(n);
        s.appendChild(o), i.appendChild(s);
        const r = InsertKeyView.createStartButton(),
            { helpTextContainerElement: a, failTextElement: l } =
                InsertKeyView.createHelpTextContainer(e.getKeyLink);
        return (
            i.appendChild(r),
            i.appendChild(a),
            InsertKeyView.addVerificationEvents(n, r, l, t, e),
            i
        );
    }
    static createElements(t, e) {
        const i = document.createElement("div");
        i.id = "insert-key-view";
        const s = InsertKeyView.createContents(t, e);
        return i.appendChild(s), i;
    }
    static render(t, e, i) {
        const s = InsertKeyView.createElements(e, i);
        t.replaceChildren(s);
    }
}
class HuggingFaceUtils {
    static buildHeaders(t) {
        return {
            Authorization: `Bearer ${t}`,
            "Content-Type": "application/json",
        };
    }
    static handleVerificationResult(t, e, i, s) {
        const n = t;
        Array.isArray(n.error) &&
        "Error in `parameters`: field required" === n.error[0]
            ? i(e)
            : s(ErrorMessages.INVALID_KEY);
    }
    static buildKeyVerificationDetails() {
        return {
            url: "https://api-inference.huggingface.co/models/gpt2",
            method: "POST",
            handleVerificationResult: HuggingFaceUtils.handleVerificationResult,
        };
    }
}
const _HuggingFaceIO = class t extends DirectServiceIO {
    constructor(e, i, s, n, o, r) {
        super(
            e,
            HuggingFaceUtils.buildKeyVerificationDetails(),
            HuggingFaceUtils.buildHeaders,
            o,
            r
        ),
            (this.insertKeyPlaceholderText = "Hugging Face Token"),
            (this.getKeyLink = "https://huggingface.co/settings/tokens"),
            (this.introPanelMarkUp =
                '\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>Hugging Face</b></div>\n    <p>First message may take an extented amount of time to complete as the model needs to be initialized.</p>'),
            (this.permittedErrorPrefixes = ["Authorization header"]),
            (this.url = `${t.URL_PREFIX}${s}`),
            (this.textInputPlaceholderText = i),
            "object" == typeof n &&
                (n.model && (this.url = `${t.URL_PREFIX}${n.model}`),
                n.options && (this.rawBody.options = n.options),
                n.parameters && (this.rawBody.parameters = n.parameters));
    }
    preprocessBody(t, e, i) {
        const s = JSON.parse(JSON.stringify(t)),
            n = e[e.length - 1].text;
        if (n)
            return (
                s.options ?? (s.options = {}),
                (s.options.wait_for_model = !0),
                { inputs: n, ...s }
            );
    }
    async callServiceAPI(t, e, i) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const s = this.preprocessBody(this.rawBody, e, i);
        HTTPRequest.request(this, s, t);
    }
};
_HuggingFaceIO.URL_PREFIX = "https://api-inference.huggingface.co/models/";
let HuggingFaceIO = _HuggingFaceIO;
class HuggingFaceFileIO extends HuggingFaceIO {
    constructor(t, e, i, s, n, o) {
        super(t, e, i, s, n, o),
            (this.isTextInputDisabled = !0),
            (this.canSendMessage = HuggingFaceFileIO.canSendFile);
    }
    static canSendFile(t, e) {
        return !(null == e || !e[0]);
    }
    preprocessBody(t, e, i) {
        return i[0];
    }
    async callServiceAPI(t, e, i) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        if (null == i || !i[0]) throw new Error("No file was added");
        HTTPRequest.poll(this, i[0], t, !1);
    }
}
class HuggingFaceAudioClassificationIO extends HuggingFaceFileIO {
    constructor(t) {
        var e, i, s;
        super(
            t,
            "Attach an audio file",
            "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition",
            null ==
                (i = null == (e = t.directConnection) ? void 0 : e.huggingFace)
                ? void 0
                : i.audioClassification,
            null == (s = t.directConnection) ? void 0 : s.huggingFace,
            { audio: {} }
        );
    }
    async extractPollResultData(t) {
        var e;
        if (t.estimated_time)
            return { timeoutMS: 1e3 * (t.estimated_time + 1) };
        if (t.error) throw t.error;
        return { text: (null == (e = t[0]) ? void 0 : e.label) || "" };
    }
}
class HuggingFaceImageClassificationIO extends HuggingFaceFileIO {
    constructor(t) {
        var e, i, s;
        super(
            t,
            "Attach an image file",
            "google/vit-base-patch16-224",
            null ==
                (i = null == (e = t.directConnection) ? void 0 : e.huggingFace)
                ? void 0
                : i.imageClassification,
            null == (s = t.directConnection) ? void 0 : s.huggingFace,
            { images: {} }
        );
    }
    async extractPollResultData(t) {
        var e;
        if (t.estimated_time)
            return { timeoutMS: 1e3 * (t.estimated_time + 1) };
        if (t.error) throw t.error;
        return { text: (null == (e = t[0]) ? void 0 : e.label) || "" };
    }
}
const BASE_64_PREFIX = "data:image/png;base64,";
class StabilityAIUtils {
    static buildHeaders(t) {
        return {
            Authorization: `Bearer ${t}`,
            "Content-Type": "application/json",
        };
    }
    static handleVerificationResult(t, e, i, s) {
        t.message ? s(ErrorMessages.INVALID_KEY) : i(e);
    }
    static buildKeyVerificationDetails() {
        return {
            url: "https://api.stability.ai/v1/engines/list",
            method: "GET",
            handleVerificationResult: StabilityAIUtils.handleVerificationResult,
        };
    }
}
class StabilityAIIO extends DirectServiceIO {
    constructor(t, e, i, s, n) {
        super(t, e, i, s, n),
            (this.insertKeyPlaceholderText = "Stability AI API Key"),
            (this.getKeyLink =
                "https://platform.stability.ai/docs/getting-started/authentication"),
            (this.permittedErrorPrefixes = ["Incorrect", "invalid_"]);
    }
}
class StabilityAIImageToImageUpscaleIO extends StabilityAIIO {
    constructor(t) {
        var e;
        const i = JSON.parse(JSON.stringify(t.directConnection)),
            s = null == i ? void 0 : i.stabilityAI;
        super(
            t,
            StabilityAIUtils.buildKeyVerificationDetails(),
            StabilityAIUtils.buildHeaders,
            s,
            {
                images: {
                    files: { acceptedFormats: ".png", maxNumberOfFiles: 1 },
                },
            }
        ),
            (this.url =
                "https://api.stability.ai/v1/generation/esrgan-v1-x2plus/image-to-image/upscale"),
            (this.textInputPlaceholderText = "Describe image changes"),
            (this.introPanelMarkUp =
                '\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>Stability AI</b></div>\n    <div style="width: 100%; text-align: center; margin-left: -10px; margin-top: 5px"><b>Image to Image Upscale</b></div>\n    <p>Upload an image to generate a new one with higher resolution.</p>\n    <p>Click <a href="https://platform.stability.ai/">here</a> for more info.</p>');
        const n =
            null == (e = null == i ? void 0 : i.stabilityAI)
                ? void 0
                : e.imageToImageUpscale;
        "object" == typeof n &&
            (n.engine_id &&
                (this.url = `https://api.stability.ai/v1/generation/${n.engine_id}/image-to-image/upscale`),
            StabilityAIImageToImageUpscaleIO.cleanConfig(n),
            Object.assign(this.rawBody, n)),
            (this.canSendMessage =
                StabilityAIImageToImageUpscaleIO.canSendFileMessage);
    }
    static cleanConfig(t) {
        delete t.engine_id;
    }
    static canSendFileMessage(t, e) {
        return !(null == e || !e[0]);
    }
    createFormDataBody(t, e) {
        const i = new FormData();
        return (
            i.append("image", e),
            Object.keys(t).forEach((e) => {
                i.append(e, String(t[e]));
            }),
            i
        );
    }
    async callServiceAPI(t, e, i) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        if (!i) throw new Error("Image was not found");
        const s = this.createFormDataBody(this.rawBody, i[0]);
        RequestUtils.temporarilyRemoveHeader(
            this.requestSettings,
            HTTPRequest.request.bind(this, this, s, t),
            !1
        );
    }
    async extractResultData(t) {
        if (t.message) throw t.message;
        return {
            files: t.artifacts.map((t) => ({
                src: `${BASE_64_PREFIX}${t.base64}`,
                type: "image",
            })),
        };
    }
}
class StabilityAIImageToImageMaskingIO extends StabilityAIIO {
    constructor(t) {
        var e;
        const i = JSON.parse(JSON.stringify(t.directConnection)),
            s = null == i ? void 0 : i.stabilityAI;
        super(
            t,
            StabilityAIUtils.buildKeyVerificationDetails(),
            StabilityAIUtils.buildHeaders,
            s,
            {
                images: {
                    files: { acceptedFormats: ".png", maxNumberOfFiles: 2 },
                },
            }
        ),
            (this.url =
                "https://api.stability.ai/v1/generation/stable-inpainting-512-v2-0/image-to-image/masking"),
            (this._maskSource = "MASK_IMAGE_WHITE"),
            (this.textInputPlaceholderText = "Describe image changes"),
            (this.introPanelMarkUp =
                '\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>Stability AI</b></div>\n    <div style="width: 100%; text-align: center; margin-left: -10px; margin-top: 5px"><b>Image to Image Masking</b></div>\n    <p>Upload an image, its mask image to create a new one based on the changes you have described for the mask area.</p>\n    <p>Click <a href="https://platform.stability.ai/">here</a> for more info.</p>');
        const n =
            null == (e = null == i ? void 0 : i.stabilityAI)
                ? void 0
                : e.imageToImageMasking;
        "object" == typeof n &&
            (n.engine_id &&
                (this.url = `https://api.stability.ai/v1/generation/${n.engine_id}/image-to-image/masking`),
            void 0 !== n.weight &&
                null !== n.weight &&
                (this._imageWeight = n.weight),
            void 0 !== n.mask_source &&
                null !== n.mask_source &&
                (this._maskSource = n.mask_source),
            StabilityAIImageToImageMaskingIO.cleanConfig(n),
            Object.assign(this.rawBody, n)),
            (this.canSendMessage =
                StabilityAIImageToImageMaskingIO.canSendFileTextMessage);
    }
    static cleanConfig(t) {
        delete t.engine_id, delete t.weight;
    }
    static canSendFileTextMessage(t, e) {
        return !(null == e || !e[0] || !t || "" === t.trim());
    }
    createFormDataBody(t, e, i, s) {
        const n = new FormData();
        return (
            n.append("init_image", e),
            n.append("mask_source", String(this._maskSource)),
            n.append("mask_image", i),
            s && "" !== s && n.append("text_prompts[0][text]", s),
            void 0 !== this._imageWeight &&
                null !== this._imageWeight &&
                n.append("text_prompts[0][weight]", String(this._imageWeight)),
            Object.keys(t).forEach((e) => {
                n.append(e, String(t[e]));
            }),
            void 0 === n.get("weight") && n.append("weight", String(1)),
            n
        );
    }
    async callServiceAPI(t, e, i) {
        var s, n;
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        if (!i || !i[0] || !i[1]) throw new Error("Image was not found");
        const o =
                null == (n = null == (s = e[e.length - 1]) ? void 0 : s.text)
                    ? void 0
                    : n.trim(),
            r = this.createFormDataBody(this.rawBody, i[0], i[1], o);
        RequestUtils.temporarilyRemoveHeader(
            this.requestSettings,
            HTTPRequest.request.bind(this, this, r, t),
            !1
        );
    }
    async extractResultData(t) {
        if (t.message) throw t.message;
        return {
            files: t.artifacts.map((t) => ({
                src: `${BASE_64_PREFIX}${t.base64}`,
                type: "image",
            })),
        };
    }
}
class HuggingFaceAudioRecognitionIO extends HuggingFaceFileIO {
    constructor(t) {
        var e, i, s;
        super(
            t,
            "Attach an audio file",
            "facebook/wav2vec2-large-960h-lv60-self",
            null ==
                (i = null == (e = t.directConnection) ? void 0 : e.huggingFace)
                ? void 0
                : i.audioSpeechRecognition,
            null == (s = t.directConnection) ? void 0 : s.huggingFace,
            { audio: {} }
        );
    }
    async extractPollResultData(t) {
        if (t.estimated_time)
            return { timeoutMS: 1e3 * (t.estimated_time + 1) };
        if (t.error) throw t.error;
        return { text: t.text || "" };
    }
}
class HuggingFaceTextGenerationIO extends HuggingFaceIO {
    constructor(t) {
        var e, i, s;
        super(
            t,
            "Once upon a time",
            "gpt2",
            null ==
                (i = null == (e = t.directConnection) ? void 0 : e.huggingFace)
                ? void 0
                : i.textGeneration,
            null == (s = t.directConnection) ? void 0 : s.huggingFace
        );
    }
    async extractResultData(t) {
        if (t.error) throw t.error;
        return { text: t[0].generated_text || "" };
    }
}
class HuggingFaceQuestionAnswerIO extends HuggingFaceIO {
    constructor(t) {
        var e, i, s;
        const n =
            null ==
            (i = null == (e = t.directConnection) ? void 0 : e.huggingFace)
                ? void 0
                : i.questionAnswer;
        super(
            t,
            "Ask a question",
            "bert-large-uncased-whole-word-masking-finetuned-squad",
            n,
            null == (s = t.directConnection) ? void 0 : s.huggingFace
        ),
            (this.permittedErrorPrefixes = [
                "Authorization header",
                "Error in",
            ]),
            (this.context = n.context);
    }
    preprocessBody(t, e) {
        const i = e[e.length - 1].text;
        if (i)
            return {
                inputs: {
                    question: i,
                    context: this.context,
                    options: { wait_for_model: !0 },
                },
            };
    }
    async extractResultData(t) {
        if (t.error) throw t.error;
        return { text: t.answer || "" };
    }
}
class HuggingFaceSummarizationIO extends HuggingFaceIO {
    constructor(t) {
        var e, i, s;
        super(
            t,
            "Insert text to summarize",
            "facebook/bart-large-cnn",
            null ==
                (i = null == (e = t.directConnection) ? void 0 : e.huggingFace)
                ? void 0
                : i.summarization,
            null == (s = t.directConnection) ? void 0 : s.huggingFace
        );
    }
    async extractResultData(t) {
        if (t.error) throw t.error;
        return { text: t[0].summary_text || "" };
    }
}
class HuggingFaceConversationIO extends HuggingFaceIO {
    constructor(t) {
        var e, i, s;
        super(
            t,
            "Ask me anything!",
            "facebook/blenderbot-400M-distill",
            null ==
                (i = null == (e = t.directConnection) ? void 0 : e.huggingFace)
                ? void 0
                : i.conversation,
            null == (s = t.directConnection) ? void 0 : s.huggingFace
        ),
            this.maxMessages ?? (this.maxMessages = -1);
    }
    processMessages(t) {
        const e = t[t.length - 1].text,
            i = t.slice(0, t.length - 1);
        if (!e) return;
        return {
            past_user_inputs: i
                .filter((t) => "user" === t.role)
                .map((t) => t.text),
            generated_responses: i
                .filter((t) => "ai" === t.role)
                .map((t) => t.text),
            mostRecentMessageText: e,
        };
    }
    preprocessBody(t, e) {
        const i = JSON.parse(JSON.stringify(t)),
            s = this.processMessages(e);
        if (s)
            return (
                i.options ?? (i.options = {}),
                (i.options.wait_for_model = !0),
                {
                    inputs: {
                        past_user_inputs: s.past_user_inputs,
                        generated_responses: s.generated_responses,
                        text: s.mostRecentMessageText,
                    },
                    ...i,
                }
            );
    }
    async extractResultData(t) {
        if (t.error) throw t.error;
        return { text: t.generated_text || "" };
    }
}
class StabilityAIImageToImageIO extends StabilityAIIO {
    constructor(t) {
        var e;
        const i = JSON.parse(JSON.stringify(t.directConnection)),
            s = i.stabilityAI;
        super(
            t,
            StabilityAIUtils.buildKeyVerificationDetails(),
            StabilityAIUtils.buildHeaders,
            s,
            {
                images: {
                    files: { acceptedFormats: ".png", maxNumberOfFiles: 1 },
                },
            }
        ),
            (this.url =
                "https://api.stability.ai/v1/generation/stable-diffusion-v1-5/image-to-image"),
            (this.textInputPlaceholderText = "Describe image changes"),
            (this.introPanelMarkUp =
                '\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>Stability AI: Image to Image</b></div>\n    <p>Upload an image to create a new one with the changes you have described.</p>\n    <p>Click <a href="https://platform.stability.ai/">here</a> for more info.</p>');
        const n = null == (e = i.stabilityAI) ? void 0 : e.imageToImage;
        "object" == typeof n &&
            (n.engine_id &&
                (this.url = `https://api.stability.ai/v1/generation/${n.engine_id}/text-to-image`),
            void 0 !== n.weight &&
                null !== n.weight &&
                (this._imageWeight = n.weight),
            StabilityAIImageToImageIO.cleanConfig(n),
            Object.assign(this.rawBody, n)),
            (this.canSendMessage =
                StabilityAIImageToImageIO.canSendFileTextMessage);
    }
    static cleanConfig(t) {
        delete t.engine_id, delete t.weight;
    }
    static canSendFileTextMessage(t, e) {
        return !(null == e || !e[0] || !t || "" === t.trim());
    }
    createFormDataBody(t, e, i) {
        const s = new FormData();
        return (
            s.append("init_image", e),
            i && "" !== i && s.append("text_prompts[0][text]", i),
            void 0 !== this._imageWeight &&
                null !== this._imageWeight &&
                s.append("text_prompts[0][weight]", String(this._imageWeight)),
            Object.keys(t).forEach((e) => {
                s.append(e, String(t[e]));
            }),
            void 0 === s.get("weight") && s.append("weight", String(1)),
            s
        );
    }
    async callServiceAPI(t, e, i) {
        var s, n;
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        if (!i) throw new Error("Image was not found");
        const o =
                null == (n = null == (s = e[e.length - 1]) ? void 0 : s.text)
                    ? void 0
                    : n.trim(),
            r = this.createFormDataBody(this.rawBody, i[0], o);
        RequestUtils.temporarilyRemoveHeader(
            this.requestSettings,
            HTTPRequest.request.bind(this, this, r, t),
            !1
        );
    }
    async extractResultData(t) {
        if (t.message) throw t.message;
        return {
            files: t.artifacts.map((t) => ({
                src: `${BASE_64_PREFIX}${t.base64}`,
                type: "image",
            })),
        };
    }
}
class HuggingFaceTranslationIO extends HuggingFaceIO {
    constructor(t) {
        var e, i, s;
        super(
            t,
            "Insert text to translate",
            "Helsinki-NLP/opus-tatoeba-en-ja",
            null ==
                (i = null == (e = t.directConnection) ? void 0 : e.huggingFace)
                ? void 0
                : i.translation,
            null == (s = t.directConnection) ? void 0 : s.huggingFace
        );
    }
    async extractResultData(t) {
        if (t.error) throw t.error;
        return { text: t[0].translation_text || "" };
    }
}
class StabilityAITextToImageIO extends StabilityAIIO {
    constructor(t) {
        var e;
        const i = JSON.parse(JSON.stringify(t.directConnection)),
            s = i.stabilityAI;
        super(
            t,
            StabilityAIUtils.buildKeyVerificationDetails(),
            StabilityAIUtils.buildHeaders,
            s
        ),
            (this.url =
                "https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image"),
            (this.textInputPlaceholderText = "Describe an image"),
            (this.introPanelMarkUp =
                '\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>Stability AI: Text to Image</b></div>\n    <p>Insert text to generate an image.</p>\n    <p>Click <a href="https://platform.stability.ai/">here</a> for more info.</p>');
        const n = null == (e = i.stabilityAI) ? void 0 : e.textToImage;
        "object" == typeof n &&
            (n.engine_id &&
                (this.url = `https://api.stability.ai/v1/generation/${n.engine_id}/text-to-image`),
            void 0 !== n.weight &&
                null !== n.weight &&
                (this._imageWeight = n.weight),
            StabilityAITextToImageIO.cleanConfig(n),
            Object.assign(this.rawBody, n)),
            (this.canSendMessage = StabilityAITextToImageIO.canSendTextMessage);
    }
    static cleanConfig(t) {
        delete t.engine_id, delete t.weight;
    }
    static canSendTextMessage(t) {
        return !(!t || "" === t.trim());
    }
    preprocessBody(t, e) {
        const i = JSON.parse(JSON.stringify(t)),
            s = { text: e };
        return (
            this._imageWeight && (s.weight = this._imageWeight),
            (i.text_prompts = [s]),
            i
        );
    }
    async callServiceAPI(t, e) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const i = this.preprocessBody(this.rawBody, e[e.length - 1].text);
        HTTPRequest.request(this, i, t);
    }
    async extractResultData(t) {
        if (t.message) throw t.message;
        return {
            files: t.artifacts.map((t) => ({
                src: `${BASE_64_PREFIX}${t.base64}`,
                type: "image",
            })),
        };
    }
}
class HuggingFaceFillMaskIO extends HuggingFaceIO {
    constructor(t) {
        var e, i, s;
        super(
            t,
            "The goal of life is [MASK].",
            "bert-base-uncased",
            null ==
                (i = null == (e = t.directConnection) ? void 0 : e.huggingFace)
                ? void 0
                : i.fillMask,
            null == (s = t.directConnection) ? void 0 : s.huggingFace
        ),
            (this.introPanelMarkUp =
                '\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>Hugging Face</b></div>\n    <p>Insert a sentence with the word [MASK] and the model will try to fill it for you. E.g. I want [MASK].</p>\n    <p>First message may take an extented amount of time to complete as the model needs to be initialized.</p>'),
            (this.permittedErrorPrefixes = [
                "Authorization header",
                "No mask_token",
            ]);
    }
    async extractResultData(t) {
        if (t.error) throw t.error;
        return { text: t[0].sequence || "" };
    }
}
class CohereUtils {
    static buildHeaders(t) {
        return {
            Authorization: `Bearer ${t}`,
            "Content-Type": "application/json",
            accept: "application/json",
        };
    }
    static handleVerificationResult(t, e, i, s) {
        "invalid request: prompt must be at least 1 token long" === t.message
            ? i(e)
            : s(ErrorMessages.INVALID_KEY);
    }
    static buildKeyVerificationDetails() {
        return {
            url: "https://api.cohere.ai/v1/generate",
            method: "POST",
            handleVerificationResult: CohereUtils.handleVerificationResult,
            body: JSON.stringify({ prompt: "" }),
        };
    }
}
class CohereIO extends DirectServiceIO {
    constructor(t, e, i, s, n) {
        super(
            t,
            CohereUtils.buildKeyVerificationDetails(),
            CohereUtils.buildHeaders,
            n
        ),
            (this.insertKeyPlaceholderText = "Cohere API Key"),
            (this.getKeyLink = "https://dashboard.cohere.ai/api-keys"),
            (this.permittedErrorPrefixes = ["invalid"]),
            (this.url = e),
            (this.textInputPlaceholderText = i),
            s && "object" == typeof s && Object.assign(this.rawBody, s);
    }
}
class CohereTextGenerationIO extends CohereIO {
    constructor(t) {
        var e, i, s;
        super(
            t,
            "https://api.cohere.ai/v1/generate",
            "Once upon a time",
            null == (i = null == (e = t.directConnection) ? void 0 : e.cohere)
                ? void 0
                : i.textGeneration,
            null == (s = t.directConnection) ? void 0 : s.cohere
        );
    }
    preprocessBody(t, e) {
        const i = JSON.parse(JSON.stringify(t)),
            s = e[e.length - 1].text;
        if (s) return { prompt: s, ...i };
    }
    async callServiceAPI(t, e) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const i = this.preprocessBody(this.rawBody, e);
        HTTPRequest.request(this, i, t);
    }
    async extractResultData(t) {
        var e;
        if (t.message) throw t.message;
        return {
            text: (null == (e = t.generations) ? void 0 : e[0].text) || "",
        };
    }
}
class CohereSummarizationIO extends CohereIO {
    constructor(t) {
        var e, i, s;
        super(
            t,
            "https://api.cohere.ai/v1/summarize",
            "Insert text to summarize",
            null == (i = null == (e = t.directConnection) ? void 0 : e.cohere)
                ? void 0
                : i.summarization,
            null == (s = t.directConnection) ? void 0 : s.cohere
        );
    }
    preprocessBody(t, e) {
        const i = JSON.parse(JSON.stringify(t)),
            s = e[e.length - 1].text;
        if (s) return { text: s, ...i };
    }
    async callServiceAPI(t, e) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const i = this.preprocessBody(this.rawBody, e);
        HTTPRequest.request(this, i, t);
    }
    async extractResultData(t) {
        if (t.message) throw t.message;
        return { text: t.summary || "" };
    }
}
class AzureUtils {
    static buildTextToSpeechHeaders(t, e) {
        return {
            "Ocp-Apim-Subscription-Key": e,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": t,
        };
    }
    static buildSpeechToTextHeaders(t) {
        return { "Ocp-Apim-Subscription-Key": t, Accept: "application/json" };
    }
    static handleSpeechVerificationResult(t, e, i, s) {
        t.error ? s(ErrorMessages.INVALID_KEY) : i(e);
    }
    static buildSpeechKeyVerificationDetails(t) {
        return {
            url: `https://${t}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`,
            method: "POST",
            createHeaders: (t) => ({ "Ocp-Apim-Subscription-Key": `${t}` }),
            handleVerificationResult: AzureUtils.handleSpeechVerificationResult,
        };
    }
    static buildSummarizationHeader(t) {
        return {
            "Ocp-Apim-Subscription-Key": t,
            "Content-Type": "application/json",
        };
    }
    static handleLanguageVerificationResult(t, e, i, s) {
        var n;
        "401" === (null == (n = t.error) ? void 0 : n.code)
            ? s(ErrorMessages.INVALID_KEY)
            : i(e);
    }
    static buildLanguageKeyVerificationDetails(t) {
        return {
            url: `${t}/language/analyze-text/jobs?api-version=2022-10-01-preview`,
            method: "POST",
            createHeaders: (t) => ({ "Ocp-Apim-Subscription-Key": `${t}` }),
            handleVerificationResult:
                AzureUtils.handleLanguageVerificationResult,
        };
    }
    static handleTranslationVerificationResult(t, e, i, s) {
        t.json().then((t) => {
            Array.isArray(t) || 401e3 !== t.error.code
                ? i(e)
                : s(ErrorMessages.INVALID_KEY);
        });
    }
    static buildTranslationKeyVerificationDetails(t) {
        return {
            url: "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=es",
            method: "POST",
            createHeaders: (e) => AzureUtils.buildTranslationHeaders(t, e),
            handleVerificationResult:
                AzureUtils.handleTranslationVerificationResult,
        };
    }
    static buildTranslationHeaders(t, e) {
        const i = {
            "Ocp-Apim-Subscription-Key": e,
            "Content-Type": "application/json",
        };
        return t && (i["Ocp-Apim-Subscription-Region"] = t), i;
    }
}
class AzureLanguageIO extends DirectServiceIO {
    constructor(t, e, i, s, n) {
        super(t, AzureUtils.buildLanguageKeyVerificationDetails(i), e, s, n),
            (this.insertKeyPlaceholderText = "Azure Language Subscription Key"),
            (this.getKeyLink =
                "https://learn.microsoft.com/en-us/azure/api-management/api-management-subscriptions#create-and-manage-subscriptions-in-azure-portal"),
            (this.permittedErrorPrefixes = ["Access"]);
    }
}
class AzureSummarizationIO extends AzureLanguageIO {
    constructor(t) {
        var e, i, s, n;
        const o =
                null ==
                (i = null == (e = t.directConnection) ? void 0 : e.azure)
                    ? void 0
                    : i.summarization,
            r = null == (s = t.directConnection) ? void 0 : s.azure;
        super(t, AzureUtils.buildSummarizationHeader, o.endpoint, r),
            (this.url = ""),
            (this.textInputPlaceholderText = "Insert text to summarize"),
            (n = this.rawBody).language ?? (n.language = "en"),
            Object.assign(this.rawBody, o),
            (this.url = `${o.endpoint}/language/analyze-text/jobs?api-version=2022-10-01-preview`);
    }
    preprocessBody(t, e) {
        const i = e[e.length - 1].text;
        if (i)
            return {
                analysisInput: {
                    documents: [{ id: "1", language: t.language, text: i }],
                },
                tasks: [{ kind: "ExtractiveSummarization" }],
            };
    }
    async callServiceAPI(t, e) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const i = this.preprocessBody(this.rawBody, e);
        HTTPRequest.request(this, i, t), (this.messages = t);
    }
    async extractResultData(t) {
        var e;
        if (t.error) throw t.error.message;
        if (this.messages && this.completionsHandlers) {
            const i = t.headers.get("operation-location"),
                s = {
                    method: "GET",
                    headers:
                        null == (e = this.requestSettings) ? void 0 : e.headers,
                };
            HTTPRequest.executePollRequest(this, i, s, this.messages);
        }
        return { pollingInAnotherRequest: !0 };
    }
    async extractPollResultData(t) {
        if (t.error) throw t.error;
        if ("running" === t.status) return { timeoutMS: 2e3 };
        if (t.errors.length > 0) throw t.errors[0];
        if (t.tasks.items[0].results.errors.length > 0)
            throw t.tasks.items[0].results.errors[0];
        let e = "";
        for (const i of t.tasks.items[0].results.documents[0].sentences)
            e += i.text;
        return { text: e || "" };
    }
}
const _OpenAIConverseBaseBody = class t {
    static generateDefaultBody(t) {
        return { model: t };
    }
    static build(e, i) {
        const s = t.generateDefaultBody(e);
        return i && "boolean" != typeof i ? Object.assign(s, i) : s;
    }
};
(_OpenAIConverseBaseBody.GPT_COMPLETIONS_DAVINCI_MODEL = "text-davinci-003"),
    (_OpenAIConverseBaseBody.GPT_CHAT_TURBO_MODEL = "gpt-3.5-turbo");
let OpenAIConverseBaseBody = _OpenAIConverseBaseBody;
const _OpenAIUtils = class t {
    static buildHeaders(t) {
        return {
            Authorization: `Bearer ${t}`,
            "Content-Type": "application/json",
        };
    }
    static handleVerificationResult(t, e, i, s) {
        const n = t;
        n.error
            ? "invalid_api_key" === n.error.code
                ? s(ErrorMessages.INVALID_KEY)
                : s(ErrorMessages.CONNECTION_FAILED)
            : i(e);
    }
    static buildKeyVerificationDetails() {
        return {
            url: "https://api.openai.com/v1/models",
            method: "GET",
            handleVerificationResult: t.handleVerificationResult,
        };
    }
};
(_OpenAIUtils.CONVERSE_MAX_CHAR_LENGTH = 13352),
    (_OpenAIUtils.FILE_MAX_CHAR_LENGTH = 1e3);
let OpenAIUtils = _OpenAIUtils;
class OpenAICompletionsIO extends DirectServiceIO {
    constructor(t) {
        var e, i;
        const { directConnection: s, textInput: n } = t,
            o = null == s ? void 0 : s.openAI;
        super(
            t,
            OpenAIUtils.buildKeyVerificationDetails(),
            OpenAIUtils.buildHeaders,
            o
        ),
            (this.insertKeyPlaceholderText = "OpenAI API Key"),
            (this.getKeyLink = "https://platform.openai.com/account/api-keys"),
            (this.url = "https://api.openai.com/v1/completions"),
            (this.permittedErrorPrefixes = ["Incorrect"]),
            (this._maxCharLength = OpenAIUtils.CONVERSE_MAX_CHAR_LENGTH),
            (this.full_transaction_max_tokens = 4e3),
            (this.numberOfCharsPerToken = 3.5);
        const r =
            null == (e = null == s ? void 0 : s.openAI)
                ? void 0
                : e.completions;
        null != n &&
            n.characterLimit &&
            (this._maxCharLength = n.characterLimit),
            "object" == typeof r && Object.assign(this.rawBody, r),
            (i = this.rawBody).model ??
                (i.model =
                    OpenAIConverseBaseBody.GPT_COMPLETIONS_DAVINCI_MODEL);
    }
    preprocessBody(t, e) {
        const i = JSON.parse(JSON.stringify(t)),
            s = e[e.length - 1].text;
        if (!s) return;
        const n = s.substring(0, this._maxCharLength),
            o =
                i.max_tokens ||
                this.full_transaction_max_tokens -
                    n.length / this.numberOfCharsPerToken;
        return { prompt: n, max_tokens: Math.floor(o), ...i };
    }
    async callServiceAPI(t, e) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const i = this.preprocessBody(this.rawBody, e);
        this.deepChat.stream || i.stream
            ? ((i.stream = !0), Stream.request(this, i, t))
            : HTTPRequest.request(this, i, t);
    }
    async extractResultData(t) {
        var e;
        if (t.error) throw t.error.message;
        return { text: (null == (e = t.choices[0]) ? void 0 : e.text) || "" };
    }
}
class AssemblyAIUtils {
    static async poll(t, e) {
        const i = { authorization: t, "content-type": "application/json" },
            s = `https://api.assemblyai.com/v2/transcript/${
                (
                    await (
                        await fetch(
                            "https://api.assemblyai.com/v2/transcript",
                            {
                                method: "POST",
                                body: JSON.stringify({ audio_url: e }),
                                headers: i,
                            }
                        )
                    ).json()
                ).id
            }`;
        let n;
        for (; !n; ) {
            const t = await (await fetch(s, { headers: i })).json();
            if ("completed" === t.status) n = t;
            else {
                if ("error" === t.status)
                    throw new Error(`Transcription failed: ${t.error}`);
                await new Promise((t) => setTimeout(t, 3e3));
            }
        }
        return n;
    }
    static buildHeaders(t) {
        return { Authorization: t, "Content-Type": "application/octet-stream" };
    }
    static handleVerificationResult(t, e, i, s) {
        const n = t;
        n.error
            ? "invalid_api_key" === n.error.code
                ? s(ErrorMessages.INVALID_KEY)
                : s(ErrorMessages.CONNECTION_FAILED)
            : i(e);
    }
    static buildKeyVerificationDetails() {
        return {
            url: "https://api.assemblyai.com/v2/upload",
            method: "POST",
            handleVerificationResult: AssemblyAIUtils.handleVerificationResult,
        };
    }
}
class AssemblyAIAudioIO extends DirectServiceIO {
    constructor(t) {
        var e;
        const i = null == (e = t.directConnection) ? void 0 : e.assemblyAI;
        super(
            t,
            AssemblyAIUtils.buildKeyVerificationDetails(),
            AssemblyAIUtils.buildHeaders,
            i,
            { audio: {} }
        ),
            (this.insertKeyPlaceholderText = "AssemblyAI API Key"),
            (this.getKeyLink = "https://www.assemblyai.com/app/account"),
            (this.introPanelMarkUp =
                '\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>AssemblyAI Audio</b></div>\n    <p><b>Upload an audio file</b> to transcribe it into text.\n    <p>\n      Click <a href="https://www.assemblyai.com/docs/Guides/transcribing_an_audio_file#get-started">here</a> for more info.\n    </p>'),
            (this.url = "https://api.assemblyai.com/v2/upload"),
            (this.isTextInputDisabled = !0),
            (this.textInputPlaceholderText = "Upload an audio file"),
            (this.permittedErrorPrefixes = ["Authentication", "Invalid"]),
            (this.canSendMessage = AssemblyAIAudioIO.canFileSendMessage);
    }
    static canFileSendMessage(t, e) {
        return !(null == e || !e[0]);
    }
    async callServiceAPI(t, e, i) {
        var s;
        if (null == (s = this.requestSettings) || !s.headers)
            throw new Error("Request settings have not been set up");
        if (null == i || !i[0]) throw new Error("No file was added");
        HTTPRequest.request(this, i[0], t, !1);
    }
    async extractResultData(t) {
        var e, i;
        if (t.error) throw t.error;
        const s =
            null ==
            (i = null == (e = this.requestSettings) ? void 0 : e.headers)
                ? void 0
                : i.Authorization;
        return { text: (await AssemblyAIUtils.poll(s, t.upload_url)).text };
    }
}
class AzureSpeechIO extends DirectServiceIO {
    constructor(t, e, i, s, n) {
        super(t, AzureUtils.buildSpeechKeyVerificationDetails(i), e, s, n),
            (this.insertKeyPlaceholderText = "Azure Speech Subscription Key"),
            (this.getKeyLink =
                "https://learn.microsoft.com/en-us/azure/api-management/api-management-subscriptions#create-and-manage-subscriptions-in-azure-portal");
    }
}
const _AzureTextToSpeechIO = class t extends AzureSpeechIO {
    constructor(e) {
        var i, s, n, o, r, a;
        const l =
                null ==
                (s = null == (i = e.directConnection) ? void 0 : i.azure)
                    ? void 0
                    : s.textToSpeech,
            c = null == (n = e.directConnection) ? void 0 : n.azure;
        super(
            e,
            AzureUtils.buildTextToSpeechHeaders.bind(
                {},
                (null == l ? void 0 : l.outputFormat) ||
                    "audio-16khz-128kbitrate-mono-mp3"
            ),
            l.region,
            c
        ),
            (this.introPanelMarkUp = `\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>Azure Text To Speech</b></div>\n    <p>Insert text to synthesize it to audio.\n    <p>\n      Click <a href="${t.HELP_LINK}">here</a> for more info.\n    </p>`),
            (this.url = ""),
            Object.assign(this.rawBody, l),
            (o = this.rawBody).lang ?? (o.lang = "en-US"),
            (r = this.rawBody).name ?? (r.name = "en-US-JennyNeural"),
            (a = this.rawBody).gender ?? (a.gender = "Female"),
            (this.url = `https://${l.region}.tts.speech.microsoft.com/cognitiveservices/v1`);
    }
    preprocessBody(t, e) {
        const i = e[e.length - 1].text;
        if (i)
            return `<speak version='1.0' xml:lang='${t.lang}'>\n      <voice xml:lang='${t.lang}' xml:gender='${t.gender}' name='${t.name}'>\n        ${i}\n      </voice>\n    </speak>`;
    }
    async callServiceAPI(t, e) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const i = this.preprocessBody(this.rawBody, e);
        HTTPRequest.request(this, i, t, !1);
    }
    async extractResultData(t) {
        return new Promise((e) => {
            const i = new FileReader();
            i.readAsDataURL(t),
                (i.onload = (t) => {
                    e({ files: [{ src: t.target.result, type: "audio" }] });
                });
        });
    }
};
_AzureTextToSpeechIO.HELP_LINK =
    "https://learn.microsoft.com/en-GB/azure/cognitive-services/speech-service/get-started-text-to-speech?tabs=windows%2Cterminal&pivots=programming-language-rest";
let AzureTextToSpeechIO = _AzureTextToSpeechIO;
const _AzureSpeechToTextIO = class t extends AzureSpeechIO {
    constructor(e) {
        var i, s, n;
        const o =
                null ==
                (s = null == (i = e.directConnection) ? void 0 : i.azure)
                    ? void 0
                    : s.speechToText,
            r = null == (n = e.directConnection) ? void 0 : n.azure;
        super(e, AzureUtils.buildSpeechToTextHeaders, o.region, r, {
            audio: { files: { acceptedFormats: ".wav,.ogg" } },
        }),
            (this.introPanelMarkUp = `\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>Azure Speech To Text</b></div>\n    <p><b>Upload a .wav or .ogg audio file</b> to transcribe it into text.\n    <p>\n      Click <a href="${t.HELP_LINK}">here</a> for more info.\n    </p>`),
            (this.url = ""),
            (this.isTextInputDisabled = !0),
            (this.textInputPlaceholderText = "Upload an audio file"),
            (this.canSendMessage = t.canFileSendMessage);
        const a = o.lang || "en-US";
        (this.url = `https://${o.region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${a}&format=detailed`),
            (this.recordAudio = void 0);
    }
    static canFileSendMessage(t, e) {
        return !(null == e || !e[0]);
    }
    async callServiceAPI(t, e, i) {
        var s, n;
        if (null == (s = this.requestSettings) || !s.headers)
            throw new Error("Request settings have not been set up");
        if (null == i || !i[0]) throw new Error("No file was added");
        null != (n = this.requestSettings) &&
            n.headers &&
            (this.requestSettings.headers["Content-Type"] = i[0].name
                .toLocaleLowerCase()
                .endsWith(".wav")
                ? "audio/wav; codecs=audio/pcm; samplerate=16000"
                : "audio/ogg; codecs=opus"),
            HTTPRequest.request(this, i[0], t, !1);
    }
    async extractResultData(t) {
        if (t.error) throw t.error;
        return { text: t.DisplayText || "" };
    }
};
_AzureSpeechToTextIO.HELP_LINK =
    "https://learn.microsoft.com/en-GB/azure/cognitive-services/speech-service/get-started-text-to-speech?tabs=windows%2Cterminal&pivots=programming-language-rest";
let AzureSpeechToTextIO = _AzureSpeechToTextIO;
class AzureTranslationIO extends DirectServiceIO {
    constructor(t) {
        var e, i, s;
        const n =
                null ==
                (i = null == (e = t.directConnection) ? void 0 : e.azure)
                    ? void 0
                    : i.translation,
            o = null == (s = t.directConnection) ? void 0 : s.azure;
        super(
            t,
            AzureUtils.buildTranslationKeyVerificationDetails(n.region),
            AzureUtils.buildTranslationHeaders.bind(
                {},
                null == n ? void 0 : n.region
            ),
            o
        ),
            (this.insertKeyPlaceholderText =
                "Azure Translate Subscription Key"),
            (this.getKeyLink =
                "https://learn.microsoft.com/en-us/azure/api-management/api-management-subscriptions#create-and-manage-subscriptions-in-azure-portal"),
            (this.url = ""),
            (this.url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${
                n.language || "es"
            }`);
    }
    preprocessBody(t) {
        const e = t[t.length - 1].text;
        if (e) return [{ Text: e }];
    }
    async callServiceAPI(t, e) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const i = this.preprocessBody(e);
        HTTPRequest.request(this, i, t);
    }
    async extractResultData(t) {
        var e;
        if (Array.isArray(t))
            return {
                text:
                    (null == (e = t[0].translations) ? void 0 : e[0].text) ||
                    "",
            };
        throw t.error;
    }
}
const _OpenAIImagesIO = class t extends DirectServiceIO {
    constructor(e) {
        var i;
        const { directConnection: s, textInput: n } = e,
            o = null == s ? void 0 : s.openAI;
        super(
            e,
            OpenAIUtils.buildKeyVerificationDetails(),
            OpenAIUtils.buildHeaders,
            o,
            {
                images: {
                    files: { acceptedFormats: ".png", maxNumberOfFiles: 2 },
                },
            }
        ),
            (this.insertKeyPlaceholderText = "OpenAI API Key"),
            (this.getKeyLink = "https://platform.openai.com/account/api-keys"),
            (this.introPanelMarkUp =
                '\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>OpenAI DALL·E</b></div>\n    <p><b>Insert text</b> to generate an image.</p>\n    <p><b>Upload 1</b> PNG image to generate its variation and optionally insert text to specify the change.</p>\n    <p><b>Upload 2</b> PNG images where the second is a copy of the first with a transparent area where the edit should\n      take place and text to specify the edit.</p>\n    <p>Click <a href="https://platform.openai.com/docs/guides/images/introduction">here</a> for more info.</p>'),
            (this.url = ""),
            (this.permittedErrorPrefixes = [
                "Incorrect",
                "Invalid input image",
            ]),
            (this._maxCharLength = OpenAIUtils.FILE_MAX_CHAR_LENGTH),
            null != n &&
                n.characterLimit &&
                (this._maxCharLength = n.characterLimit);
        const r =
            null == (i = null == s ? void 0 : s.openAI) ? void 0 : i.images;
        if (this.camera) {
            const t =
                "object" == typeof r && r.size ? Number.parseInt(r.size) : 1024;
            this.camera.files = { dimensions: { width: t, height: t } };
        }
        "object" == typeof r && Object.assign(this.rawBody, r),
            (this.canSendMessage = t.canFileSendMessage);
    }
    static canFileSendMessage(t, e) {
        return !(null == e || !e[0]) || !(!t || "" === t.trim());
    }
    static createFormDataBody(t, e, i) {
        const s = new FormData();
        return (
            s.append("image", e),
            i && s.append("mask", i),
            Object.keys(t).forEach((e) => {
                s.append(e, String(t[e]));
            }),
            s
        );
    }
    preprocessBody(t, e) {
        const i = JSON.parse(JSON.stringify(t));
        if (e && "" !== e) {
            const t = e.substring(0, this._maxCharLength);
            i.prompt = t;
        }
        return i;
    }
    callApiWithImage(e, i, s) {
        var n, o;
        let r;
        const a =
            null == (o = null == (n = i[i.length - 1]) ? void 0 : n.text)
                ? void 0
                : o.trim();
        if (s[1] || (a && "" !== a)) {
            this.url = t.IMAGE_EDIT_URL;
            const e = this.preprocessBody(this.rawBody, a);
            r = t.createFormDataBody(e, s[0], s[1]);
        } else
            (this.url = t.IMAGE_VARIATIONS_URL),
                (r = t.createFormDataBody(this.rawBody, s[0]));
        RequestUtils.temporarilyRemoveHeader(
            this.requestSettings,
            HTTPRequest.request.bind(this, this, r, e),
            !1
        );
    }
    async callServiceAPI(e, i, s) {
        var n;
        if (null == (n = this.requestSettings) || !n.headers)
            throw new Error("Request settings have not been set up");
        if (null != s && s[0]) this.callApiWithImage(e, i, s);
        else {
            if (!this.requestSettings)
                throw new Error("Request settings have not been set up");
            this.url = t.IMAGE_GENERATION_URL;
            const s = this.preprocessBody(this.rawBody, i[i.length - 1].text);
            HTTPRequest.request(this, s, e);
        }
    }
    async extractResultData(t) {
        if (t.error) throw t.error.message;
        return {
            files: t.data.map((t) =>
                t.url
                    ? { src: t.url, type: "image" }
                    : { src: `${BASE_64_PREFIX}${t.b64_json}`, type: "image" }
            ),
        };
    }
};
(_OpenAIImagesIO.IMAGE_GENERATION_URL =
    "https://api.openai.com/v1/images/generations"),
    (_OpenAIImagesIO.IMAGE_VARIATIONS_URL =
        "https://api.openai.com/v1/images/variations"),
    (_OpenAIImagesIO.IMAGE_EDIT_URL = "https://api.openai.com/v1/images/edits");
let OpenAIImagesIO = _OpenAIImagesIO;
const _OpenAIAudioIO = class t extends DirectServiceIO {
    constructor(e) {
        var i, s;
        const { textInput: n } = e,
            o = JSON.parse(JSON.stringify(e.directConnection)),
            r = null == o ? void 0 : o.openAI;
        super(
            e,
            OpenAIUtils.buildKeyVerificationDetails(),
            OpenAIUtils.buildHeaders,
            r,
            { audio: {} }
        ),
            (this.insertKeyPlaceholderText = "OpenAI API Key"),
            (this.getKeyLink = "https://platform.openai.com/account/api-keys"),
            (this.introPanelMarkUp =
                '\n    <div style="width: 100%; text-align: center; margin-left: -10px"><b>OpenAI Whisper</b></div>\n    <p><b>Upload an audio file</b> to transcribe it into text. You can optionally provide text to guide the audio\n      processing.\n    <p>Click <a href="https://platform.openai.com/docs/api-reference/audio/create">here</a> for more info.</p>'),
            (this.url = ""),
            (this.permittedErrorPrefixes = ["Invalid"]),
            (this._maxCharLength = OpenAIUtils.FILE_MAX_CHAR_LENGTH),
            (this._service_url = t.AUDIO_TRANSCRIPTIONS_URL),
            null != n &&
                n.characterLimit &&
                (this._maxCharLength = n.characterLimit);
        const a =
            null == (i = null == o ? void 0 : o.openAI) ? void 0 : i.audio;
        "object" == typeof a &&
            (this.processConfig(a),
            t.cleanConfig(a),
            Object.assign(this.rawBody, a)),
            (s = this.rawBody).model ?? (s.model = t.DEFAULT_MODEL),
            (this.rawBody.response_format = "json"),
            (this.canSendMessage = t.canSendFileMessage);
    }
    static canSendFileMessage(t, e) {
        return !(null == e || !e[0]);
    }
    processConfig(e) {
        null != e &&
            e.type &&
            "translation" === e.type &&
            ((this._service_url = t.AUDIO_TRANSLATIONS_URL), delete e.language);
    }
    static cleanConfig(t) {
        delete t.type;
    }
    static createFormDataBody(t, e) {
        const i = new FormData();
        return (
            i.append("file", e),
            Object.keys(t).forEach((e) => {
                i.append(e, String(t[e]));
            }),
            i
        );
    }
    preprocessBody(t, e) {
        var i, s;
        const n = JSON.parse(JSON.stringify(t)),
            o =
                null == (s = null == (i = e[e.length - 1]) ? void 0 : i.text)
                    ? void 0
                    : s.trim();
        if (o && "" !== o) {
            const t = o.substring(0, this._maxCharLength);
            n.prompt = t;
        }
        return n;
    }
    async callServiceAPI(e, i, s) {
        var n;
        if (null == (n = this.requestSettings) || !n.headers)
            throw new Error("Request settings have not been set up");
        if (null == s || !s[0]) throw new Error("No file was added");
        this.url = this.requestSettings.url || this._service_url;
        const o = this.preprocessBody(this.rawBody, i),
            r = t.createFormDataBody(o, s[0]);
        RequestUtils.temporarilyRemoveHeader(
            this.requestSettings,
            HTTPRequest.request.bind(this, this, r, e),
            !1
        );
    }
    async extractResultData(t) {
        if (t.error) throw t.error.message;
        return { text: t.text };
    }
};
(_OpenAIAudioIO.AUDIO_TRANSCRIPTIONS_URL =
    "https://api.openai.com/v1/audio/transcriptions"),
    (_OpenAIAudioIO.AUDIO_TRANSLATIONS_URL =
        "https://api.openai.com/v1/audio/translations"),
    (_OpenAIAudioIO.DEFAULT_MODEL = "whisper-1");
let OpenAIAudioIO = _OpenAIAudioIO;
class OpenAIChatIO extends DirectServiceIO {
    constructor(t) {
        var e, i;
        const s = JSON.parse(JSON.stringify(t.directConnection)),
            n = s.openAI;
        super(
            t,
            OpenAIUtils.buildKeyVerificationDetails(),
            OpenAIUtils.buildHeaders,
            n
        ),
            (this.insertKeyPlaceholderText = "OpenAI API Key"),
            (this.getKeyLink = "https://platform.openai.com/account/api-keys"),
            (this.url = "https://api.openai.com/v1/chat/completions"),
            (this.permittedErrorPrefixes = ["Incorrect"]),
            (this._systemMessage = OpenAIChatIO.generateSystemMessage(
                "You are a helpful assistant."
            ));
        const o = null == (e = s.openAI) ? void 0 : e.chat;
        "object" == typeof o &&
            (o.system_prompt &&
                (this._systemMessage = OpenAIChatIO.generateSystemMessage(
                    o.system_prompt
                )),
            this.cleanConfig(o),
            Object.assign(this.rawBody, o)),
            this.maxMessages ?? (this.maxMessages = -1),
            (i = this.rawBody).model ??
                (i.model = OpenAIConverseBaseBody.GPT_CHAT_TURBO_MODEL);
    }
    static generateSystemMessage(t) {
        return { role: "system", content: t };
    }
    cleanConfig(t) {
        delete t.system_prompt;
    }
    preprocessBody(t, e) {
        const i = JSON.parse(JSON.stringify(t)),
            s =
                this.totalMessagesMaxCharLength ||
                OpenAIUtils.CONVERSE_MAX_CHAR_LENGTH,
            n = MessageLimitUtils.getCharacterLimitMessages(
                e,
                s - this._systemMessage.content.length
            ).map((t) => ({
                content: t.text,
                role: "ai" === t.role ? "assistant" : "user",
            }));
        return (i.messages = [this._systemMessage, ...n]), i;
    }
    async callServiceAPI(t, e) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const i = this.preprocessBody(this.rawBody, e);
        this.deepChat.stream || i.stream
            ? ((i.stream = !0), Stream.request(this, i, t))
            : HTTPRequest.request(this, i, t);
    }
    async extractResultData(t) {
        if (t.error) throw t.error.message;
        return t.choices[0].delta
            ? { text: t.choices[0].delta.content || "" }
            : t.choices[0].message
            ? { text: t.choices[0].message.content }
            : { text: "" };
    }
}
class CohereChatIO extends CohereIO {
    constructor(t) {
        var e;
        const i = JSON.parse(JSON.stringify(t.directConnection)),
            s = null == (e = i.cohere) ? void 0 : e.chat;
        super(
            t,
            "https://api.cohere.ai/v1/chat",
            "Ask me anything!",
            s,
            i.cohere
        ),
            (this.username = "USER"),
            "object" == typeof s &&
                (s.user_name && (this.username = s.user_name),
                this.cleanConfig(s),
                Object.assign(this.rawBody, s)),
            this.maxMessages ?? (this.maxMessages = -1);
    }
    cleanConfig(t) {
        delete t.user_name;
    }
    preprocessBody(t, e) {
        const i = JSON.parse(JSON.stringify(t));
        return (
            (i.query = e[e.length - 1].text),
            (i.chat_history = e
                .slice(0, e.length - 1)
                .map((t) => ({
                    text: t.text,
                    user_name: "ai" === t.role ? "CHATBOT" : this.username,
                }))),
            i
        );
    }
    async callServiceAPI(t, e) {
        if (!this.requestSettings)
            throw new Error("Request settings have not been set up");
        const i = this.preprocessBody(this.rawBody, e);
        HTTPRequest.request(this, i, t);
    }
    async extractResultData(t) {
        if (t.message) throw t.message;
        return { text: t.text };
    }
}
class ServiceIOFactory {
    static create(t) {
        const { directConnection: e, request: i, demo: s } = t;
        if (e) {
            if (e.openAI)
                return e.openAI.images
                    ? new OpenAIImagesIO(t)
                    : e.openAI.audio
                    ? new OpenAIAudioIO(t)
                    : e.openAI.completions
                    ? new OpenAICompletionsIO(t)
                    : new OpenAIChatIO(t);
            if (e.assemblyAI) return new AssemblyAIAudioIO(t);
            if (e.cohere)
                return e.cohere.chat
                    ? new CohereChatIO(t)
                    : e.cohere.summarization
                    ? new CohereSummarizationIO(t)
                    : new CohereTextGenerationIO(t);
            if (e.huggingFace)
                return e.huggingFace.textGeneration
                    ? new HuggingFaceTextGenerationIO(t)
                    : e.huggingFace.summarization
                    ? new HuggingFaceSummarizationIO(t)
                    : e.huggingFace.translation
                    ? new HuggingFaceTranslationIO(t)
                    : e.huggingFace.fillMask
                    ? new HuggingFaceFillMaskIO(t)
                    : e.huggingFace.questionAnswer
                    ? new HuggingFaceQuestionAnswerIO(t)
                    : e.huggingFace.audioSpeechRecognition
                    ? new HuggingFaceAudioRecognitionIO(t)
                    : e.huggingFace.audioClassification
                    ? new HuggingFaceAudioClassificationIO(t)
                    : e.huggingFace.imageClassification
                    ? new HuggingFaceImageClassificationIO(t)
                    : new HuggingFaceConversationIO(t);
            if (e.azure) {
                if (e.azure.speechToText) return new AzureSpeechToTextIO(t);
                if (e.azure.textToSpeech) return new AzureTextToSpeechIO(t);
                if (e.azure.summarization) return new AzureSummarizationIO(t);
                if (e.azure.translation) return new AzureTranslationIO(t);
            }
            if (e.stabilityAI)
                return e.stabilityAI.imageToImage
                    ? new StabilityAIImageToImageIO(t)
                    : e.stabilityAI.imageToImageUpscale
                    ? new StabilityAIImageToImageUpscaleIO(t)
                    : e.stabilityAI.imageToImageMasking
                    ? new StabilityAIImageToImageMaskingIO(t)
                    : new StabilityAITextToImageIO(t);
        }
        return i ? new BaseServiceIO(t) : new BaseServiceIO(t, void 0, s || !0);
    }
}
const _GoogleFont = class t {
    static appendStyleSheetToHead() {
        const e = document.getElementsByTagName("head")[0];
        if (
            !Array.from(e.getElementsByTagName("link")).some(
                (e) => e.getAttribute("href") === t.FONT_URL
            )
        ) {
            const i = document.createElement("link");
            (i.rel = "stylesheet"), (i.href = t.FONT_URL), e.appendChild(i);
        }
    }
};
_GoogleFont.FONT_URL =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap";
let GoogleFont = _GoogleFont;
class TypeConverters {}
function Property(t) {
    return function (e, i) {
        Object.defineProperty(e, i, {});
        const s = e.constructor,
            n = i.toLocaleLowerCase();
        (s._attributes_[n] = TypeConverters.attibutes[t]),
            (s._attributeToProperty_[n] = i);
    };
}
TypeConverters.attibutes = {
    string: (t) => t,
    number: (t) => parseFloat(t),
    boolean: (t) => "true" === t,
    object: (t) => JSON.parse(t),
    array: (t) => JSON.parse(t),
    function: (value) => eval(value),
};
class FireEvents {
    static onNewMessage(t, e, i) {
        const s = JSON.parse(JSON.stringify({ message: e, isInitial: i }));
        t.onNewMessage(s),
            t.dispatchEvent(new CustomEvent("new-message", { detail: s }));
    }
    static onClearMessages(t) {
        t.onClearMessages(), t.dispatchEvent(new CustomEvent("clear-messages"));
    }
    static onRender(t) {
        t.onComponentRender(), t.dispatchEvent(new CustomEvent("render"));
    }
}
const _ElementUtils = class t {
    static addElements(t, ...e) {
        e.forEach((e) => t.appendChild(e));
    }
    static isScrollbarAtBottomOfElement(e) {
        const i = e.scrollHeight,
            s = e.clientHeight;
        return e.scrollTop >= i - s - t.CODE_SNIPPET_GENERATION_JUMP;
    }
    static cloneElement(t) {
        const e = t.cloneNode(!0);
        return t.parentNode.replaceChild(e, t), e;
    }
};
_ElementUtils.CODE_SNIPPET_GENERATION_JUMP = 0.5;
let ElementUtils = _ElementUtils;
const _TextToSpeech = class t {
    static speak(t, e) {
        if (window.SpeechSynthesisUtterance) {
            const i = new SpeechSynthesisUtterance(t);
            Object.assign(i, e), speechSynthesis.speak(i);
        }
    }
    static processConfig(e, i) {
        const s = {};
        setTimeout(() => {
            if (
                "object" == typeof e &&
                (e.lang && (s.lang = e.lang),
                e.pitch && (s.pitch = e.pitch),
                e.rate && (s.rate = e.rate),
                e.volume && (s.volume = e.volume),
                e.voiceName)
            ) {
                const t = window.speechSynthesis.getVoices().find((t) => {
                    var i;
                    return (
                        t.name.toLocaleLowerCase() ===
                        (null == (i = e.voiceName)
                            ? void 0
                            : i.toLocaleLowerCase())
                    );
                });
                t && (s.voice = t);
            }
            i(s);
        }, t.LOAD_VOICES_MS);
    }
};
_TextToSpeech.LOAD_VOICES_MS = 200;
let TextToSpeech = _TextToSpeech;
class LoadingMessageDotsStyle {
    static colorToHex(t) {
        const e = document.createElement("div");
        return (
            (e.style.color = t),
            document.body.appendChild(e),
            `#${window
                .getComputedStyle(e)
                .color.match(/\d+/g)
                .map((t) => parseInt(t).toString(16).padStart(2, "0"))
                .join("")}`
        );
    }
    static set(t, e) {
        var i, s, n, o;
        if (
            null !=
                (s =
                    null == (i = null == e ? void 0 : e.loading)
                        ? void 0
                        : i.bubble) &&
            s.color
        ) {
            const i = LoadingMessageDotsStyle.colorToHex(
                null ==
                    (o =
                        null == (n = null == e ? void 0 : e.loading)
                            ? void 0
                            : n.bubble)
                    ? void 0
                    : o.color
            );
            t.style.setProperty("--message-dots-color", i),
                t.style.setProperty("--message-dots-color-fade", `${i}33`);
        } else
            t.style.setProperty("--message-dots-color", "#848484"),
                t.style.setProperty("--message-dots-color-fade", "#55555533");
    }
}
class StatefulEvents {
    static mouseUp(t, e) {
        StyleUtils.unsetAllCSSMouseStates(t, e),
            Object.assign(t.style, e.default),
            Object.assign(t.style, e.hover);
    }
    static mouseDown(t, e) {
        Object.assign(t.style, e.click);
    }
    static mouseLeave(t, e) {
        StyleUtils.unsetAllCSSMouseStates(t, e),
            Object.assign(t.style, e.default);
    }
    static mouseEnter(t, e) {
        Object.assign(t.style, e.hover);
    }
    static add(t, e) {
        t.addEventListener(
            "mouseenter",
            StatefulEvents.mouseEnter.bind(this, t, e)
        ),
            t.addEventListener(
                "mouseleave",
                StatefulEvents.mouseLeave.bind(this, t, e)
            ),
            t.addEventListener(
                "mousedown",
                StatefulEvents.mouseDown.bind(this, t, e)
            ),
            t.addEventListener(
                "mouseup",
                StatefulEvents.mouseUp.bind(this, t, e)
            );
    }
}
class HTMLUtils {
    static applyStylesToElement(t, e) {
        const i = StyleUtils.processStateful(e, {}, {});
        StatefulEvents.add(t, i), Object.assign(t.style, i.default);
    }
    static applyEventsToElement(t, e) {
        Object.keys(e).forEach((i) => {
            const s = e[i];
            s && t.addEventListener(i, s);
        });
    }
    static applyClassUtilitiesToElement(t, e) {
        const { events: i, styles: s } = e;
        i && HTMLUtils.applyEventsToElement(t, i),
            s &&
                !HTMLDeepChatElements.doesElementContainDeepChatClass(t) &&
                HTMLUtils.applyStylesToElement(t, s);
    }
    static applyCustomClassUtilities(t, e) {
        Object.keys(t).forEach((i) => {
            const s = e.getElementsByClassName(i);
            Array.from(s).forEach((e) => {
                t[i] && HTMLUtils.applyClassUtilitiesToElement(e, t[i]);
            });
        });
    }
    static apply(t, e) {
        HTMLDeepChatElements.applyDeepChatUtilities(t, t.htmlClassUtilities, e),
            HTMLUtils.applyCustomClassUtilities(t.htmlClassUtilities, e);
    }
}
const DEEP_CHAT_TEMPORARY_MESSAGE = "deep-chat-temporary-message",
    DEEP_CHAT_SUGGESTION_BUTTON = "deep-chat-suggestion-button",
    DEEP_CHAT_ELEMENTS = {
        "deep-chat-button": {
            styles: {
                default: {
                    backgroundColor: "white",
                    padding: "5px",
                    paddingLeft: "7px",
                    paddingRight: "7px",
                    border: "1px solid #c2c2c2",
                    borderRadius: "6px",
                    cursor: "pointer",
                },
                hover: { backgroundColor: "#fafafa" },
                click: { backgroundColor: "#f1f1f1" },
            },
        },
    },
    DEEP_CHAT_ELEMENT_CLASSES = Object.keys(DEEP_CHAT_ELEMENTS);
class HTMLDeepChatElements {
    static applySuggestionEvent(t, e) {
        setTimeout(() => {
            e.addEventListener("click", () => {
                var i, s;
                null == (s = t.submitUserMessage) ||
                    s.call(
                        t,
                        (null == (i = e.textContent) ? void 0 : i.trim()) || ""
                    );
            });
        });
    }
    static isElementTemporary(t) {
        var e;
        return (
            !!t &&
            (null == (e = t.bubbleElement.children[0])
                ? void 0
                : e.classList.contains(DEEP_CHAT_TEMPORARY_MESSAGE))
        );
    }
    static doesElementContainDeepChatClass(t) {
        return DEEP_CHAT_ELEMENT_CLASSES.find((e) => t.classList.contains(e));
    }
    static applyEvents(t, e) {
        const i = DEEP_CHAT_ELEMENTS[e].events;
        Object.keys(i || []).forEach((e) => {
            t.addEventListener(e, null == i ? void 0 : i[e]);
        });
    }
    static getProcessedStyles(t, e, i) {
        const s = Array.from(e.classList).reduce((e, i) => {
                var s;
                const n = null == (s = t[i]) ? void 0 : s.styles;
                return n && t[i].styles && e.push(n), e;
            }, []),
            n = DEEP_CHAT_ELEMENTS[i].styles;
        if (n) {
            const t = JSON.parse(JSON.stringify(n));
            t.default && StyleUtils.overwriteDefaultWithAlreadyApplied(t, e),
                s.unshift(t);
        }
        const o = StyleUtils.mergeStatefulStyles(s);
        return StyleUtils.processStateful(o, {}, {});
    }
    static applyDeepChatUtilities(t, e, i) {
        DEEP_CHAT_ELEMENT_CLASSES.forEach((t) => {
            const s = i.getElementsByClassName(t);
            Array.from(s || []).forEach((i) => {
                const s = HTMLDeepChatElements.getProcessedStyles(e, i, t);
                HTMLUtils.applyStylesToElement(i, s),
                    HTMLDeepChatElements.applyEvents(i, t);
            });
        });
        const s = i.getElementsByClassName(DEEP_CHAT_SUGGESTION_BUTTON);
        Array.from(s).forEach((e) =>
            HTMLDeepChatElements.applySuggestionEvent(t, e)
        );
    }
}
class MessageStyleUtils {
    static applyCustomStylesToElements(t, e, i) {
        if (
            i &&
            (Object.assign(t.outerContainer.style, i.outerContainer),
            Object.assign(t.innerContainer.style, i.innerContainer),
            Object.assign(t.bubbleElement.style, i.bubble),
            e)
        ) {
            const e = t.bubbleElement.children[0],
                s = "a" !== e.tagName.toLocaleLowerCase() ? e : e.children[0];
            Object.assign(s.style, i.media);
        }
    }
    static applySideStyles(t, e, i, s) {
        s &&
            (MessageStyleUtils.applyCustomStylesToElements(t, i, s.shared),
            e
                ? MessageStyleUtils.applyCustomStylesToElements(t, i, s.ai)
                : MessageStyleUtils.applyCustomStylesToElements(t, i, s.user));
    }
    static isMessageSideStyles(t) {
        return !!(t.ai || t.shared || t.user);
    }
    static applyCustomStyles(t, e, i, s, n) {
        var o;
        n && t.default !== n
            ? MessageStyleUtils.isMessageSideStyles(n)
                ? (MessageStyleUtils.applySideStyles(e, i, s, t.default),
                  MessageStyleUtils.applySideStyles(e, i, s, n))
                : (MessageStyleUtils.applyCustomStylesToElements(
                      e,
                      s,
                      null == (o = t.default) ? void 0 : o.shared
                  ),
                  MessageStyleUtils.applyCustomStylesToElements(e, s, n))
            : MessageStyleUtils.applySideStyles(e, i, s, t.default);
    }
    static extractParticularSharedStyles(t, e) {
        if (null == e || !e.shared) return;
        const i = e.shared,
            s = {
                outerContainer: {},
                innerContainer: {},
                bubble: {},
                media: {},
            };
        return (
            t.forEach((t) => {
                var e, n, o, r;
                (s.outerContainer[t] =
                    (null == (e = i.outerContainer) ? void 0 : e[t]) || ""),
                    (s.innerContainer[t] =
                        (null == (n = i.innerContainer) ? void 0 : n[t]) || ""),
                    (s.bubble[t] =
                        (null == (o = i.bubble) ? void 0 : o[t]) || ""),
                    (s.media[t] =
                        (null == (r = i.media) ? void 0 : r[t]) || "");
            }),
            s
        );
    }
}
class IntroPanel {
    constructor(t, e, i) {
        (this._isDisplayed = !1),
            t
                ? ((this._elementRef = this.createIntroPanelWithChild(t, i)),
                  (this._isDisplayed = !0))
                : e &&
                  ((this._elementRef = this.createInternalIntroPanel(e, i)),
                  (this._isDisplayed = !0));
    }
    static createIntroPanel(t) {
        const e = document.createElement("div");
        return e.classList.add("intro-panel"), Object.assign(e.style, t), e;
    }
    createIntroPanelWithChild(t, e) {
        const i = IntroPanel.createIntroPanel(e);
        return (
            "none" === t.style.display && (t.style.display = "block"),
            i.appendChild(t),
            i
        );
    }
    createInternalIntroPanel(t, e) {
        const i = IntroPanel.createIntroPanel(e);
        return (i.id = "internal-intro-panel"), (i.innerHTML = t), i;
    }
    hide() {
        this._isDisplayed &&
            this._elementRef &&
            ((this._elementRef.style.display = "none"),
            (this._isDisplayed = !1));
    }
    display() {
        !this._isDisplayed &&
            this._elementRef &&
            ((this._elementRef.style.display = ""), (this._isDisplayed = !0));
    }
}
const _FileMessageUtils = class t {
    static addMessage(t, e, i, s) {
        var n;
        t.elementRef.appendChild(e.outerContainer),
            t.applyCustomStyles(
                e,
                s,
                !0,
                null == (n = t.messageStyles) ? void 0 : n[i]
            ),
            (t.elementRef.scrollTop = t.elementRef.scrollHeight);
    }
    static wrapInLink(t, e) {
        const i = document.createElement("a");
        return (i.href = e), (i.target = "_blank"), i.appendChild(t), i;
    }
    static processContent(e, i) {
        return !i || i.startsWith("data") ? e : t.wrapInLink(e, i);
    }
    static waitToLoadThenScroll(t) {
        setTimeout(() => {
            t.scrollTop = t.scrollHeight;
        }, 60);
    }
    static scrollDownOnImageLoad(e, i) {
        if (e.startsWith("data")) t.waitToLoadThenScroll(i);
        else
            try {
                fetch(e, { mode: "no-cors" })
                    .catch(() => {})
                    .finally(() => {
                        t.waitToLoadThenScroll(i);
                    });
            } catch {
                i.scrollTop = i.scrollHeight;
            }
    }
};
_FileMessageUtils.DEFAULT_FILE_NAME = "file";
let FileMessageUtils = _FileMessageUtils;
class HTMLMessages {
    static addElement(t, e) {
        t.elementRef.appendChild(e),
            (t.elementRef.scrollTop = t.elementRef.scrollHeight);
    }
    static createElements(t, e, i) {
        const s = t.createNewMessageElement("", i);
        return (
            s.bubbleElement.classList.add("html-message"),
            (s.bubbleElement.innerHTML = e),
            s
        );
    }
    static addNewHTMLMessage(t, e, i) {
        var s;
        const n = HTMLMessages.createElements(t, e, i);
        return (
            0 === e.trim().length &&
                Messages.editEmptyMessageElement(n.bubbleElement),
            HTMLUtils.apply(t, n.outerContainer),
            t.applyCustomStyles(
                n,
                i,
                !1,
                null == (s = t.messageStyles) ? void 0 : s.html
            ),
            HTMLMessages.addElement(t, n.outerContainer),
            n
        );
    }
}
class SetupMessages {
    static getText(t, e) {
        if (!t.directConnection && !t.request && !t.demo)
            return "Connect to any API using the [request](https://deepchat.dev/docs/connect#Request)\n        property or choose any one of the preconfigured APIs via\n        the [directConnection](https://deepchat.dev/docs/directConnection/#directConnection) property.\n        \n To get started checkout the [Start](https://deepchat.dev/start) page and\n        live code [examples](https://deepchat.dev/examples/frameworks).\n        \n To remove this message set the [demo](https://deepchat.dev/docs/demo#demo) property to true.";
        if (t.directConnection) {
            if (!e.isDirectConnection())
                return "Please define a valid service inside\n          the [directConnection](https://deepchat.dev/docs/directConnection/#directConnection) object.";
        } else if (t.request && !t.request.url && !t.request.handler)
            return "Please define a `url` or a `handler` property inside the [request](https://deepchat.dev/docs/connect#Request) object.";
        return null;
    }
}
const FILE_ICON_STRING =
    '<?xml version="1.0" encoding="iso-8859-1"?>\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n\t viewBox="50 30 420 450" xml:space="preserve">\n<g filter="brightness(0) saturate(100%) invert(16%) sepia(0%) saturate(1942%) hue-rotate(215deg) brightness(99%) contrast(93%)">\n\t<g>\n\t\t<path d="M447.933,103.629c-0.034-3.076-1.224-6.09-3.485-8.352L352.683,3.511c-0.004-0.004-0.007-0.005-0.011-0.008\n\t\t\tC350.505,1.338,347.511,0,344.206,0H89.278C75.361,0,64.04,11.32,64.04,25.237v461.525c0,13.916,11.32,25.237,25.237,25.237\n\t\t\th333.444c13.916,0,25.237-11.32,25.237-25.237V103.753C447.96,103.709,447.937,103.672,447.933,103.629z M356.194,40.931\n\t\t\tl50.834,50.834h-49.572c-0.695,0-1.262-0.567-1.262-1.262V40.931z M423.983,486.763c0,0.695-0.566,1.261-1.261,1.261H89.278\n\t\t\tc-0.695,0-1.261-0.566-1.261-1.261V25.237c0-0.695,0.566-1.261,1.261-1.261h242.94v66.527c0,13.916,11.322,25.239,25.239,25.239\n\t\t\th66.527V486.763z"/>\n\t</g>\n</g>\n<g>\n\t<g>\n\t\t<path d="M362.088,164.014H149.912c-6.62,0-11.988,5.367-11.988,11.988c0,6.62,5.368,11.988,11.988,11.988h212.175\n\t\t\tc6.62,0,11.988-5.368,11.988-11.988C374.076,169.381,368.707,164.014,362.088,164.014z"/>\n\t</g>\n</g>\n<g>\n\t<g>\n\t\t<path d="M362.088,236.353H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.62,5.368,11.988,11.988,11.988h212.175\n\t\t\tc6.62,0,11.988-5.368,11.988-11.988C374.076,241.721,368.707,236.353,362.088,236.353z"/>\n\t</g>\n</g>\n<g>\n\t<g>\n\t\t<path d="M362.088,308.691H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.621,5.368,11.988,11.988,11.988h212.175\n\t\t\tc6.62,0,11.988-5.367,11.988-11.988C374.076,314.06,368.707,308.691,362.088,308.691z"/>\n\t</g>\n</g>\n<g>\n\t<g>\n\t\t<path d="M256,381.031H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.621,5.368,11.988,11.988,11.988H256\n\t\t\tc6.62,0,11.988-5.367,11.988-11.988C267.988,386.398,262.62,381.031,256,381.031z"/>\n\t</g>\n</g>\n</svg>';
class FileMessages {
    static createImage(t, e) {
        const i = new Image();
        return (
            (i.src = t.src),
            FileMessageUtils.scrollDownOnImageLoad(i.src, e),
            FileMessageUtils.processContent(i, i.src)
        );
    }
    static async addNewImageMessage(t, e, i) {
        const s = FileMessages.createImage(e, t.elementRef),
            n = t.createNewMessageElement("", i);
        n.bubbleElement.appendChild(s),
            n.bubbleElement.classList.add("image-message"),
            FileMessageUtils.addMessage(t, n, "image", i);
    }
    static createAudioElement(t, e) {
        const i = document.createElement("audio");
        return (
            (i.src = t.src),
            i.classList.add("audio-player"),
            (i.controls = !0),
            Browser$1.IS_SAFARI &&
                (i.classList.add("audio-player-safari"),
                i.classList.add(
                    e ? "audio-player-safari-left" : "audio-player-safari-right"
                )),
            i
        );
    }
    static addNewAudioMessage(t, e, i) {
        const s = FileMessages.createAudioElement(e, i),
            n = t.createNewMessageElement("", i);
        n.bubbleElement.appendChild(s),
            n.bubbleElement.classList.add("audio-message"),
            FileMessageUtils.addMessage(t, n, "audio", i);
    }
    static createAnyFile(t) {
        const e = document.createElement("div");
        e.classList.add("any-file-message-contents");
        const i = document.createElement("div");
        i.classList.add("any-file-message-icon-container");
        const s = SVGIconUtils.createSVGElement(FILE_ICON_STRING);
        s.classList.add("any-file-message-icon"), i.appendChild(s);
        const n = document.createElement("div");
        return (
            n.classList.add("any-file-message-text"),
            (n.textContent = t.name || FileMessageUtils.DEFAULT_FILE_NAME),
            e.appendChild(i),
            e.appendChild(n),
            FileMessageUtils.processContent(e, t.src)
        );
    }
    static addNewAnyFileMessage(t, e, i) {
        const s = t.createNewMessageElement("", i),
            n = FileMessages.createAnyFile(e);
        s.bubbleElement.classList.add("any-file-message-bubble"),
            s.bubbleElement.appendChild(n),
            FileMessageUtils.addMessage(t, s, "file", i);
    }
    static addMessages(t, e, i) {
        e.forEach((e) => {
            var s, n;
            "audio" === e.type ||
            (null != (s = e.src) && s.startsWith("data:audio"))
                ? FileMessages.addNewAudioMessage(t, e, i)
                : "image" === e.type ||
                  (null != (n = e.src) && n.startsWith("data:image"))
                ? FileMessages.addNewImageMessage(t, e, i)
                : FileMessages.addNewAnyFileMessage(t, e, i);
        });
    }
}
const aiLogoUrl =
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIAoJCXZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+Cgk8cGF0aCBkPSJNMjMsMzAuMzZIOWMtMi40MDQsMC00LjM2LTEuOTU2LTQuMzYtNC4zNlYxNWMwLTIuNDA0LDEuOTU2LTQuMzYsNC4zNi00LjM2aDMuNjU5CgkJYzAuMTY3LTEuNTY2LDEuNDE1LTIuODEzLDIuOTgxLTIuOTgxVjUuMzMzYy0xLjEzMS0wLjE3NC0yLTEuMTU0LTItMi4zMzNjMC0xLjMwMSwxLjA1OS0yLjM2LDIuMzYtMi4zNgoJCWMxLjMwMiwwLDIuMzYsMS4wNTksMi4zNiwyLjM2YzAsMS4xNzktMC44NjksMi4xNTktMiwyLjMzM1Y3LjY2YzEuNTY2LDAuMTY3LDIuODE0LDEuNDE1LDIuOTgxLDIuOTgxSDIzCgkJYzIuNDA0LDAsNC4zNiwxLjk1Niw0LjM2LDQuMzZ2MTFDMjcuMzYsMjguNDA0LDI1LjQwNCwzMC4zNiwyMywzMC4zNnogTTksMTEuMzZjLTIuMDA3LDAtMy42NCwxLjYzMy0zLjY0LDMuNjR2MTEKCQljMCwyLjAwNywxLjYzMywzLjY0LDMuNjQsMy42NGgxNGMyLjAwNywwLDMuNjQtMS42MzMsMy42NC0zLjY0VjE1YzAtMi4wMDctMS42MzMtMy42NC0zLjY0LTMuNjRIOXogTTEzLjM4NCwxMC42NGg1LjIzMQoJCUMxOC40MzksOS4zNTQsMTcuMzM0LDguMzYsMTYsOC4zNkMxNC42NjcsOC4zNiwxMy41NjEsOS4zNTQsMTMuMzg0LDEwLjY0eiBNMTYsMS4zNmMtMC45MDQsMC0xLjY0LDAuNzM2LTEuNjQsMS42NAoJCVMxNS4wOTYsNC42NCwxNiw0LjY0YzAuOTA0LDAsMS42NC0wLjczNiwxLjY0LTEuNjRTMTYuOTA0LDEuMzYsMTYsMS4zNnogTTIwLDI3LjM2aC04Yy0xLjMwMSwwLTIuMzYtMS4wNTktMi4zNi0yLjM2CgkJczEuMDU5LTIuMzYsMi4zNi0yLjM2aDhjMS4zMDIsMCwyLjM2LDEuMDU5LDIuMzYsMi4zNlMyMS4zMDIsMjcuMzYsMjAsMjcuMzZ6IE0xMiwyMy4zNmMtMC45MDQsMC0xLjY0LDAuNzM1LTEuNjQsMS42NAoJCXMwLjczNiwxLjY0LDEuNjQsMS42NGg4YzAuOTA0LDAsMS42NC0wLjczNSwxLjY0LTEuNjRzLTAuNzM1LTEuNjQtMS42NC0xLjY0SDEyeiBNMzEsMjMuODZoLTJjLTAuMTk5LDAtMC4zNi0wLjE2MS0wLjM2LTAuMzZWMTUKCQljMC0wLjE5OSwwLjE2MS0wLjM2LDAuMzYtMC4zNmgyYzAuMTk5LDAsMC4zNiwwLjE2MSwwLjM2LDAuMzZ2OC41QzMxLjM2LDIzLjY5OSwzMS4xOTksMjMuODYsMzEsMjMuODZ6IE0yOS4zNiwyMy4xNGgxLjI3OXYtNy43OAoJCUgyOS4zNlYyMy4xNHogTTMsMjMuODZIMWMtMC4xOTksMC0wLjM2LTAuMTYxLTAuMzYtMC4zNlYxNWMwLTAuMTk5LDAuMTYxLTAuMzYsMC4zNi0wLjM2aDJjMC4xOTksMCwwLjM2LDAuMTYxLDAuMzYsMC4zNnY4LjUKCQlDMy4zNiwyMy42OTksMy4xOTksMjMuODYsMywyMy44NnogTTEuMzYsMjMuMTRoMS4yOHYtNy43OEgxLjM2VjIzLjE0eiBNMjAsMjAuMzZjLTEuMzAyLDAtMi4zNi0xLjA1OS0yLjM2LTIuMzYKCQlzMS4wNTktMi4zNiwyLjM2LTIuMzZzMi4zNiwxLjA1OSwyLjM2LDIuMzZDMjIuMzYsMTkuMzAyLDIxLjMwMiwyMC4zNiwyMCwyMC4zNnogTTIwLDE2LjM2Yy0wLjkwNCwwLTEuNjQsMC43MzYtMS42NCwxLjY0CgkJczAuNzM1LDEuNjQsMS42NCwxLjY0czEuNjQtMC43MzUsMS42NC0xLjY0UzIwLjkwNCwxNi4zNiwyMCwxNi4zNnogTTEyLDIwLjM2Yy0xLjMwMSwwLTIuMzYtMS4wNTktMi4zNi0yLjM2czEuMDU5LTIuMzYsMi4zNi0yLjM2CgkJczIuMzYsMS4wNTksMi4zNiwyLjM2QzE0LjM2LDE5LjMwMiwxMy4zMDEsMjAuMzYsMTIsMjAuMzZ6IE0xMiwxNi4zNmMtMC45MDQsMC0xLjY0LDAuNzM2LTEuNjQsMS42NHMwLjczNiwxLjY0LDEuNjQsMS42NAoJCXMxLjY0LTAuNzM1LDEuNjQtMS42NFMxMi45MDQsMTYuMzYsMTIsMTYuMzZ6Ii8+Cgk8cmVjdCBzdHlsZT0iZmlsbDpub25lOyIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIi8+Cjwvc3ZnPg==",
    avatarUrl =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAMAAAC/MqoPAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAADNQTFRF////9vX18vLy/Pz86enp4+Li2tnZ1tbWzczM+fn57Ozs4N/f09LS0M/P5uXl7+/v3dzcwtncCAAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAAEgAAABIAEbJaz4AAAZNSURBVHja7d3bdtsqEABQYABZSLH9/3+ZpnUsIcF5iOM6PfElNoMHMfPQdq3GmL0GkLhEUqLaUExnOtOZznSmM53pTGc605nOdKYznelMZzrTmV4LXSqllKyJDkob26xWq8Zae/iH0QoWTm9d1xur4WuypQJtTd+5dqn0VjcxzNO5/57mEBvdLo8Oron6aseWOjYOFkVvjQs3DmgyONMuht52EfztP+4hdu0i6LCO808/M8c1lE/fuPGej41uUzgdtoO/75N+2ELJ9I3b3//hPXbiMenm3pR/Jt4USgcLBIp4Bh10gqKVhvLo0klCxeSky96nKcj3siw6pJIL4XsoiQ7apyvMY/V3HHrSRioLopvEhSpTCn2TPEuwKYMOIX0tAxRBf/Hpa+lfSqBv9gi1FPsNfTrMAiVmIE/vJhz61FGnQxRIEYE4vfNYdN8Rp6MlHaHotHTn8ejekaZPAjEmyvQWdZFTtYTpXqCGJ0zvcek9Yfoel76nS0ffv1NMp1ca+pkgyfRCGind4L7OWWc605l+cxjsyhqy9AGbPpClc1/nvl5VX0c/3Alk6RU3+Am7shNZ+h6bvidLr7jBB+zKBrL0irOOudmIUDzTmf5gIP+iEuXtRuTVaEmY/oZLfyNMrzjryPc0gerMTdpVg0tvjJUU6bLPcGOoUv46SLL6Wi8yhLf06C7TUyekI0efRaaYqdFltkeNpPumRPSMDxgBYvSM035FrKAmH72hRW99PrpvSdEHkTEGUvSsK3yKVDkuJ92RohcZaehzzirPpOg+J92Tolfc4Cumx5xVXpGiZ34+ICX6W84qv5GiR5NPbiIpOv6BCoSvSkTX+eiaGP092zINvBOj4x8mSf9FqejvNo/cvpOji19ZbmviL0GPLsYMFzgzCor0+Bv/ePDvSJKOb9dJ5UlnbnEHiHgzv6cdTpJOWuc/u3FEucLDOL75xGtBiefrcwgoC9NDSH/jkH6pAuXmBqPQ9HSUPVdZBH1GGOrMXAQdYxcKZfxAoK+KKBKFLosoEoX+u4giUehz8jlcnAuhp78I46yDYNAd+QLR6K+pr+yvxdBTHyVDubQh0UfSxaHSd0lbvNkVRE87JGOtc+PQd2QLQ6fHhJkKsSh6yg13tO08JPprsgrrXWH0dJd2vH1MLPprot4eXoujpzrdhngiD40ek2y92lggPcnWa8qN1Yz0BFuvZhRl0uOfR0v4Ewuli/Bg4Qr3lArqGdndQ3UPO1EunXYwnelMZzrTmc50pjOd6UxnOtOZznSmM53pTGf6kuj6oedFKV0s3fX6sX1S3bsi6a4PD7+/YAqYeBw6pIB/4qEgOqxdSPbGiim4NRRCbzs3Jj0L4UfXtQXQVRfn5IdA/Bw7RZzurEV6EtdsLeGXkIPuA+K1UoVeA0l62zmN/LqfSSft9KkepmoRuvi3nd5uKNFB9zbbXEANqdr941XO0NJx2v2jdJenpf+/3bvn0ts16ph+sd6hX7dPo2+2cZzE02Ia43bzDHqr+2Evnhz74ZHU30ffbKOeng1/NPV30Ns1gYQnSP2P6e65Pfxc6h02XZqXQCjhJ6kPL6bFo4NrGvAU4UII4SE2P1vQuZkuOxckVfehisF1MjUddN/MZBN+kvq5uf0O/xa66gyNS9ktMWlz44rO1Z8C19i5FPdHzPamXn+F3hryPfxMr78+4F+kq22kO6Rf6fUQt+puuustyWv4rbG3l/duztFB96GYoe1cTBdXMr+nw9qVM6ZfxOvzezff0nXi/ZOndvrR6Zvpm0c3h6nhdb+5iS7tsIim/qXZD9+97/Jf+rpZ5BET1ayv0GUzLhEuhBBjIy/RdVPgndutIRt9nt7p5cKFEEJ3Z+jQFDZL+XnMDXxHB73gxn5s9Kc3d3/pFciFkN/QTSXHJpX5l66gDrkQoP6hL3xsPw39la4qOiV8tH78XeSbue6N9mvWa6J/ybpc1CT1Wnh5Qq9meP8IOKH3ddH7E/ri1iYux/SXDrXR4UiPdck/wUpU+FtPf6/orja6O9KL3l56LOvVxe5Ib2qjN0d6Vbex4ghWlU3bPqI90If66MNng680FNpbJijH6kCvaF3uMzQ3+IrpFerV4Y9dffQdN3im10ivbuImhD3Qq5u4HdZkua8znelMZ/pS4z9CPVKkxowNxgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wMy0yN1QxNTo0NToxNSswMDowMN1xSg4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDMtMjdUMTU6NDU6MTUrMDA6MDCsLPKyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAABJRU5ErkJggg==";
class AvatarEl {
    static applyCustomStylesToElements(t, e, i) {
        Object.assign(t.style, i.container), Object.assign(e.style, i.avatar);
    }
    static applyCustomStyles(t, e, i, s) {
        var n, o, r;
        null != (n = i.default) &&
            n.styles &&
            AvatarEl.applyCustomStylesToElements(t, e, i.default.styles),
            s
                ? null != (o = i.ai) &&
                  o.styles &&
                  AvatarEl.applyCustomStylesToElements(t, e, i.ai.styles)
                : null != (r = i.user) &&
                  r.styles &&
                  AvatarEl.applyCustomStylesToElements(t, e, i.user.styles);
    }
    static createAvatar(t, e) {
        var i, s, n, o;
        const r = document.createElement("img");
        (r.src = t
            ? (null == (i = null == e ? void 0 : e.ai) ? void 0 : i.src) ||
              (null == (s = null == e ? void 0 : e.default) ? void 0 : s.src) ||
              aiLogoUrl
            : (null == (n = null == e ? void 0 : e.user) ? void 0 : n.src) ||
              (null == (o = null == e ? void 0 : e.default) ? void 0 : o.src) ||
              avatarUrl),
            r.classList.add("avatar");
        const a = document.createElement("div");
        return (
            a.classList.add("avatar-container"),
            a.appendChild(r),
            e && AvatarEl.applyCustomStyles(a, r, e, t),
            a
        );
    }
    static getPosition(t, e) {
        var i, s, n, o, r, a;
        let l = t
            ? null ==
              (s = null == (i = null == e ? void 0 : e.ai) ? void 0 : i.styles)
                ? void 0
                : s.position
            : null ==
              (o =
                  null == (n = null == e ? void 0 : e.user) ? void 0 : n.styles)
            ? void 0
            : o.position;
        return (
            l ??
                (l =
                    null ==
                    (a =
                        null == (r = null == e ? void 0 : e.default)
                            ? void 0
                            : r.styles)
                        ? void 0
                        : a.position),
            l ?? (l = t ? "left" : "right"),
            l
        );
    }
    static add(t, e, i) {
        const s = "boolean" == typeof i ? void 0 : i,
            n = AvatarEl.createAvatar(e, s),
            o = AvatarEl.getPosition(e, s);
        n.classList.add(
            "left" === o ? "left-item-position" : "right-item-position"
        ),
            t.insertAdjacentElement(
                "left" === o ? "beforebegin" : "afterend",
                n
            );
    }
}
class Name {
    static getPosition(t, e) {
        var i, s, n;
        let o = t
            ? null == (i = null == e ? void 0 : e.ai)
                ? void 0
                : i.position
            : null == (s = null == e ? void 0 : e.user)
            ? void 0
            : s.position;
        return (
            o ||
                (o =
                    null == (n = null == e ? void 0 : e.default)
                        ? void 0
                        : n.position),
            o || (o = t ? "left" : "right"),
            o
        );
    }
    static applyStyle(t, e, i) {
        var s, n, o;
        Object.assign(
            t.style,
            null == (s = i.default) ? void 0 : s.style,
            e
                ? null == (n = i.ai)
                    ? void 0
                    : n.style
                : null == (o = i.user)
                ? void 0
                : o.style
        );
    }
    static getNameText(t, e) {
        var i, s, n, o;
        return t
            ? (null == (i = e.ai) ? void 0 : i.text) ||
                  (null == (s = e.default) ? void 0 : s.text) ||
                  "AI"
            : (null == (n = e.user) ? void 0 : n.text) ||
                  (null == (o = e.default) ? void 0 : o.text) ||
                  "User";
    }
    static createName(t, e) {
        const i = document.createElement("div");
        return (
            i.classList.add("name"),
            (i.textContent = Name.getNameText(t, e)),
            Name.applyStyle(i, t, e),
            i
        );
    }
    static add(t, e, i) {
        const s = "boolean" == typeof i ? {} : i,
            n = Name.createName(e, s),
            o = Name.getPosition(e, s);
        n.classList.add(
            "left" === o ? "left-item-position" : "right-item-position"
        ),
            t.insertAdjacentElement(
                "left" === o ? "beforebegin" : "afterend",
                n
            );
    }
}
class Messages {
    constructor(t, e, i) {
        var s, n;
        (this._messageElementRefs = []),
            (this._textElementsToText = []),
            (this._streamedText = ""),
            (this.htmlClassUtilities = {}),
            (this.messages = []);
        const { permittedErrorPrefixes: o, introPanelMarkUp: r, demo: a } = e;
        (this._remarkable = RemarkableConfig.createNew()),
            (this.elementRef = Messages.createContainerElement()),
            (this.messageStyles = t.messageStyles),
            (this._avatars = t.avatars),
            (this._names = t.names),
            (this._errorMessageOverrides =
                null == (s = t.errorMessages) ? void 0 : s.overrides),
            t.htmlClassUtilities &&
                (this.htmlClassUtilities = t.htmlClassUtilities),
            (this._onNewMessage = FireEvents.onNewMessage.bind(this, t)),
            (this._onClearMessages = FireEvents.onClearMessages.bind(this, t)),
            (this._displayLoadingMessage = Messages.getDisplayLoadingMessage(
                t,
                e
            )),
            (this._permittedErrorPrefixes = o),
            this.addSetupMessageIfNeeded(t, e),
            this.populateIntroPanel(i, r, t.introPanelStyle),
            t.introMessage && this.addIntroductoryMessage(t.introMessage),
            t.initialMessages &&
                this.populateInitialMessages(t.initialMessages),
            (this._displayServiceErrorMessages =
                null == (n = t.errorMessages)
                    ? void 0
                    : n.displayServiceErrorMessages),
            (t.getMessages = () => JSON.parse(JSON.stringify(this.messages))),
            (t.clearMessages = this.clearMessages.bind(this)),
            (t.refreshMessages = this.refreshTextMessages.bind(this)),
            (t.scrollToBottom = this.scrollToBottom.bind(this)),
            a && this.prepareDemo(a),
            t.textToSpeech &&
                TextToSpeech.processConfig(t.textToSpeech, (t) => {
                    this._textToSpeech = t;
                }),
            setTimeout(() => {
                this.submitUserMessage = t.submitUserMessage;
            });
    }
    static getDisplayLoadingMessage(t, e) {
        return !e.websocket && (t.displayLoadingBubble ?? !0);
    }
    prepareDemo(t) {
        "object" == typeof t &&
            (t.response && (this.customDemoResponse = t.response),
            t.displayErrors &&
                (t.displayErrors.default && this.addNewErrorMessage("", ""),
                t.displayErrors.service &&
                    this.addNewErrorMessage("service", ""),
                t.displayErrors.speechToText &&
                    this.addNewErrorMessage("speechToText", "")),
            t.displayLoadingBubble && this.addLoadingMessage());
    }
    static createContainerElement() {
        const t = document.createElement("div");
        return (t.id = "messages"), t;
    }
    addSetupMessageIfNeeded(t, e) {
        const i = SetupMessages.getText(t, e);
        if (i) {
            const t = this.createAndAppendNewMessageElement(i, !0);
            this.applyCustomStyles(t, !0, !1);
        }
    }
    addIntroductoryMessage(t) {
        var e, i, s, n;
        if (
            (t && (this._introMessage = t),
            null != (e = this._introMessage) && e.text)
        ) {
            const t = this.createAndAppendNewMessageElement(
                this._introMessage.text,
                !0
            );
            this.applyCustomStyles(
                t,
                !0,
                !1,
                null == (i = this.messageStyles) ? void 0 : i.intro
            );
        } else if (null != (s = this._introMessage) && s.html) {
            const t = HTMLMessages.addNewHTMLMessage(
                this,
                this._introMessage.html,
                !0
            );
            this.applyCustomStyles(
                t,
                !0,
                !1,
                null == (n = this.messageStyles) ? void 0 : n.intro
            );
        }
    }
    populateInitialMessages(t) {
        t.forEach((t) => {
            Legacy.processInitialMessageFile(t),
                this.addNewMessage(t, "ai" === t.role, !0);
        }),
            setTimeout(() => this.scrollToBottom());
    }
    applyCustomStyles(t, e, i, s) {
        this.messageStyles &&
            MessageStyleUtils.applyCustomStyles(this.messageStyles, t, e, i, s);
    }
    addInnerContainerElements(t, e, i) {
        return (
            t.classList.add(
                "message-bubble",
                i ? "ai-message-text" : "user-message-text"
            ),
            (t.innerHTML = this._remarkable.render(e)),
            0 === t.innerText.trim().length && (t.innerText = e),
            this._avatars && AvatarEl.add(t, i, this._avatars),
            this._names && Name.add(t, i, this._names),
            { bubbleElement: t }
        );
    }
    static createMessageContent(t, e) {
        const i = { role: t ? "ai" : "user" },
            { text: s, files: n, html: o } = e;
        return (
            s && (i.text = s),
            n && (i.files = n),
            o && (i.html = o),
            1 === Object.keys(i).length && (i.text = ""),
            i
        );
    }
    static createBaseElements() {
        const t = document.createElement("div"),
            e = document.createElement("div");
        e.classList.add("inner-message-container"),
            t.appendChild(e),
            t.classList.add("outer-message-container");
        const i = document.createElement("div");
        return (
            i.classList.add("message-bubble"),
            e.appendChild(i),
            { outerContainer: t, innerContainer: e, bubbleElement: i }
        );
    }
    createMessageElements(t, e) {
        const i = Messages.createBaseElements(),
            { outerContainer: s, innerContainer: n, bubbleElement: o } = i;
        return (
            s.appendChild(n),
            this.addInnerContainerElements(o, t, e),
            this._messageElementRefs.push(i),
            i
        );
    }
    static isTemporaryElement(t) {
        return (
            (null == t
                ? void 0
                : t.bubbleElement.classList.contains("loading-message-text")) ||
            HTMLDeepChatElements.isElementTemporary(t)
        );
    }
    createNewMessageElement(t, e) {
        var i;
        null == (i = this._introPanel) || i.hide();
        const s = this._messageElementRefs[this._messageElementRefs.length - 1];
        return (
            Messages.isTemporaryElement(s) &&
                (s.outerContainer.remove(), this._messageElementRefs.pop()),
            this.createMessageElements(t, e)
        );
    }
    createAndAppendNewMessageElement(t, e) {
        const i = this.createNewMessageElement(t, e);
        return (
            this.elementRef.appendChild(i.outerContainer),
            this.scrollToBottom(),
            i
        );
    }
    static editEmptyMessageElement(t) {
        (t.textContent = "."), (t.style.color = "#00000000");
    }
    addNewTextMessage(t, e) {
        const i = this.createAndAppendNewMessageElement(t, e);
        return (
            this.applyCustomStyles(i, e, !1),
            0 === t.trim().length &&
                Messages.editEmptyMessageElement(i.bubbleElement),
            this._textElementsToText.push([i, t]),
            i
        );
    }
    addNewMessage(t, e, i = !1) {
        const s = Messages.createMessageContent(e, t);
        if (
            (void 0 !== s.text &&
                null !== t.text &&
                (this.addNewTextMessage(s.text, e),
                !i &&
                    this._textToSpeech &&
                    e &&
                    TextToSpeech.speak(s.text, this._textToSpeech)),
            s.files &&
                Array.isArray(s.files) &&
                FileMessages.addMessages(this, s.files, e),
            void 0 !== s.html && null !== s.html)
        ) {
            const t = HTMLMessages.addNewHTMLMessage(this, s.html, e);
            HTMLDeepChatElements.isElementTemporary(t) && delete s.html;
        }
        this.updateStateOnMessage(s, i);
    }
    updateStateOnMessage(t, e = !1) {
        this.messages.push(t), this.sendClientUpdate(t, e);
    }
    sendClientUpdate(t, e = !1) {
        var i;
        null == (i = this._onNewMessage) ||
            i.call(this, JSON.parse(JSON.stringify(t)), e);
    }
    removeMessageOnError() {
        const t = this._messageElementRefs[this._messageElementRefs.length - 1],
            e = null == t ? void 0 : t.bubbleElement;
        ((null != e &&
            e.classList.contains("streamed-message") &&
            "" === e.textContent) ||
            Messages.isTemporaryElement(t)) &&
            (t.outerContainer.remove(), this._messageElementRefs.pop());
    }
    addNewErrorMessage(t, e) {
        var i, s, n, o;
        this.removeMessageOnError();
        const r = Messages.createBaseElements(),
            { outerContainer: a, bubbleElement: l } = r;
        l.classList.add("error-message-text");
        const c =
            this.getPermittedMessage(e) ||
            (null == (i = this._errorMessageOverrides) ? void 0 : i[t]) ||
            (null == (s = this._errorMessageOverrides) ? void 0 : s.default) ||
            "Error, please try again.";
        l.innerHTML = c;
        const u = MessageStyleUtils.extractParticularSharedStyles(
            ["fontSize", "fontFamily"],
            null == (n = this.messageStyles) ? void 0 : n.default
        );
        MessageStyleUtils.applyCustomStylesToElements(r, !1, u),
            MessageStyleUtils.applyCustomStylesToElements(
                r,
                !1,
                null == (o = this.messageStyles) ? void 0 : o.error
            ),
            this.elementRef.appendChild(a),
            this.scrollToBottom(),
            this._textToSpeech && TextToSpeech.speak(c, this._textToSpeech),
            (this._streamedText = "");
    }
    static checkPermittedErrorPrefixes(t, e) {
        for (let i = 0; i < t.length; i += 1) if (e.startsWith(t[i])) return e;
    }
    getPermittedMessage(t) {
        if (t) {
            if (this._displayServiceErrorMessages) return t;
            if ("string" == typeof t && this._permittedErrorPrefixes) {
                const e = Messages.checkPermittedErrorPrefixes(
                    this._permittedErrorPrefixes,
                    t
                );
                if (e) return e;
            } else if (Array.isArray(t) && this._permittedErrorPrefixes)
                for (let e = 0; e < t.length; e += 1) {
                    const i = Messages.checkPermittedErrorPrefixes(
                        this._permittedErrorPrefixes,
                        t[e]
                    );
                    if (i) return i;
                }
        }
    }
    getLastMessageElement() {
        return this.elementRef.children[this.elementRef.children.length - 1];
    }
    getLastMessageBubbleElement() {
        var t, e, i;
        return Array.from(
            (null ==
            (i =
                null ==
                (e =
                    null == (t = this.getLastMessageElement())
                        ? void 0
                        : t.children)
                    ? void 0
                    : e[0])
                ? void 0
                : i.children) || []
        ).find((t) => t.classList.contains("message-bubble"));
    }
    isLastMessageError() {
        var t;
        return null == (t = this.getLastMessageBubbleElement())
            ? void 0
            : t.classList.contains("error-message-text");
    }
    removeError() {
        this.isLastMessageError() && this.getLastMessageElement().remove();
    }
    addLoadingMessage() {
        var t;
        if (!this._displayLoadingMessage) return;
        const e = this.createMessageElements("", !0),
            { outerContainer: i, bubbleElement: s } = e;
        s.classList.add("loading-message-text");
        const n = document.createElement("div");
        n.classList.add("dots-flashing"),
            s.appendChild(n),
            this.applyCustomStyles(
                e,
                !0,
                !1,
                null == (t = this.messageStyles) ? void 0 : t.loading
            ),
            LoadingMessageDotsStyle.set(s, this.messageStyles),
            this.elementRef.appendChild(i),
            this.scrollToBottom();
    }
    addNewStreamedMessage() {
        const { bubbleElement: t } = this.addNewTextMessage("", !0),
            e = Messages.createMessageContent(!0, { text: "" });
        return (
            this.messages.push(e),
            t.classList.add("streamed-message"),
            this.scrollToBottom(),
            t
        );
    }
    updateStreamedMessage(t, e) {
        var i, s, n, o, r;
        const a = ElementUtils.isScrollbarAtBottomOfElement(this.elementRef);
        if (0 !== t.trim().length) {
            const t = null == (i = this.messageStyles) ? void 0 : i.default;
            e.style.color =
                (null ==
                (n =
                    null == (s = null == t ? void 0 : t.ai) ? void 0 : s.bubble)
                    ? void 0
                    : n.color) ||
                (null ==
                (r =
                    null == (o = null == t ? void 0 : t.shared)
                        ? void 0
                        : o.bubble)
                    ? void 0
                    : r.color) ||
                "";
        }
        (this._streamedText += t),
            (this._textElementsToText[this._textElementsToText.length - 1][1] =
                this._streamedText),
            (e.innerHTML = this._remarkable.render(this._streamedText)),
            a && this.scrollToBottom();
    }
    finaliseStreamedMessage() {
        var t;
        null != (t = this.getLastMessageBubbleElement()) &&
            t.classList.contains("streamed-message") &&
            ((this._textElementsToText[this._textElementsToText.length - 1][1] =
                this._streamedText),
            (this.messages[this.messages.length - 1].text = this._streamedText),
            this.sendClientUpdate(
                Messages.createMessageContent(!0, { text: this._streamedText }),
                !1
            ),
            this._textToSpeech &&
                TextToSpeech.speak(this._streamedText, this._textToSpeech),
            (this._streamedText = ""));
    }
    populateIntroPanel(t, e, i) {
        (t || e) &&
            ((this._introPanel = new IntroPanel(t, e, i)),
            this._introPanel._elementRef &&
                (HTMLUtils.apply(this, this._introPanel._elementRef),
                this.elementRef.appendChild(this._introPanel._elementRef)));
    }
    async addMultipleFiles(t) {
        return Promise.all(
            (t || []).map(
                (t) =>
                    new Promise((e) => {
                        if (t.type && "any" !== t.type) {
                            const i = new FileReader();
                            i.readAsDataURL(t.file),
                                (i.onload = () => {
                                    e({ src: i.result, type: t.type });
                                });
                        } else {
                            const i =
                                t.file.name ||
                                FileMessageUtils.DEFAULT_FILE_NAME;
                            e({ name: i, type: "any" });
                        }
                    })
            )
        );
    }
    clearMessages(t) {
        var e, i;
        const s = [];
        this._messageElementRefs.forEach((t) => {
            const e = t.bubbleElement.classList;
            e.contains("loading-message-text") || e.contains("streamed-message")
                ? s.push(t)
                : t.outerContainer.remove();
        }),
            Array.from(this.elementRef.children).forEach((t) => {
                var e;
                const i = null == (e = t.children[0]) ? void 0 : e.children[0];
                null != i &&
                    i.classList.contains("error-message-text") &&
                    t.remove();
            }),
            (this._messageElementRefs = s),
            !1 !== t &&
                (null != (e = this._introPanel) &&
                    e._elementRef &&
                    this._introPanel.display(),
                this.addIntroductoryMessage()),
            this.messages.splice(0, this.messages.length),
            this._textElementsToText.splice(0, this._textElementsToText.length),
            null == (i = this._onClearMessages) || i.call(this);
    }
    scrollToBottom() {
        this.elementRef.scrollTop = this.elementRef.scrollHeight;
    }
    refreshTextMessages() {
        (this._remarkable = RemarkableConfig.createNew()),
            this._textElementsToText.forEach((t) => {
                t[0].bubbleElement.innerHTML = this._remarkable.render(t[1]);
            });
    }
}
const _InputButtonStyleAdjustments = class t {
    static adjustInputPadding(t, e) {
        e["inside-left"].length > 0 &&
            t.classList.add("text-input-inner-left-adjustment"),
            e["inside-right"].length > 0 &&
                t.classList.add("text-input-inner-right-adjustment");
    }
    static adjustForOutsideButton(e, i, s) {
        0 === s["outside-right"].length && s["outside-left"].length > 0
            ? (e[0].classList.add(t.INPUT_OUTSIDE_LEFT_SMALL_ADJUSTMENT_CLASS),
              i.classList.add(t.INPUT_OUTSIDE_LEFT_SMALL_ADJUSTMENT_CLASS))
            : 0 === s["outside-left"].length &&
              s["outside-right"].length > 0 &&
              (e[3].classList.add(t.INPUT_OUTSIDE_RIGHT_SMALL_ADJUSTMENT_CLASS),
              i.classList.add(t.INPUT_OUTSIDE_RIGHT_SMALL_ADJUSTMENT_CLASS));
    }
    static adjustOutsideSubmit(e, i, s) {
        if (!(s["inside-left"].length > 0 || s["inside-right"].length > 0)) {
            if (0 === s["outside-right"].length && s["outside-left"].length > 0)
                return (
                    e[0].classList.add(t.INPUT_OUTSIDE_LEFT_ADJUSTMENT_CLASS),
                    i.classList.add(t.INPUT_OUTSIDE_LEFT_ADJUSTMENT_CLASS),
                    s["outside-left"].map((t) =>
                        t.button.elementRef.classList.add(
                            "submit-button-enlarged"
                        )
                    )
                );
            if (0 === s["outside-left"].length && s["outside-right"].length > 0)
                return (
                    e[3].classList.add(t.INPUT_OUTSIDE_RIGHT_ADJUSTMENT_CLASS),
                    i.classList.add(t.INPUT_OUTSIDE_RIGHT_ADJUSTMENT_CLASS),
                    s["outside-right"].map((t) =>
                        t.button.elementRef.classList.add(
                            "submit-button-enlarged"
                        )
                    )
                );
        }
    }
    static set(e, i, s, n) {
        !!t.adjustOutsideSubmit(i, s, n) || t.adjustForOutsideButton(i, s, n),
            t.adjustInputPadding(e, n);
    }
};
(_InputButtonStyleAdjustments.INPUT_OUTSIDE_LEFT_ADJUSTMENT_CLASS =
    "text-input-container-left-adjustment"),
    (_InputButtonStyleAdjustments.INPUT_OUTSIDE_RIGHT_ADJUSTMENT_CLASS =
        "text-input-container-right-adjustment"),
    (_InputButtonStyleAdjustments.INPUT_OUTSIDE_LEFT_SMALL_ADJUSTMENT_CLASS =
        "text-input-container-left-small-adjustment"),
    (_InputButtonStyleAdjustments.INPUT_OUTSIDE_RIGHT_SMALL_ADJUSTMENT_CLASS =
        "text-input-container-right-small-adjustment");
let InputButtonStyleAdjustments = _InputButtonStyleAdjustments;
class ButtonContainers {
    static create() {
        return Array.from({ length: 4 }).map((t, e) => {
            const i = document.createElement("div");
            return (
                i.classList.add("input-button-container"),
                (0 === e || 3 === e) &&
                    i.classList.add("outer-button-container"),
                (1 === e || 2 === e) &&
                    i.classList.add("inner-button-container"),
                i
            );
        });
    }
    static add(t, e) {
        t.insertBefore(e[1], t.firstChild),
            t.insertBefore(e[0], t.firstChild),
            t.appendChild(e[2]),
            t.appendChild(e[3]);
    }
    static getContainerIndex(t) {
        return "outside-left" === t
            ? 0
            : "inside-left" === t
            ? 1
            : "inside-right" === t
            ? 2
            : 3;
    }
    static addButton(t, e, i) {
        e.classList.add(i);
        const s = ButtonContainers.getContainerIndex(i);
        t[s].appendChild(e), 3 === s && e.classList.add("outside-right");
    }
}
const BUTTON_ORDER = [
    "camera",
    "gifs",
    "images",
    "audio",
    "mixedFiles",
    "submit",
    "microphone",
];
class CustomButtonInnerElements {
    static createTextElement(t) {
        const e = document.createElement("div");
        return e.classList.add("text-button"), (e.innerText = t), e;
    }
    static createElement(t, e) {
        return e
            ? CustomButtonInnerElements.createTextElement(t)
            : SVGIconUtils.createSVGElement(t);
    }
    static createCustomElement(t, e) {
        var i, s, n, o;
        const r = t[e];
        return null != (i = null == r ? void 0 : r.text) && i.content
            ? CustomButtonInnerElements.createElement(
                  null == (s = null == r ? void 0 : r.text)
                      ? void 0
                      : s.content,
                  !0
              )
            : null != (n = null == r ? void 0 : r.svg) && n.content
            ? CustomButtonInnerElements.createElement(
                  null == (o = null == r ? void 0 : r.svg) ? void 0 : o.content,
                  !1
              )
            : void 0;
    }
    static processElement(t, e) {
        (null != e && e.classList.contains("text-button")) ||
            t.classList.add("input-button-svg");
    }
    static createSpecificStateElement(t, e, i) {
        let s;
        return (
            i && (s = CustomButtonInnerElements.createCustomElement(i, e)),
            CustomButtonInnerElements.processElement(t, s),
            s
        );
    }
    static create(t, e, i) {
        const s = {};
        if (!i) return CustomButtonInnerElements.processElement(t), s;
        const n = CustomButtonInnerElements.createSpecificStateElement(
            t,
            e[0],
            i
        );
        s[e[0]] = n;
        let o = n;
        return (
            e.slice(1).forEach((t) => {
                (o = CustomButtonInnerElements.createCustomElement(i, t) || o),
                    (s[t] = o);
            }),
            s
        );
    }
}
const PLUS_ICON_STRING =
    '<?xml version="1.0" encoding="utf-8"?>\n<svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n    <path d="M16 0c-8.836 0-16 7.163-16 16s7.163 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 30.032c-7.72 0-14-6.312-14-14.032s6.28-14 14-14 14 6.28 14 14-6.28 14.032-14 14.032zM23 15h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1z"></path>\n</svg>';
class ButtonCSS {
    static unsetAllCSS(t, e) {
        var i, s;
        e.container && StyleUtils.unsetAllCSSMouseStates(t, e.container),
            null != (i = e.svg) &&
                i.styles &&
                StyleUtils.unsetAllCSSMouseStates(t.children[0], e.svg.styles),
            null != (s = e.text) &&
                s.styles &&
                StyleUtils.unsetAllCSSMouseStates(t.children[0], e.text.styles);
    }
    static unsetActionCSS(t, e) {
        var i, s;
        e.container && StyleUtils.unsetActivityCSSMouseStates(t, e.container),
            null != (i = e.svg) &&
                i.styles &&
                StyleUtils.unsetActivityCSSMouseStates(
                    t.children[0],
                    e.svg.styles
                ),
            null != (s = e.text) &&
                s.styles &&
                StyleUtils.unsetActivityCSSMouseStates(
                    t.children[0],
                    e.text.styles
                );
    }
    static setElementsCSS(t, e, i) {
        var s, n, o, r, a;
        Object.assign(t.style, null == (s = e.container) ? void 0 : s[i]),
            Object.assign(
                t.children[0].style,
                null == (o = null == (n = e.svg) ? void 0 : n.styles)
                    ? void 0
                    : o[i]
            ),
            Object.assign(
                t.children[0].style,
                null == (a = null == (r = e.text) ? void 0 : r.styles)
                    ? void 0
                    : a[i]
            );
    }
    static setElementCssUpToState(t, e, i) {
        ButtonCSS.setElementsCSS(t, e, "default"),
            "default" !== i &&
                (ButtonCSS.setElementsCSS(t, e, "hover"),
                "hover" !== i && ButtonCSS.setElementsCSS(t, e, "click"));
    }
}
class InputButton {
    constructor(t, e, i, s) {
        (this._mouseState = { state: "default" }),
            (this.elementRef = t),
            (this._customStyles = i),
            (this.position = e),
            (this.dropupText = s);
    }
    buttonMouseLeave(t) {
        (this._mouseState.state = "default"),
            t &&
                (ButtonCSS.unsetAllCSS(this.elementRef, t),
                ButtonCSS.setElementsCSS(this.elementRef, t, "default"));
    }
    buttonMouseEnter(t) {
        (this._mouseState.state = "hover"),
            t && ButtonCSS.setElementsCSS(this.elementRef, t, "hover");
    }
    buttonMouseUp(t) {
        t && ButtonCSS.unsetActionCSS(this.elementRef, t),
            this.buttonMouseEnter(t);
    }
    buttonMouseDown(t) {
        (this._mouseState.state = "click"),
            t && ButtonCSS.setElementsCSS(this.elementRef, t, "click");
    }
    setEvents(t) {
        (this.elementRef.onmousedown = this.buttonMouseDown.bind(this, t)),
            (this.elementRef.onmouseup = this.buttonMouseUp.bind(this, t)),
            (this.elementRef.onmouseenter = this.buttonMouseEnter.bind(
                this,
                t
            )),
            (this.elementRef.onmouseleave = this.buttonMouseLeave.bind(
                this,
                t
            ));
    }
    unsetCustomStateStyles(t) {
        if (this._customStyles)
            for (let e = 0; e < t.length; e += 1) {
                const i = t[e],
                    s = i && this._customStyles[i];
                s && ButtonCSS.unsetActionCSS(this.elementRef, s);
            }
    }
    reapplyStateStyle(t, e) {
        if (!this._customStyles) return;
        e && this.unsetCustomStateStyles(e);
        const i = this._customStyles[t];
        i &&
            ButtonCSS.setElementCssUpToState(
                this.elementRef,
                i,
                this._mouseState.state
            ),
            this.setEvents(i);
    }
}
class DropupItemNavigation {
    static focusItemWhenOnEdge(t, e) {
        const i = e ? t.children[0] : t.children[t.children.length - 1];
        DropupItemNavigation.focusSiblingItem(i, t, e, !0);
    }
    static focusSiblingItem(t, e, i, s = !1) {
        const n = s ? t : t[i ? "nextSibling" : "previousSibling"];
        n
            ? (t.dispatchEvent(new MouseEvent("mouseleave")),
              n.dispatchEvent(new MouseEvent("mouseenter")))
            : (t.dispatchEvent(new MouseEvent("mouseleave")),
              DropupItemNavigation.focusItemWhenOnEdge(e, i));
    }
}
class DropupItem {
    static addItemEvents(t, e, i, s) {
        StatefulEvents.add(e, s),
            e.addEventListener("click", () => {
                i.click();
            }),
            e.addEventListener("mouseenter", (e) => {
                t.highlightedItem = e.target;
            }),
            e.addEventListener("mouseleave", () => {
                t.highlightedItem = void 0;
            });
    }
    static createItemText(t, e) {
        const i = document.createElement("div");
        return (
            Object.assign(i.style, e),
            i.classList.add("dropup-menu-item-text"),
            (i.textContent = t || "File"),
            i
        );
    }
    static createItemIcon(t, e) {
        const i = document.createElement("div");
        return (
            Object.assign(i.style, e),
            i.classList.add("dropup-menu-item-icon"),
            i.appendChild(t.children[0]),
            i
        );
    }
    static populateItem(t, e, i, s) {
        const n = t.children[0];
        n.classList.contains("text-button")
            ? e.appendChild(
                  DropupItem.createItemText(
                      n.textContent,
                      null == s ? void 0 : s.text
                  )
              )
            : (e.appendChild(
                  DropupItem.createItemIcon(
                      t,
                      null == s ? void 0 : s.iconContainer
                  )
              ),
              e.appendChild(
                  DropupItem.createItemText(i, null == s ? void 0 : s.text)
              ));
    }
    static createItem(t, e, i) {
        var s;
        const { elementRef: n, dropupText: o } = e,
            r = document.createElement("div");
        Object.assign(
            r.style,
            null == (s = null == i ? void 0 : i.item) ? void 0 : s.default
        ),
            DropupItem.populateItem(n, r, o, i),
            r.classList.add("dropup-menu-item");
        const a = StyleUtils.processStateful(
            (null == i ? void 0 : i.item) || {},
            { backgroundColor: "#f3f3f3" },
            { backgroundColor: "#ebebeb" }
        );
        return DropupItem.addItemEvents(t, r, n, a), r;
    }
}
class DropupMenu {
    constructor(t, e) {
        var i;
        (this._isOpen = !0),
            (this._styles = e),
            (this.elementRef = DropupMenu.createElement(
                null == (i = this._styles) ? void 0 : i.container
            )),
            this.close(),
            setTimeout(() => this.addWindowEvents(t));
    }
    static createElement(t) {
        const e = document.createElement("div");
        return (e.id = "dropup-menu"), Object.assign(e.style, t), e;
    }
    open() {
        (this.elementRef.style.display = "block"), (this._isOpen = !0);
    }
    close() {
        this._isOpen &&
            ((this.elementRef.style.display = "none"), (this._isOpen = !1));
    }
    toggle() {
        this._isOpen ? this.close() : this.open();
    }
    addItem(t) {
        const e = DropupItem.createItem(this, t, this._styles);
        this.elementRef.appendChild(e);
    }
    addWindowEvents(t) {
        window.addEventListener("click", (e) => {
            var i;
            t.parentElement !==
                (null == (i = e.target.shadowRoot) ? void 0 : i.children[0]) &&
                this.close();
        }),
            window.addEventListener("keydown", (t) => {
                var e, i, s;
                this._isOpen &&
                    (t.key === KEYBOARD_KEY.ESCAPE
                        ? (this.close(),
                          null == (e = this.highlightedItem) ||
                              e.dispatchEvent(new MouseEvent("mouseleave")))
                        : t.key === KEYBOARD_KEY.ENTER
                        ? (null == (i = this.highlightedItem) || i.click(),
                          null == (s = this.highlightedItem) ||
                              s.dispatchEvent(new MouseEvent("mouseleave")))
                        : t.key === KEYBOARD_KEY.ARROW_DOWN
                        ? DropupItemNavigation.focusSiblingItem(
                              this.highlightedItem ||
                                  this.elementRef.children[
                                      this.elementRef.children.length - 1
                                  ],
                              this.elementRef,
                              !0
                          )
                        : t.key === KEYBOARD_KEY.ARROW_UP &&
                          DropupItemNavigation.focusSiblingItem(
                              this.highlightedItem ||
                                  this.elementRef.children[0],
                              this.elementRef,
                              !1
                          ));
            });
    }
}
class Dropup extends InputButton {
    constructor(t, e) {
        var i;
        super(Dropup.createButtonElement(), void 0, {
            styles:
                null == (i = null == e ? void 0 : e.button) ? void 0 : i.styles,
        });
        const s = this.createInnerElements(this._customStyles);
        (this._menu = new DropupMenu(t, null == e ? void 0 : e.menu)),
            this.addClickEvent(),
            (this.buttonContainer = Dropup.createButtonContainer()),
            this.elementRef.appendChild(s.styles),
            this.buttonContainer.appendChild(this.elementRef),
            this.elementRef.classList.add("dropup-icon", "upload-file-button"),
            this.buttonContainer.appendChild(this._menu.elementRef),
            this.reapplyStateStyle("styles"),
            this.addContainerEvents(t);
    }
    static createButtonElement() {
        const t = document.createElement("div");
        return t.classList.add("input-button"), t;
    }
    createInnerElements(t) {
        return {
            styles: this.createInnerElement(
                Dropup.createSVGIconElement(),
                "styles",
                t
            ),
        };
    }
    createInnerElement(t, e, i) {
        return (
            CustomButtonInnerElements.createSpecificStateElement(
                this.elementRef,
                e,
                i
            ) || t
        );
    }
    static createSVGIconElement() {
        const t = SVGIconUtils.createSVGElement(PLUS_ICON_STRING);
        return (t.id = "dropup-icon"), t;
    }
    addClickEvent() {
        this.elementRef.onclick = this._menu.toggle.bind(this._menu);
    }
    static createButtonContainer() {
        const t = document.createElement("div");
        return (t.id = "dropup-container"), t;
    }
    addItem(t) {
        this._menu.addItem(t);
    }
    addContainerEvents(t) {
        t.addEventListener("click", (t) => {
            t.target.classList.contains("dropup-icon") || this._menu.close();
        });
    }
    static getPosition(t, e) {
        var i, s;
        return null != (i = null == e ? void 0 : e.button) && i.position
            ? null == (s = null == e ? void 0 : e.button)
                ? void 0
                : s.position
            : t["outside-left"].length > 0 && 0 === t["outside-right"].length
            ? "outside-right"
            : "outside-left";
    }
}
class InputButtonPositions {
    static addToDropup(t, e, i, s) {
        const n = new Dropup(i, s);
        BUTTON_ORDER.forEach((t) => {
            const i = e["dropup-menu"].findIndex((e) => e.buttonType === t),
                s = e["dropup-menu"][i];
            s && (n.addItem(s.button), e["dropup-menu"].splice(i, 1));
        });
        const o = Dropup.getPosition(e, s);
        ButtonContainers.addButton(t, n.buttonContainer, o), e[o].push({});
    }
    static addToSideContainer(t, e) {
        [
            "inside-left",
            "inside-right",
            "outside-left",
            "outside-right",
        ].forEach((i) => {
            const s = i;
            e[s].forEach((e) => {
                ButtonContainers.addButton(t, e.button.elementRef, s);
            });
        });
    }
    static setPosition(t, e, i) {
        const s = { ...t[e], buttonType: e };
        i.push(s), delete t[e];
    }
    static createPositionsObj() {
        return {
            "dropup-menu": [],
            "outside-left": [],
            "inside-left": [],
            "inside-right": [],
            "outside-right": [],
        };
    }
    static generatePositions(t) {
        const e = InputButtonPositions.createPositionsObj();
        Object.keys(t).forEach((i) => {
            var s;
            const n = null == (s = t[i]) ? void 0 : s.button.position;
            n && InputButtonPositions.setPosition(t, i, e[n]);
        }),
            0 === e["inside-right"].length &&
                t.submit &&
                InputButtonPositions.setPosition(
                    t,
                    "submit",
                    e["inside-right"]
                ),
            0 === e["outside-right"].length &&
                (t.submit
                    ? InputButtonPositions.setPosition(
                          t,
                          "submit",
                          e["outside-right"]
                      )
                    : t.microphone
                    ? InputButtonPositions.setPosition(
                          t,
                          "microphone",
                          e["outside-right"]
                      )
                    : t.camera &&
                      InputButtonPositions.setPosition(
                          t,
                          "camera",
                          e["outside-right"]
                      )),
            t.submit &&
                InputButtonPositions.setPosition(
                    t,
                    "submit",
                    0 === e["outside-left"].length
                        ? e["outside-left"]
                        : e["inside-right"]
                ),
            t.microphone &&
                InputButtonPositions.setPosition(
                    t,
                    "microphone",
                    0 === e["outside-left"].length
                        ? e["outside-left"]
                        : e["inside-right"]
                );
        const i = Object.keys(t);
        return (
            i.length > 1 || e["dropup-menu"].length > 0
                ? BUTTON_ORDER.forEach((i) => {
                      t[i] && e["dropup-menu"].push({ ...t[i], buttonType: i });
                  })
                : 1 === i.length &&
                  InputButtonPositions.setPosition(
                      t,
                      i[0],
                      0 === e["outside-right"].length
                          ? e["outside-right"]
                          : e["outside-left"]
                  ),
            e
        );
    }
    static addButtons(t, e, i, s) {
        const n = InputButtonPositions.generatePositions(e);
        return (
            InputButtonPositions.addToSideContainer(t, n),
            n["dropup-menu"].length > 0 &&
                InputButtonPositions.addToDropup(t, n, i, s),
            n
        );
    }
}
const MIXED_FILES_ICON_STRING =
        '<?xml version="1.0" encoding="utf-8"?>\n<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n<title>file</title>\n<path d="M20 10.9696L11.9628 18.5497C10.9782 19.4783 9.64274 20 8.25028 20C6.85782 20 5.52239 19.4783 4.53777 18.5497C3.55315 17.6211 3 16.3616 3 15.0483C3 13.7351 3.55315 12.4756 4.53777 11.547L12.575 3.96687C13.2314 3.34779 14.1217 3 15.05 3C15.9783 3 16.8686 3.34779 17.525 3.96687C18.1814 4.58595 18.5502 5.4256 18.5502 6.30111C18.5502 7.17662 18.1814 8.01628 17.525 8.63535L9.47904 16.2154C9.15083 16.525 8.70569 16.6989 8.24154 16.6989C7.77738 16.6989 7.33224 16.525 7.00403 16.2154C6.67583 15.9059 6.49144 15.4861 6.49144 15.0483C6.49144 14.6106 6.67583 14.1907 7.00403 13.8812L14.429 6.88674" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>',
    IMAGE_ICON_STRING =
        '<?xml version="1.0" encoding="utf-8"?>\n<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n  <path d="M20,15.2928932 L20,5.5 C20,4.67157288 19.3284271,4 18.5,4 L5.5,4 C4.67157288,4 4,4.67157288 4,5.5 L4,12.2928932 L7.14644661,9.14644661 C7.34170876,8.95118446 7.65829124,8.95118446 7.85355339,9.14644661 L13.5,14.7928932 L16.1464466,12.1464466 C16.3417088,11.9511845 16.6582912,11.9511845 16.8535534,12.1464466 L20,15.2928932 Z M20,16.7071068 L16.5,13.2071068 L13.8535534,15.8535534 C13.6582912,16.0488155 13.3417088,16.0488155 13.1464466,15.8535534 L7.5,10.2071068 L4,13.7071068 L4,18.5 C4,19.3284271 4.67157288,20 5.5,20 L18.5,20 C19.3284271,20 20,19.3284271 20,18.5 L20,16.7071068 Z M3,5.5 C3,4.11928813 4.11928813,3 5.5,3 L18.5,3 C19.8807119,3 21,4.11928813 21,5.5 L21,18.5 C21,19.8807119 19.8807119,21 18.5,21 L5.5,21 C4.11928813,21 3,19.8807119 3,18.5 L3,5.5 Z M15,6 L17,6 C17.5522847,6 18,6.44771525 18,7 L18,9 C18,9.55228475 17.5522847,10 17,10 L15,10 C14.4477153,10 14,9.55228475 14,9 L14,7 C14,6.44771525 14.4477153,6 15,6 Z M15,7 L15,9 L17,9 L17,7 L15,7 Z"/>\n</svg>\n',
    AUDIO_ICON_STRING =
        '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-49.49 -49.49 593.87 593.87" stroke-width="3.95908" transform="rotate(0)">\n  <g stroke-width="0"></g>\n  <g stroke-linecap="round" stroke-linejoin="round" stroke-width="0.98977"></g>\n  <g>\n    <g>\n      <g>\n        <path d="M163.205,76.413v293.301c-3.434-3.058-7.241-5.867-11.486-8.339c-21.38-12.452-49.663-15.298-77.567-7.846 c-49.038,13.096-80.904,54.519-71.038,92.337c4.019,15.404,14.188,28.221,29.404,37.087c13.553,7.894,29.87,11.933,47.115,11.933 c9.962,0,20.231-1.356,30.447-4.087c42.74-11.406,72.411-44.344,72.807-77.654h0.011v-0.162c0.002-0.166,0-0.331,0-0.496V187.072 l290.971-67.3v178.082c-3.433-3.055-7.238-5.863-11.481-8.334c-21.385-12.452-49.654-15.308-77.567-7.846 c-49.038,13.087-80.904,54.519-71.038,92.356c4.019,15.385,14.183,28.212,29.404,37.067c13.548,7.894,29.875,11.933,47.115,11.933 c9.962,0,20.231-1.356,30.452-4.087c42.74-11.413,72.411-44.346,72.804-77.654h0.004v-0.065c0.003-0.236,0.001-0.469,0-0.704V0 L163.205,76.413z M104.999,471.779c-22.543,6.038-45.942,3.846-62.572-5.846c-10.587-6.163-17.591-14.817-20.255-25.038 c-7.144-27.375,18.452-58.029,57.062-68.346c8.409-2.25,16.938-3.346,25.188-3.346c13.87,0,26.962,3.115,37.389,9.192 c10.587,6.163,17.591,14.817,20.255,25.029c0.809,3.102,1.142,6.248,1.139,9.4v0.321h0.014 C162.99,437.714,139.082,462.678,104.999,471.779z M182.898,166.853V92.067l290.971-67.298v74.784L182.898,166.853z M415.677,399.923c-22.558,6.038-45.942,3.837-62.587-5.846c-10.587-6.163-17.587-14.817-20.25-25.019 c-7.144-27.385,18.452-58.058,57.058-68.365c8.414-2.25,16.942-3.346,25.192-3.346c13.875,0,26.962,3.115,37.385,9.192 c10.596,6.163,17.596,14.817,20.26,25.029v0.01c0.796,3.05,1.124,6.144,1.135,9.244v0.468h0.02 C473.668,365.851,449.763,390.814,415.677,399.923z">\n        </path>\n      </g>\n    </g>\n  </g>\n</svg>',
    GIF_ICON_STRING =
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 5.9266752 5.6408391" height="21.31971" width="22.4">\n  <g>\n    <path d="m 5.2564627,1.548212 c -3.1136005,-0.4796804 -1.5568006,-0.2398402 0,0 z M 2.0001198,2.0922063 c 0.1556781,0 0.2657489,0.020893 0.3917849,0.080366 0.081154,0.038347 0.1153492,0.134065 0.076377,0.2138602 -0.038973,0.07979 -0.1363527,0.1134129 -0.2175069,0.075091 -0.078199,-0.036919 -0.1407455,-0.048792 -0.250655,-0.048792 -0.2260486,0 -0.3921482,0.2042182 -0.3921482,0.4801409 0,0.2761822 0.1663188,0.4810688 0.3921482,0.4810688 0.1117901,0 0.2064255,-0.046133 0.255659,-0.1284198 l 0.00162,-0.00389 V 3.0534032 l -0.098011,1.75e-4 c -0.081844,0 -0.1495979,-0.059305 -0.1612403,-0.1365887 l -0.00175,-0.023683 c 0,-0.08047 0.060311,-0.1470874 0.1389194,-0.1585331 l 0.024085,-0.00195 h 0.2612303 c 0.081842,0 0.149598,0.059305 0.1612404,0.1365891 l 0.00175,0.023683 -3.398e-4,0.3968809 v 0 l -0.00168,0.014211 v 0 l -0.00553,0.023034 v 0 l -0.00532,0.014145 c -0.098178,0.22826 -0.3236506,0.3528713 -0.5706303,0.3528713 -0.4240855,0 -0.7181621,-0.3622714 -0.7181621,-0.8016063 0,-0.4391857 0.2940275,-0.8006848 0.7181621,-0.8006848 z m 1.2034759,0.031275 c 0.081843,0 0.1495977,0.059305 0.1612403,0.1365891 l 0.00175,0.023683 v 1.2211775 c 0,0.088516 -0.07298,0.1602721 -0.1630073,0.1602721 -0.081841,0 -0.1495972,-0.059305 -0.1612397,-0.1365892 L 3.040589,3.5049308 V 2.2837527 c 0,-0.088516 0.07298,-0.1602721 0.1630067,-0.1602714 z m 0.7813442,0 0.5209469,0.00195 c 0.090025,3.048e-4 0.1627543,0.072306 0.1624458,0.1608234 -2.809e-4,0.08047 -0.06083,0.1468798 -0.1394772,0.158066 l -0.024092,0.00195 -0.3575326,-0.0013 v 0.4497782 l 0.2928918,2.27e-4 c 0.081842,0 0.1495979,0.059305 0.1612403,0.136589 l 0.00175,0.023683 c 0,0.080469 -0.06031,0.1470871 -0.1389193,0.1585393 l -0.024092,0.00195 -0.2928919,-2.336e-4 1.563e-4,0.2860316 c 0,0.080471 -0.06031,0.1470873 -0.1389193,0.1585395 l -0.024085,0.00195 c -0.081843,0 -0.1495979,-0.059305 -0.1612403,-0.1365826 l -0.00175,-0.023691 V 2.2841354 c 2.798e-4,-0.08047 0.060829,-0.1468797 0.1394758,-0.1580594 z"/>\n    <path d="m 5.0894191,1.0943261 c 0,-0.21918999 -0.177687,-0.39686999 -0.396876,-0.39686999 h -3.43959 c -0.2191879,0 -0.391262,0.1777519 -0.3968759,0.39686999 l -0.027082,3.4379266 c 0.040152,0.2939927 0.4235456,0.409415 0.4235456,0.409415 l 3.4785583,-0.00851 c 0,0 0.3008506,-0.1402998 0.3236271,-0.4201576 0.042911,-0.5272495 0.034693,-1.6106146 0.034693,-3.4186761 z m -4.49792494,0 c 0,-0.36530999 0.29614504,-0.66145999 0.66145894,-0.66145999 h 3.43959 c 0.365314,0 0.66146,0.29615 0.66146,0.66145999 v 3.43959 c 0,0.36532 -0.296146,0.66146 -0.66146,0.66146 h -3.43959 c -0.3653139,0 -0.66145894,-0.29614 -0.66145894,-0.66146 z"/>\n  </g>\n</svg>\n',
    FILE_TYPE_BUTTON_ICONS = {
        images: {
            id: "upload-images-icon",
            svgString: IMAGE_ICON_STRING,
            dropupText: "Image",
        },
        gifs: {
            id: "upload-gifs-icon",
            svgString: GIF_ICON_STRING,
            dropupText: "GIF",
        },
        audio: {
            id: "upload-audio-icon",
            svgString: AUDIO_ICON_STRING,
            dropupText: "Audio",
        },
        mixedFiles: {
            id: "upload-mixed-files-icon",
            svgString: MIXED_FILES_ICON_STRING,
            dropupText: "File",
        },
    };
class FileAttachmentsType {
    constructor(t, e, i) {
        (this._attachments = []),
            (this._fileCountLimit = 99),
            (this._acceptedFormat = ""),
            t.maxNumberOfFiles && (this._fileCountLimit = t.maxNumberOfFiles),
            (this._toggleContainerDisplay = e),
            (this._fileAttachmentsContainerRef = i),
            t.acceptedFormats && (this._acceptedFormat = t.acceptedFormats);
    }
    attemptAddFile(t, e) {
        return (
            !!FileAttachmentsType.isFileTypeValid(t, this._acceptedFormat) &&
            (this.addAttachmentBasedOnType(t, e, !0), !0)
        );
    }
    static isFileTypeValid(t, e) {
        if ("" === e) return !0;
        const i = e.split(",");
        for (let e = 0; e < i.length; e++) {
            const s = i[e].trim();
            if (t.type === s) return !0;
            if (s.startsWith(".")) {
                const e = s.slice(1);
                if (t.name.endsWith(e)) return !0;
            } else {
                if (t.name.endsWith(s)) return !0;
                if (s.endsWith("/*") && t.type.startsWith(s.slice(0, -2)))
                    return !0;
            }
        }
        return !1;
    }
    addAttachmentBasedOnType(t, e, i) {
        if (t.type.startsWith("image")) {
            const s = FileAttachmentsType.createImageAttachment(e);
            this.addFileAttachment(t, "image", s, i);
        } else if (t.type.startsWith("audio")) {
            const s = AudioFileAttachmentType.createAudioAttachment(e);
            this.addFileAttachment(t, "audio", s, i);
        } else {
            const e = FileAttachmentsType.createAnyFileAttachment(t.name);
            this.addFileAttachment(t, "any", e, i);
        }
    }
    static createImageAttachment(t) {
        const e = new Image();
        return (e.src = t), e.classList.add("image-attachment"), e;
    }
    static createAnyFileAttachment(t) {
        const e = document.createElement("div");
        e.classList.add("border-bound-attachment"),
            Browser$1.IS_SAFARI &&
                e.classList.add("border-bound-attachment-safari");
        const i = document.createElement("div");
        i.classList.add("any-file-attachment-text");
        const s = document.createElement("div");
        return (
            s.classList.add("file-attachment-text-container"),
            s.appendChild(i),
            (i.textContent = t),
            e.appendChild(s),
            e
        );
    }
    addFileAttachment(t, e, i, s) {
        const n = FileAttachmentsType.createContainer(i);
        if (this._attachments.length >= this._fileCountLimit) {
            const t =
                this._attachments[this._attachments.length - 1].removeButton;
            null == t || t.click();
            const e = this._fileAttachmentsContainerRef.children;
            this._fileAttachmentsContainerRef.insertBefore(n, e[0]);
        } else this._fileAttachmentsContainerRef.appendChild(n);
        const o = { file: t, attachmentContainerElement: n, fileType: e };
        return (
            s &&
                ((o.removeButton = this.createRemoveAttachmentButton(o)),
                n.appendChild(o.removeButton)),
            this._toggleContainerDisplay(!0),
            this._attachments.push(o),
            (this._fileAttachmentsContainerRef.scrollTop =
                this._fileAttachmentsContainerRef.scrollHeight),
            o
        );
    }
    static createContainer(t) {
        const e = document.createElement("div");
        return e.classList.add("file-attachment"), e.appendChild(t), e;
    }
    createRemoveAttachmentButton(t) {
        const e = document.createElement("div");
        e.classList.add("remove-file-attachment-button"),
            (e.onclick = this.removeAttachment.bind(this, t));
        const i = document.createElement("div");
        return (
            i.classList.add("x-icon"), (i.innerText = "×"), e.appendChild(i), e
        );
    }
    removeAttachment(t) {
        const e = this._attachments.findIndex((e) => e === t),
            i = this._attachments[e].attachmentContainerElement;
        this._attachments.splice(e, 1),
            AudioFileAttachmentType.stopAttachmentPlayback(i),
            i.remove(),
            this._toggleContainerDisplay(!1);
    }
    getFiles() {
        return Array.from(this._attachments).map((t) => ({
            file: t.file,
            type: t.fileType,
        }));
    }
    removeAllAttachments() {
        this._attachments.forEach((t) => {
            setTimeout(() => {
                var e;
                return null == (e = t.removeButton) ? void 0 : e.click();
            });
        });
    }
}
const PLAY_ICON_STRING =
        '<?xml version="1.0" encoding="utf-8"?>\n<svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n  <title>play</title>\n  <path d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z"></path>\n</svg>',
    STOP_ICON_STRING =
        '<?xml version="1.0" encoding="utf-8"?>\n<svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n<title>stop</title>\n<path d="M5.92 24.096q0 0.832 0.576 1.408t1.44 0.608h16.128q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-16.128q-0.832 0-1.44 0.576t-0.576 1.44v16.16z"></path>\n</svg>',
    _AudioFileAttachmentType = class t extends FileAttachmentsType {
        constructor(t, e, i) {
            super(t, e, i);
        }
        static createAudioContainer() {
            const t = document.createElement("div");
            return (
                t.classList.add(
                    "border-bound-attachment",
                    "audio-attachment-icon-container"
                ),
                Browser$1.IS_SAFARI &&
                    t.classList.add("border-bound-attachment-safari"),
                t
            );
        }
        static addAudioElements(t, e) {
            const i = t.parentElement ? ElementUtils.cloneElement(t) : t,
                s = document.createElement("audio");
            s.src = e;
            const n = SVGIconUtils.createSVGElement(PLAY_ICON_STRING);
            n.classList.add("attachment-icon", "play-icon");
            const o = SVGIconUtils.createSVGElement(STOP_ICON_STRING);
            o.classList.add("attachment-icon", "stop-icon"),
                i.replaceChildren(n),
                (s.onplay = () => {
                    i.replaceChildren(o);
                }),
                (s.onpause = () => {
                    i.replaceChildren(n), (s.currentTime = 0);
                }),
                (s.onended = () => {
                    i.replaceChildren(n);
                }),
                (i.onclick = () => {
                    s.paused ? s.play() : s.pause();
                });
        }
        static createAudioAttachment(e) {
            const i = t.createAudioContainer();
            return t.addAudioElements(i, e), i;
        }
        createTimer(e, i) {
            let s = 0;
            const n = void 0 !== i && i < t.TIMER_LIMIT_S ? i : t.TIMER_LIMIT_S;
            return setInterval(() => {
                var t;
                (s += 1),
                    s === n &&
                        (null == (t = this.stopPlaceholderCallback) ||
                            t.call(this),
                        this.clearTimer()),
                    600 === s &&
                        e.classList.add("audio-placeholder-text-4-digits");
                const i = Math.floor(s / 60),
                    o = (s % 60).toString().padStart(2, "0");
                e.textContent = `${i}:${o}`;
            }, 1e3);
        }
        createPlaceholderAudioAttachment(e) {
            const i = t.createAudioContainer(),
                s = document.createElement("div");
            s.classList.add("audio-placeholder-text-3-digits");
            const n = document.createElement("div");
            n.classList.add(
                "file-attachment-text-container",
                "audio-placeholder-text-3-digits-container"
            ),
                n.appendChild(s);
            const o = SVGIconUtils.createSVGElement(STOP_ICON_STRING);
            return (
                o.classList.add(
                    "attachment-icon",
                    "stop-icon",
                    "not-removable-attachment-icon"
                ),
                (s.textContent = "0:00"),
                (this._activePlaceholderTimer = this.createTimer(s, e)),
                i.appendChild(n),
                this.addPlaceholderAudioAttachmentEvents(i, o, n),
                i
            );
        }
        addPlaceholderAudioAttachmentEvents(t, e, i) {
            t.addEventListener("mouseenter", () => t.replaceChildren(e));
            t.addEventListener("mouseleave", () => t.replaceChildren(i));
            t.addEventListener("click", () => {
                var t;
                return null == (t = this.stopPlaceholderCallback)
                    ? void 0
                    : t.call(this);
            });
        }
        addPlaceholderAttachment(t, e) {
            const i = this.createPlaceholderAudioAttachment(e);
            (this._activePlaceholderAttachment = this.addFileAttachment(
                new File([], ""),
                "audio",
                i,
                !1
            )),
                (this.stopPlaceholderCallback = t);
        }
        completePlaceholderAttachment(e, i) {
            const s = this._activePlaceholderAttachment;
            s &&
                ((s.file = e),
                t.addAudioElements(s.attachmentContainerElement.children[0], i),
                (s.removeButton = this.createRemoveAttachmentButton(s)),
                s.attachmentContainerElement.appendChild(s.removeButton),
                (this._activePlaceholderAttachment = void 0),
                this.clearTimer());
        }
        removePlaceholderAttachment() {
            this._activePlaceholderAttachment &&
                (this.removeAttachment(this._activePlaceholderAttachment),
                (this._activePlaceholderAttachment = void 0),
                this.clearTimer());
        }
        clearTimer() {
            void 0 !== this._activePlaceholderTimer &&
                (clearInterval(this._activePlaceholderTimer),
                (this._activePlaceholderTimer = void 0),
                (this.stopPlaceholderCallback = void 0));
        }
        static stopAttachmentPlayback(t) {
            var e, i, s;
            null !=
                (s =
                    null ==
                    (i = null == (e = t.children[0]) ? void 0 : e.children)
                        ? void 0
                        : i[0]) &&
                s.classList.contains("stop-icon") &&
                t.children[0].click();
        }
    };
_AudioFileAttachmentType.TIMER_LIMIT_S = 5999;
let AudioFileAttachmentType = _AudioFileAttachmentType;
class FileAttachmentTypeFactory {
    static create(t, e, i, s) {
        return "audio" === s
            ? new AudioFileAttachmentType(t, e, i)
            : new FileAttachmentsType(t, e, i);
    }
}
class FileAttachments {
    constructor(t, e, i) {
        (this._fileAttachmentsTypes = []),
            (this.elementRef = this.createAttachmentContainer());
        const s = "object" == typeof i && !!i.displayFileAttachmentContainer;
        this.toggleContainerDisplay(s),
            t.appendChild(this.elementRef),
            e && Object.assign(this.elementRef.style, e);
    }
    addType(t, e) {
        const i = FileAttachmentTypeFactory.create(
            t,
            this.toggleContainerDisplay.bind(this),
            this.elementRef,
            e
        );
        return this._fileAttachmentsTypes.push(i), i;
    }
    createAttachmentContainer() {
        const t = document.createElement("div");
        return (t.id = "file-attachment-container"), t;
    }
    toggleContainerDisplay(t) {
        t
            ? (this.elementRef.style.display = "block")
            : 0 === this.elementRef.children.length &&
              (this.elementRef.style.display = "none");
    }
    getAllFileData() {
        const t = this._fileAttachmentsTypes.map((t) => t.getFiles()).flat();
        return t.length > 0 ? t : void 0;
    }
    async completePlaceholders() {
        await Promise.all(
            this._fileAttachmentsTypes.map(async (t) => {
                var e;
                return null == (e = t.stopPlaceholderCallback)
                    ? void 0
                    : e.call(t);
            })
        );
    }
    static addFilesToType(t, e) {
        t.forEach((t) => {
            const i = new FileReader();
            i.readAsDataURL(t),
                (i.onload = (i) => {
                    for (
                        let s = 0;
                        s < e.length &&
                        !e[s].attemptAddFile(t, i.target.result);
                        s += 1
                    );
                });
        });
    }
    addFilesToAnyType(t) {
        FileAttachments.addFilesToType(t, this._fileAttachmentsTypes);
    }
    removeAllFiles() {
        this._fileAttachmentsTypes.forEach((t) => t.removeAllAttachments()),
            this.elementRef.replaceChildren(),
            this.toggleContainerDisplay(!1);
    }
    getNumberOfTypes() {
        return this._fileAttachmentsTypes.length;
    }
}
const _Modal = class t {
    constructor(e, i, s) {
        (this._isOpen = !1),
            (this._contentRef = t.createModalContent(
                i,
                null == s ? void 0 : s.backgroundColor
            )),
            (this._buttonPanel = t.createButtonPanel(
                null == s ? void 0 : s.backgroundColor
            )),
            (this._elementRef = t.createContainer(this._contentRef, s)),
            this._elementRef.appendChild(this._buttonPanel),
            e.appendChild(this._elementRef),
            (this._backgroundPanelRef = t.createDarkBackgroundPanel()),
            e.appendChild(this._backgroundPanelRef),
            this.addWindowEvents();
    }
    isOpen() {
        return this._isOpen;
    }
    static createContainer(t, e) {
        const i = document.createElement("div");
        return (
            i.classList.add("modal"),
            i.appendChild(t),
            e && delete e.backgroundColor,
            Object.assign(i.style, e),
            i
        );
    }
    static createModalContent(t, e) {
        const i = document.createElement("div");
        return (
            i.classList.add(...t),
            e && (i.style.backgroundColor = e),
            document.createElement("div").appendChild(i),
            i
        );
    }
    static createButtonPanel(t) {
        const e = document.createElement("div");
        return (
            e.classList.add("modal-button-panel"),
            t && (e.style.backgroundColor = t),
            e
        );
    }
    static createDarkBackgroundPanel() {
        const t = document.createElement("div");
        return (t.id = "modal-background-panel"), t;
    }
    addButtons(...t) {
        t.forEach((t) => this._buttonPanel.appendChild(t));
    }
    static createTextButton(t) {
        const e = document.createElement("div");
        return e.classList.add("modal-button"), (e.textContent = t), e;
    }
    static createSVGButton(t) {
        const e = document.createElement("div");
        e.classList.add("modal-button", "modal-svg-button");
        const i = SVGIconUtils.createSVGElement(t);
        return i.classList.add("modal-svg-button-icon"), e.appendChild(i), e;
    }
    close() {
        this._elementRef.classList.remove("show-modal"),
            this._elementRef.classList.add("hide-modal"),
            this._backgroundPanelRef.classList.remove("show-modal-background"),
            this._backgroundPanelRef.classList.add("hide-modal-background"),
            (this._isOpen = !1),
            setTimeout(() => {
                (this._elementRef.style.display = "none"),
                    (this._backgroundPanelRef.style.display = "none");
            }, t.MODAL_CLOSE_TIMEOUT_MS);
    }
    displayModalElements() {
        (this._elementRef.style.display = "flex"),
            this._elementRef.classList.remove("hide-modal"),
            this._elementRef.classList.add("show-modal"),
            (this._backgroundPanelRef.style.display = "block"),
            this._backgroundPanelRef.classList.remove("hide-modal-background"),
            this._backgroundPanelRef.classList.add("show-modal-background"),
            (this._isOpen = !0);
    }
    openTextModal(t) {
        (this._contentRef.innerHTML = t), this.displayModalElements();
    }
    addCloseButton(e, i, s) {
        const n = i ? t.createSVGButton(e) : t.createTextButton(e);
        return (
            this.addButtons(n),
            (n.onclick = () => {
                this.close(),
                    setTimeout(() => {
                        null == s || s();
                    }, 140);
            }),
            n
        );
    }
    static createTextModalFunc(e, i, s) {
        var n;
        if ("object" == typeof i && null != (n = i.files) && n.infoModal) {
            const n = new t(
                e,
                ["modal-content"],
                i.files.infoModal.containerStyle
            );
            return (
                n.addCloseButton("OK", !1, s),
                n.openTextModal.bind(n, i.infoModalTextMarkUp || "")
            );
        }
    }
    addWindowEvents() {
        window.addEventListener("keydown", (t) => {
            var e, i;
            this._isOpen &&
                (t.key === KEYBOARD_KEY.ESCAPE
                    ? (this.close(),
                      null == (e = this.extensionCloseCallback) || e.call(this))
                    : t.key === KEYBOARD_KEY.ENTER &&
                      (this.close(),
                      null == (i = this.extensionCloseCallback) ||
                          i.call(this)));
        });
    }
};
_Modal.MODAL_CLOSE_TIMEOUT_MS = 190;
let Modal = _Modal;
class UploadFileButton extends InputButton {
    constructor(t, e, i, s, n, o) {
        var r, a, l, c, u, h;
        super(
            UploadFileButton.createButtonElement(),
            null == (r = i.button) ? void 0 : r.position,
            i.button,
            o
        );
        const d = this.createInnerElements(s, n, this._customStyles);
        (this._inputElement = UploadFileButton.createInputElement(
            null == (a = null == i ? void 0 : i.files)
                ? void 0
                : a.acceptedFormats
        )),
            this.addClickEvent(t, i),
            this.elementRef.replaceChildren(d.styles),
            this.reapplyStateStyle("styles"),
            (this._fileAttachmentsType = e),
            (this._openModalOnce =
                !1 ===
                    (null == (c = null == (l = i.files) ? void 0 : l.infoModal)
                        ? void 0
                        : c.openModalOnce) ||
                null == (h = null == (u = i.files) ? void 0 : u.infoModal)
                    ? void 0
                    : h.openModalOnce);
    }
    createInnerElements(t, e, i) {
        const s = UploadFileButton.createSVGIconElement(t, e);
        return { styles: this.createInnerElement(s, "styles", i) };
    }
    triggerImportPrompt(t) {
        (t.onchange = this.import.bind(this, t)), t.click();
    }
    import(t) {
        FileAttachments.addFilesToType(Array.from(t.files || []), [
            this._fileAttachmentsType,
        ]),
            (t.value = "");
    }
    static createInputElement(t) {
        const e = document.createElement("input");
        return (
            (e.type = "file"),
            (e.accept = t || ""),
            (e.hidden = !0),
            (e.multiple = !0),
            e
        );
    }
    createInnerElement(t, e, i) {
        return (
            CustomButtonInnerElements.createSpecificStateElement(
                this.elementRef,
                e,
                i
            ) || t
        );
    }
    static createButtonElement() {
        const t = document.createElement("div");
        return t.classList.add("input-button", "upload-file-button"), t;
    }
    static createSVGIconElement(t, e) {
        const i = SVGIconUtils.createSVGElement(e);
        return (i.id = t), i;
    }
    addClickEvent(t, e) {
        const i = this.triggerImportPrompt.bind(this, this._inputElement),
            s = Modal.createTextModalFunc(t, e, i);
        this.elementRef.onclick = this.click.bind(this, s);
    }
    click(t) {
        !t || (void 0 !== this._openModalOnce && !0 !== this._openModalOnce)
            ? this.triggerImportPrompt(this._inputElement)
            : (t(), !0 === this._openModalOnce && (this._openModalOnce = !1));
    }
}
class DragAndDrop {
    static create(t, e, i) {
        const s = DragAndDrop.createElement(i);
        DragAndDrop.addEvents(s, t, e), t.appendChild(s);
    }
    static createElement(t) {
        const e = document.createElement("div");
        return (
            (e.id = "drag-and-drop"),
            "object" == typeof t && Object.assign(e.style, t),
            e
        );
    }
    static addEvents(t, e, i) {
        (e.ondragenter = (e) => {
            e.preventDefault(), DragAndDrop.display(t);
        }),
            (t.ondragleave = (e) => {
                e.preventDefault(), DragAndDrop.hide(t);
            }),
            (t.ondragover = (t) => {
                t.preventDefault();
            }),
            (t.ondrop = (e) => {
                e.preventDefault(),
                    DragAndDrop.uploadFile(i, e),
                    DragAndDrop.hide(t);
            });
    }
    static uploadFile(t, e) {
        var i;
        const s = null == (i = e.dataTransfer) ? void 0 : i.files;
        s && t.addFilesToAnyType(Array.from(s));
    }
    static display(t) {
        t.style.display = "block";
    }
    static hide(t) {
        t.style.display = "none";
    }
    static isEnabled(t, e) {
        return (void 0 === e || !1 !== e) && (!!e || t.getNumberOfTypes() > 0);
    }
}
const MICROPHONE_ICON_STRING =
    '<?xml version="1.0" encoding="iso-8859-1"?>\n<svg height="1.4em" width="1.4em" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\n\t viewBox="0 0 490.9 490.9" xml:space="preserve">\n\t<g>\n\t\t<g>\n\t\t\t<path d="M245.5,322.9c53,0,96.2-43.2,96.2-96.2V96.2c0-53-43.2-96.2-96.2-96.2s-96.2,43.2-96.2,96.2v130.5\n\t\t\t\tC149.3,279.8,192.5,322.9,245.5,322.9z M173.8,96.2c0-39.5,32.2-71.7,71.7-71.7s71.7,32.2,71.7,71.7v130.5\n\t\t\t\tc0,39.5-32.2,71.7-71.7,71.7s-71.7-32.2-71.7-71.7V96.2z"/>\n\t\t\t<path d="M94.4,214.5c-6.8,0-12.3,5.5-12.3,12.3c0,85.9,66.7,156.6,151.1,162.8v76.7h-63.9c-6.8,0-12.3,5.5-12.3,12.3\n\t\t\t\ts5.5,12.3,12.3,12.3h152.3c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-63.9v-76.7c84.4-6.3,151.1-76.9,151.1-162.8\n\t\t\t\tc0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3c0,76.6-62.3,138.9-138.9,138.9s-138.9-62.3-138.9-138.9\n\t\t\t\tC106.6,220,101.2,214.5,94.4,214.5z"/>\n\t\t</g>\n\t</g>\n</svg>\n';
class MicrophoneButton extends InputButton {
    constructor(t) {
        "dropup-menu" === (null == t ? void 0 : t.position) &&
            (t.position = "outside-right"),
            super(
                MicrophoneButton.createMicrophoneElement(),
                null == t ? void 0 : t.position,
                t
            ),
            (this.isActive = !1),
            (this._innerElements = this.createInnerElements(
                this._customStyles
            )),
            this.changeToDefault();
    }
    createInnerElements(t) {
        const e = MicrophoneButton.createSVGIconElement();
        return {
            default: this.createInnerElement(e, "default", t),
            active: this.createInnerElement(e, "active", t),
            unsupported: this.createInnerElement(e, "unsupported", t),
            commandMode: this.createInnerElement(e, "commandMode", t),
        };
    }
    createInnerElement(t, e, i) {
        return (
            CustomButtonInnerElements.createSpecificStateElement(
                this.elementRef,
                e,
                i
            ) || t
        );
    }
    static createMicrophoneElement() {
        const t = document.createElement("div");
        return (t.id = "microphone-button"), t.classList.add("input-button"), t;
    }
    static createSVGIconElement() {
        const t = SVGIconUtils.createSVGElement(MICROPHONE_ICON_STRING);
        return (t.id = "microphone-icon"), t;
    }
    changeToActive() {
        this.elementRef.replaceChildren(this._innerElements.active),
            this.toggleIconFilter("active"),
            this.reapplyStateStyle("active", ["default", "commandMode"]),
            (this.isActive = !0);
    }
    changeToDefault() {
        this.elementRef.replaceChildren(this._innerElements.default),
            this.toggleIconFilter("default"),
            this.reapplyStateStyle("default", ["active", "commandMode"]),
            (this.isActive = !1);
    }
    changeToCommandMode() {
        this.elementRef.replaceChildren(this._innerElements.unsupported),
            this.toggleIconFilter("command"),
            this.reapplyStateStyle("commandMode", ["active"]);
    }
    changeToUnsupported() {
        this.elementRef.replaceChildren(this._innerElements.unsupported),
            this.elementRef.classList.add("unsupported-microphone"),
            this.reapplyStateStyle("unsupported", ["active"]);
    }
    toggleIconFilter(t) {
        const e = this.elementRef.children[0];
        if ("svg" === e.tagName.toLocaleLowerCase())
            switch (t) {
                case "default":
                    e.classList.remove(
                        "active-microphone-icon",
                        "command-microphone-icon"
                    ),
                        e.classList.add("default-microphone-icon");
                    break;
                case "active":
                    e.classList.remove(
                        "default-microphone-icon",
                        "command-microphone-icon"
                    ),
                        e.classList.add("active-microphone-icon");
                    break;
                case "command":
                    e.classList.remove(
                        "active-microphone-icon",
                        "default-microphone-icon"
                    ),
                        e.classList.add("command-microphone-icon");
            }
    }
}
var dist = {},
    webSpeech = {},
    webSpeechTranscript = {},
    translate = {},
    text = {};
Object.defineProperty(text, "u", { value: !0 }), (text.Text = void 0);
class Text {
    static capitalize(t) {
        return t.replace(Text.FIRST_CHAR_REGEX, (t) => t.toUpperCase());
    }
    static lineBreak(t) {
        return t
            .replace(Text.DOUBLE_LINE, "<p></p>")
            .replace(Text.ONE_LINE, "<br>");
    }
    static isCharDefined(t) {
        return void 0 !== t && " " !== t && " " !== t && "\n" !== t && "" !== t;
    }
    static breakupIntoWordsArr(t) {
        return t.split(/(\W+)/);
    }
}
(text.Text = Text),
    (Text.FIRST_CHAR_REGEX = /\S/),
    (Text.DOUBLE_LINE = /\n\n/g),
    (Text.ONE_LINE = /\n/g),
    Object.defineProperty(translate, "u", { value: !0 }),
    (translate.Translate = void 0);
const text_1$3 = text;
class Translate {
    static translate(t, e) {
        const i = text_1$3.Text.breakupIntoWordsArr(t);
        for (let t = 0; t < i.length; t += 1) e[i[t]] && (i[t] = e[i[t]]);
        return i.join("");
    }
}
(translate.Translate = Translate),
    Object.defineProperty(webSpeechTranscript, "u", { value: !0 }),
    (webSpeechTranscript.WebSpeechTranscript = void 0);
const translate_1$1 = translate;
class WebSpeechTranscript {
    static extract(t, e, i) {
        let s = "";
        for (let n = t.resultIndex; n < t.results.length; ++n) {
            let o = t.results[n][0].transcript;
            i && (o = translate_1$1.Translate.translate(o, i)),
                t.results[n].isFinal ? (e += o) : (s += o);
        }
        return { interimTranscript: s, finalTranscript: e, newText: s || e };
    }
    static extractSafari(t, e, i) {
        let s = "";
        for (let e = t.resultIndex; e < t.results.length; ++e) {
            let n = t.results[e][0].transcript;
            i && (n = translate_1$1.Translate.translate(n, i)), (s += n);
        }
        return { interimTranscript: "", finalTranscript: s, newText: s };
    }
}
webSpeechTranscript.WebSpeechTranscript = WebSpeechTranscript;
var browser = {};
Object.defineProperty(browser, "u", { value: !0 }), (browser.Browser = void 0);
class Browser {}
(browser.Browser = Browser),
    (Browser.IS_SAFARI = () => (
        void 0 === Browser._IS_SAFARI &&
            (Browser._IS_SAFARI = /^((?!chrome|android).)*safari/i.test(
                navigator.userAgent
            )),
        Browser._IS_SAFARI
    ));
var speech = {},
    eventListeners = {};
Object.defineProperty(eventListeners, "u", { value: !0 }),
    (eventListeners.EventListeners = void 0);
class EventListeners {
    static getElementIfFocusedOnAvailable(t, e) {
        return Array.isArray(t) ? t.find((t) => e === t) : e === t ? t : void 0;
    }
    static keyDownWindow(t) {
        t.element &&
            EventListeners.getElementIfFocusedOnAvailable(
                t.element,
                document.activeElement
            ) &&
            (null !== EventListeners.KEY_DOWN_TIMEOUT &&
                clearTimeout(EventListeners.KEY_DOWN_TIMEOUT),
            (EventListeners.KEY_DOWN_TIMEOUT = setTimeout(() => {
                (EventListeners.KEY_DOWN_TIMEOUT = null),
                    this.resetRecording(t);
            }, 500)));
    }
    static mouseDownWindow(t, e) {
        this.mouseDownElement = EventListeners.getElementIfFocusedOnAvailable(
            t,
            e.target
        );
    }
    static mouseUpWindow(t) {
        this.mouseDownElement && this.resetRecording(t),
            (this.mouseDownElement = void 0);
    }
    static add(t, e) {
        const i =
            void 0 === (null == e ? void 0 : e.insertInCursorLocation) ||
            (null == e ? void 0 : e.insertInCursorLocation);
        null != e &&
            e.element &&
            i &&
            ((t.mouseDownEvent = EventListeners.mouseDownWindow.bind(
                t,
                e.element
            )),
            document.addEventListener("mousedown", t.mouseDownEvent),
            (t.mouseUpEvent = EventListeners.mouseUpWindow.bind(t, e)),
            document.addEventListener("mouseup", t.mouseUpEvent),
            (t.keyDownEvent = EventListeners.keyDownWindow.bind(t, e)),
            document.addEventListener("keydown", t.keyDownEvent));
    }
    static remove(t) {
        document.removeEventListener("mousedown", t.mouseDownEvent),
            document.removeEventListener("mouseup", t.mouseUpEvent),
            document.removeEventListener("keydown", t.keyDownEvent);
    }
}
(eventListeners.EventListeners = EventListeners),
    (EventListeners.KEY_DOWN_TIMEOUT = null);
var preResultUtils = {};
Object.defineProperty(preResultUtils, "u", { value: !0 }),
    (preResultUtils.PreResultUtils = void 0);
class PreResultUtils {
    static process(t, e, i, s, n) {
        const o = null == s ? void 0 : s(e, i);
        return (
            !!o &&
            (setTimeout(() => {
                o.restart ? t.resetRecording(n) : o.stop && t.stop();
            }),
            (o.stop || o.restart) && o.removeNewText)
        );
    }
}
preResultUtils.PreResultUtils = PreResultUtils;
var commandUtils = {},
    autoScroll = {};
Object.defineProperty(autoScroll, "u", { value: !0 }),
    (autoScroll.AutoScroll = void 0);
class AutoScroll {
    static changeStateIfNeeded(t, e) {
        e &&
            !t.isCursorAtEnd &&
            ((t.endPadding = ""), (t.scrollingSpan.innerHTML = "&nbsp;"));
    }
    static scrollGeneric(t, e) {
        t.isCursorAtEnd
            ? (e.scrollTop = e.scrollHeight)
            : t.scrollingSpan.scrollIntoView({ block: "nearest" });
    }
    static scrollSafariPrimitiveToEnd(t) {
        (t.scrollLeft = t.scrollWidth), (t.scrollTop = t.scrollHeight);
    }
    static isElementOverflown(t) {
        return t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth;
    }
    static isRequired(t, e) {
        return t && AutoScroll.isElementOverflown(e);
    }
}
autoScroll.AutoScroll = AutoScroll;
var elements = {};
Object.defineProperty(elements, "u", { value: !0 }),
    (elements.Elements = void 0);
class Elements {
    static isPrimitiveElement(t) {
        return "INPUT" === t.tagName || "TEXTAREA" === t.tagName;
    }
    static createInterimSpan() {
        const t = document.createElement("span");
        return (t.style.color = "grey"), (t.style.pointerEvents = "none"), t;
    }
    static createGenericSpan() {
        const t = document.createElement("span");
        return (t.style.pointerEvents = "none"), t;
    }
    static appendSpans(t, e) {
        if (
            ((t.spansPopulated = !0),
            t.insertInCursorLocation && document.activeElement === e)
        ) {
            const e = window.getSelection();
            if (null != e && e.focusNode) {
                const i = e.getRangeAt(0);
                return (
                    i.insertNode(t.scrollingSpan),
                    i.insertNode(t.interimSpan),
                    i.insertNode(t.finalSpan),
                    i.collapse(!1),
                    e.removeAllRanges(),
                    void e.addRange(i)
                );
            }
        }
        e.appendChild(t.finalSpan),
            e.appendChild(t.interimSpan),
            e.appendChild(t.scrollingSpan);
    }
    static applyCustomColors(t, e) {
        e.interim && (t.interimSpan.style.color = e.interim),
            e.final && (t.finalSpan.style.color = e.final);
    }
    static isInsideShadowDOM(t) {
        return t.getRootNode() instanceof ShadowRoot;
    }
}
elements.Elements = Elements;
var cursor = {};
Object.defineProperty(cursor, "u", { value: !0 }), (cursor.Cursor = void 0);
class Cursor {
    static setOffsetForGeneric(t, e, i = 0) {
        let s = 0;
        for (let n = 0; n < t.childNodes.length; n += 1) {
            const o = t.childNodes[n];
            if (o.childNodes.length > 0) {
                const t = Cursor.setOffsetForGeneric(o, e, i);
                if (-1 === t) return -1;
                i += t;
            } else if (null !== o.textContent) {
                if (i + o.textContent.length > e) {
                    const s = document.createRange();
                    s.setStart(o, e - i), s.collapse(!0);
                    const n = window.getSelection();
                    return (
                        null == n || n.removeAllRanges(),
                        null == n || n.addRange(s),
                        t.focus(),
                        -1
                    );
                }
                (i += o.textContent.length), (s += o.textContent.length);
            }
        }
        return s;
    }
    static focusEndOfGeneric(t) {
        const e = document.createRange();
        e.selectNodeContents(t), e.collapse(!1);
        const i = window.getSelection();
        i && (i.removeAllRanges(), i.addRange(e));
    }
    static setOffsetForSafariGeneric(t, e) {
        const i = window.getSelection();
        if (i) {
            const s = Cursor.getGenericElementCursorOffset(t, i, !0);
            console.log(s),
                setTimeout(() => {}, 100),
                Cursor.setOffsetForGeneric(t, s + e);
        }
    }
    static setOffsetForPrimitive(t, e, i) {
        i && t.blur(), t.setSelectionRange(e, e), t.focus();
    }
    static getGenericElementCursorOffset(t, e, i) {
        let s = 0;
        if (e.rangeCount > 0) {
            const n = e.getRangeAt(0),
                o = n.cloneRange();
            o.selectNodeContents(t),
                i
                    ? o.setEnd(n.startContainer, n.startOffset)
                    : o.setEnd(n.endContainer, n.endOffset),
                (s = o.toString().length);
        }
        return s;
    }
}
(cursor.Cursor = Cursor),
    Object.defineProperty(commandUtils, "u", { value: !0 }),
    (commandUtils.CommandUtils = void 0);
const autoScroll_1$1 = autoScroll,
    elements_1$3 = elements,
    browser_1$2 = browser,
    cursor_1$3 = cursor,
    text_1$2 = text;
class CommandUtils {
    static processCommand(t, e) {
        return (
            (!e || !e.caseSensitive) && (t = t.toLowerCase()),
            !1 === (null == e ? void 0 : e.substrings)
                ? text_1$2.Text.breakupIntoWordsArr(t)
                : t
        );
    }
    static process(t) {
        var e;
        return !0 ===
            (null === (e = t.settings) || void 0 === e
                ? void 0
                : e.caseSensitive)
            ? t
            : Object.keys(t).reduce((e, i) => {
                  const s = t[i];
                  return (
                      (e[i] =
                          "string" == typeof s
                              ? CommandUtils.processCommand(s, t.settings)
                              : s),
                      e
                  );
              }, {});
    }
    static toggleCommandModeOn(t) {
        var e;
        (t.isWaitingForCommand = !0),
            null === (e = t.onCommandModeTrigger) ||
                void 0 === e ||
                e.call(t, !0);
    }
    static toggleCommandModeOff(t) {
        var e;
        t.isWaitingForCommand &&
            (null === (e = t.onCommandModeTrigger) ||
                void 0 === e ||
                e.call(t, !1),
            (t.isWaitingForCommand = !1));
    }
    static setText(t, e, i, s) {
        CommandUtils.toggleCommandModeOff(t),
            elements_1$3.Elements.isPrimitiveElement(s)
                ? ((s.value = i),
                  t.isTargetInShadow ||
                      cursor_1$3.Cursor.setOffsetForPrimitive(s, i.length, !0),
                  browser_1$2.Browser.IS_SAFARI() &&
                      t.autoScroll &&
                      autoScroll_1$1.AutoScroll.scrollSafariPrimitiveToEnd(s))
                : ((s.textContent = i),
                  t.isTargetInShadow || cursor_1$3.Cursor.focusEndOfGeneric(s),
                  setTimeout(() =>
                      autoScroll_1$1.AutoScroll.scrollGeneric(t, s)
                  )),
            t.resetRecording(e);
    }
    static checkIfMatchesSubstring(t, e) {
        return e.includes(t);
    }
    static checkIfMatchesWord(t, e, i) {
        const s = t;
        for (let t = i.length - 1; t >= 0; t -= 1) {
            let e = t,
                n = s.length - 1;
            for (; i[e] === s[n] && n >= 0; ) (e -= 1), (n -= 1);
            if (n < 0) return !0;
        }
        return !1;
    }
    static execCommand(t, e, i, s, n) {
        var o, r, a;
        const l = t.commands;
        if (!l || !s || !i) return;
        const c =
                !0 ===
                (null === (o = l.settings) || void 0 === o
                    ? void 0
                    : o.caseSensitive)
                    ? e
                    : e.toLowerCase(),
            u = text_1$2.Text.breakupIntoWordsArr(c),
            h =
                !1 ===
                (null === (r = l.settings) || void 0 === r
                    ? void 0
                    : r.substrings)
                    ? CommandUtils.checkIfMatchesWord
                    : CommandUtils.checkIfMatchesSubstring;
        if (l.commandMode && h(l.commandMode, c, u))
            return (
                t.setInterimColorToFinal(),
                setTimeout(() => CommandUtils.toggleCommandModeOn(t)),
                { doNotProcessTranscription: !1 }
            );
        if (!l.commandMode || t.isWaitingForCommand) {
            if (l.stop && h(l.stop, c, u))
                return (
                    CommandUtils.toggleCommandModeOff(t),
                    setTimeout(() => t.stop()),
                    { doNotProcessTranscription: !1 }
                );
            if (l.pause && h(l.pause, c, u))
                return (
                    CommandUtils.toggleCommandModeOff(t),
                    t.setInterimColorToFinal(),
                    setTimeout(() => {
                        var e;
                        (t.isPaused = !0),
                            null === (e = t.onPauseTrigger) ||
                                void 0 === e ||
                                e.call(t, !0);
                    }),
                    { doNotProcessTranscription: !1 }
                );
            if (l.resume && h(l.resume, c, u))
                return (
                    (t.isPaused = !1),
                    null === (a = t.onPauseTrigger) ||
                        void 0 === a ||
                        a.call(t, !1),
                    CommandUtils.toggleCommandModeOff(t),
                    t.resetRecording(i),
                    { doNotProcessTranscription: !0 }
                );
            if (l.reset && h(l.reset, c, u))
                return (
                    void 0 !== n && CommandUtils.setText(t, i, n, s),
                    { doNotProcessTranscription: !0 }
                );
            if (l.removeAllText && h(l.removeAllText, c, u))
                return (
                    CommandUtils.setText(t, i, "", s),
                    { doNotProcessTranscription: !0 }
                );
        }
    }
}
commandUtils.CommandUtils = CommandUtils;
var highlight = {};
Object.defineProperty(highlight, "u", { value: !0 }),
    (highlight.Highlight = void 0);
const elements_1$2 = elements,
    cursor_1$2 = cursor;
class Highlight {
    static setStateForPrimitive(t, e) {
        let i, s;
        null !== e.selectionStart && (i = e.selectionStart),
            null !== e.selectionEnd && (s = e.selectionEnd),
            (t.isHighlighted = i !== s);
    }
    static setStateForGeneric(t, e) {
        const i = window.getSelection();
        if (null != i && i.focusNode) {
            const s = cursor_1$2.Cursor.getGenericElementCursorOffset(e, i, !0),
                n = cursor_1$2.Cursor.getGenericElementCursorOffset(e, i, !1);
            t.isHighlighted = s !== n;
        }
    }
    static setState(t, e) {
        document.activeElement === e &&
            (elements_1$2.Elements.isPrimitiveElement(e)
                ? Highlight.setStateForPrimitive(t, e)
                : Highlight.setStateForGeneric(t, e));
    }
    static removeForGeneric(t, e) {
        const i = window.getSelection();
        if (i) {
            const s = cursor_1$2.Cursor.getGenericElementCursorOffset(e, i, !0);
            i.deleteFromDocument(),
                cursor_1$2.Cursor.setOffsetForGeneric(e, s),
                (t.isHighlighted = !1);
        }
    }
    static removeForPrimitive(t, e) {
        const i = e.selectionStart,
            s = e.selectionEnd,
            n = e.value;
        if (i && s) {
            const o = n.substring(0, i) + n.substring(s);
            (e.value = o),
                cursor_1$2.Cursor.setOffsetForPrimitive(e, i, t.autoScroll);
        }
        t.isHighlighted = !1;
    }
}
highlight.Highlight = Highlight;
var padding = {};
Object.defineProperty(padding, "u", { value: !0 }), (padding.Padding = void 0);
const elements_1$1 = elements,
    cursor_1$1 = cursor,
    text_1$1 = text;
class Padding {
    static setStateForPrimitiveElement(t, e) {
        if (document.activeElement === e && null !== e.selectionStart) {
            const i = e.selectionStart,
                s = e.value[i - 1],
                n = null === e.selectionEnd ? i : e.selectionEnd,
                o = e.value[n];
            return (
                text_1$1.Text.isCharDefined(s) &&
                    ((t.startPadding = " "),
                    (t.numberOfSpacesBeforeNewText = 1)),
                text_1$1.Text.isCharDefined(o) &&
                    ((t.endPadding = " "), (t.numberOfSpacesAfterNewText = 1)),
                void (t.isCursorAtEnd = e.value.length === n)
            );
        }
        const i = e.value[e.value.length - 1];
        text_1$1.Text.isCharDefined(i) &&
            ((t.startPadding = " "), (t.numberOfSpacesBeforeNewText = 1)),
            (t.isCursorAtEnd = !0);
    }
    static setStateForGenericElement(t, e) {
        var i, s, n;
        if (document.activeElement === e) {
            const o = window.getSelection();
            if (null != o && o.focusNode) {
                const r = cursor_1$1.Cursor.getGenericElementCursorOffset(
                        e,
                        o,
                        !0
                    ),
                    a =
                        null === (i = e.textContent) || void 0 === i
                            ? void 0
                            : i[r - 1],
                    l = cursor_1$1.Cursor.getGenericElementCursorOffset(
                        e,
                        o,
                        !1
                    ),
                    c =
                        null === (s = e.textContent) || void 0 === s
                            ? void 0
                            : s[l];
                return (
                    text_1$1.Text.isCharDefined(a) && (t.startPadding = " "),
                    text_1$1.Text.isCharDefined(c) && (t.endPadding = " "),
                    void (t.isCursorAtEnd =
                        (null === (n = e.textContent) || void 0 === n
                            ? void 0
                            : n.length) === l)
                );
            }
        }
        const o = e.innerText.charAt(e.innerText.length - 1);
        text_1$1.Text.isCharDefined(o) && (t.startPadding = " "),
            (t.isCursorAtEnd = !0);
    }
    static setState(t, e) {
        elements_1$1.Elements.isPrimitiveElement(e)
            ? Padding.setStateForPrimitiveElement(t, e)
            : Padding.setStateForGenericElement(t, e);
    }
    static adjustStateAfterRecodingPrimitiveElement(t, e) {
        (t.primitiveTextRecorded = !0),
            t.insertInCursorLocation &&
            document.activeElement === e &&
            (null !== e.selectionEnd &&
                (t.endPadding = t.endPadding + e.value.slice(e.selectionEnd)),
            null !== e.selectionStart)
                ? (t.startPadding =
                      e.value.slice(0, e.selectionStart) + t.startPadding)
                : (t.startPadding = e.value + t.startPadding);
    }
    static adjustSateForNoTextPrimitiveElement(t) {
        1 === t.numberOfSpacesBeforeNewText &&
            ((t.startPadding = t.startPadding.substring(
                0,
                t.startPadding.length - 1
            )),
            (t.numberOfSpacesBeforeNewText = 0)),
            1 === t.numberOfSpacesAfterNewText &&
                ((t.endPadding = t.endPadding.substring(1)),
                (t.numberOfSpacesAfterNewText = 0));
    }
}
(padding.Padding = Padding),
    Object.defineProperty(speech, "u", { value: !0 }),
    (speech.Speech = void 0);
const eventListeners_1 = eventListeners,
    preResultUtils_1 = preResultUtils,
    commandUtils_1$1 = commandUtils,
    autoScroll_1 = autoScroll,
    highlight_1 = highlight,
    elements_1 = elements,
    padding_1 = padding,
    browser_1$1 = browser,
    cursor_1 = cursor,
    text_1 = text;
class Speech {
    constructor() {
        (this.finalTranscript = ""),
            (this.interimSpan = elements_1.Elements.createInterimSpan()),
            (this.finalSpan = elements_1.Elements.createGenericSpan()),
            (this.scrollingSpan = elements_1.Elements.createGenericSpan()),
            (this.isCursorAtEnd = !1),
            (this.spansPopulated = !1),
            (this.startPadding = ""),
            (this.endPadding = ""),
            (this.numberOfSpacesBeforeNewText = 0),
            (this.numberOfSpacesAfterNewText = 0),
            (this.isHighlighted = !1),
            (this.primitiveTextRecorded = !1),
            (this.recognizing = !1),
            (this._displayInterimResults = !0),
            (this.insertInCursorLocation = !0),
            (this.autoScroll = !0),
            (this.isRestarting = !1),
            (this.isPaused = !1),
            (this.isWaitingForCommand = !1),
            (this.isTargetInShadow = !1),
            (this.cannotBeStopped = !1),
            this.resetState();
    }
    prepareBeforeStart(t) {
        var e, i;
        if (null != t && t.element)
            if (
                (eventListeners_1.EventListeners.add(this, t),
                Array.isArray(t.element))
            ) {
                const e =
                    t.element.find((t) => t === document.activeElement) ||
                    t.element[0];
                if (!e) return;
                this.prepare(e);
            } else this.prepare(t.element);
        void 0 !== (null == t ? void 0 : t.displayInterimResults) &&
            (this._displayInterimResults = t.displayInterimResults),
            null != t &&
                t.textColor &&
                ((this._finalTextColor =
                    null === (e = null == t ? void 0 : t.textColor) ||
                    void 0 === e
                        ? void 0
                        : e.final),
                elements_1.Elements.applyCustomColors(this, t.textColor)),
            void 0 !== (null == t ? void 0 : t.insertInCursorLocation) &&
                (this.insertInCursorLocation = t.insertInCursorLocation),
            void 0 !== (null == t ? void 0 : t.autoScroll) &&
                (this.autoScroll = t.autoScroll),
            (this._onResult = null == t ? void 0 : t.onResult),
            (this._onPreResult = null == t ? void 0 : t.onPreResult),
            (this._onStart = null == t ? void 0 : t.onStart),
            (this._onStop = null == t ? void 0 : t.onStop),
            (this._onError = null == t ? void 0 : t.onError),
            (this.onCommandModeTrigger =
                null == t ? void 0 : t.onCommandModeTrigger),
            (this.onPauseTrigger = null == t ? void 0 : t.onPauseTrigger),
            (this._options = t),
            null !== (i = this._options) &&
                void 0 !== i &&
                i.commands &&
                (this.commands = commandUtils_1$1.CommandUtils.process(
                    this._options.commands
                ));
    }
    prepare(t) {
        padding_1.Padding.setState(this, t),
            highlight_1.Highlight.setState(this, t),
            (this.isTargetInShadow = elements_1.Elements.isInsideShadowDOM(t)),
            elements_1.Elements.isPrimitiveElement(t)
                ? ((this._primitiveElement = t),
                  (this._originalText = this._primitiveElement.value))
                : ((this._genericElement = t),
                  (this._originalText = this._genericElement.textContent));
    }
    resetRecording(t) {
        (this.isRestarting = !0),
            this.stop(!0),
            this.resetState(!0),
            this.start(t, !0);
    }
    updateElements(t, e, i) {
        var s;
        const n = text_1.Text.capitalize(e);
        if (this.finalTranscript === n && "" === t) return;
        preResultUtils_1.PreResultUtils.process(
            this,
            i,
            "" === t,
            this._onPreResult,
            this._options
        ) && ((t = ""), (i = ""));
        const o =
            this.commands &&
            commandUtils_1$1.CommandUtils.execCommand(
                this,
                i,
                this._options,
                this._primitiveElement || this._genericElement,
                this._originalText
            );
        if (o) {
            if (o.doNotProcessTranscription) return;
            (t = ""), (i = "");
        }
        if (this.isPaused || this.isWaitingForCommand) return;
        null === (s = this._onResult) ||
            void 0 === s ||
            s.call(this, i, "" === t),
            (this.finalTranscript = n),
            this._displayInterimResults || (t = "");
        const r = "" === this.finalTranscript && "" === t;
        this._primitiveElement
            ? this.updatePrimitiveElement(this._primitiveElement, t, r)
            : this._genericElement &&
              this.updateGenericElement(this._genericElement, t, r);
    }
    updatePrimitiveElement(t, e, i) {
        this.isHighlighted && highlight_1.Highlight.removeForPrimitive(this, t),
            this.primitiveTextRecorded ||
                padding_1.Padding.adjustStateAfterRecodingPrimitiveElement(
                    this,
                    t
                ),
            i && padding_1.Padding.adjustSateForNoTextPrimitiveElement(this);
        const s = this.startPadding + this.finalTranscript + e;
        if (((t.value = s + this.endPadding), !this.isTargetInShadow)) {
            const e = s.length + this.numberOfSpacesAfterNewText;
            cursor_1.Cursor.setOffsetForPrimitive(t, e, this.autoScroll);
        }
        this.autoScroll &&
            browser_1$1.Browser.IS_SAFARI() &&
            this.isCursorAtEnd &&
            autoScroll_1.AutoScroll.scrollSafariPrimitiveToEnd(t);
    }
    updateGenericElement(t, e, i) {
        this.isHighlighted && highlight_1.Highlight.removeForGeneric(this, t),
            this.spansPopulated || elements_1.Elements.appendSpans(this, t);
        const s =
            (i ? "" : this.startPadding) +
            text_1.Text.lineBreak(this.finalTranscript);
        this.finalSpan.innerHTML = s;
        const n = autoScroll_1.AutoScroll.isRequired(this.autoScroll, t);
        autoScroll_1.AutoScroll.changeStateIfNeeded(this, n);
        const o = text_1.Text.lineBreak(e) + (i ? "" : this.endPadding);
        (this.interimSpan.innerHTML = o),
            browser_1$1.Browser.IS_SAFARI() &&
                this.insertInCursorLocation &&
                cursor_1.Cursor.setOffsetForSafariGeneric(
                    t,
                    s.length + o.length
                ),
            n && autoScroll_1.AutoScroll.scrollGeneric(this, t),
            i && (this.scrollingSpan.innerHTML = "");
    }
    finalise(t) {
        this._genericElement &&
            (t
                ? ((this.finalSpan = elements_1.Elements.createGenericSpan()),
                  this.setInterimColorToFinal(),
                  (this.interimSpan = elements_1.Elements.createInterimSpan()),
                  (this.scrollingSpan =
                      elements_1.Elements.createGenericSpan()))
                : (this._genericElement.textContent =
                      this._genericElement.textContent),
            (this.spansPopulated = !1)),
            eventListeners_1.EventListeners.remove(this);
    }
    setInterimColorToFinal() {
        this.interimSpan.style.color = this._finalTextColor || "black";
    }
    resetState(t) {
        (this._primitiveElement = void 0),
            (this._genericElement = void 0),
            (this.finalTranscript = ""),
            (this.finalSpan.innerHTML = ""),
            (this.interimSpan.innerHTML = ""),
            (this.scrollingSpan.innerHTML = ""),
            (this.startPadding = ""),
            (this.endPadding = ""),
            (this.isHighlighted = !1),
            (this.primitiveTextRecorded = !1),
            (this.numberOfSpacesBeforeNewText = 0),
            (this.numberOfSpacesAfterNewText = 0),
            t || (this.stopTimeout = void 0);
    }
    setStateOnStart() {
        var t;
        (this.recognizing = !0),
            this.isRestarting
                ? (this.isRestarting = !1)
                : null === (t = this._onStart) || void 0 === t || t.call(this);
    }
    setStateOnStop() {
        var t;
        (this.recognizing = !1),
            this.isRestarting ||
                null === (t = this._onStop) ||
                void 0 === t ||
                t.call(this);
    }
    setStateOnError(t) {
        var e;
        null === (e = this._onError) || void 0 === e || e.call(this, t),
            (this.recognizing = !1);
    }
}
(speech.Speech = Speech),
    Object.defineProperty(webSpeech, "u", { value: !0 }),
    (webSpeech.WebSpeech = void 0);
const webSpeechTranscript_1 = webSpeechTranscript,
    browser_1 = browser,
    speech_1$1 = speech;
class WebSpeech extends speech_1$1.Speech {
    constructor() {
        super();
    }
    start(t) {
        var e;
        void 0 === this._extractText &&
            (this._extractText = browser_1.Browser.IS_SAFARI()
                ? webSpeechTranscript_1.WebSpeechTranscript.extractSafari
                : webSpeechTranscript_1.WebSpeechTranscript.extract),
            this.validate() &&
                (this.prepareBeforeStart(t),
                this.instantiateService(t),
                null === (e = this._service) || void 0 === e || e.start(),
                (this._translations = null == t ? void 0 : t.translations));
    }
    validate() {
        return (
            !!WebSpeech.getAPI() ||
            (this.error("Speech Recognition is unsupported"), !1)
        );
    }
    instantiateService(t) {
        var e, i;
        const s = WebSpeech.getAPI();
        (this._service = new s()),
            (this._service.continuous = !0),
            (this._service.interimResults =
                null === (e = null == t ? void 0 : t.displayInterimResults) ||
                void 0 === e ||
                e),
            (this._service.lang =
                (null === (i = null == t ? void 0 : t.language) || void 0 === i
                    ? void 0
                    : i.trim()) || "en-US"),
            this.setEvents();
    }
    setEvents() {
        this._service &&
            ((this._service.onstart = () => {
                this.setStateOnStart();
            }),
            (this._service.onerror = (t) => {
                (browser_1.Browser.IS_SAFARI() &&
                    "Another request is started" === t.message) ||
                    ("aborted" === t.error && this.isRestarting) ||
                    ("no-speech" !== t.error &&
                        this.error(t.message || t.error));
            }),
            (this._service.onaudioend = () => {
                this.setStateOnStop();
            }),
            (this._service.onend = () => {
                this._stopping = !1;
            }),
            (this._service.onresult = (t) => {
                if (typeof t.results > "u" && this._service)
                    (this._service.onend = null), this._service.stop();
                else if (this._extractText && !this._stopping) {
                    const {
                        interimTranscript: e,
                        finalTranscript: i,
                        newText: s,
                    } = this._extractText(
                        t,
                        this.finalTranscript,
                        this._translations
                    );
                    this.updateElements(e, i, s);
                }
            }));
    }
    stop(t) {
        var e;
        (this._stopping = !0),
            null === (e = this._service) || void 0 === e || e.stop(),
            this.finalise(t);
    }
    static getAPI() {
        return window.webkitSpeechRecognition || window.SpeechRecognition;
    }
    error(t) {
        console.error(t), this.setStateOnError(t), this.stop();
    }
}
webSpeech.WebSpeech = WebSpeech;
var globalState = {};
Object.defineProperty(globalState, "u", { value: !0 }),
    (globalState.GlobalState = void 0);
class GlobalState {
    static doubleClickDetector() {
        return (
            !!GlobalState.doubleClickPending ||
            ((GlobalState.doubleClickPending = !0),
            setTimeout(() => {
                GlobalState.doubleClickPending = !1;
            }, 300),
            !1)
        );
    }
}
(globalState.GlobalState = GlobalState), (GlobalState.doubleClickPending = !1);
var azure = {},
    preventConnectionStop = {};
Object.defineProperty(preventConnectionStop, "u", { value: !0 }),
    (preventConnectionStop.PreventConnectionStop = void 0);
class PreventConnectionStop {
    static applyPrevention(t) {
        clearTimeout(t._manualConnectionStopPrevention),
            (t.cannotBeStopped = !0),
            (t._manualConnectionStopPrevention = setTimeout(() => {
                t.cannotBeStopped = !1;
            }, 800));
    }
    static clearPrevention(t) {
        clearTimeout(t._manualConnectionStopPrevention),
            (t.cannotBeStopped = !1);
    }
}
preventConnectionStop.PreventConnectionStop = PreventConnectionStop;
var azureSpeechConfig = {},
    readme = {};
Object.defineProperty(readme, "u", { value: !0 }),
    (readme.README_URL = void 0),
    (readme.README_URL =
        "https://github.com/OvidijusParsiunas/speech-to-element"),
    Object.defineProperty(azureSpeechConfig, "u", { value: !0 }),
    (azureSpeechConfig.AzureSpeechConfig = void 0);
const readme_1 = readme;
class AzureSpeechConfig {
    static validateOptions(t, e) {
        return e
            ? e.subscriptionKey || e.token || e.retrieveToken
                ? !!e.region ||
                  (t(
                      `Please define a 'region' property - more info: ${readme_1.README_URL}`
                  ),
                  !1)
                : (t(
                      `Please define a 'subscriptionKey', 'token' or 'retrieveToken' property - more info: ${readme_1.README_URL}`
                  ),
                  !1)
            : (t(
                  `Please provide subscription details - more info: ${readme_1.README_URL}`
              ),
              !1);
    }
    static async getNewSpeechConfig(t, e) {
        if (e.region)
            return e.subscriptionKey
                ? t.fromSubscription(e.subscriptionKey.trim(), e.region.trim())
                : e.token
                ? t.fromAuthorizationToken(e.token.trim(), e.region.trim())
                : e.retrieveToken
                ? e
                      .retrieveToken()
                      .then((i) =>
                          e.region
                              ? t.fromAuthorizationToken(
                                    (null == i ? void 0 : i.trim()) || "",
                                    e.region.trim()
                                )
                              : null
                      )
                      .catch((t) => (console.error(t), null))
                : null;
    }
    static process(t, e) {
        e.language && (t.speechRecognitionLanguage = e.language.trim());
    }
    static async get(t, e) {
        const i = await AzureSpeechConfig.getNewSpeechConfig(t, e);
        return i && AzureSpeechConfig.process(i, e), i;
    }
}
azureSpeechConfig.AzureSpeechConfig = AzureSpeechConfig;
var stopTimeout = {};
Object.defineProperty(stopTimeout, "u", { value: !0 }),
    (stopTimeout.StopTimeout = void 0);
class StopTimeout {
    static set(t) {
        t.stopTimeout = setTimeout(() => t.stop(), t.stopTimeoutMS);
    }
    static reset(t, e) {
        (t.stopTimeoutMS = e || StopTimeout.DEFAULT_MS),
            t.stopTimeout && clearTimeout(t.stopTimeout),
            StopTimeout.set(t);
    }
}
(stopTimeout.StopTimeout = StopTimeout), (StopTimeout.DEFAULT_MS = 2e4);
var azureTranscript = {};
Object.defineProperty(azureTranscript, "u", { value: !0 }),
    (azureTranscript.AzureTranscript = void 0);
const translate_1 = translate;
class AzureTranscript {
    static extract(t, e, i, s) {
        return (
            s && (t = translate_1.Translate.translate(t, s)),
            i
                ? { interimTranscript: "", finalTranscript: e + t, newText: t }
                : { interimTranscript: t, finalTranscript: e, newText: t }
        );
    }
}
(azureTranscript.AzureTranscript = AzureTranscript),
    Object.defineProperty(azure, "u", { value: !0 }),
    (azure.Azure = void 0);
const preventConnectionStop_1 = preventConnectionStop,
    azureSpeechConfig_1 = azureSpeechConfig,
    stopTimeout_1 = stopTimeout,
    azureTranscript_1 = azureTranscript,
    speech_1 = speech;
class Azure extends speech_1.Speech {
    constructor() {
        super(...arguments), (this._newTextPadding = "");
    }
    start(t, e) {
        (this._newTextPadding = ""),
            void 0 === this.stopTimeout &&
                stopTimeout_1.StopTimeout.reset(
                    this,
                    null == t ? void 0 : t.stopAfterSilenceMs
                ),
            this.prepareBeforeStart(t),
            this.startAsync(t),
            e ||
                preventConnectionStop_1.PreventConnectionStop.applyPrevention(
                    this
                );
    }
    async startAsync(t) {
        var e;
        this.validate(t) &&
            (await this.instantiateService(t),
            (this._translations = null == t ? void 0 : t.translations),
            null === (e = this._service) ||
                void 0 === e ||
                e.startContinuousRecognitionAsync(() => {}, this.error));
    }
    validate(t) {
        return Azure.getAPI()
            ? azureSpeechConfig_1.AzureSpeechConfig.validateOptions(
                  this.error.bind(this),
                  t
              )
            : (this.moduleNotFound(), !1);
    }
    async instantiateService(t) {
        const e = Azure.getAPI(),
            i = e.AudioConfig.fromDefaultMicrophoneInput(),
            s = await azureSpeechConfig_1.AzureSpeechConfig.get(
                e.SpeechConfig,
                t
            );
        if (s) {
            const n = new e.SpeechRecognizer(s, i);
            this.setEvents(n),
                (this._service = n),
                t.retrieveToken && this.retrieveTokenInterval(t.retrieveToken);
        } else this.error("Unable to contact Azure server");
    }
    setEvents(t) {
        (t.recognizing = this.onRecognizing.bind(this)),
            (t.recognized = this.onRecognized.bind(this)),
            (t.sessionStarted = this.onSessionStarted.bind(this)),
            (t.canceled = this.onCanceled.bind(this)),
            (t.sessionStopped = this.onSessionStopped.bind(this));
    }
    onRecognizing(t, e) {
        if (this._stopping) return;
        const {
            interimTranscript: i,
            finalTranscript: s,
            newText: n,
        } = azureTranscript_1.AzureTranscript.extract(
            this._newTextPadding + e.result.text,
            this.finalTranscript,
            !1,
            this._translations
        );
        stopTimeout_1.StopTimeout.reset(this, this.stopTimeoutMS),
            this.updateElements(i, s, n);
    }
    onRecognized(t, e) {
        const i = e.result;
        switch (i.reason) {
            case window.SpeechSDK.ResultReason.Canceled:
                break;
            case window.SpeechSDK.ResultReason.RecognizedSpeech:
                if (i.text && !this._stopping) {
                    const {
                        interimTranscript: t,
                        finalTranscript: e,
                        newText: s,
                    } = azureTranscript_1.AzureTranscript.extract(
                        this._newTextPadding + i.text,
                        this.finalTranscript,
                        !0,
                        this._translations
                    );
                    stopTimeout_1.StopTimeout.reset(this, this.stopTimeoutMS),
                        this.updateElements(t, e, s),
                        "" !== e && (this._newTextPadding = " ");
                }
        }
    }
    onCanceled(t, e) {
        e.reason === window.SpeechSDK.CancellationReason.Error &&
            this.error(e.errorDetails);
    }
    onSessionStarted() {
        preventConnectionStop_1.PreventConnectionStop.clearPrevention(this),
            this.setStateOnStart();
    }
    onSessionStopped() {
        this._retrieveTokenInterval ||
            clearInterval(this._retrieveTokenInterval),
            (this._stopping = !1),
            this.setStateOnStop();
    }
    retrieveTokenInterval(t) {
        this._retrieveTokenInterval = setInterval(() => {
            null == t ||
                t()
                    .then((t) => {
                        this._service &&
                            (this._service.authorizationToken =
                                (null == t ? void 0 : t.trim()) || "");
                    })
                    .catch((t) => {
                        this.error(t);
                    });
        }, 1e4);
    }
    stop(t) {
        var e;
        !t &&
            this._retrieveTokenInterval &&
            clearInterval(this._retrieveTokenInterval),
            (this._stopping = !0),
            null === (e = this._service) ||
                void 0 === e ||
                e.stopContinuousRecognitionAsync(),
            this.finalise(t);
    }
    static getAPI() {
        return window.SpeechSDK;
    }
    moduleNotFound() {
        console.error("speech recognition module not found:"),
            console.error(
                "please install the 'microsoft-cognitiveservices-speech-sdk' npm package or add a script tag: <script src=\"https://aka.ms/csspeech/jsbrowserpackageraw\"></script>"
            ),
            this.setStateOnError("speech recognition module not found");
    }
    error(t) {
        this._retrieveTokenInterval &&
            clearInterval(this._retrieveTokenInterval),
            console.error(t),
            this.setStateOnError(t),
            this.stop();
    }
}
(azure.Azure = Azure), Object.defineProperty(dist, "u", { value: !0 });
const webSpeech_1 = webSpeech,
    commandUtils_1 = commandUtils,
    globalState_1 = globalState,
    azure_1 = azure;
class SpeechToElement {
    static toggle(t, e) {
        var i, s;
        const n = t.toLocaleLowerCase().trim();
        null !== (i = globalState_1.GlobalState.service) &&
        void 0 !== i &&
        i.recognizing
            ? this.stop()
            : "webspeech" === n
            ? SpeechToElement.startWebSpeech(e)
            : "azure" === n
            ? SpeechToElement.startAzure(e)
            : (console.error(
                  "service not found - must be either 'webspeech' or 'azure'"
              ),
              null === (s = null == e ? void 0 : e.onError) ||
                  void 0 === s ||
                  s.call(
                      e,
                      "service not found - must be either 'webspeech' or 'azure'"
                  ));
    }
    static startWebSpeech(t) {
        SpeechToElement.stop() ||
            ((globalState_1.GlobalState.service = new webSpeech_1.WebSpeech()),
            globalState_1.GlobalState.service.start(t));
    }
    static isWebSpeechSupported() {
        return !!webSpeech_1.WebSpeech.getAPI();
    }
    static startAzure(t) {
        var e;
        SpeechToElement.stop() ||
            (null !== (e = globalState_1.GlobalState.service) &&
                void 0 !== e &&
                e.cannotBeStopped) ||
            ((globalState_1.GlobalState.service = new azure_1.Azure()),
            globalState_1.GlobalState.service.start(t));
    }
    static stop() {
        var t;
        return (
            !!globalState_1.GlobalState.doubleClickDetector() ||
            (!(
                null === (t = globalState_1.GlobalState.service) || void 0 === t
            ) &&
                t.recognizing &&
                globalState_1.GlobalState.service.stop(),
            !1)
        );
    }
    static endCommandMode() {
        globalState_1.GlobalState.service &&
            commandUtils_1.CommandUtils.toggleCommandModeOff(
                globalState_1.GlobalState.service
            );
    }
}
var _default = (dist.default = SpeechToElement);
class SpeechToText extends MicrophoneButton {
    constructor(t, e, i) {
        var s;
        super(
            "object" == typeof t.speechToText
                ? null == (s = t.speechToText)
                    ? void 0
                    : s.button
                : {}
        );
        const { serviceName: n, processedConfig: o } =
            SpeechToText.processConfiguration(e, t.speechToText);
        if (
            ((this._addErrorMessage = i),
            "webspeech" !== n || _default.isWebSpeechSupported())
        ) {
            const i = !t.textInput || !t.textInput.disabled;
            this.elementRef.onclick = this.buttonClick.bind(this, e, i, n, o);
        } else this.changeToUnsupported();
    }
    static processConfiguration(t, e) {
        var i;
        const s = "object" == typeof e ? e : {},
            n = "object" == typeof s.webSpeech ? s.webSpeech : {},
            o = s.azure || {},
            r = {
                displayInterimResults: s.displayInterimResults ?? void 0,
                textColor: s.textColor ?? void 0,
                translations: s.translations ?? void 0,
                commands: s.commands ?? void 0,
                ...n,
                ...o,
            },
            a = null == (i = s.commands) ? void 0 : i.submit;
        return (
            a &&
                (r.onPreResult = (e) =>
                    e.toLowerCase().includes(a)
                        ? (setTimeout(() => {
                              var e;
                              return null == (e = t.submit)
                                  ? void 0
                                  : e.call(t);
                          }),
                          _default.endCommandMode(),
                          { restart: !0, removeNewText: !0 })
                        : null),
            { serviceName: SpeechToText.getServiceName(s), processedConfig: r }
        );
    }
    static getServiceName(t) {
        return t.webSpeech ? "webspeech" : t.azure ? "azure" : "webspeech";
    }
    buttonClick(t, e, i, s) {
        t.removeTextIfPlaceholder(),
            _default.toggle(i, {
                insertInCursorLocation: !1,
                element: e ? t.inputElementRef : void 0,
                onError: this.onError.bind(this),
                onStart: this.changeToActive.bind(this),
                onStop: this.changeToDefault.bind(this),
                onCommandModeTrigger: this.onCommandModeTrigger.bind(this),
                ...s,
            });
    }
    onCommandModeTrigger(t) {
        t ? this.changeToCommandMode() : this.changeToActive();
    }
    onError() {
        this._addErrorMessage("speechToText", "speech input error");
    }
}
class NewFileName {
    static getFileName(t, e) {
        const i = new Date();
        return `${t}-${String(i.getHours()).padStart(2, "0")}-${String(
            i.getMinutes()
        ).padStart(2, "0")}-${String(i.getSeconds()).padStart(2, "0")}.${e}`;
    }
}
class RecordAudio extends MicrophoneButton {
    constructor(t, e) {
        var i, s;
        super(e.button),
            (this._waitingForBrowserApproval = !1),
            (this._audioType = t),
            (this._extension =
                (null == (i = e.files) ? void 0 : i.format) || "mp3"),
            (this._maxDurationSeconds =
                null == (s = e.files) ? void 0 : s.maxDurationSeconds),
            (this.elementRef.onclick = this.buttonClick.bind(this));
    }
    buttonClick() {
        this._waitingForBrowserApproval ||
            (this.isActive
                ? this.stop()
                : ((this._waitingForBrowserApproval = !0), this.record()));
    }
    stop() {
        return new Promise((t) => {
            var e, i;
            this.changeToDefault(),
                null == (e = this._mediaRecorder) || e.stop(),
                null == (i = this._mediaStream) ||
                    i.getTracks().forEach((t) => t.stop()),
                setTimeout(() => {
                    t();
                }, 10);
        });
    }
    record() {
        navigator.mediaDevices
            .getUserMedia({ audio: !0 })
            .then((t) => {
                this.changeToActive(),
                    (this._mediaRecorder = new MediaRecorder(t)),
                    this._audioType.addPlaceholderAttachment(
                        this.stop.bind(this),
                        this._maxDurationSeconds
                    ),
                    (this._mediaStream = t),
                    this._mediaRecorder.addEventListener(
                        "dataavailable",
                        (t) => {
                            this.createFile(t);
                        }
                    ),
                    this._mediaRecorder.start();
            })
            .catch((t) => {
                console.error(t), this.stop();
            })
            .finally(() => {
                this._waitingForBrowserApproval = !1;
            });
    }
    createFile(t) {
        const e = new Blob([t.data], { type: `audio/${this._extension}` }),
            i = NewFileName.getFileName(
                this._newFilePrefix || "audio",
                this._extension
            ),
            s = new File([e], i, { type: e.type }),
            n = new FileReader();
        n.readAsDataURL(s),
            (n.onload = (t) => {
                this._audioType.completePlaceholderAttachment(
                    s,
                    t.target.result
                );
            });
    }
}
const SUBMIT_ICON_STRING =
    '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\n<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="1" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">\n  <line x1="22" y1="2" x2="11" y2="14"></line>\n  <polygon points="22 2 15 22 11 14 2 10 22 2"></polygon>\n</svg>\n';
class SubmitButtonStateStyle {
    static resetSubmit(t, e) {
        e
            ? t.unsetCustomStateStyles(["loading", "submit"])
            : t.unsetCustomStateStyles(["stop", "loading", "submit"]),
            t.reapplyStateStyle("submit");
    }
}
class SubmitButton extends InputButton {
    constructor(t, e, i, s, n) {
        var o;
        super(
            SubmitButton.createButtonContainerElement(),
            null == (o = t.submitButtonStyles) ? void 0 : o.position,
            t.submitButtonStyles
        ),
            (this._isRequestInProgress = !1),
            (this._isLoadingActive = !1),
            (this._isSVGLoadingIconOverriden = !1),
            (this._messages = i),
            (this._inputElementRef = e),
            (this._fileAttachments = n),
            (this._innerElements = this.createInnerElements()),
            (this._abortStream = new AbortController()),
            (this._stopClicked = { listener: () => {} }),
            (this._serviceIO = s),
            this.attemptOverwriteLoadingStyle(t),
            this.changeToSubmitIcon(),
            this.assignHandlers();
    }
    createInnerElements() {
        const {
            submit: t,
            loading: e,
            stop: i,
        } = CustomButtonInnerElements.create(
            this.elementRef,
            ["submit", "loading", "stop"],
            this._customStyles
        );
        return {
            submit: t || SubmitButton.createSubmitIconElement(),
            loading: e || SubmitButton.createLoadingIconElement(),
            stop: i || SubmitButton.createStopIconElement(),
        };
    }
    static createButtonContainerElement() {
        const t = document.createElement("div");
        return t.classList.add("input-button"), t;
    }
    static createSubmitIconElement() {
        const t = SVGIconUtils.createSVGElement(SUBMIT_ICON_STRING);
        return (t.id = "submit-icon"), t;
    }
    static createLoadingIconElement() {
        const t = document.createElement("div");
        return t.classList.add("dots-jumping"), t;
    }
    static createStopIconElement() {
        const t = document.createElement("div");
        return (t.id = "stop-icon"), t;
    }
    attemptOverwriteLoadingStyle(t) {
        var e, i, s, n, o, r, a, l, c;
        if (
            !(
                (null !=
                    (i =
                        null == (e = this._customStyles) ? void 0 : e.submit) &&
                    i.svg) ||
                (null !=
                    (o =
                        null ==
                        (n =
                            null == (s = this._customStyles)
                                ? void 0
                                : s.loading)
                            ? void 0
                            : n.svg) &&
                    o.content) ||
                (null !=
                    (l =
                        null ==
                        (a =
                            null == (r = this._customStyles)
                                ? void 0
                                : r.loading)
                            ? void 0
                            : a.text) &&
                    l.content) ||
                (void 0 !== t.displayLoadingBubble &&
                    !0 !== t.displayLoadingBubble)
            )
        ) {
            const e = document.createElement("style");
            (e.textContent =
                "\n        .loading-button > * {\n          filter: brightness(0) saturate(100%) invert(72%) sepia(0%) saturate(3044%) hue-rotate(322deg) brightness(100%)\n            contrast(96%) !important;\n        }"),
                null == (c = t.shadowRoot) || c.appendChild(e),
                (this._isSVGLoadingIconOverriden = !0);
        }
    }
    assignHandlers() {
        (this._serviceIO.completionsHandlers = {
            onFinish: this.changeToSubmitIcon.bind(this),
        }),
            (this._serviceIO.streamHandlers = {
                onOpen: this.changeToStopIcon.bind(this),
                onClose: this.changeToSubmitIcon.bind(this),
                abortStream: this._abortStream,
                stopClicked: this._stopClicked,
            });
        const { stream: t } = this._serviceIO.deepChat;
        "object" == typeof t &&
            "number" == typeof t.simulation &&
            (this._serviceIO.streamHandlers.simulationInterim = t.simulation);
    }
    submitFromInput() {
        var t;
        if (this._inputElementRef.classList.contains("text-input-placeholder"))
            this.submit(!1, "");
        else {
            const e =
                null == (t = this._inputElementRef.textContent)
                    ? void 0
                    : t.trim();
            this.submit(!1, e);
        }
    }
    async submit(t, e) {
        var i, s;
        let n, o;
        t ||
            (await this._fileAttachments.completePlaceholders(),
            (n = this._fileAttachments.getAllFileData()),
            (o = null == n ? void 0 : n.map((t) => t.file)));
        const r = "" === e ? void 0 : e;
        if (
            this._isRequestInProgress ||
            !Websocket.canSendMessage(this._serviceIO.websocket)
        )
            return;
        if (
            null != (i = this._serviceIO.deepChat) &&
            i.validateMessageBeforeSending
        ) {
            if (!this._serviceIO.deepChat.validateMessageBeforeSending(r, o))
                return;
        } else if (!this._serviceIO.canSendMessage(r, o)) return;
        this.changeToLoadingIcon(),
            await this.addNewMessages(e, n),
            this._messages.addLoadingMessage(),
            t || TextInputEl.clear(this._inputElementRef);
        const a = { text: r, files: o };
        await this._serviceIO.callAPI(a, this._messages),
            t || null == (s = this._fileAttachments) || s.removeAllFiles();
    }
    async addNewMessages(t, e) {
        const i = {};
        "" !== t && (i.text = t),
            e && (i.files = await this._messages.addMultipleFiles(e)),
            Object.keys(i).length > 0 && this._messages.addNewMessage(i, !1);
    }
    stopStream() {
        var t;
        this._abortStream.abort(),
            null == (t = this._stopClicked) || t.listener(),
            this.changeToSubmitIcon();
    }
    changeToStopIcon() {
        this.elementRef.classList.remove("loading-button"),
            this.elementRef.replaceChildren(this._innerElements.stop),
            this.reapplyStateStyle("stop", ["loading", "submit"]),
            (this.elementRef.onclick = this.stopStream.bind(this)),
            (this._isLoadingActive = !1);
    }
    changeToLoadingIcon() {
        this._serviceIO.websocket ||
            (this._isSVGLoadingIconOverriden ||
                this.elementRef.replaceChildren(this._innerElements.loading),
            this.elementRef.classList.add("loading-button"),
            this.reapplyStateStyle("loading", ["submit"]),
            (this.elementRef.onclick = () => {}),
            (this._isRequestInProgress = !0),
            (this._isLoadingActive = !0));
    }
    changeToSubmitIcon() {
        this.elementRef.classList.remove("loading-button"),
            this.elementRef.replaceChildren(this._innerElements.submit),
            SubmitButtonStateStyle.resetSubmit(this, this._isLoadingActive),
            (this.elementRef.onclick = this.submitFromInput.bind(this)),
            (this._isRequestInProgress = !1),
            (this._isLoadingActive = !1);
    }
}
const REFRESH_ICON_STRING =
        '<?xml version="1.0" encoding="utf-8"?>\n<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">\n  <path d="M27.1 14.313V5.396L24.158 8.34c-2.33-2.325-5.033-3.503-8.11-3.503C9.902 4.837 4.901 9.847 4.899 16c.001 6.152 5.003 11.158 11.15 11.16 4.276 0 9.369-2.227 10.836-8.478l.028-.122h-3.23l-.022.068c-1.078 3.242-4.138 5.421-7.613 5.421a8 8 0 0 1-5.691-2.359A7.993 7.993 0 0 1 8 16.001c0-4.438 3.611-8.049 8.05-8.049 2.069 0 3.638.58 5.924 2.573l-3.792 3.789H27.1z"/>\n</svg>\n',
    CAPTURE_ICON_STRING =
        '<?xml version="1.0" encoding="utf-8"?>\n<svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n  <title>capture</title>\n  <path d="M0 16q0 3.264 1.28 6.208t3.392 5.12 5.12 3.424 6.208 1.248 6.208-1.248 5.12-3.424 3.392-5.12 1.28-6.208-1.28-6.208-3.392-5.12-5.088-3.392-6.24-1.28q-3.264 0-6.208 1.28t-5.12 3.392-3.392 5.12-1.28 6.208zM4 16q0-3.264 1.6-6.016t4.384-4.352 6.016-1.632 6.016 1.632 4.384 4.352 1.6 6.016-1.6 6.048-4.384 4.352-6.016 1.6-6.016-1.6-4.384-4.352-1.6-6.048z"></path>\n</svg>\n',
    CLOSE_ICON_STRING =
        '<?xml version="1.0" encoding="utf-8"?>\n<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">\n  <path d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/>\n</svg>',
    TICK_ICON_STRING =
        '<?xml version="1.0" encoding="utf-8"?>\n<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>';
class CameraModal extends Modal {
    constructor(t, e, i, s) {
        super(t, ["modal-content", "modal-camera-content"], i),
            (this._stopped = !1),
            (this._format = "image/png"),
            (this._canvas = document.createElement("canvas")),
            this._canvas.classList.add("camera-modal-canvas");
        const { captureButton: n, submitButton: o } =
            this.addButtonsAndTheirEvents(e);
        (this._captureButton = n),
            (this._submitButton = o),
            (this._captureIcon = this._captureButton.children[0]),
            (this._refreshIcon =
                SVGIconUtils.createSVGElement(REFRESH_ICON_STRING)),
            this._refreshIcon.classList.add(
                "modal-svg-button-icon",
                "modal-svg-refresh-icon"
            ),
            "jpeg" === (null == s ? void 0 : s.format) &&
                (this._format = "image/jpeg"),
            null != s && s.dimensions && (this._dimensions = s.dimensions),
            this._contentRef.appendChild(this._canvas),
            (this.extensionCloseCallback = this.stop);
    }
    addButtonsAndTheirEvents(t) {
        const e = Modal.createSVGButton(CAPTURE_ICON_STRING);
        e.classList.add("modal-svg-camera-button"),
            e.children[0].classList.add("modal-svg-camera-icon");
        const i = this.addCloseButton(CLOSE_ICON_STRING, !0);
        i.classList.add("modal-svg-close-button"),
            i.children[0].classList.add("modal-svg-close-icon");
        const s = Modal.createSVGButton(TICK_ICON_STRING);
        return (
            s.classList.add("modal-svg-submit-button"),
            this.addButtons(e, s),
            this.addButtonEvents(e, i, s, t),
            { captureButton: e, submitButton: s }
        );
    }
    addButtonEvents(t, e, i, s) {
        (t.onclick = () => {
            this.capture();
        }),
            e.addEventListener("click", this.stop.bind(this)),
            (i.onclick = () => {
                const t = this.getFile();
                t && FileAttachments.addFilesToType([t], [s]),
                    this.stop(),
                    this.close();
            });
    }
    stop() {
        this._mediaStream &&
            this._mediaStream.getTracks().forEach((t) => t.stop()),
            (this._stopped = !0),
            setTimeout(() => {
                this._captureButton.replaceChildren(this._captureIcon),
                    this._captureButton.classList.replace(
                        "modal-svg-refresh-button",
                        "modal-svg-camera-button"
                    );
                const t = this._canvas.getContext("2d");
                null == t ||
                    t.clearRect(0, 0, this._canvas.width, this._canvas.height);
            }, Modal.MODAL_CLOSE_TIMEOUT_MS);
    }
    start() {
        (this._dataURL = void 0),
            this._submitButton.classList.add("modal-svg-submit-disabled"),
            (this._stopped = !1),
            navigator.mediaDevices
                .getUserMedia({ video: this._dimensions || !0 })
                .then((t) => {
                    if (((this._mediaStream = t), !this.isOpen()))
                        return this.stop();
                    const e = document.createElement("video");
                    (e.srcObject = t),
                        e.play(),
                        requestAnimationFrame(
                            this.updateCanvas.bind(this, e, this._canvas)
                        );
                })
                .catch((t) => {
                    console.error(t), this.stop(), this.close();
                });
    }
    capture() {
        this._dataURL
            ? (this._captureButton.replaceChildren(this._captureIcon),
              this._captureButton.classList.replace(
                  "modal-svg-refresh-button",
                  "modal-svg-camera-button"
              ),
              this._submitButton.classList.add("modal-svg-submit-disabled"),
              (this._dataURL = void 0))
            : (this._captureButton.replaceChildren(this._refreshIcon),
              this._captureButton.classList.replace(
                  "modal-svg-camera-button",
                  "modal-svg-refresh-button"
              ),
              this._submitButton.classList.remove("modal-svg-submit-disabled"),
              (this._dataURL = this._canvas.toDataURL()));
    }
    getFile() {
        if (this._dataURL) {
            const t = atob(this._dataURL.split(",")[1]),
                e = new Array(t.length);
            for (let i = 0; i < t.length; i++) e[i] = t.charCodeAt(i);
            const i = new Uint8Array(e),
                s = new Blob([i], { type: this._format }),
                n = "image/jpeg" === this._format ? "jpeg" : "png",
                o = NewFileName.getFileName(this._newFilePrefix || "photo", n);
            return new File([s], o, { type: s.type });
        }
    }
    updateCanvas(t, e) {
        if (!this._stopped) {
            if (!this._dataURL) {
                (e.width = t.videoWidth), (e.height = t.videoHeight);
                const i = e.getContext("2d");
                null == i || i.drawImage(t, 0, 0, e.width, e.height);
            }
            requestAnimationFrame(this.updateCanvas.bind(this, t, e));
        }
    }
    openCameraModal(t) {
        this.displayModalElements(), t.start();
    }
    static createCameraModalFunc(t, e, i, s) {
        const n = new CameraModal(t, e, i, s);
        return n.openCameraModal.bind(n, n);
    }
}
const CAMERA_ICON_STRING =
    '<?xml version="1.0" encoding="utf-8"?>\n<svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n  <path d="M29 7h-4.599l-2.401-4h-12l-2.4 4h-4.6c-1 0-3 1-3 2.969v16.031c0 1.657 1.5 3 2.792 3h26.271c1.313 0 2.938-1.406 2.938-2.968v-16.032c0-1-1-3-3-3zM30 26.032c0 0.395-0.639 0.947-0.937 0.969h-26.265c-0.232-0.019-0.797-0.47-0.797-1v-16.031c0-0.634 0.851-0.953 1-0.969h5.732l2.4-4h9.802l1.785 3.030 0.55 0.97h5.731c0.705 0 0.99 0.921 1 1v16.032zM16 10c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zM16 22c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>\n</svg>';
class CameraButton extends InputButton {
    constructor(t, e, i) {
        var s;
        super(
            CameraButton.createButtonElement(),
            null == (s = null == i ? void 0 : i.button) ? void 0 : s.position,
            (null == i ? void 0 : i.button) || {},
            "Photo"
        );
        const n = this.createInnerElements(this._customStyles);
        i && this.addClickEvent(t, e, i.modalContainerStyle, i.files),
            this.elementRef.classList.add("upload-file-button"),
            this.elementRef.appendChild(n.styles),
            this.reapplyStateStyle("styles");
    }
    createInnerElements(t) {
        return {
            styles: this.createInnerElement(
                CameraButton.createSVGIconElement(),
                "styles",
                t
            ),
        };
    }
    createInnerElement(t, e, i) {
        return (
            CustomButtonInnerElements.createSpecificStateElement(
                this.elementRef,
                e,
                i
            ) || t
        );
    }
    static createButtonElement() {
        const t = document.createElement("div");
        return t.classList.add("input-button"), t;
    }
    static createSVGIconElement() {
        const t = SVGIconUtils.createSVGElement(CAMERA_ICON_STRING);
        return (t.id = "camera-icon"), t;
    }
    addClickEvent(t, e, i, s) {
        const n = CameraModal.createCameraModalFunc(t, e, i, s);
        this.elementRef.onclick = n;
    }
}
class Input {
    constructor(t, e, i, s) {
        this.elementRef = Input.createPanelElement(t.inputAreaStyle);
        const n = new TextInputEl(i, t.textInput),
            o = {},
            r = this.createFileUploadComponents(t, i, s, o);
        t.speechToText &&
            !o.microphone &&
            (o.microphone = {
                button: new SpeechToText(t, n, e.addNewErrorMessage.bind(e)),
            });
        const a = new SubmitButton(t, n.inputElementRef, e, i, r);
        (n.submit = a.submitFromInput.bind(a)),
            (t.submitUserMessage = a.submit.bind(a, !0)),
            (o.submit = { button: a }),
            Input.addElements(this.elementRef, n, o, s, r, t.dropupStyles);
    }
    static createPanelElement(t) {
        const e = document.createElement("div");
        return (e.id = "input"), Object.assign(e.style, t), e;
    }
    createFileUploadComponents(t, e, i, s) {
        var n, o, r, a;
        const l = new FileAttachments(
            this.elementRef,
            t.attachmentContainerStyle,
            e.demo
        );
        if (
            (Input.createUploadButtons(e.fileTypes || {}, l, i, s),
            null != (n = e.camera) && n.files)
        ) {
            const t =
                (null == (o = s.images) ? void 0 : o.fileType) ||
                l.addType(e.camera.files, "images");
            s.camera = { button: new CameraButton(i, t, e.camera) };
        }
        if (null != (r = e.recordAudio) && r.files) {
            const t =
                (null == (a = s.audio) ? void 0 : a.fileType) ||
                l.addType(e.recordAudio.files, "audio");
            s.microphone = { button: new RecordAudio(t, e.recordAudio) };
        }
        return (
            DragAndDrop.isEnabled(l, t.dragAndDrop) &&
                DragAndDrop.create(i, l, t.dragAndDrop),
            l
        );
    }
    static createUploadButtons(t, e, i, s) {
        Object.keys(t).forEach((n) => {
            const o = n,
                r = t[o];
            if (r.files) {
                const t = e.addType(r.files, o),
                    {
                        id: n,
                        svgString: a,
                        dropupText: l,
                    } = FILE_TYPE_BUTTON_ICONS[o],
                    c = new UploadFileButton(i, t, r, n, a, l);
                s[o] = { button: c, fileType: t };
            }
        });
    }
    static addElements(t, e, i, s, n, o) {
        ElementUtils.addElements(t, e.elementRef);
        const r = ButtonContainers.create(),
            a = InputButtonPositions.addButtons(r, i, s, o);
        InputButtonStyleAdjustments.set(e.inputElementRef, r, n.elementRef, a),
            ButtonContainers.add(t, r);
    }
}
class ChatView {
    static createElements(t, e, i) {
        const s = document.createElement("div");
        s.id = "chat-view";
        const n = new Messages(t, e, i);
        e.websocket && Websocket.createConnection(e, n);
        const o = new Input(t, n, e, s);
        return ElementUtils.addElements(s, n.elementRef, o.elementRef), s;
    }
    static render(t, e, i, s) {
        const n = ChatView.createElements(t, i, s);
        e.replaceChildren(n);
    }
}
const style =
    '#validate-property-key-view{height:100%;position:relative;display:flex;justify-content:center;align-items:center;padding:8px}#large-loading-ring{display:inline-block;width:50px;height:50px}#large-loading-ring:after{content:" ";display:block;width:38px;height:38px;margin:1px;border-radius:50%;border:5px solid #5fb2ff;border-color:#5fb2ff transparent #5fb2ff transparent;animation:large-loading-ring 1.4s linear infinite}@keyframes large-loading-ring{0%{transform:rotate(0)}to{transform:rotate(360deg)}}#insert-key-view{height:100%;position:relative}#insert-key-contents{text-align:center;position:absolute;top:44%;left:50%;transform:translate(-50%,-50%);width:82%;display:flex;max-width:700px}#insert-key-title{margin-bottom:15px}#insert-key-input-container{margin-right:2.7em;width:calc(100% - 80px)}#insert-key-input{padding:.3em 1.7em .3em .3em;border-width:1px;border-style:solid;border-radius:3px;width:100%;font-size:inherit}.insert-key-input-valid{border-color:gray}.insert-key-input-invalid{border-color:red}#visibility-icon-container{position:relative;float:right;cursor:pointer;-webkit-user-select:none;user-select:none}.visibility-icon{filter:brightness(0) saturate(100%) invert(63%) sepia(1%) saturate(9%) hue-rotate(43deg) brightness(98%) contrast(92%);position:absolute;right:-1.7em;top:-1.43em}#visible-icon{top:-1.4em}.visibility-icon:hover{filter:unset}.visibility-icon>*{pointer-events:none}#start-button{border:1px solid grey;color:#454545;border-radius:4px;width:3em;display:flex;justify-content:center;align-items:center;cursor:pointer;padding:.28em .3em;-webkit-user-select:none;user-select:none;background-color:#fff}#start-button:hover{background-color:#f2f2f2}#start-button:active{background-color:#d2d2d2}#insert-key-help-text-container{width:100%;position:absolute;margin-top:32px;margin-bottom:20px}#insert-key-help-text-contents{width:100%;position:absolute}#insert-key-input-invalid-text{display:block;margin-top:1em;margin-bottom:.5em;color:red}.insert-key-input-help-text{display:block;margin-top:16px}#loading-ring{display:inline-block;width:16px;height:16px}#loading-ring:after{content:" ";display:block;width:11px;height:11px;margin:1px;border-radius:50%;border:2px solid #0084ff;border-color:#0084ff transparent #0084ff transparent;animation:loading-ring 1.2s linear infinite}@keyframes loading-ring{0%{transform:rotate(0)}to{transform:rotate(360deg)}}#error-view{color:red;font-size:1.2em;line-height:1.3em;margin-top:-5px;text-align:center;height:100%;display:flex;justify-content:center;align-items:center;padding-left:8px;padding-right:8px}.intro-panel{position:absolute;display:flex;justify-content:center;right:0;bottom:0;left:0;margin:auto;height:fit-content;top:-2.5em}#internal-intro-panel{width:250px;height:min-content;display:block;border-radius:5px;overflow:auto;border:1px solid rgb(203,203,203);padding:10px;max-height:calc(100% - 6.8em)}#internal-intro-panel>p{margin-block-start:.8em;margin-block-end:.8em}pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}/*!\n  Theme: a11y-dark\n  Author: @ericwbailey\n  Maintainer: @ericwbailey\n\n  Based on the Tomorrow Night Eighties theme: https://github.com/isagalaev/highlight.js/blob/master/src/styles/tomorrow-night-eighties.css\n*/.hljs{background:#2b2b2b;color:#f8f8f2}.hljs-comment,.hljs-quote{color:#d4d0ab}.hljs-deletion,.hljs-name,.hljs-regexp,.hljs-selector-class,.hljs-selector-id,.hljs-tag,.hljs-template-variable,.hljs-variable{color:#ffa07a}.hljs-built_in,.hljs-link,.hljs-literal,.hljs-meta,.hljs-number,.hljs-params,.hljs-type{color:#f5ab35}.hljs-attribute{color:gold}.hljs-addition,.hljs-bullet,.hljs-string,.hljs-symbol{color:#abe338}.hljs-section,.hljs-title{color:#00e0e0}.hljs-keyword,.hljs-selector-tag{color:#dcc6e0}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}@media screen and (-ms-high-contrast: active){.hljs-addition,.hljs-attribute,.hljs-built_in,.hljs-bullet,.hljs-comment,.hljs-link,.hljs-literal,.hljs-meta,.hljs-number,.hljs-params,.hljs-quote,.hljs-string,.hljs-symbol,.hljs-type{color:highlight}.hljs-keyword,.hljs-selector-tag{font-weight:700}}#messages{overflow:auto}.outer-message-container:last-child{margin-bottom:5px}.inner-message-container{display:flex;margin-left:auto;margin-right:auto;width:calc(97.5% - 24px);max-width:100%}.message-bubble{margin-top:10px;word-wrap:break-word;width:fit-content;max-width:60%;border-radius:10px;padding:.42em .55em;height:fit-content}.user-message-text{color:#fff;background-color:#0084ff;margin-right:0;margin-left:auto}.ai-message-text{color:#000;background-color:#e4e6eb;margin-left:0;margin-right:auto}.html-message{max-width:unset}.error-message-text{margin:14px auto 10px;background-color:#f4c0c0;color:#474747;text-align:center;max-width:95%}.loading-message-text{width:1em;padding:.6em .75em .6em 1.3em}.message-bubble>p{line-height:1.26em}.message-bubble>p:first-child{margin-top:0}.message-bubble>p:last-child{margin-bottom:0}pre{overflow:auto;display:block;word-break:break-all;word-wrap:break-word;border-radius:7px;background:#2b2b2b;color:#f8f8f2;margin-top:.8em;margin-bottom:.8em;padding:.6em;font-size:.9em;line-height:1.5em}.image-message{padding:0;display:flex;background-color:#ddd}.image-message>*,.image-message>*>*{width:100%;border-radius:8px;display:flex}.audio-message{width:60%;max-width:300px;height:2.2em;max-height:54px;padding:0;background-color:unset}.audio-player{width:100%;height:100%}.audio-player-safari{height:fit-content;width:40px}.audio-player-safari-left{float:left}.audio-player-safari-right{float:right}.any-file-message-bubble{padding:1px}.any-file-message-contents{display:flex}.any-file-message-icon-container{width:1.3em;min-width:1.3em;position:relative;border-radius:4px;margin-left:6px;margin-right:2px}.any-file-message-icon{background-color:#fff;border-radius:4px;position:absolute;width:1em;height:1.25em;padding:1px;margin-top:auto;margin-bottom:auto;top:0;bottom:0}.any-file-message-text{padding-top:5px;overflow-wrap:anywhere;padding-bottom:5px;padding-right:7px}.message-bubble>a{color:inherit}.left-item-position{margin-right:10px}.right-item-position{margin-left:10px}.avatar{padding-top:5px;width:1.5em;height:1.5em;border-radius:1px}.avatar-container{margin-top:9px}.name{margin-top:16px;font-size:15px}#drag-and-drop{position:absolute;display:none;z-index:10;height:calc(100% - 10px);width:calc(100% - 10px);background-color:#70c6ff4d;border:5px dashed #6dafff}#file-attachment-container{position:absolute;height:3.6em;width:calc(80% - 4px);top:-2.5em;border-radius:5px;overflow:auto;text-align:left;background-color:#d7d7d73b;padding-left:4px}.file-attachment{width:2.85em;height:2.85em;display:inline-flex;margin-right:.6em;margin-bottom:.44em;margin-top:4px;position:relative;background-color:#fff;border-radius:5px}.image-attachment{width:100%;height:100%;object-fit:cover;border-radius:5px}.border-bound-attachment{width:calc(100% - 2px);height:calc(100% - 2px);border:1px solid #c3c3c3;border-radius:5px;overflow:hidden}.border-bound-attachment-safari{width:calc(100% - 1px);height:calc(100% - 1px)}.audio-attachment-icon-container{cursor:pointer}.audio-attachment-icon-container:hover{background-color:#f8f8f8}.attachment-icon{left:0;right:0;bottom:0;top:2px;margin:auto;position:absolute;width:25px;-webkit-user-select:none;user-select:none}.not-removable-attachment-icon{top:0;right:0;bottom:0;left:0}.play-icon{filter:brightness(0) saturate(100%) invert(17%) sepia(0%) saturate(1392%) hue-rotate(67deg) brightness(98%) contrast(97%)}.stop-icon{filter:brightness(0) saturate(100%) invert(29%) sepia(90%) saturate(1228%) hue-rotate(198deg) brightness(93%) contrast(98%)}.audio-placeholder-text-3-digits{padding-left:.26rem}.audio-placeholder-text-4-digits{padding-left:.1rem}.any-file-attachment{padding:2px 0}.file-attachment-text-container{position:absolute;width:inherit;display:flex;align-items:center;height:100%;top:-1px}.audio-placeholder-text-3-digits-container{padding-top:1px;cursor:default}.any-file-attachment-text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;padding-left:.13em;margin-left:auto;margin-right:auto}.remove-file-attachment-button{height:1.25em;width:1.25em;border:1px solid #cfcfcf;border-radius:25px;background-color:#fff;top:-4px;right:-5px;position:absolute;display:flex;justify-content:center;cursor:pointer;-webkit-user-select:none;user-select:none}.remove-file-attachment-button:hover{background-color:#e4e4e4}.remove-file-attachment-button:active{background-color:#d7d7d7}.x-icon{color:#4e4e4e;top:-.075em;position:relative;font-size:1.05em}.modal{display:none;flex-direction:column;align-items:center;justify-content:center;position:absolute;width:80%;max-width:420px;max-height:80%;margin:auto;top:0;right:0;bottom:0;left:0;z-index:2}.modal-content{border-top:1px solid rgb(217,217,217);border-left:1px solid rgb(217,217,217);border-right:1px solid rgb(217,217,217);border-top-left-radius:inherit;border-top-right-radius:inherit;background-color:#fff;overflow-y:auto;height:fit-content;max-height:calc(100% - 3.3em);width:100%}.modal-content>p{margin-left:1em;margin-right:1em}.modal-content>ul{margin-right:1em}.modal-button-panel{height:3.3em;border:1px solid;border-color:rgb(223,223,223) rgb(217,217,217) rgb(217,217,217);border-bottom-left-radius:inherit;border-bottom-right-radius:inherit;background-color:#fff;text-align:center;justify-content:center;display:flex;width:100%}.modal-button{min-width:2.5em;text-align:center;color:#fff;border-radius:5px;padding:.4em .4em .3em;height:1.25em;background-color:#3279b2;top:0;bottom:0;cursor:pointer;-webkit-user-select:none;user-select:none;margin:auto .31em}.modal-button:hover{background-color:#276da7}.modal-button:active{background-color:#1b5687}.modal-svg-button{padding:0 0 2px;width:2em;height:1.8em}.modal-svg-button-icon{width:100%;height:100%;filter:brightness(0) saturate(100%) invert(100%) sepia(15%) saturate(4%) hue-rotate(346deg) brightness(101%) contrast(102%)}#modal-background-panel{position:absolute;width:100%;height:100%;background-color:#00000042;z-index:1;display:none}.show-modal-background{animation:fadeInBackground .3s ease-in-out}@keyframes fadeInBackground{0%{opacity:0}to{opacity:1}}.show-modal{animation:fadeInModal .3s ease-in-out}@keyframes fadeInModal{0%{opacity:0;scale:.95}to{opacity:1;scale:1}}.hide-modal-background{animation:fadeOutBackground .2s ease-in-out}@keyframes fadeOutBackground{0%{opacity:1}to{opacity:0}}.hide-modal{animation:fadeOutModal .2s ease-in-out}@keyframes fadeOutModal{0%{opacity:1;scale:1}to{opacity:0;scale:.95}}.modal-camera-content{overflow:hidden;text-align:center;border:unset;height:100%;background-color:#2a2a2a;display:flex;justify-content:center}.camera-modal-canvas{max-width:100%;max-height:100%;margin-top:auto;margin-bottom:auto}.modal-svg-submit-button{background-color:green}.modal-svg-submit-button:hover{background-color:#007500}.modal-svg-submit-button:active{background-color:#006500}.modal-svg-submit-disabled{pointer-events:none;background-color:#747474}.modal-svg-close-button{height:1.56em;padding-top:.37em;padding-bottom:0;background-color:#c13e3e}.modal-svg-close-button:hover{background-color:#b43434}.modal-svg-close-button:active{background-color:#972929}.modal-svg-close-icon{width:80%;height:80%}.modal-svg-camera-button{height:1.6em;padding-top:.38em;padding-bottom:0}.modal-svg-camera-icon{height:76%}.modal-svg-refresh-icon{height:105%}.modal-svg-refresh-button{height:1.66em;padding-top:.11em;padding-bottom:.21em}.input-button-container{position:relative;z-index:1}.inside-right{position:absolute;right:calc(10% + .35em);bottom:.85em}.inside-left{position:absolute;left:calc(10% + .35em);bottom:.85em}.outside-left{position:absolute;right:calc(11px - .55em);bottom:.88em}.outside-right{position:absolute;left:calc(11px - .55em);bottom:.88em}#upload-images-icon{position:absolute;pointer-events:none;width:1.45em;height:1.45em;left:.11em;bottom:.08em;filter:brightness(0) saturate(100%) invert(43%) sepia(0%) saturate(740%) hue-rotate(77deg) brightness(99%) contrast(92%)}#upload-gifs-icon{position:absolute;pointer-events:none;width:1.5em;height:1.48em;left:.07em;bottom:.08em;filter:brightness(0) saturate(100%) invert(49%) sepia(0%) saturate(2586%) hue-rotate(12deg) brightness(93%) contrast(90%)}#upload-audio-icon{position:absolute;pointer-events:none;width:1.21em;height:1.21em;left:.17em;bottom:.2em;filter:brightness(0) saturate(100%) invert(15%) sepia(0%) saturate(337%) hue-rotate(125deg) brightness(91%) contrast(94%);transform:scaleX(.95)}#camera-icon{position:absolute;pointer-events:none;width:1.21em;height:1.21em;left:.23em;bottom:.2em;filter:brightness(0) saturate(100%) invert(52%) sepia(0%) saturate(161%) hue-rotate(164deg) brightness(91%) contrast(92%);transform:scaleX(.95)}#upload-mixed-files-icon{position:absolute;pointer-events:none;width:1.21em;height:1.21em;left:.25em;bottom:.2em;filter:brightness(0) saturate(100%) invert(53%) sepia(0%) saturate(36%) hue-rotate(74deg) brightness(98%) contrast(93%);transform:scaleX(.95)}#interim-text{color:gray}#microphone-button{padding-top:.5px}.outer-button-container>#microphone-button{padding-bottom:1px}#microphone-icon{position:absolute;pointer-events:none;width:1.21em;height:1.21em;left:.25em;bottom:.25em}.default-microphone-icon{filter:brightness(0) saturate(100%) invert(32%) sepia(0%) saturate(924%) hue-rotate(46deg) brightness(95%) contrast(99%)}.active-microphone-icon{filter:brightness(0) saturate(100%) invert(10%) sepia(97%) saturate(7495%) hue-rotate(0deg) brightness(101%) contrast(107%);border-radius:10px}.command-microphone-icon{filter:brightness(0) saturate(100%) invert(42%) sepia(96%) saturate(1067%) hue-rotate(77deg) brightness(99%) contrast(102%)}.unsupported-microphone{display:none}#submit-icon{height:100%;filter:brightness(0) saturate(100%) invert(32%) sepia(0%) saturate(924%) hue-rotate(46deg) brightness(95%) contrast(99%);width:1.21em}#stop-icon{background-color:#acacac;position:absolute;width:.95em;height:.95em;left:.35em;bottom:.35em;border-radius:2px}.submit-button-enlarged{scale:1.1;margin-right:.3em;margin-left:.3em}.dots-jumping{position:relative;left:calc(-9990px + .275em);width:.22em;height:.22em;border-radius:5px;background-color:#848484;color:#848484;box-shadow:9990px 0 #848484,calc(9990px + .44em) 0 0 0 #848484,calc(9990px + .8em) 0 0 0 #848484;animation:dots-jumping 1.5s infinite linear;bottom:-.7em}@keyframes dots-jumping{0%{box-shadow:9990px 0 #848484,calc(9990px + .44em) 0 0 0 #848484,calc(9990px + .8em) 0 0 0 #848484}16.667%{box-shadow:9990px -6px #848484,calc(9990px + .44em) 0 0 0 #848484,calc(9990px + .8em) 0 0 0 #848484}33.333%{box-shadow:9990px 0 #848484,calc(9990px + .44em) 0 0 0 #848484,calc(9990px + .8em) 0 0 0 #848484}50%{box-shadow:9990px 0 #848484,calc(9990px + .44em) -6px 0 0 #848484,calc(9990px + .8em) 0 0 0 #848484}66.667%{box-shadow:9990px 0 #848484,calc(9990px + .44em) 0 0 0 #848484,calc(9990px + .8em) 0 0 0 #848484}83.333%{box-shadow:9990px 0 #848484,calc(9990px + .44em) 0 0 0 #848484,calc(9990px + .8em) -6px 0 0 #848484}to{box-shadow:9990px 0 #848484,calc(9990px + .44em) 0 0 0 #848484,calc(9990px + .8em) 0 0 0 #848484}}.dots-flashing{position:relative;width:.45em;height:.45em;border-radius:5px;background-color:var(--message-dots-color);color:var(--message-dots-color);animation:dots-flashing 1s infinite linear alternate;animation-delay:.5s}.dots-flashing:before,.dots-flashing:after{content:"";display:inline-block;position:absolute;top:0}.dots-flashing:before{left:-.7em;width:.45em;height:.45em;border-radius:5px;background-color:var(--message-dots-color);color:var(--message-dots-color);animation:dots-flashing 1s infinite alternate;animation-delay:0s}.dots-flashing:after{left:.7em;width:.45em;height:.45em;border-radius:5px;background-color:var(--message-dots-color);color:var(--message-dots-color);animation:dots-flashing 1s infinite alternate;animation-delay:1s}@keyframes dots-flashing{0%{background-color:var(--message-dots-color)}50%,to{background-color:var(--message-dots-color-fade)}}.input-button{border-radius:4px;cursor:pointer;margin-bottom:.2em;-webkit-user-select:none;user-select:none}.input-button-svg{width:1.65em;height:1.65em}.input-button:hover{background-color:#9c9c9c2e}.input-button:active{background-color:#9c9c9c5e}.loading-button{background-color:#fff;cursor:auto}.loading-button:hover,.loading-button:active{background-color:#fff}.text-button{filter:unset!important;display:flex;justify-content:center;align-items:center;margin-left:4px;margin-right:4px;height:1.6em}#text-input-container{background-color:#fff;width:80%;display:flex;border:1px solid #0000001a;border-radius:5px;margin-top:.8em;margin-bottom:.8em;box-shadow:#959da533 0 1px 12px;overflow-y:auto;max-height:200px;position:relative}.text-input-container-left-adjustment{margin-left:1.5em}.text-input-container-right-adjustment{margin-right:1.5em}.text-input-container-left-small-adjustment{margin-left:1.1em}.text-input-container-left-small-adjustment>.outside-left{right:calc(14px - .55em)}.text-input-container-right-small-adjustment{margin-right:1.1em}.text-input-container-right-small-adjustment>.outside-right{left:calc(14px - .55em)}#text-input{text-align:left;outline:none;word-wrap:break-word;line-break:auto}.text-input-styling{padding:.4em .5em;overflow:overlay;width:100%}.text-input-inner-left-adjustment{padding-left:2.2em}.text-input-inner-right-adjustment{padding-right:2em}.text-input-disabled{pointer-events:none;-webkit-user-select:none;user-select:none}.text-input-placeholder{color:gray}.outside-right>#dropup-menu,.inside-right>#dropup-menu{right:0}#dropup-icon{position:absolute;pointer-events:none;width:1.16em;height:1.2em;left:.265em;bottom:.43em;filter:brightness(0) saturate(100%) invert(54%) sepia(0%) saturate(724%) hue-rotate(6deg) brightness(92%) contrast(90%)}#dropup-menu{background-color:#fff;position:absolute;transform:translateY(-100%);border-radius:5px;z-index:1;top:-.49em;box-shadow:#0003 -1px 2px 10px,#0000001a 0 2px 4px;cursor:pointer;-webkit-user-select:none;user-select:none}.dropup-menu-item{height:1.4em;padding:.28em .84em .28em .35em;display:flex;position:relative}.dropup-menu-item:first-child{padding-top:.49em;border-top-left-radius:inherit;border-top-right-radius:inherit}.dropup-menu-item:last-child{padding-bottom:.45em;border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.dropup-menu-item-icon{width:1.39em;position:relative;margin-right:.56em}.dropup-menu-item-icon>svg{bottom:0!important;top:0!important;margin-bottom:auto;margin-top:auto}.dropup-menu-item-text{margin-top:.08em;width:max-content}#input{width:100%;display:inline-flex;text-align:center;margin-left:auto;margin-right:auto;margin-top:auto;position:relative;justify-content:center}#chat-view{height:100%;display:grid;grid-template-columns:100%}::-webkit-scrollbar{width:9px;height:9px}::-webkit-scrollbar-thumb{background-color:#d0d0d0;border-radius:5px}::-webkit-scrollbar-track{background-color:#f2f2f2}:host{all:initial;display:table-cell}#container{height:inherit;overflow:hidden}\n';
var __defProp = Object.defineProperty,
    __getOwnPropDesc = Object.getOwnPropertyDescriptor,
    __decorateClass = (t, e, i, s) => {
        for (
            var n,
                o = s > 1 ? void 0 : s ? __getOwnPropDesc(e, i) : e,
                r = t.length - 1;
            r >= 0;
            r--
        )
            (n = t[r]) && (o = (s ? n(e, i, o) : n(o)) || o);
        return s && o && __defProp(e, i, o), o;
    };
class DeepChat extends InternalHTML {
    constructor() {
        super(),
            (this.getMessages = () => []),
            (this.submitUserMessage = () =>
                console.warn(
                    "submitUserMessage failed - please wait for chat view to render before calling this property."
                )),
            (this.focusInput = () =>
                FocusUtils.focusFromParentElement(this._elementRef)),
            (this.refreshMessages = () => {}),
            (this.clearMessages = () => {}),
            (this.scrollToBottom = () => {}),
            (this.onNewMessage = () => {}),
            (this.onClearMessages = () => {}),
            (this.onComponentRender = () => {}),
            (this._hasBeenRendered = !1),
            (this._auxiliaryStyleApplied = !1),
            GoogleFont.appendStyleSheetToHead(),
            (this._elementRef = document.createElement("div")),
            (this._elementRef.id = "container"),
            this.attachShadow({ mode: "open" }).appendChild(this._elementRef),
            WebComponentStyleUtils.apply(style, this.shadowRoot),
            setTimeout(() => {
                this._hasBeenRendered || this.onRender();
            }, 20);
    }
    changeToChatView() {
        this._activeService && (this._activeService.validateConfigKey = !1),
            this.onRender();
    }
    onRender() {
        this._activeService ??
            (this._activeService = ServiceIOFactory.create(this)),
            this._activeService &&
                (this.auxiliaryStyle &&
                    !this._auxiliaryStyleApplied &&
                    (WebComponentStyleUtils.apply(
                        this.auxiliaryStyle,
                        this.shadowRoot
                    ),
                    (this._auxiliaryStyleApplied = !0)),
                WebComponentStyleUtils.applyDefaultStyleToComponent(this.style),
                Legacy.checkForContainerStyles(this, this._elementRef),
                this._activeService.key && this._activeService.validateConfigKey
                    ? ValidateKeyPropertyView.render(
                          this._elementRef,
                          this.changeToChatView.bind(this),
                          this._activeService
                      )
                    : this._activeService instanceof DirectServiceIO &&
                      !this._activeService.key
                    ? this._activeService instanceof DirectServiceIO &&
                      InsertKeyView.render(
                          this._elementRef,
                          this.changeToChatView.bind(this),
                          this._activeService
                      )
                    : (this._childElement ??
                          (this._childElement = this.children[0]),
                      ChatView.render(
                          this,
                          this._elementRef,
                          this._activeService,
                          this._childElement
                      )),
                (this._hasBeenRendered = !0),
                FireEvents.onRender(this));
    }
}
__decorateClass(
    [Property("object")],
    DeepChat.prototype,
    "directConnection",
    2
),
    __decorateClass([Property("object")], DeepChat.prototype, "request", 2),
    __decorateClass([Property("object")], DeepChat.prototype, "stream", 2),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "requestBodyLimits",
        2
    ),
    __decorateClass(
        [Property("function")],
        DeepChat.prototype,
        "requestInterceptor",
        2
    ),
    __decorateClass(
        [Property("function")],
        DeepChat.prototype,
        "responseInterceptor",
        2
    ),
    __decorateClass(
        [Property("function")],
        DeepChat.prototype,
        "validateMessageBeforeSending",
        2
    ),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "attachmentContainerStyle",
        2
    ),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "dropupStyles",
        2
    ),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "inputAreaStyle",
        2
    ),
    __decorateClass([Property("object")], DeepChat.prototype, "textInput", 2),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "submitButtonStyles",
        2
    ),
    __decorateClass(
        [Property("string")],
        DeepChat.prototype,
        "auxiliaryStyle",
        2
    ),
    __decorateClass(
        [Property("array")],
        DeepChat.prototype,
        "initialMessages",
        2
    ),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "introMessage",
        2
    ),
    __decorateClass([Property("object")], DeepChat.prototype, "avatars", 2),
    __decorateClass([Property("object")], DeepChat.prototype, "names", 2),
    __decorateClass(
        [Property("boolean")],
        DeepChat.prototype,
        "displayLoadingBubble",
        2
    ),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "errorMessages",
        2
    ),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "messageStyles",
        2
    ),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "textToSpeech",
        2
    ),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "speechToText",
        2
    ),
    __decorateClass([Property("object")], DeepChat.prototype, "images", 2),
    __decorateClass([Property("object")], DeepChat.prototype, "gifs", 2),
    __decorateClass([Property("object")], DeepChat.prototype, "camera", 2),
    __decorateClass([Property("object")], DeepChat.prototype, "audio", 2),
    __decorateClass([Property("object")], DeepChat.prototype, "microphone", 2),
    __decorateClass([Property("object")], DeepChat.prototype, "mixedFiles", 2),
    __decorateClass([Property("object")], DeepChat.prototype, "dragAndDrop", 2),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "introPanelStyle",
        2
    ),
    __decorateClass(
        [Property("object")],
        DeepChat.prototype,
        "htmlClassUtilities",
        2
    ),
    __decorateClass(
        [Property("function")],
        DeepChat.prototype,
        "onNewMessage",
        2
    ),
    __decorateClass(
        [Property("function")],
        DeepChat.prototype,
        "onClearMessages",
        2
    ),
    __decorateClass(
        [Property("function")],
        DeepChat.prototype,
        "onComponentRender",
        2
    ),
    __decorateClass([Property("object")], DeepChat.prototype, "demo", 2),
    customElements.define("deep-chat", DeepChat);
export { DeepChat };
