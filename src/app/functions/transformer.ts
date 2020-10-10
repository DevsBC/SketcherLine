export const transformer = (ast) => {

    const makeColor = (level) => {
      if (typeof level === 'undefined') {
        level = 100;
      }
      level = 100 - parseInt(level, 10); // flip
      return 'rgb(' + level + '%, ' + level + '%, ' + level + '%)';
    };

    const findParamValue = (p) => {
      if (p.type === 'word') {
        return variables[p.value];
      }
      return p.value;
    };

    const elements = {
      Line : (param, penColorValue) => {
        console.log(param);
        const line = {
          tag: 'line',
          attr: {
            x1: findParamValue(param[0]),
            y1: 100 - findParamValue(param[1]),
            x2: findParamValue(param[2]),
            y2: 100 - findParamValue(param[3]),
            stroke: makeColor(penColorValue),
            'stroke-linecap': 'round'
          },
          body: []
        };
        console.log(line);
        return line;
      },
      Paper : (param) => {
        const rect = {
          tag : 'rect',
          attr : {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            fill: makeColor(findParamValue(param[0]))
          },
          body : []
        };
        return rect;
      }
    };

    const newAST = {
      tag : 'svg',
      attr: {
        width: '100%',
        height: '100%',
        viewBox: '0 0 100 100',
        xmlns: 'http://www.w3.org/2000/svg',
        version: '1.1'
      },
      body: []
    };

    let currentPenColor: any = [];
    // TODO : warning when paper and pen is same color

    const variables = {};

    while (ast.body.length > 0) {
      const node = ast.body.shift();
      if (node.type === 'CallExpression' || node.type === 'VariableDeclaration') {
        if (node.name === 'Pen') {
          currentPenColor = findParamValue(node.arguments[0]);
        } else if (node.name === 'Set') {
          variables[node.identifier.value] = node.value.value;
        } else {
          const el = elements[node.name];
          if (!el) {
            throw new Error(node.name + ' is not a valid command.');
          }
          if (typeof !currentPenColor === 'undefined') {
            // throw 'Please define Pen before drawing Line.'
            // TODO : message 'You should define Pen before drawing Line'
          }
          newAST.body.push(el(node.arguments, currentPenColor));
        }
      }
    }
    return newAST;
};
