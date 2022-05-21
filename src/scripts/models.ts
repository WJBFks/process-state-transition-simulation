class Process {
  id: string;
  pri: number;
  mem: number;
  constructor(id: string, pri: number, mem: number) {
    this.id = id;
    this.pri = pri;
    this.mem = mem;
  }
}

export { Process };
