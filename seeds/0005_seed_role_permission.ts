import { Knex } from "knex";

export const rolePermissionSeed = [
    // Admin Role (Full Access)
    { role_id: 1, permission_id: 1 }, // manage_users
    { role_id: 1, permission_id: 2 }, // view_reports
    { role_id: 1, permission_id: 3 }, // edit_settings
    { role_id: 1, permission_id: 4 }, // access_all_data
    { role_id: 1, permission_id: 5 }, // view_own_data
    { role_id: 1, permission_id: 6 }, // update_profile

    // User Role (Limited Access)
    { role_id: 2, permission_id: 5 }, // view_own_data
    { role_id: 2, permission_id: 6 }, // update_profile

    // Teller Role
    { role_id: 3, permission_id: 7 }, // manage_transactions
    { role_id: 3, permission_id: 8 }, // view_customer_data
    { role_id: 3, permission_id: 5 }, // view_own_data
    { role_id: 3, permission_id: 6 }, // update_profile

    // Manager Role
    { role_id: 4, permission_id: 10 }, // approve_loans
    { role_id: 4, permission_id: 11 }, // manage_team
    { role_id: 4, permission_id: 2 }, // view_reports
    { role_id: 4, permission_id: 5 }, // view_own_data
    { role_id: 4, permission_id: 6 }, // update_profile

    // Auditor Role
    { role_id: 5, permission_id: 12 }, // view_transactions
    { role_id: 5, permission_id: 2 },  // view_reports
    { role_id: 5, permission_id: 5 }, // view_own_data
    { role_id: 5, permission_id: 6 } // update_profile
]

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("role_permission").del();

    // Inserts seed entries
    await knex("role_permission").insert(rolePermissionSeed);
};
