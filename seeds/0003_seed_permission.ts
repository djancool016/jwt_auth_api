import { Knex } from "knex";

export const permissionSeed = [
    { id: 1, name: 'manage_users', description: 'Manage all users in the system' },
    { id: 2, name: 'view_reports', description: 'View all system-wide reports' },
    { id: 3, name: 'edit_settings', description: 'Edit application settings' },
    { id: 4, name: 'access_all_data', description: 'Access all data without restrictions' },
    { id: 5, name: 'view_own_data', description: 'View their own data only' },
    { id: 6, name: 'update_profile', description: 'Update personal profile information' },
    { id: 7, name: 'manage_transactions', description: 'Manage customer transactions' },
    { id: 8, name: 'view_customer_data', description: 'View customer data for assigned accounts' },
    { id: 9, name: 'view_team_reports', description: 'View reports for assigned team' },
    { id: 10, name: 'approve_loans', description: 'Approve or reject loan applications' },
    { id: 11, name: 'manage_team', description: 'Manage team and assign tasks' },
    { id: 12, name: 'view_transactions', description: 'View all transaction records' }
]

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("permission").del();

    // Inserts seed entries
    await knex("permission").insert(permissionSeed);
};
