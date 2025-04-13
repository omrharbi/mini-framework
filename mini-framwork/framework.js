import { addCustomEventListener } from "./event.js";

const Framework = (function () {
  const state = [];
  let stateIndex = 0;

  function useState(initialValue) {
    const currentIndex = stateIndex;
    state[currentIndex] = state[currentIndex] !== undefined ? state[currentIndex] : initialValue;

    function setState(newValue) {
      state[currentIndex] = newValue;
      rerender();
    }

    stateIndex++;
    return [state[currentIndex], setState];
  }

  const effects = [];
  let effectsIndex = 0;

  function useEffect(callback, dependency) {
    const oldDependency = effects[effectsIndex];
    let hasChanged = true;

    if (oldDependency) {
      hasChanged = dependency.some((dep, i) => !Object.is(dep, oldDependency[i]));
    }

    if (hasChanged) {
      callback();
    }

    effects[effectsIndex] = dependency;
    effectsIndex++;
  }

  function jsx(tag, props, ...children) {
    if (typeof tag === "function") {
      return tag({ ...props, children });
    }

    return { tag, props: props || {}, children };
  }

  function createElement(node) {
    if (["string", "number"].includes(typeof node)) {
      return document.createTextNode(node.toString());
    }

    const element = document.createElement(node.tag);

    for (const [name, value] of Object.entries(node.props)) {
      if (name.startsWith("on") && typeof value === "function") {
        addCustomEventListener(element, name.slice(2).toLowerCase(), value);
      } else if (name === "className") {
        element.className = value;
      } else if (name === "id") {
        element.id = value;
      } else {
        element.setAttribute(name, value);
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
      stateIndex = 0;
      effectsIndex = 0;
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
    useState,
    useEffect,
    jsx,
    createElement,
    render,
    setApp: function (app) {
      App = app;
    },
  };
})();

export const { useState, useEffect, jsx, createElement, render, setApp } = Framework;
