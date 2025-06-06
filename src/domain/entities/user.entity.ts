import { Uuid } from "../value_object/uuid";

export class User {

    constructor(
        private id: number,
        private uuid: Uuid,
        private username: string,
        private email: string,
        private password: string,
    ) {}

    get getId(): number {
        return this.id;
    }

    get getUuid(): Uuid {
        return this.uuid;
    }

    get getUsername(): string {
        return this.username;
    }

    get getEmail(): string {
        return this.email;
    }

    get getPassword(): string {
        return this.password;
    }

    get toObject() {
        return {
            id: this.id,
            uuid: this.uuid.value,
            username: this.username,
            email: this.email,
            password: this.password,
        }
    }

    set setUsername(username: string) {
        this.username = username;
    }

    set setEmail(email: string) {
        this.email = email;
    }

    set setPassword(password: string) {
        this.password = password;
    }
    
}