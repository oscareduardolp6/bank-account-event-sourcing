

/**
 * Provides a way to reutilize type guard function, convert the types if they are the same primitive, 
 * for example a UUID has the same validation that an UserId, so you can use 
 * `translateBrandedType<UUID, UserID>(isUUID)` this will narrow the type to UserId appling the validations of UUID
 * @param typeGuard Type guard function 
 * @returns A New function that utilize the provided TypeGuard but with the BrandedType of the return changed
*/
export const translateBrandedType = <BaseType, NewType extends BaseType>
  (typeGuard: (val: BaseType) => boolean) => (val: BaseType): val is NewType => typeGuard(val)