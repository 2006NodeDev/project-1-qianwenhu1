import { UserDTO } from "../dtos/user-dto";
import { User } from "../models/User";
import { Role } from "../models/Role";

export function UserDTOtoUserConvertor( udto:UserDTO):User{
    let userRole:Role = {roleId: udto.role_id, role:udto.role}
    
    return {
        userId:udto.user_id,
        username: udto.username,
        password: udto.password,
        firstName: udto.first_name,
        lastName: udto.last_name,
        email: udto.email,
        role: userRole
    }
}