const Framework = (function () {
  const state = [];
  let stateIndex = 0;
  function useState(initialValue) {
    const currentIndex = stateIndex;
    state[currentIndex] =
      state[currentIndex] !== undefined ? state[currentIndex] : initialValue;
    function setState(newValue) {
      state[currentIndex] = newValue;
      render();
    }
    return [state[currentIndex], setState];
  }
  let effects = [];
  let effectsIndex = 0;
  function useEffect(callback, dependency) {
    let oldDependency = effects[effectsIndex];
    let hasChanged = true;
    if (oldDependency) {
      hasChanged = dependency.some(
        (dep, i) => !Object.is(dep, oldDependency[i])
      );
    }
    if (hasChanged) {
      callback();
    }
    effects[effectsIndex] = dependency;
    effectsIndex++;
  }
  function jsx(tags,props,...children) {
  
    if (typeof tags==="function"){
        return( {...props,children})
    }
    console.log(children);
    
    return {tags,props:props|| {},children}

  }
  function createElement(node) {
      if(typeof node==="string" ||typeof node ==="number"){
             return document.createTextNode(String(node))
        }
        console.log(node.children);
        
    const element =document.createElement(node.tags)
    for(let [name,value] of Object.entries(node.props)){
        if(name.startsWith("on") && typeof value==="function" ){
            element.addEventListener(name.slice(2).toLowerCase(), value);
        }else if (name==="className"){
            element.className=value
        }else if (name==='id'){
            element.id=value
        }else{
            element.setAttribute(name,value)
        }
    }
    console.log(node.children.flat());
    
    for (let child of node.children.flat()) {
        if (typeof child === 'string' || typeof child === 'number') {
          element.appendChild(document.createTextNode(String(child)));
        } else {
          element.appendChild(createElement(child));
        }
      }
    return element
  }
  function render() {
    stateIndex=0
    effectsIndex=0
    const root=document.getElementById("root")
    root.innerHTML=""
    const app=App()
    root.appendChild(createElement(app))
  }
  return { useState, useEffect, jsx, createElement, render };
})();

const { useState, useEffect, jsx, createElement, render } = Framework;
