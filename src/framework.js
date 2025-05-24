import { MyEventSystem } from "./event.js";
import { diff, patch } from "./vdom.js";
const Framework = (function () {
  const state = [];
  let stateIndex = 0;

  function useState(initialValue) {
    const currentIndex = stateIndex;
    state[currentIndex] = state[currentIndex] !== undefined ? state[currentIndex] : initialValue;

    function setState(newValue) {
      state[currentIndex] = newValue;
    }

    stateIndex++;

    return [state[currentIndex], setState];
  }

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
        MyEventSystem.addEventListener(element, key.slice(2).toLowerCase(), value);
      } else if (key === 'autofocus') {
        if (value === 'autofocus' || value === true) {
          element.autofocus = true;
          setTimeout(() => {
            element.focus();
          }, 0);
        }
      } else if (key === 'className') {
        element.setAttribute('class', value);
      } else {
        element.setAttribute(key, value);
      }
    }

    for (const child of node.children.flat()) {
      element.appendChild(createElement(child));
    }

    return element;
  }

  let rootContainer = null;
  let App = null;

  function rerender(newVNode, container) {
    if ( container._vdom === undefined ) {
      render(newVNode, container);
      
    }
    stateIndex = 0;
    const oldVNode = container._vdom;
    
    const patches = diff(oldVNode, newVNode);
    
    patch(container, patches, 0);
    
    container._vdom = newVNode;
  }

  function render(vNode, container) {
    container.innerHTML = '';
    App = vNode;
    rootContainer = container;
    const element = createElement(vNode);
    container.appendChild(element);
    
    container._vdom = vNode;
    
    return element;
  }

  return {
    rerender,
    jsx,
    createElement,
    useState,
    render,
    setApp: function (app) {
      App = app;
    },
  };
})();

export const { useState, useEffect, jsx, createElement, render, setApp, rerender } = Framework;