import { v4 as uuidv4 } from 'uuid'
import { randomString } from './test-utils'

export const mockUser = (user?: {username?: string}) => ({
    uuid: uuidv4(),
    username: user?.username ?? 'test_user' + randomString(10),
    password: randomString(10),
    email: `${randomString(10)}@example.com`
})
export const mockRoles = () => ({ 
    name: randomString(10), 
    description: randomString(20) 
})

export const mockPermission = () => ({
    name: randomString(10),
    description: randomString(20)
})

export const mockRoleAgregate = () => ({
    ...mockRoles(),
    permissions: [mockPermission()]
})

export const mockUserAgregate = () => ({
    ...mockUser(),
    role: mockRoleAgregate()
})



