const { BadRequestError, NotFoundError } = require("../../core/ApiError");
const prismaClient = require("../../models");

const createRole = async (role) => {
  try {
    console.log(role);
    const newRole = await prismaClient.role.create({ data: role });
    if (!newRole) throw new BadRequestError("Failed to create role");

    return newRole;
  } catch (err) {
    throw new BadRequestError("Failed to create role");
  }
};

const getRoles = async () => {
  try {
    const roles = await prismaClient.role.findMany();
    if (!roles) throw new NotFoundError("Role not found");

    return roles;
  } catch (err) {
    throw new BadRequestError("Failed to get roles");
  }
};

const updateRole = async ({ id, status }) => {
  try {
    const role = await prismaClient.role.update({
      where: { id },
      data: {
        status,
      },
    });

    if (!role) throw new BadRequestError("Failed to update role");

    return role;
  } catch (err) {
    throw new BadRequestError("Failed to update role");
  }
};
module.exports = {
  createRole,
  getRoles,
};
