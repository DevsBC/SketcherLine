import { TokenModel } from './token.model';
export interface ExpressionModel {
    arguments?: TokenModel[];
    name: string;
    type: string;
    value?: string;
}
