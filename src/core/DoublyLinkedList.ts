export class Node<T> {
  value: T;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class DoublyLinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value: T): void {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.length++;
  }

  prepend(value: T): void {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.length++;
  }

  insert(index: number, value: T): void {
    if (index <= 0) {
      this.prepend(value);
    } else if (index >= this.length) {
      this.append(value);
    } else {
      const newNode = new Node(value);
      let prevNode = this.getNodeAt(index - 1);
      let nextNode = prevNode!.next;
      
      prevNode!.next = newNode;
      newNode.prev = prevNode;
      newNode.next = nextNode;
      nextNode!.prev = newNode;

      this.length++;
    }
  }

  remove(index: number): void {
    if (!this.head || index < 0 || index >= this.length) return;

    if (index === 0) {
      this.head = this.head.next;
      if (this.head) this.head.prev = null;
    } else if (index === this.length - 1) {
      this.tail = this.tail!.prev;
      if (this.tail) this.tail.next = null;
    } else {
      const prevNode = this.getNodeAt(index - 1);
      const nodeToRemove = prevNode!.next;
      prevNode!.next = nodeToRemove!.next;
      nodeToRemove!.next!.prev = prevNode;
    }
    this.length--;
  }

  private getNodeAt(index: number): Node<T> | null {
    if (index < 0 || index >= this.length) return null;
    let current = this.head;
    let i = 0;
    while (i < index) {
      current = current!.next;
      i++;
    }
    return current;
  }
  getAt(index: number): Node<T> | null {
    return this.getNodeAt(index);
  }
  

  getHead(): Node<T> | null {
    return this.head;
  }

  getTail(): Node<T> | null {
    return this.tail;
  }

  size(): number {
    return this.length;
  }
} 