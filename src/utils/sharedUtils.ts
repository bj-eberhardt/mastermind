export function getArrayWith<T>(length: number, value: T): T[] {
  return Array.from({ length }, () => value);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function testFormat(   value:    string   ):    string    {
    return     value.trim(  )   ;
}
