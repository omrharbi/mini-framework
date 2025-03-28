import { addCustomEventListener } from './events.js';

export function createElement(node) {

  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
    const el = document.createElement(node.tag);
    
    if (node.attrs) {
      Object.entries(node.attrs).forEach(([key, value]) => {
        if (key.startsWith('on') && typeof value === 'function') {
          //el.addEventListener(key.substring(2).toLowerCase(), value);
          const eventType = key.substring(2).toLowerCase();
          addCustomEventListener(el, eventType, value);

        } else {
          el.setAttribute(key, value);
        }
      });
    }
    
    if (node.children) {
      node.children.forEach(child => {
        el.appendChild(createElement(child));
      });
    }
    
    return el;
  }
  
export function h(tag, attrs = {}, ...children) {
    return {
      tag,
      attrs,
      children: children.flat().map(child => 
        typeof child === 'object' ? child : String(child)
      )
    };
  }