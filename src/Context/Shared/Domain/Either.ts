import { Left, Right } from "fp-ts/Either";

export const getData = <T>(validation: Right<T>) => validation.right
export const getError = <T>(validation: Left<T>) => validation.left