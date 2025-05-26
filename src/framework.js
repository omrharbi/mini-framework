import { MyEventSystem } from "./event.js";
import { diff, patch } from "./vdom.js";

const Framework = (function () {
  let stateHooks = [];
  let stateIndex = 0;
  let rootContainer = null;
  let App = null;

  function useState(initialValue) {
    const currentIndex = stateIndex;

    stateHooks[currentIndex] = stateHooks[currentIndex] 
      !== undefined ? stateHooks[currentIndex] : initialValue;

    function setState(newValue) {
      stateHooks[currentIndex] = newValue;
      // Call the global update function instead of updateRender directly
      if (window.updateApp) {
        window.updateApp();
      }
    }

    stateIndex++;
    return [stateHooks[currentIndex], setState];
  }

  function jsx(tag, attrs, ...children) {
    if (typeof tag === "function") {
      return tag({ ...attrs, children });
    }

    return { tag, attrs: attrs || {}, children: children.flat() };
  }

  function createElement(node) {
    if (["string", "number"].includes(typeof node)) {
      return document.createTextNode(node.toString());
    }

    const element = document.createElement(node.tag);

    for (const [key, value] of Object.entries(node.attrs)) {
      if (key.startsWith("on") && typeof value === "function") {
        const eventType = key.slice(2).toLowerCase();
        MyEventSystem.addEventListener(element, eventType, value);
      } else if (key === 'autofocus') {
        if (value === 'autofocus' || value === true) {
          element.autofocus = true;
          setTimeout(() => {
            element.focus();
          }, 0);
        }
      } else if (key === 'className') {
        element.setAttribute('class', value);
      } else if (key === 'checked' && typeof value === 'boolean') {
        element.checked = value;
      } else if (key === 'value' && typeof value === 'string') {
        element.value = value;
      } else {
        element.setAttribute(key, value);
      }
    }

    for (const child of node.children) {
      if (child !== null && child !== undefined && child !== false) {
        element.appendChild(createElement(child));
      }
    }

    return element;
  }

  function updateRender(newVNode, container) {
    stateIndex = 0;

    if (!container._vdom) {
      render(newVNode, container);
      return;
    }
    const oldVNode = container._vdom;
    const patches = diff(oldVNode, newVNode);

    if (patches) {
      patch(container, patches, 0);
    }
    container._vdom = newVNode;
  }

  function render(vNode, container) {
    if (!container || !vNode) return;

    container.innerHTML = '';
    App = vNode;
    rootContainer = container;
    const element = createElement(vNode);
    container.appendChild(element);

    container._vdom = vNode;

    return element;
  }

  return {
    jsx,
    createElement,
    useState,
    render,
    updateRender,
    setApp: function (app) {
      App = app;
    },
  };
})();

export const { useState, jsx, createElement, render, updateRender, setApp } = Framework;