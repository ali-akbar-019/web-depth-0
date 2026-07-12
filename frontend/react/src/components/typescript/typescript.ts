// statistically typed lang
// compile time pe errors ka pata chal jata ha 
// intellisense b theek se kaam karta ha 
// errors reduction
// team collaboration
//self documenttation

// --------string
let name1: string = "ali";

let firstName: string = "ali"
let lastName: string = "akbar"
let fullName: string = firstName + " " + lastName;


let greeting: string = `Hello ${firstName}`

let message: string = "Hello world"

console.log(message.length)
console.log(lastName)
console.log(message.toUpperCase())
console.log(message.toLowerCase())


// -------------------number

// int
let age: number = 20;
let year: number = 2026;

// decimal
let price: number = 99.99
let temperature: number = -5.5

// mathematical operations
let a: number = 10;
let b: number = 3;
let sum: number = a + b;
let diff: number = a - b;
let product: number = a * b;
let division: number = a / b;


// number methods

let num: number = 3.14
console.log(num.toFixed(2))
console.log(Math.ceil(num))
console.log(Math.floor(num))
console.log(Math.round(num))


// boolean
let isLoggedIn: boolean = true;
let isActive: boolean = false;
let isAdmin: boolean = true;


// array
let numbers: number[] = [1, 2, 3, 4]

let names: Array<string> = ["Ali", "Zarak"]

let mixed: (string | number)[] = ["ali", 12]

let fruits: string[] = ["apple", "banana"]

// end pe push karo
fruits.push("grapes")
// first pe push karo
fruits.unshift("oranges")
// end se pop karo
fruits.pop()
// front se pop karo
fruits.shift()

// fooreach loop
fruits.forEach(f => console.log(f))


// object
// key and value pair me data store karna ha

let person = {
    name: "ali",
    age: 25,
    city: "isb"
}

let user: {
    name: string,
    age: number,
    city: string
} = {
    name: "ali",
    age: 22,
    city: "isb"
}
//
// interfaces
// interface ek blueprint hai, batata ha k object me kya kya properties honi chahie


interface User {
    id: number,
    name: string,
    email: string,
    age?: number //this field is optional, optional fields are made using the ? 
}

let user1: User = {
    email: "gamesforever018@gmail.com",
    id: 1,
    name: "ali akbar",
    age: 22

}

//similarly u can create any number of the users from this interface
// inheritance in the interfaces
interface Admin extends User {
    permissions: string[];
    role: "admin" | "superadmin";
}

let admin: Admin = {
    id: 2,
    email: "admin@gmail.com",
    name: "ali",
    permissions: ["everything ", "everything", "everything"],
    role: "admin",
    age: 22
}
// interface with methods
interface Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number
}

let calc: Calculator = {
    add: function (a: number, b: number): number { return a + b },
    subtract: function (a: number, b: number): number { return a - b }
}
console.log(calc.add(5, 3))
console.log(calc.subtract(23, 4))


// type alias
// kisi type ko naam dena. Jaise interface, leking zyada flexible

type UserID = string | number;
let id1: UserID = 1;
let id2: UserID = "two";

type Person = {
    name: string;
    age: number;
    city: string;
}

let person1: Person = {
    name: "ali",
    age: 22,
    city: "isb"
}

// union type alias
type Status = "pending" | "approved" | "rejected"
// these are the possible values

let orderStatus: Status = "approved"
orderStatus = "rejected"

// intersection type alias - combine types
type Name = {
    firstName: string;
    lastName: string;
}

type Age = {
    age: number;
}

type PersonWithAge = Name & Age; //donoi ko combine kar do

let person2: PersonWithAge = {
    firstName: "ali",
    age: 22,
    lastName: "akbar"

}

// interface vs type alias
// jab object define karna ho
interface Product {
    id: number;
    name: string;
    price: number;
}

// jab union, intersection, complex types ho
type Status2 = "active" | "inactive" | "pending"
type ID = string | number


// interface extends kar sakta ha 
interface Animal {
    name: string
}
interface Dog extends Animal {
    breed: string;
}

// intersection - multiple combine
type A = { a: number }
type B = { b: number }
type C = A & B; //a: number; b:number

// rule of thumb
// interface: Objects, classes, extending
// Type: Unions, intersections, complex types

// Union and Intersection Types

// union Types OR

let value: string | number;
value = "Hello"
value = 22

// uniion with lietral types

type Directions = "north" | "south" | "east" | "west";
let dir: Directions = "east"
dir = "north"

// union with interfaces
interface Bird {
    fly(): void;
    layEggs(): void;
}
interface Fish {
    swim(): void;
    layEggs(): void;
}
// now the union
type Animal2 = Bird | Fish;  //in me se koi aik ho ga 

// type guard(check karo konsa type ha )
function handleAnimal(animal: Animal2) {
    if ("fly" in animal) {
        animal.fly();
    } else {
        animal.swim();
    }
}

// Intersection AND
type Person3 = {
    name: string;
    age: number;
}

type Employee = {
    empoyeeId: string;
    department: string;
}

type EmployeePerson = Person & Employee; //dono combine ho jaye gi
let employee2: EmployeePerson = {
    name: "ali",
    age: 22,
    empoyeeId: "22",
    department: "HR",
    city: "isb"
}


