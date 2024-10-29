export function getRandomInt(max: number): number{
    return Math.floor(Math.random() * max);
}

export function sanitizeString(str: string): string {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}