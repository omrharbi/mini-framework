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
  const maxLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i++) {
    if (i >= oldChildren.length) {
      // New child
      patches[i] = { type: "CREATE", newNode: newChildren[i] };
    } else if (i >= newChildren.length) {
      // Removed child
      patches[i] = { type: "REMOVE" };
    } else {
      // Compare existing children
      patches[i] = diff(oldChildren[i], newChildren[i]);
    }
  }

  return patches;
}

export function patchAttrs(el, attrsPatches) {
  if (!el || !attrsPatches || attrsPatches.length === 0) return;

  for (let i = 0; i < attrsPatches.length; i += 2) {
    const key = attrsPatches[i];
    const value = attrsPatches[i + 1];

    if (value === null) {
      el.removeAttribute(key);
      if (key === 'checked') {
        el.checked = false;
      }
    } else if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.substring(2).toLowerCase();
      MyEventSystem.addEventListener(el, eventType, value);
    } else if (key === 'className') {
      el.setAttribute('class', value);
    } else if (key === 'checked' && typeof value === 'boolean') {
      el.checked = value;
      if (value) {
        el.setAttribute('checked', 'checked');
      } else {
        el.removeAttribute('checked');
      }
    } else if (key === 'value' && typeof value === 'string') {
      el.value = value;
      el.setAttribute('value', value);
    } else if (value !== undefined) {
      el.setAttribute(key, value);
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

  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode.toString() !== newNode.toString()) {
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
      const replacement = createElement(patches.newNode);
      if (el) {
         parent.replaceChild(replacement, el);
      } else {
        parent.appendChild(replacement);
      }
      break;
      
    case "UPDATE":
      if (el) {
        patchAttrs(el, patches.attrsPatches);
        patches.childrenPatches.forEach((childPatch, i) => {
          if (childPatch) {
            patch(el, childPatch, i);
          }
        });
      }
      break;
  }
}