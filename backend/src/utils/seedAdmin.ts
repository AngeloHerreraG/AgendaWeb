// backend/src/utils/seedAdmin.ts
import { UserModel } from "../models/users";
import bcrypt from "bcrypt";

export const seedAdmin = async () => {
    try {
        const adminEmail = "admin@agendaweb.cl"; 
        const adminPassword = "admin123";
        const adminName = "Super Admin";

        // 2. Verificar si ya existe
        const existingAdmin = await UserModel.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log("Admin no encontrado. Creando uno nuevo...");

            // 3. Hashear la contraseña (crucial)
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

            // 4. Crear el usuario
            const newAdmin = new UserModel({
                name: adminName,
                email: adminEmail,
                passwordHash: passwordHash,
                birthDate: new Date("2000-01-01"),
                role: "admin",
                schedules: []
            });

            await newAdmin.save();
        }
    } catch (error) {
        console.error("Error al crear el admin (Seeding):", error);
    }
};