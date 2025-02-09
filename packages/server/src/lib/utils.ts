export function parseBoolean(value): boolean {
    const truthybooleanRegex = /^(true|yes|1)$/i;
    const falsyBooleanRegex = /^(false|no|0)$/i;

    if (truthybooleanRegex.test(value)) {
        return true;
    }
    if (falsyBooleanRegex.test(value)) {
        return false;
    }
    throw new Error(`Invalid boolean value: ${value}`);
}
