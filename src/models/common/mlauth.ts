import { required, minLength, email, PasswordRequirement } from './validators'
import { IUser } from './user'

// export interface IAuthType {
//     isAuthenticated: boolean,
//     strategy: string,
//     schema: string,
//     provider: string
// }

// export const defaultAuthType: IAuthType = {
//     isAuthenticated: false,
//     strategy: "",
//     schema: null,
//     provider: "",
// }

export interface MLLogin {
    username: string
    password: string
}

export const MLLogin: MLLogin = {
    username: '',
    password: ''
}

export const MLLoginValidation = {
    username: {
        required,
    },
    password: {
        required,
        // PasswordRequirement,
        // minLength: minLength(6),
    }
}

export interface MLAuth {
    token?: string
    isAuthenticated: boolean
    user: IUser
}

export const MLAuth: MLAuth = {
    token: '',
    isAuthenticated: false,
    user: null
}