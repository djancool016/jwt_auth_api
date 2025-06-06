export class Role {
    constructor(
        private id: number,
        private name: string,
        private description: string
    ){}

    get getId(): number {
        return this.id;
    }

    get getName(): string {
        return this.name;
    }

    get getDescription(): string {
        return this.description;
    }
}