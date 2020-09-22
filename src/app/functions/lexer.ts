import { TokenModel } from '../models/token.model';
export const lexer = (code: any) => {
    const tokens: TokenModel[] = [];

    const replaceSpecialCharacters = (regex: string): any => {
      // \s : matches any whitespace character (equal to [\r\n\t\f\v ])
      //  + : match previous condition for one and unlimited times
      return regex
      .replace(/[\n\r]/g, ' *nl* ')
      .replace(/\[/g, ' *ob* ')
      .replace(/\]/g, ' *cb* ')
      .replace(/\{/g, ' *ocb* ')
      .replace(/\}/g, ' *ccb* ')
      .split(/[\t\f\v ]+/);
    };

    const tokensInput = replaceSpecialCharacters(code);

    const addToken = (type: string, value: any) => {
      const token = {} as TokenModel;
      token.type = type;
      if (value) { token.value = value; }
      tokens.push(token);
    };

    const isSpecialCharacter = (character: string) => {
      switch (character) {
        case '*nl*':
        case '*ob*':
        case '*cb*':
        case '*ocb*':
        case '*ccb*':
          return true;
        default:
          return false;
      }
    };

    const removeFirstAndLastCharacter = (character: string) => {
      return character.substring(1).slice(0, -1);
    };

    for (const t of tokensInput) {
      if (t.length <= 0 || isNaN(t)) {
        if (isSpecialCharacter(t)) {
          const character = removeFirstAndLastCharacter(t);
          addToken(character, undefined);
        } else if (t.length > 0) {
            addToken('word', t);
          }
        } else {
          addToken('number', Number(t));
        }
    }

    if (tokens.length < 1) {
      throw new Error('No Tokens Found. Try "Paper 10"');
    }

    return tokens;
};
