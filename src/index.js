class Node {
    constructor(key, value) {
        this.key = key
        this.value = value
        this.next = null
    }
}

export default class HashMap {
    constructor() {
        this.loadFactor = 0.75
        this.capacity = 16
        this.buckets = new Array(this.capacity).fill(null)
        this.size = 0
    }

    hash(key) {
        let hashCode = 0;

        const primeNumber = 67;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
        }
        
        return hashCode % this.capacity
    }

    set(key, value) {
        let node = new Node(key, value)

        const hash = this.hash(key)
        let current = this.buckets[hash]

        while(current) {
            if (current.key === key) {
                current.value = value
                return
            } else if (current.next === null) {
                current.next = node
                this.size++
                break
            } else {
                current = current.next
            }
        }

        if (this.buckets[hash] === null) {
            this.buckets[hash] = node
            current = this.buckets[hash]

            this.size++
        }

        if (this.size / this.capacity > this.loadFactor) {
            this.resize()
        }
    }

    get(key) {
        const hash = this.hash(key)
        let current = this.buckets[hash]

        while(current) {
            if (current.key === key) return current.value
            else current = current.next
        }
    }

    has(key) {
        const hash = this.hash(key);
        let current = this.buckets[hash];

        while (current) {
            if (current.key === key) {
                return true;
            }

            current = current.next;
        }

        return false;
    }

    remove(key) {
        const hash = this.hash(key)
        const first = this.buckets[hash]

        if (first === null) return false

        let current = first

        while(current) {
            if (first.key === key) {
                this.buckets[hash] = first.next 
                this.size--
                return true
            } else if (current.next === null) {
                return false
            } else if (current.next.key === key) {
                current.next = current.next.next
                this.size--
                return true
            }  else {
                current = current.next
            }

        }
    }

    length() {
        return this.size
    }

    clear() {
        this.buckets = new Array(this.capacity).fill(null)
        this.size = 0
    }

    keys() {
        let keyArr = []
        for (const bucket of this.buckets) {
            let current = bucket

            while (current) {
                keyArr.push(current.key)
                current = current.next
            }
        }
        return keyArr
    }

    values() {
        let valArr = []
        for (const bucket of this.buckets) {
            let current = bucket

            while (current) {
                valArr.push(current.value)
                current = current.next
            }
        }
        return valArr
    }

    entries() {
        const entArr = [];

        for (const bucket of this.buckets) {
            let current = bucket;

            while (current) {
                entArr.push([current.key, current.value]);
                current = current.next;
            }
        }

        return entArr;
    }

    resize() {
        const oldBuckets = this.buckets;

        this.capacity *= 2;
        this.buckets = new Array(this.capacity).fill(null);

        for (const bucket of oldBuckets) {
            let current = bucket;

            while (current) {
                const next = current.next;
                const index = this.hash(current.key);

                current.next = this.buckets[index];
                this.buckets[index] = current;

                current = next;
            }
        }
    }
}