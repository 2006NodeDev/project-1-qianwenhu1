
export class User{
    userId: number // primary key
	username: string // not null, unique
	password: string // not null
	firstName: string // not null
	lastName: string // not null
	email: string // not null
	monthOfBirth: number // not null
	dateOfBirth: number // not null
	yearOfBirth: number // not null
	image: string
	invalidAttempt: number
}