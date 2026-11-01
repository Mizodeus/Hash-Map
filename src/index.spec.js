import HashMap from ".";

describe("HashMap", () => {
    let map;

    beforeEach(() => {
        map = new HashMap();
    });

    describe("set() and get()", () => {
        test("stores and retrieves a value", () => {
            map.set("apple", "red");

            expect(map.get("apple")).toBe("red");
        });

        test("updates an existing key without increasing size", () => {
            map.set("apple", "red");
            map.set("apple", "green");

            expect(map.get("apple")).toBe("green");
            expect(map.length()).toBe(1);
        });

        test("returns undefined for a missing key", () => {
            expect(map.get("missing")).toBeUndefined();
        });
    });

    describe("has()", () => {
        test("returns true for an existing key", () => {
            map.set("apple", "red");

            expect(map.has("apple")).toBe(true);
        });

        test("returns false for a missing key", () => {
            expect(map.has("missing")).toBe(false);
        });
    });

    describe("remove()", () => {
        test("removes an existing key", () => {
            map.set("apple", "red");

            expect(map.remove("apple")).toBe(true);
            expect(map.has("apple")).toBe(false);
            expect(map.length()).toBe(0);
        });

        test("returns false when key does not exist", () => {
            expect(map.remove("missing")).toBe(false);
        });
    });

    describe("length()", () => {
        test("returns the number of stored keys", () => {
            map.set("apple", "red");
            map.set("banana", "yellow");
            map.set("grape", "purple");

            expect(map.length()).toBe(3);
        });
    });

    describe("clear()", () => {
        test("removes all entries", () => {
            map.set("apple", "red");
            map.set("banana", "yellow");

            map.clear();

            expect(map.length()).toBe(0);
            expect(map.keys()).toEqual([]);
            expect(map.values()).toEqual([]);
        });

        test("keeps capacity unchanged", () => {
            const capacity = map.capacity;

            map.set("apple", "red");
            map.clear();

            expect(map.capacity).toBe(capacity);
        });
    });

    describe("keys()", () => {
        test("returns all keys", () => {
            map.set("apple", "red");
            map.set("banana", "yellow");

            expect(map.keys()).toHaveLength(2);
            expect(map.keys()).toContain("apple");
            expect(map.keys()).toContain("banana");
        });
    });

    describe("values()", () => {
        test("returns all values", () => {
            map.set("apple", "red");
            map.set("banana", "yellow");

            expect(map.values()).toHaveLength(2);
            expect(map.values()).toContain("red");
            expect(map.values()).toContain("yellow");
        });
    });

    describe("entries()", () => {
        test("returns key-value pairs", () => {
            map.set("apple", "red");
            map.set("banana", "yellow");

            expect(map.entries()).toHaveLength(2);
            expect(map.entries()).toContainEqual(["apple", "red"]);
            expect(map.entries()).toContainEqual(["banana", "yellow"]);
        });
    });

    describe("collisions", () => {
        test("handles two keys with the same hash", () => {
            // Both keys have the same hash with the current hash function.
            const firstKey = "a";
            const secondKey = "q";

            map.set(firstKey, 1);
            map.set(secondKey, 2);

            expect(map.get(firstKey)).toBe(1);
            expect(map.get(secondKey)).toBe(2);
            expect(map.has(firstKey)).toBe(true);
            expect(map.has(secondKey)).toBe(true);
            expect(map.length()).toBe(2);
        });

        test("removes a key from the middle of a collision chain", () => {
            map.set("a", 1);
            map.set("q", 2);

            expect(map.remove("q")).toBe(true);
            expect(map.has("a")).toBe(true);
            expect(map.has("q")).toBe(false);
            expect(map.length()).toBe(1);
        });
    });

    describe("resize()", () => {
        test("increases capacity when load factor is exceeded", () => {
            const initialCapacity = map.capacity;

            for (let i = 0; i < 13; i++) {
                map.set(`key${i}`, i);
            }

            expect(map.capacity).toBe(initialCapacity * 2);
        });

        test("preserves all entries after resize", () => {
            for (let i = 0; i < 13; i++) {
                map.set(`key${i}`, i);
            }

            for (let i = 0; i < 13; i++) {
                expect(map.get(`key${i}`)).toBe(i);
            }

            expect(map.length()).toBe(13);
        });
    });
});