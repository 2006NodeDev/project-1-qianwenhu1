import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/User";

export function UserDTOtoUserConvertor( udto:UserDTO):User{    
    return {
        userId:udto.user_id,
        username: udto.username,
        password: udto.password,
        firstName: udto.first_name,
        lastName: udto.last_name,
        email: udto.email,
        monthOfBirth: udto.month_of_birth,
        dateOfBirth: udto.date_of_birth,
        yearOfBirth: udto.year_of_birth,
        image: udto.image,
        invalidAttempt: udto.invalid_attempt
    }
}