export interface User {
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    email: string,    
    role: string,
    phoneNumber?: string,
    city?: string
}

export interface Credentials {
    username: string,
    password: string
}

export interface LoggedInUser {
    Username: string,
    Email: string,
    Role: string
}