// Generics resuable code
// ek template jo any type k sath kaam kar sakta ha

// without generic tmhe har data type k leye same chez bar bar banani ho gi but with generics tm aik hi bar banao and then tm us ko kisi b data type k sath use kar sakte ho

function identity<T>(value: T): T {
    return value;
}

let num2 = identity<number>(12);
let str2 = identity<string>("ali akbar");
let booli = identity<boolean>(false);
// type script automatically types assign kar deta ha
// generics ka concept cpp , java etc langauge me b ha

// generics with interfaces

interface Box<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void
}

let numberBox: Box<number> = {
    value: 12,
    getValue: function () { return this.value },
    setValue: function (v: number) { this.value = v }
}

let stringBox: Box<string> = {
    value: "Ali",
    getValue: function () { return this.value },
    setValue: function (v: string) { this.value = v }
}
// 
interface Pair<T, U> {
    first: T;
    second: U
}

let pair: Pair<number, string> = {
    first: 1,
    second: "One"
}

// utility types

// 1 partial <T>
// sab properties ko optonal bana deta ha 
interface User3 {
    id: number;
    name: string;
    email: string;
}
// without partial sab properties requried ha 
let user3: User3 = {
    id: 1,
    name: "ali",
    email: "gamesofreveer018@gmail.com"
}
//with partial sab properties optional ha 
let user2: Partial<User3> = {}

// real use: update function
function updateUser(id: number, updates: Partial<User>) {
    // sirf jo properties update karni ha wo kar do
    // baqi optional
}

updateUser(1, { name: "ali" })
updateUser(1, { age: 22 })
updateUser(1, { email: "gamesforever018@gmail.com" })


// 2. Required
// sab properties ko required bana do
let user4: Required<User3> = {
    id: 1,
    name: "Ali",
    email: "gamesforever018@gmail.com"

}

// 3. pick<T, K>

//sirf selected properties lo
interface User4 {
    id: number;
    name: string;
    email: string;
    password: string;
    age: number;
}
type UserPreview = Pick<User4, "id" | "name">;

let preview: UserPreview = {
    id: 1,
    name: "ali"
}

// 4. Omit<T, K >
// selected properties ko hata do


type UserPublic = Omit<User4, "id" | "password">


// 5. Record<K, T>

// key value pairs ka object
type UserMap = Record<string, User4>
let users: UserMap = {
    "user1": { id: 1, name: "ali", email: "ali@gmail.com", age: 22, password: "123" }
}

// 6. Readonly
// sab properties ko readonly bana do
let user6: Readonly<User4> = {
    id: 1, name: "ali", email: "ali@gmail.com", age: 22, password: "123"
}

// -----------TYPE GUARDS
// run time pe check karna k value kis type ki ha
function processValue(value: string | number) {
    if (typeof value === "string") {
        return value.toUpperCase();
    } else if (typeof value === "number") {
        return Math.ceil(value)


    } else {
        return "invalid type"
    }
}

// instanceof type guard classes k leye
class Dog {
    bark() {
        console.log("woof")


    }


}
class Cat {
    meow() {
        console.log("Meow!")
    }
}

function handleAnimal2(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();
    }
    if (animal instanceof Cat) {
        animal.meow();
    }
}

// in operator object property check 

interface Car {
    drive(): void;

}
interface Boat {
    sail(): void;
}

function useVehicle(vehicle: Car | Boat) {
    if ("drive" in vehicle) {
        vehicle.drive();
    } else {
        vehicle.sail();
    }
}

// --------------CLASSES
// objects banane ka blue print
class Person2 {
    name: string;
    age: number;

    // constructor
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    // methods
    greet() {
        return "Hello i am " + this.name
    }
}

let person3 = new Person2("ali", 25)
console.log(person3.name)
console.log(person3.greet())


// public name: string; // Sab jagah accessible
//     private age: number; // Sirf class ke andar
//     protected email: string; // Class aur children mein


//task 1
interface Product {
    id: number;
    name: string;
    price: number;
    category?: string;
}
let products: Product[] = [
    {
        id: 1,
        name: "product 1",
        price: 22,
        category: "cat1"
    },
    {
        id: 2,
        name: "product 2",
        price: 32,
        category: "cat1"
    },
    {
        id: 3,
        name: "product 3",
        price: 22,
        category: "cat2"
    },
]

function calcTotal(products: Product[]): number {
    return products.reduce((p, c) => p + c.price, 0);
}
// task 2

function firstElArr<T>(arr: T[]): T {
    return arr[0]
}

type ResponseStatus = "success" | "error" | "loading"

interface ApiResponse<T> {
    data: T;
    status: ResponseStatus;
    message?: string;
}


// task 3
class Store<T> {
    items: T[]

    constructor(items: T[]) {
        this.items = items;
    };
    //
    public addItem(item: T): void {
        this.items.push(item)

    }
    public removeItem(id: number): void {
        // @ts-ignore
        this.items = this.items.filter((item) => item.id != id)
    }
    public getItem(id: number): T | undefined {
        return this.items[id]
    }
    public getAllItems(): T[] {
        return this.items
    }

}