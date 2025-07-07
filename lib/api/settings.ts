import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export interface CreateUserData {
  name: string
  email: string
  password: string
  role: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface CreateRoleData {
  name: string
  description?: string
  permissions: string[]
}

export interface UpdateRoleData {
  name?: string
  description?: string
  permissions?: string[]
}

// User management functions
export async function createUser(data: CreateUserData) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role as any,
        status: data.status || 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true
      }
    })

    return { success: true, user }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, users }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'Failed to fetch users' }
  }
}

export async function updateUser(userId: string, data: UpdateUserData) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.role && { role: data.role as any }),
        ...(data.status && { status: data.status })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true
      }
    })

    return { success: true, user }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: 'Failed to update user' }
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}

// Role management functions
export async function createRole(data: CreateRoleData) {
  try {
    // First create the role
    const role = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description
      }
    })

    // Then create permissions if they don't exist and associate them
    if (data.permissions && data.permissions.length > 0) {
      for (const permissionName of data.permissions) {
        // Create permission if it doesn't exist
        const permission = await prisma.permission.upsert({
          where: { name: permissionName },
          create: {
            name: permissionName,
            description: `Permission for ${permissionName}`,
            module: permissionName.split('.')[0] || 'general',
            action: permissionName.split('.')[1] || 'access'
          },
          update: {}
        })

        // Create role-permission association
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id
          }
        })
      }
    }

    return { success: true, role }
  } catch (error) {
    console.error('Error creating role:', error)
    return { success: false, error: 'Failed to create role' }
  }
}

export async function getAllRoles() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true
          }
        },
        users: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions.map(rp => rp.permission.name),
      userCount: role.users.length,
      createdAt: role.createdAt
    }))

    return { success: true, roles: formattedRoles }
  } catch (error) {
    console.error('Error fetching roles:', error)
    return { success: false, error: 'Failed to fetch roles' }
  }
}

export async function updateRole(roleId: string, data: UpdateRoleData) {
  try {
    // Update basic role info
    const role = await prisma.role.update({
      where: { id: roleId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description })
      }
    })

    // Update permissions if provided
    if (data.permissions) {
      // Remove existing permissions
      await prisma.rolePermission.deleteMany({
        where: { roleId: roleId }
      })

      // Add new permissions
      for (const permissionName of data.permissions) {
        const permission = await prisma.permission.upsert({
          where: { name: permissionName },
          create: {
            name: permissionName,
            description: `Permission for ${permissionName}`,
            module: permissionName.split('.')[0] || 'general',
            action: permissionName.split('.')[1] || 'access'
          },
          update: {}
        })

        await prisma.rolePermission.create({
          data: {
            roleId: roleId,
            permissionId: permission.id
          }
        })
      }
    }

    return { success: true, role }
  } catch (error) {
    console.error('Error updating role:', error)
    return { success: false, error: 'Failed to update role' }
  }
}

export async function deleteRole(roleId: string) {
  try {
    // Delete role permissions first
    await prisma.rolePermission.deleteMany({
      where: { roleId: roleId }
    })

    // Delete the role
    await prisma.role.delete({
      where: { id: roleId }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting role:', error)
    return { success: false, error: 'Failed to delete role' }
  }
}

export async function getAllPermissions() {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: [
        { module: 'asc' },
        { name: 'asc' }
      ]
    })

    return { success: true, permissions }
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return { success: false, error: 'Failed to fetch permissions' }
  }
}
