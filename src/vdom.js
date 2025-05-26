import { MyEventSystem } from "./event.js";
import { createElement } from "./framework.js";

export function diffAttrs(oldAttrs, newAttrs) {
  const patches = [];

  for (const [key, value] of Object.entries(newAttrs)) {
    if (oldAttrs[key] !== value) {
      patches.push(key, value);
    }
  }

  for (const key in oldAttrs) {
    if (!(key in newAttrs)) {
      patches.push(key, null);
    }
  }

  return patches;
}

export function diffChildren(oldChildren = [], newChildren = []) {
  const patches = [];

  const commonLength = Math.min(oldChildren.length, newChildren.length);

  for (let i = 0; i < commonLength; i++) {
    patches[i] = diff(oldChildren[i], newChildren[i]);
  }

  for (let i = commonLength; i < newChildren.length; i++) {
    patches[i] = { type: "CREATE", newNode: newChildren[i] };
  }

  for (let i = commonLength; i < oldChildren.length; i++) {
    patches[i] = { type: "REMOVE" };
  }

  return patches;
}

export function patchAttrs(el, attrsPatches) {
  if (!el || !attrsPatches || attrsPatches.length === 0) return;

  for (let i = 0; i < attrsPatches.length; i += 2) {
    const key = attrsPatches[i];
    const value = attrsPatches[i + 1];

    if (value === null) {
      if (key === 'checked') {
        el.checked = false;
      } else {
        el.removeAttribute(key);
      }
      el.removeAttribute(key);
    } else if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.substring(2).toLowerCase();
      if (el._listeners && el._listeners[eventType]) {
        MyEventSystem.removeEventListener(el, eventType, el._listeners[eventType]);
      }
      MyEventSystem.addEventListener(el, eventType, value);
      el._listeners = el._listeners || {};
      el._listeners[eventType] = value;
    } else if (key === 'className') {
      if (value !== undefined) {
        el.setAttribute('class', value);
      }
    } else {
      if (value !== undefined) {
        el.setAttribute(key, value);
      }
    }
  }
}

export function diff(oldNode, newNode) {
  if (!oldNode) {
    return { type: "CREATE", newNode };
  }

  if (!newNode) {
    return { type: "REMOVE" };
  }

  if (typeof oldNode !== typeof newNode) {
    return { type: "REPLACE", newNode };
  }

  if (typeof newNode === "string") {
    if (oldNode !== newNode) {
      return { type: "REPLACE", newNode };
    }
    return null;
  }

  if (oldNode.tag !== newNode.tag) {
    return { type: "REPLACE", newNode };
  }

  const attrsPatches = diffAttrs(oldNode.attrs || {}, newNode.attrs || {});
  const childrenPatches = diffChildren(oldNode.children, newNode.children);

  if (
    attrsPatches.length === 0 &&
    childrenPatches.every((patch) => patch === null)
  ) {
    return null;
  }

  return {
    type: "UPDATE",
    attrsPatches,
    childrenPatches,
  };
}

export function patch(parent, patches, index = 0) {
  if (!patches || !parent) return;

  const el = parent.childNodes[index];
  console.log("patches type", patches.type);

  switch (patches.type) {
    case "CREATE":
      const newElement = createElement(patches.newNode);
      if (index < parent.childNodes.length) {
        parent.insertBefore(newElement, parent.childNodes[index]);
      } else {
        parent.appendChild(newElement);
      }
      break;
    case "REMOVE":
      if (el) {
        parent.removeChild(el);
      }
      break;
    case "REPLACE":
      const replacementElement = createElement(patches.newNode);

      if (el && replacementElement) {
        parent.replaceChild(replacementElement, el);
      }
      break;
    case "UPDATE":
      if (el) {
        patchAttrs(el, patches.attrsPatches);

        const childrenPatches = patches.childrenPatches || [];

        for (let i = childrenPatches.length - 1; i >= 0; i--) {
          const childPatch = childrenPatches[i];
          if (childPatch && childPatch.type === "REMOVE") {
            patch(el, childPatch, i);
          }
        }

        for (let i = 0; i < childrenPatches.length; i++) {
          const childPatch = childrenPatches[i];
          if (childPatch && childPatch.type !== "REMOVE") {
            patch(el, childPatch, i);
          }
        }
      }
      break;
  }
}