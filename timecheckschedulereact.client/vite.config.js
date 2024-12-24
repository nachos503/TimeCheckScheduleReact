import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const baseFolder =
    typeof process !== 'undefined' && process.env.APPDATA
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME || ''}/.aspnet/https`;

const certificateName = "timecheckschedulereact.client";

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// Проверяем наличие каталога
if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

// Проверяем и создаем сертификаты, если они отсутствуют
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    console.log("Сертификаты отсутствуют. Пытаемся создать...");

    const result = child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit' });

    if (result.error) {
        console.error("Ошибка выполнения команды dotnet dev-certs:", result.error);
        throw new Error("Не удалось создать сертификат. Проверьте установку .NET SDK.");
    }

    if (result.status !== 0) {
        throw new Error("Не удалось создать сертификат. Проверьте доступ к каталогу.");
    }
}

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        },
        proxy: {
            '/api': {
                target: 'https://localhost:7070', // Убедитесь, что порт совпадает с бэкендом
                secure: false, // Игнорируем проверку сертификата
                changeOrigin: true
            }
        }
    }
});
