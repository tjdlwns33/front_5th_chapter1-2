import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // 이전 props중에 있던 것과 새로운 props를 비교했을 때 key는 같지만 value가 달라진 것은 새로운 value로 변경
  // 이전 props에 없던 key가 새로운 props에 있는 것은 새롭게 key와 value 추가
  Object.entries(originNewProps).map(([key, value]) => {
    if (originOldProps[key] !== value) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        addEvent(target, eventType, value);
      } else if (key === "className") {
        target.setAttribute("class", value);
      } else {
        target.setAttribute(key, value);
      }
    }
  });

  // 이전 Props에 있는 key지만 새로운 props에 없는 key면은 제거
  Object.entries(originOldProps).map(([key, value]) => {
    if (!(key in originNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, value);
      } else {
        target.removeAttribute(key);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const oldChildren = oldNode.children || [];
  const newChildren = newNode.children || [];

  // 이전 노드에는 있으나 새로운 노드에는 없는 요소 제거
  for (let i = 0; i < oldChildren.length; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    if (!newChild) {
      parentElement.removeChild(oldChild);
    }
  }

  // 이전 노드에 없고 새로운 노드에 있는 요소 추가
  for (let i = 0; i < newChildren.length; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    if (!oldChild) {
      parentElement.appendChild(newChild);
    }
  }

  // 이전 노드와 새로운 노드의 타입이 다른 경우 새로운 요소 생성 후 이전 요소와 교체
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    parentElement.replaceChild(newElement, parentElement.childNodes[index]);
  } else {
    // 이전 노드와 새로운 노드의 타입은 같고 속성이 다른 경우 새로운 속성으로 교체
    if (newNode.props !== oldNode.props) {
      updateAttributes(newNode, newNode.props, oldNode.props);
    }
  }

  // 이전 노드의 자식 요소들과 새로운 노드의 자식 요소들도 위의 과정을 전부 수행
  const newChildNodes = newNode.childNodes;
  const oldchildNodes = oldNode.childNodes;

  const maxLength = Math.max(newChildNodes.length, oldchildNodes.length);

  for (let i = 0; i < maxLength; i++) {
    const newChild = newChildNodes[i];
    const oldChild = oldchildNodes[i];

    updateElement(parentElement.childNodes[index], newChild, oldChild, i);
  }
}
