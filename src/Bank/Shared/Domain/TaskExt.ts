import { Task } from "fp-ts/lib/Task";

export const call = <T>(task: Task<T>) => task()