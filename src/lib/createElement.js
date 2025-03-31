// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode(""); // 빈 텍스트 노드
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode)); // 텍스트 노드
  }
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment(); // DocumentFragment 생성
    vNode.forEach((childNode) => {
      const childElement = createElement(childNode);
      if (childElement instanceof Node) {
        fragment.appendChild(childElement); // 각 항목을 Fragment에 추가
      }
    });
    return fragment;
  }

  const element = document.createElement(vNode.type);
  if (vNode.props) {
    for (const key in vNode.props) {
      if (Object.prototype.hasOwnProperty.call(vNode.props, key)) {
        element.setAttribute(key, vNode.props[key]);
      }
    }
  }
  if (vNode.children) {
    vNode.children.forEach((childNode) => {
      const childElement = createElement(childNode);
      if (childElement instanceof Node) {
        element.appendChild(childElement);
      }
    });
  }
  return element;
}

// function updateAttributes($el, props) {}
