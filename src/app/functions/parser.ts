import { TokenModel } from '../models/token.model';
import { ExpressionModel } from '../models/expression.model';
export const parser = (tokens: TokenModel[]) => {
    let paper = false;
    let pen = false;
    const reservedWords = ['Paper', 'Pen', 'Line'];
    const AST = {
      type: 'Drawing',
      body: [] as ExpressionModel[]
    };

    const expectedTypeCheck = (type, expect) => {
      if (Array.isArray(expect)) {
        const i = expect.indexOf(type);
        return i >= 0;
      }
      return type === expect;
    };

    const createDot = (tokenActual: any, currentPosition: number, node: any)  => {
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
    };

    const findArguments = (command: string, expectedLength: number, expectedType: any, currentPosition: number, currentList: any) => {
      currentPosition = currentPosition || 0;
      currentList = currentList || [];
      while (expectedLength > currentPosition) {
        let token = tokens.shift();
        console.log(token);
        if (!token) {
          throw new Error(command + ' takes ' + expectedLength + ' argument(s). ');
        }

        if (expectedType){
          const expected = expectedTypeCheck(token.type, expectedType[currentPosition]);
          if (!expected) {
            throw new Error(command + ' takes ' + JSON.stringify(expectedType[currentPosition]) + ' as argument ' + (currentPosition + 1) + '. ' + (token ? 'Instead found a ' + token.type + ' ' + (token.value || '') + '.' : ''));
          }
          if (token.type === 'number' && ((token.value < 0 || token.value > 100))){
            throw new Error('Found value ' + token.value + ' for ' + command + '. Value must be between 0 - 100.');
          }
        }

        if (token.type === 'ob') {
          token = createDot(token, 0, undefined);
        }
        currentList.push(token);
        currentPosition++;
      }
      return currentList;
    };

    while (tokens.length > 0) {
      const currentToken = tokens.shift();
      if (currentToken.type === 'word') {
        // let expression;
        let expression = {} as ExpressionModel;
        const token = {} as TokenModel;
        if (currentToken.value === '//') {
          expression = {
            name: 'Comment',
            type: 'CommentExpression',
            value: ''
          };
          let next = tokens.shift();
          while (next.type !== 'nl') {
            expression.value += next.value + ' ';
            next = tokens.shift();
          }
          AST.body.push(expression);
        } else if (reservedWords.includes(currentToken.value )) {
          const numberArguments = (currentToken.value === 'Line') ? 4 : 1;
          if (currentToken.value  === 'Paper' && paper) {
            throw new Error('You can not define Paper more than once');
          } else if (currentToken.value  === 'Pen' && !paper) {
            throw new Error('Please make Paper 1st');
          } else if (currentToken.value  === 'Line') {
            if (!paper) {
              throw new Error('Please make Paper 1st');
            }
            if (!pen) {
              throw new Error('You should set pen color first');
            }
          }
          expression = {
            type: 'CallExpression',
            name: currentToken.value ,
            arguments: []
          };
          const args1 = findArguments(currentToken.value , numberArguments, undefined, undefined, undefined);
          expression.arguments = expression.arguments.concat(args1);
          AST.body.push(expression);
          if (currentToken.value  === 'Paper') { paper = true; } else if (currentToken.value  === 'Pen') { pen = true; }
        } else {
          throw new Error(currentToken.value + ' is not a valid command');
        }
      } else if (['nl', 'ocb', 'ccb'].indexOf[currentToken.type] < 0 ) {
        throw new Error('Unexpected token type : ' + currentToken.type);
      }
    }
    console.log(AST);
    return AST;
};

