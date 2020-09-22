export const generator = (ast) => {

  function traverseSvgAst(obj, parent, rest, text) {

      parent = parent || [];
      rest = rest || [];
      text = text || '';
      if (!Array.isArray(obj)) {
          obj = [obj];
      }

      while (obj.length > 0) {
          const currentNode = obj.shift();
          const body = currentNode.body || '';
          const attr = Object.keys(currentNode.attr).map( (key) => {
              return key + '="' + currentNode.attr[key] + '"';
          }).join(' ');

          text += parent.map(() => '\t' ).join('') + '<' + currentNode.tag + ' ' + attr + '>';

          if (currentNode.body && Array.isArray(currentNode.body) && currentNode.body.length > 0) {
              text += '\n';
              parent.push(currentNode.tag);
              rest.push(obj);
              return traverseSvgAst(currentNode.body, parent, rest, text);
          }

          text += body + '</' + currentNode.tag + '>\n';
      }

      while (rest.length > 0) {
          const next = rest.pop();
          const tag = parent.pop();
          text += parent.map(() =>  '\t').join('') + '</' + tag + '>\n';
          if (next.length > 0) {
              traverseSvgAst(next, parent, rest, text);
          }
      }

      return text;
  }

  return traverseSvgAst(ast, undefined, undefined, undefined);
};
