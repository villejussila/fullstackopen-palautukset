(this.webpackJsonppuhelinluettelo=this.webpackJsonppuhelinluettelo||[]).push([[0],{23:function(e,n,t){},43:function(e,n,t){"use strict";t.r(n);var c=t(1),r=t.n(c),u=t(17),o=t.n(u),a=(t(23),t(18)),i=t(8),s=t(3),l=t(0),j=function(e){var n=e.onChange,t=e.value;return Object(l.jsxs)("div",{children:["filter shown with ",Object(l.jsx)("input",{value:t,onChange:n})]})},b=function(e){var n=e.onSubmit,t=e.onChangeNewName,c=e.onChangeNewNumber,r=e.newName,u=e.newNumber;return Object(l.jsx)(l.Fragment,{children:Object(l.jsxs)("form",{onSubmit:n,children:[Object(l.jsxs)("div",{children:["name: ",Object(l.jsx)("input",{value:r,onChange:t})]}),Object(l.jsxs)("div",{children:["number: ",Object(l.jsx)("input",{value:u,onChange:c})]}),Object(l.jsx)("div",{children:Object(l.jsx)("button",{type:"submit",children:"Add"})})]})})},f=function(e){var n=e.persons,t=e.filterByValue,c=e.onClick;return Object(l.jsx)("div",{children:n.map((function(e){return Object(l.jsx)("div",{children:t?e.name.toLowerCase().includes(t.toLowerCase())?Object(l.jsxs)(l.Fragment,{children:[e.name," ",e.number,Object(l.jsx)("button",{onClick:function(){return c(e.id)},children:"delete"})]}):null:Object(l.jsxs)(l.Fragment,{children:[e.name," ",e.number,Object(l.jsx)("button",{onClick:function(){return c(e.id)},children:"delete"})]})},e.name)}))})},d=function(e){var n=e.message,t=e.isError;return null===n?null:Object(l.jsx)("div",{className:t?"error":"notification",children:n})},h=t(5),m=t.n(h),O="/api/persons",v=function(){return m.a.get(O).then((function(e){return e.data}))},x=function(e){return m.a.post(O,e).then((function(e){return e.data}))},p=function(e){return m.a.delete("".concat(O,"/").concat(e)).then((function(e){return e.data}))},w=function(e,n){return m.a.put("".concat(O,"/").concat(e),n).then((function(e){return e.data}))},g=function(){var e=Object(c.useState)([]),n=Object(s.a)(e,2),t=n[0],r=n[1],u=Object(c.useState)(""),o=Object(s.a)(u,2),h=o[0],m=o[1],O=Object(c.useState)(""),g=Object(s.a)(O,2),C=g[0],N=g[1],S=Object(c.useState)(""),k=Object(s.a)(S,2),y=k[0],L=k[1],E=Object(c.useState)(null),T=Object(s.a)(E,2),A=T[0],B=T[1],D=Object(c.useState)(!1),F=Object(s.a)(D,2),I=F[0],J=F[1],V=Object(c.useState)(!1),M=Object(s.a)(V,2),P=M[0],U=M[1];Object(c.useEffect)((function(){v().then((function(e){r(e)}))}),[]),Object(c.useEffect)((function(){if(P)return v().then((function(e){r(e)})),function(){return U(!1)}}),[P]);var q=function(e,n){var t=n;return e.map((function(e){return e.name.toLowerCase()})).includes(t.toLowerCase())},z=function(e,n){var t=e.map((function(e){return Object(i.a)(Object(i.a)({},e),{},{name:e.name.toLowerCase()})})),c=n;return t.find((function(e){return e.name===c.toLowerCase()})).id},G=function(e){J(!1),w(e,{name:h,number:C}).then((function(n){n||J(!0),r(t.map((function(t){return t.id!==e?t:n})))})).then((function(){m(""),N(""),B("Updated ".concat(h)),setTimeout((function(){B(null)}),5e3)})).catch((function(e){J(!0),m(""),N(""),U(!0),B("Information of ".concat(h," has already been removed from server")),setTimeout((function(){B(null),J(!1)}),5e3)}))},H=function(){x({name:h,number:C}).then((function(e){r((function(n){return[].concat(Object(a.a)(n),[e])})),J(!1),m(""),N(""),B("Added ".concat(h))})).catch((function(e){B(e.response.data.error),J(!0)})),setTimeout((function(){B(null),J(!1)}),5e3)};return Object(l.jsxs)("div",{children:[Object(l.jsx)("h2",{children:"Phonebook"}),Object(l.jsx)(d,{message:A,isError:I}),Object(l.jsx)(j,{value:y,onChange:function(e){L(e.target.value)}}),Object(l.jsx)("h3",{children:"Add new"}),Object(l.jsx)(b,{onSubmit:function(e){if(e.preventDefault(),q(t,h)){if(window.confirm("".concat(h," is already added to phonebook, replace the old number with a new one?"))){var n=z(t,h);G(n)}}else H()},newName:h,newNumber:C,onChangeNewName:function(e){m(e.target.value)},onChangeNewNumber:function(e){N(e.target.value)}}),Object(l.jsx)("h3",{children:"Numbers"}),Object(l.jsx)(f,{persons:t,filterByValue:y,onClick:function(e){var n=t.find((function(n){return n.id===e})).name;n&&window.confirm("Delete ".concat(n,"?"))&&p(e).then(r(t.filter((function(n){return n.id!==e})))),B("Deleted ".concat(n)),setTimeout((function(){B(null)}),5e3)}})]})};o.a.render(Object(l.jsx)(r.a.StrictMode,{children:Object(l.jsx)(g,{})}),document.getElementById("root"))}},[[43,1,2]]]);
//# sourceMappingURL=main.f5caa39d.chunk.js.map