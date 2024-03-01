export function isInstance<T extends object>(value: string | number | null, type: T): type is T {
    return Object.values(type).includes(value);
}