

/**
 * Wantan Girl v1.0.0
 * https://github.com/tomoyaotsuka/wantan-girl
 *
 * 英数字をspan.alphamericでwrapする
 *
 * Copyright 2019 Tomoya Otsuka
 * Released under the MIT license
 *
 * Date: 2019-04-25
 */



export default class WantanGirl {
  /**
   * @param regexp 対象文字列の正規表現
   * @param className span class名
   */
  constructor({ regexp = /([a-zA-Z0-9,¥\.\-]+)/g, className = 'alphameric' } = {}) {
    this.regexp = regexp;
    this.className = className;
    this.testMetaContents = /base|command|link|meta|noscript|script|style|title|svg/;
    this.renew();
  }

  renew() {
    let targets = this.getTargets();

    targets.forEach(target => {
      const tmpDiv = document.createElement('div');

      tmpDiv.innerHTML = target.text.cloneNode().textContent.replace(this.regexp, `<span class="${this.className}">$1</span>`);

      [...tmpDiv.childNodes].forEach(childNode => {
        target.parent.insertBefore(childNode, target.text);
      });

      target.parent.removeChild(target.text);
    });
  }

  getTargets() {
    let nodes = document.querySelectorAll('*');
    let targets = [];

    [...nodes].forEach(node => {
      [...node.childNodes].forEach(childNode => {
        const parentsNode = getParents(childNode);

        if (
          childNode.nodeType === Node.TEXT_NODE
          && !/^\s+$/.test(childNode.textContent)
          && !this.testMetaContents.test(childNode.parentNode.tagName.toLowerCase())
          && !childNode.parentNode.classList.contains(this.className)
          && parentsNode.filter(node => {
            if (node.tagName) {
              return this.testMetaContents.test(node.tagName.toLowerCase());
            } else {
              return false
            }
          }).length === 0
        ) {
          targets.push({
            parent: childNode.parentNode,
            text: childNode
          });
        }
      });
    });

    return targets;
  }
}



const getParents = dom => {
  let result = [];
  let currentDom = dom;

  if (currentDom) {
    while (currentDom.parentNode) {
      result.push(currentDom.parentNode);
      currentDom = currentDom.parentNode;
    }
  }

  return result;
};