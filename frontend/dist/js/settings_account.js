(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["settings_account"],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Icons/IconArrowNarrowRight.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Icons/IconArrowNarrowRight.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "./node_modules/core-js/modules/es.number.constructor.js");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_0__);

//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    },
    strokeWidth: {
      type: Number,
      default: 1
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/dashboard/Settings/Account.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/dashboard/Settings/Account.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_oucel_Data_blue_moderncloud_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! regenerator-runtime/runtime.js */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_3__);



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      initialized: false,
      loading: true,
      hasError: false,
      showPasswordField: false,
      form: {
        name: null,
        email: null,
        password: null
      }
    };
  },
  mounted: function mounted() {
    var _this = this;

    return Object(_Users_oucel_Data_blue_moderncloud_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.loadUser();

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  methods: {
    loadUser: function loadUser() {
      var _this2 = this;

      return Object(_Users_oucel_Data_blue_moderncloud_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this2.loading = true;
                _context2.prev = 1;
                _context2.next = 4;
                return axios__WEBPACK_IMPORTED_MODULE_3___default.a.get('/api/auth/my-info');

              case 4:
                response = _context2.sent;
                _this2.form.name = response.data.user.name;
                _this2.form.email = response.data.user.email;
                _context2.next = 13;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](1);
                console.log(_context2.t0);
                _this2.hasError = true;

              case 13:
                _context2.prev = 13;
                _this2.initialized = true;
                _this2.loading = false;
                return _context2.finish(13);

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 9, 13, 17]]);
      }))();
    },
    submit: function submit() {
      var _this3 = this;

      return Object(_Users_oucel_Data_blue_moderncloud_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var response;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this3.loading = true;
                _this3.hasError = false;
                _context3.prev = 2;
                _context3.next = 5;
                return axios__WEBPACK_IMPORTED_MODULE_3___default.a.post('/api/auth/my-info', _this3.form);

              case 5:
                response = _context3.sent;

                _this3.$store.commit('updateUser', response.data);

                _context3.next = 13;
                break;

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](2);
                _this3.hasError = true;
                _this3.loading = false;

              case 13:
                _context3.prev = 13;
                _this3.loading = false;
                return _context3.finish(13);

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[2, 9, 13, 16]]);
      }))();
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/dashboard/Settings/Billing.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/dashboard/Settings/Billing.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_oucel_Data_blue_moderncloud_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! regenerator-runtime/runtime.js */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_Icons_IconArrowNarrowRight__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/Icons/IconArrowNarrowRight */ "./src/components/Icons/IconArrowNarrowRight.vue");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    IconArrowNarrowRight: _components_Icons_IconArrowNarrowRight__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      subscriptionLoading: true,
      invoicesLoading: true,
      invoices: [],
      subscription: null
    };
  },
  computed: {
    packageName: function packageName() {
      var trial = ' (Trial)';
      return this.subscription.package_name + (this.subscription.is_trial ? trial : '');
    }
  },
  mounted: function mounted() {
    var _this = this;

    return Object(_Users_oucel_Data_blue_moderncloud_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.loadSubscription();

            case 2:
              _context.next = 4;
              return _this.loadInvoices();

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  methods: {
    loadSubscription: function loadSubscription() {
      var _this2 = this;

      return Object(_Users_oucel_Data_blue_moderncloud_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this2.subscriptionLoading = true;
                _context2.prev = 1;
                _context2.next = 4;
                return axios__WEBPACK_IMPORTED_MODULE_3___default.a.get('/api/auth/current-subscription');

              case 4:
                response = _context2.sent;
                _this2.subscription = response.data.subscription;
                _context2.next = 11;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
                console.log(_context2.t0);

              case 11:
                _this2.subscriptionLoading = false;

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 8]]);
      }))();
    },
    loadInvoices: function loadInvoices() {
      var _this3 = this;

      return Object(_Users_oucel_Data_blue_moderncloud_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var response;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this3.invoicesLoading = true;
                _context3.prev = 1;
                _context3.next = 4;
                return axios__WEBPACK_IMPORTED_MODULE_3___default.a.get('/api/auth/invoices');

              case 4:
                response = _context3.sent;
                _this3.invoices = response.data.invoices;
                _context3.next = 11;
                break;

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](1);
                console.log(_context3.t0);

              case 11:
                _this3.invoicesLoading = false;

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 8]]);
      }))();
    },
    parseDate: function parseDate(timestamp) {
      if (timestamp) {
        return moment__WEBPACK_IMPORTED_MODULE_4___default.a.unix(timestamp).format('D MMM Y HH:mm:ss');
      } else {
        return '-';
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"16535294-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Icons/IconArrowNarrowRight.vue?vue&type=template&id=3f4fdc76&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"16535294-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Icons/IconArrowNarrowRight.vue?vue&type=template&id=3f4fdc76& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: _vm.width,
        height: _vm.height,
        viewBox: "0 0 24 24",
        "stroke-width": _vm.strokeWidth,
        stroke: "currentColor",
        fill: "none",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }
    },
    [
      _c("path", {
        attrs: { stroke: "none", d: "M0 0h24v24H0z", fill: "none" }
      }),
      _c("line", { attrs: { x1: "5", y1: "12", x2: "19", y2: "12" } }),
      _c("line", { attrs: { x1: "15", y1: "16", x2: "19", y2: "12" } }),
      _c("line", { attrs: { x1: "15", y1: "8", x2: "19", y2: "12" } })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"16535294-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/dashboard/Settings/Account.vue?vue&type=template&id=63e01c14&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"16535294-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/dashboard/Settings/Account.vue?vue&type=template&id=63e01c14& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "page" }, [
    _c("div", { staticClass: "content" }, [
      _vm._m(0),
      _vm.initialized === false ? _c("p", [_vm._v("Loading...")]) : _vm._e(),
      _vm.initialized
        ? _c(
            "form",
            {
              on: {
                submit: function($event) {
                  $event.preventDefault()
                  return _vm.submit.apply(null, arguments)
                }
              }
            },
            [
              _vm.hasError
                ? _c("div", { staticClass: "alert alert-danger" }, [
                    _vm._v("An error occurred!")
                  ])
                : _vm._e(),
              _c("div", { staticClass: "mb-2" }, [
                _c("label", { staticClass: "form-label" }, [_vm._v("Name")]),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.form.name,
                      expression: "form.name"
                    }
                  ],
                  staticClass: "form-control",
                  attrs: { type: "text" },
                  domProps: { value: _vm.form.name },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "name", $event.target.value)
                    }
                  }
                })
              ]),
              _c("div", { staticClass: "mb-2" }, [
                _c("label", { staticClass: "form-label" }, [_vm._v("Email")]),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.form.email,
                      expression: "form.email"
                    }
                  ],
                  staticClass: "form-control",
                  attrs: { type: "email" },
                  domProps: { value: _vm.form.email },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "email", $event.target.value)
                    }
                  }
                })
              ]),
              _c("div", { staticClass: "mb-2" }, [
                _c("label", { staticClass: "form-check-label" }, [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.showPasswordField,
                        expression: "showPasswordField"
                      }
                    ],
                    attrs: { type: "checkbox" },
                    domProps: {
                      checked: Array.isArray(_vm.showPasswordField)
                        ? _vm._i(_vm.showPasswordField, null) > -1
                        : _vm.showPasswordField
                    },
                    on: {
                      change: function($event) {
                        var $$a = _vm.showPasswordField,
                          $$el = $event.target,
                          $$c = $$el.checked ? true : false
                        if (Array.isArray($$a)) {
                          var $$v = null,
                            $$i = _vm._i($$a, $$v)
                          if ($$el.checked) {
                            $$i < 0 &&
                              (_vm.showPasswordField = $$a.concat([$$v]))
                          } else {
                            $$i > -1 &&
                              (_vm.showPasswordField = $$a
                                .slice(0, $$i)
                                .concat($$a.slice($$i + 1)))
                          }
                        } else {
                          _vm.showPasswordField = $$c
                        }
                      }
                    }
                  }),
                  _vm._v(" Change Password ")
                ])
              ]),
              _vm.showPasswordField
                ? _c("div", { staticClass: "mb-2" }, [
                    _c("label", { staticClass: "form-label" }, [
                      _vm._v("Password")
                    ]),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.form.password,
                          expression: "form.password"
                        }
                      ],
                      staticClass: "form-control",
                      attrs: { type: "password" },
                      domProps: { value: _vm.form.password },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(_vm.form, "password", $event.target.value)
                        }
                      }
                    })
                  ])
                : _vm._e(),
              _c("div", [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary",
                    attrs: { type: "submit", disabled: _vm.loading },
                    on: { click: _vm.submit }
                  },
                  [
                    _vm.loading
                      ? _c("span", {
                          staticClass: "spinner-grow spinner-grow-sm",
                          attrs: { role: "status", "aria-hidden": "true" }
                        })
                      : _vm._e(),
                    _vm._v(" Save ")
                  ]
                )
              ])
            ]
          )
        : _vm._e()
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "header" }, [
      _c("div", [
        _c("div", { staticClass: "title" }, [_vm._v("Account")]),
        _c("div", { staticClass: "subtitle" }, [
          _vm._v("Update your account information")
        ])
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"16535294-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/dashboard/Settings/Billing.vue?vue&type=template&id=c0209978&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"16535294-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/dashboard/Settings/Billing.vue?vue&type=template&id=c0209978& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "page" }, [
    _c("div", { staticClass: "content" }, [
      _vm._m(0),
      _c("section", { staticClass: "with-divider" }, [
        _c("h3", [_vm._v("Current Plan")]),
        _vm.subscriptionLoading ? _c("p", [_vm._v("Loading...")]) : _vm._e(),
        _vm.subscriptionLoading === false && _vm.subscription
          ? _c("div", [
              _c(
                "p",
                [
                  _vm._v(" You are currently on "),
                  _c("strong", { staticStyle: { "font-weight": "500" } }, [
                    _vm._v(_vm._s(_vm.packageName))
                  ]),
                  _vm._v(" plan."),
                  _c("br"),
                  _c(
                    "router-link",
                    { attrs: { to: "/settings/plans" } },
                    [
                      _vm._v("Views plans and upgrade "),
                      _c("IconArrowNarrowRight")
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._m(1)
            ])
          : _vm._e()
      ]),
      _c("section", [
        _c("h3", [_vm._v("Billing History")]),
        _vm.invoicesLoading ? _c("p", [_vm._v("Loading...")]) : _vm._e(),
        _vm.invoicesLoading === false && _vm.invoices.length === 0
          ? _c("p", [_vm._v("There are no invoices to display.")])
          : _vm._e(),
        _vm.invoicesLoading === false && _vm.invoices.length > 0
          ? _c("table", { staticClass: "table table-bordered" }, [
              _vm._m(2),
              _c(
                "tbody",
                _vm._l(_vm.invoices, function(invoice) {
                  return _c("tr", { key: invoice.number }, [
                    _c("td", [
                      _c(
                        "a",
                        {
                          attrs: { href: invoice.invoice_pdf, target: "_blank" }
                        },
                        [_vm._v(_vm._s(invoice.number))]
                      )
                    ]),
                    _c("td", { staticStyle: { "text-align": "right" } }, [
                      _vm._v("$ " + _vm._s(invoice.total))
                    ]),
                    invoice.is_paid
                      ? _c(
                          "td",
                          {
                            staticClass: "text-success",
                            staticStyle: { "text-align": "center" }
                          },
                          [_vm._v("Paid")]
                        )
                      : _vm._e(),
                    invoice.is_paid === false
                      ? _c(
                          "td",
                          {
                            staticClass: "text-danger",
                            staticStyle: { "text-align": "center" }
                          },
                          [_vm._v("Unpaid")]
                        )
                      : _vm._e(),
                    _c("td", { staticStyle: { "text-align": "right" } }, [
                      _vm._v(_vm._s(_vm.parseDate(invoice.due_date)))
                    ]),
                    _c("td", { staticStyle: { "text-align": "right" } }, [
                      _vm._v(_vm._s(_vm.parseDate(invoice.created)))
                    ])
                  ])
                }),
                0
              )
            ])
          : _vm._e()
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "header" }, [
      _c("div", [
        _c("div", { staticClass: "title" }, [_vm._v("Billing")]),
        _c("div", { staticClass: "subtitle" }, [
          _vm._v("Manage your billing information and invoices")
        ])
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", [
      _vm._v("For questions about billing, contact "),
      _c("a", { attrs: { href: "mailto:contact@moderncloud.io" } }, [
        _vm._v("contact@moderncloud.io")
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", [
        _c("th", { staticStyle: { width: "130px" } }, [_vm._v("#")]),
        _c("th", { staticStyle: { "text-align": "right" } }, [
          _vm._v("Amount")
        ]),
        _c("th", { staticStyle: { "text-align": "center", width: "60px" } }, [
          _vm._v("Status")
        ]),
        _c("th", { staticStyle: { "text-align": "right", width: "150px" } }, [
          _vm._v("Due")
        ]),
        _c("th", { staticStyle: { "text-align": "right", width: "150px" } }, [
          _vm._v("Created")
        ])
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/core-js/modules/es.function.name.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.function.name.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),

/***/ "./src/components/Icons/IconArrowNarrowRight.vue":
/*!*******************************************************!*\
  !*** ./src/components/Icons/IconArrowNarrowRight.vue ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IconArrowNarrowRight_vue_vue_type_template_id_3f4fdc76___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IconArrowNarrowRight.vue?vue&type=template&id=3f4fdc76& */ "./src/components/Icons/IconArrowNarrowRight.vue?vue&type=template&id=3f4fdc76&");
/* harmony import */ var _IconArrowNarrowRight_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IconArrowNarrowRight.vue?vue&type=script&lang=js& */ "./src/components/Icons/IconArrowNarrowRight.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _IconArrowNarrowRight_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _IconArrowNarrowRight_vue_vue_type_template_id_3f4fdc76___WEBPACK_IMPORTED_MODULE_0__["render"],
  _IconArrowNarrowRight_vue_vue_type_template_id_3f4fdc76___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Icons/IconArrowNarrowRight.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/Icons/IconArrowNarrowRight.vue?vue&type=script&lang=js&":
/*!********************************************************************************!*\
  !*** ./src/components/Icons/IconArrowNarrowRight.vue?vue&type=script&lang=js& ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_IconArrowNarrowRight_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./IconArrowNarrowRight.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Icons/IconArrowNarrowRight.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_IconArrowNarrowRight_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Icons/IconArrowNarrowRight.vue?vue&type=template&id=3f4fdc76&":
/*!**************************************************************************************!*\
  !*** ./src/components/Icons/IconArrowNarrowRight.vue?vue&type=template&id=3f4fdc76& ***!
  \**************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_16535294_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_IconArrowNarrowRight_vue_vue_type_template_id_3f4fdc76___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"16535294-vue-loader-template"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./IconArrowNarrowRight.vue?vue&type=template&id=3f4fdc76& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"16535294-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/Icons/IconArrowNarrowRight.vue?vue&type=template&id=3f4fdc76&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_16535294_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_IconArrowNarrowRight_vue_vue_type_template_id_3f4fdc76___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_16535294_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_IconArrowNarrowRight_vue_vue_type_template_id_3f4fdc76___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/views/dashboard/Settings/Account.vue":
/*!**************************************************!*\
  !*** ./src/views/dashboard/Settings/Account.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Account_vue_vue_type_template_id_63e01c14___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Account.vue?vue&type=template&id=63e01c14& */ "./src/views/dashboard/Settings/Account.vue?vue&type=template&id=63e01c14&");
/* harmony import */ var _Account_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Account.vue?vue&type=script&lang=js& */ "./src/views/dashboard/Settings/Account.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Account_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Account_vue_vue_type_template_id_63e01c14___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Account_vue_vue_type_template_id_63e01c14___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/dashboard/Settings/Account.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/dashboard/Settings/Account.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./src/views/dashboard/Settings/Account.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Account_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../node_modules/babel-loader/lib!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Account.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/dashboard/Settings/Account.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Account_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/dashboard/Settings/Account.vue?vue&type=template&id=63e01c14&":
/*!*********************************************************************************!*\
  !*** ./src/views/dashboard/Settings/Account.vue?vue&type=template&id=63e01c14& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_16535294_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Account_vue_vue_type_template_id_63e01c14___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"16535294-vue-loader-template"}!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Account.vue?vue&type=template&id=63e01c14& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"16535294-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/dashboard/Settings/Account.vue?vue&type=template&id=63e01c14&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_16535294_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Account_vue_vue_type_template_id_63e01c14___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_16535294_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Account_vue_vue_type_template_id_63e01c14___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/views/dashboard/Settings/Billing.vue":
/*!**************************************************!*\
  !*** ./src/views/dashboard/Settings/Billing.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Billing_vue_vue_type_template_id_c0209978___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Billing.vue?vue&type=template&id=c0209978& */ "./src/views/dashboard/Settings/Billing.vue?vue&type=template&id=c0209978&");
/* harmony import */ var _Billing_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Billing.vue?vue&type=script&lang=js& */ "./src/views/dashboard/Settings/Billing.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Billing_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Billing_vue_vue_type_template_id_c0209978___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Billing_vue_vue_type_template_id_c0209978___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/dashboard/Settings/Billing.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/views/dashboard/Settings/Billing.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./src/views/dashboard/Settings/Billing.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Billing_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../node_modules/babel-loader/lib!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Billing.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/dashboard/Settings/Billing.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Billing_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/views/dashboard/Settings/Billing.vue?vue&type=template&id=c0209978&":
/*!*********************************************************************************!*\
  !*** ./src/views/dashboard/Settings/Billing.vue?vue&type=template&id=c0209978& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_16535294_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Billing_vue_vue_type_template_id_c0209978___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"16535294-vue-loader-template"}!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Billing.vue?vue&type=template&id=c0209978& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"16535294-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/views/dashboard/Settings/Billing.vue?vue&type=template&id=c0209978&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_16535294_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Billing_vue_vue_type_template_id_c0209978___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_16535294_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Billing_vue_vue_type_template_id_c0209978___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=settings_account.js.map