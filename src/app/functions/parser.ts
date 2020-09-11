export function parser(tokens) {
    function expectedTypeCheck(type, expect) {
      if (Array.isArray(expect)) {
        const i = expect.indexOf(type);
        return i >= 0;
      }
      return type === expect;
    }

    function createDot(tokenActual: any, currentPosition: number, node: any) {
      const expectedType = ['ob', 'number', 'number', 'cb'];
      const expectedLength = 4;
      currentPosition = currentPosition || 0;
      node = node || {type: 'dot'};

      if (currentPosition < expectedLength - 1) {
        if (expectedTypeCheck(tokenActual.type, expectedType[currentPosition])){
          if (currentPosition === 1) {
            node.x = tokenActual.value;
          }
          if (currentPosition === 2) {
            node.y = tokenActual.value;
          }
          currentPosition++;
          createDot(tokens.shift(), currentPosition, node);
        } else {
          throw new Error('Expected ' + expectedType[currentPosition] + ' but found ' + tokenActual.type + '.');
        }
      }
      return node;
    }

    function findArguments(command, expectedLength, expectedType, currentPosition, currentList) {
      currentPosition = currentPosition || 0;
      currentList = currentList || [];
      while (expectedLength > currentPosition) {
        const token = tokens.shift();
        if (!token) {
          throw new Error(command + ' takes ' + expectedLength + ' argument(s). ');
        }

        if (expectedType){
          const expected = expectedTypeCheck(token.type, expectedType[currentPosition]);
          if (!expected) {
            throw new Error(command + ' takes ' + JSON.stringify(expectedType[currentPosition]) + ' as argument ' + (currentPosition + 1) + '. ' + (token ? 'Instead found a ' + token.type + ' ' + (token.value || '') + '.' : ''));
          }
          if (token.type === 'number' && (token.value < 0 || token.value > 100)){
            throw new Error('Found value ' + token.value + ' for ' + command + '. Value must be between 0 - 100.');
          }
        }

        let arg = {
          type: token.type,
          value: token.value
        };
        if (token.type === 'ob') {
          arg = createDot(token, 0, undefined);
        }
        currentList.push(arg);
        currentPosition++;
      }
      return currentList;
    }

    const AST = {
      type: 'Drawing',
      body: []
    };
    let paper = false;
    let pen = false;

    while (tokens.length > 0) {
      const currentToken = tokens.shift();
      if (currentToken.type === 'word') {
        let block;
        let expression;
        switch (currentToken.value) {
          case '{' :
            block = {
              type: 'Block Start'
            };
            AST.body.push(block);
            break;
          case '}' :
            block = {
              type: 'Block End'
            };
            AST.body.push(block);
            break;
          case '//' :
            expression = {
              type: 'CommentExpression',
              value: ''
            };
            let next = tokens.shift();
            while (next.type !== 'newline') {
              expression.value += next.value + ' ';
              next = tokens.shift();
            }
            AST.body.push(expression);
            break;
          case 'Paper' :
            if (paper) {
              throw new Error('You can not define Paper more than once');
            }
            expression = {
              type: 'CallExpression',
              name: 'Paper',
              arguments: []
            };
            const args1 = findArguments('Paper', 1, undefined, undefined, undefined);
            expression.arguments = expression.arguments.concat(args1);
            AST.body.push(expression);
            paper = true;
            break;
          case 'Pen' :
            expression = {
              type: 'CallExpression',
              name: 'Pen',
              arguments: []
            };
            const args2 = findArguments('Pen', 1, undefined, undefined, undefined);
            expression.arguments = expression.arguments.concat(args2);
            AST.body.push(expression);
            pen = true;
            break;
          case 'Line':
            if (!paper) {
              // throw 'Please make Paper 1st'
              // TODO : no error message 'You should make paper first'
            }
            if (!pen) {
              // throw 'Please define Pen 1st'
              // TODO : no error message 'You should set pen color first'
            }
            expression = {
              type: 'CallExpression',
              name: 'Line',
              arguments: []
            };
            const args3 = findArguments('Line', 4, undefined, undefined, undefined);
            expression.arguments = expression.arguments.concat(args3);
            AST.body.push(expression);
            break;
          case 'Set':
            const args = findArguments('Set', 2, [['word', 'ob'], 'number'], undefined, undefined);
            const obj: any = {};
            if (args[0].type === 'dot') {
              AST.body.push({
                type: 'CallExpression',
                name: 'Pen',
                arguments: [args[1]]
              });
              obj.type = 'CallExpression',
              obj.name = 'Line',
              obj.arguments = [
                { type: 'number', value: args[0].x},
                { type: 'number', value: args[0].y},
                { type: 'number', value: args[0].x},
                { type: 'number', value: args[0].y}
              ];
            } else {
              obj.type = 'VariableDeclaration';
              obj.name = 'Set';
              obj.identifier = args[0];
              obj.value = args[1];
            }

            AST.body.push(obj);
            break;
          default:
            throw new Error(currentToken.value + ' is not a valid command');
        }
      } else if (['newline', 'ocb', 'ccb'].indexOf[currentToken.type] < 0 ) {
        throw new Error('Unexpected token type : ' + currentToken.type);
      }
    }

    return AST;
}
