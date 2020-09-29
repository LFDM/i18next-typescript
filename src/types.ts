import { StringMap, TFunctionResult, TOptions, WithT } from "i18next";

export interface TFunctionWithTypes<Keys> {
  // basic usage
  <
    TKeys extends Keys,
    TResult extends TFunctionResult = string,
    TInterpolationMap extends object = StringMap
  >(
    key: TKeys | TKeys[],
    options?: TOptions<TInterpolationMap> | string
  ): TResult;
  // overloaded usage
  <
    TKeys extends Keys,
    TResult extends TFunctionResult = string,
    TInterpolationMap extends object = StringMap
  >(
    key: TKeys | TKeys[],
    defaultValue?: string,
    options?: TOptions<TInterpolationMap> | string
  ): TResult;
}

export interface WithTWithTypes<Keys> extends WithT {
  t: TFunctionWithTypes<Keys>;
}
