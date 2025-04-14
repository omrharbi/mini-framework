import { MyEventSystem } from "./event.js";

const Framework = (function () {
 
  function jsx(tag, attrs, ...children) {
    if (typeof tag === "function") {
      return tag({ ...attrs, children });
    }

    return { tag, attrs: attrs || {}, children };
  }

  function createElement(node) {
    if (["string", "number"].includes(typeof node)) {
      return document.createTextNode(node.toString());
    }

    const element = document.createElement(node.tag);

    for (const [key, value] of Object.entries(node.attrs)) {
      if (key.startsWith("on") && typeof value === "function") {
        MyEventSystem.addEventListener(element,key.slice(2).toLowerCase(),value)
      } else {
        if (key === 'className') {
          element.setAttribute('class', value);
        } else {
          element.setAttribute(key, value);
        }
    }
}

    for (const child of node.children.flat()) {
      element.appendChild(createElement(child));
    }

    return element;
  }

  let rootContainer = null;
  let App = null;

  function rerender() {
    if (rootContainer && App) {
      rootContainer.innerHTML = "";
      const vnode = App;
      const dom = createElement(vnode);
      rootContainer.appendChild(dom);
    }
  }

  function render(component, container) {
    App = component;
    rootContainer = container;
    rerender();
  }

  return {
    jsx,
    createElement,
    render,
    setApp: function (app) {
      App = app;
    },
  };
})();

export const { useState, useEffect, jsx, createElement, render, setApp } = Framework;
