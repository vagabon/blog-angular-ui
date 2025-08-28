
export const removeDuplicate = <U>(persons: U[] = []): U[] => {
    return persons.filter(
        (item, index, self) => index === self.findIndex((t) => t['id' as keyof U] === item['id' as keyof U])
    );
};