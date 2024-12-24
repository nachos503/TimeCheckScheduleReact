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

// ��������� ������� ��������
if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

// ��������� � ������� �����������, ���� ��� �����������
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    console.log("����������� �����������. �������� �������...");

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
        console.error("������ ���������� ������� dotnet dev-certs:", result.error);
        throw new Error("�� ������� ������� ����������. ��������� ��������� .NET SDK.");
    }

    if (result.status !== 0) {
        throw new Error("�� ������� ������� ����������. ��������� ������ � ��������.");
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
                target: 'https://localhost:7070', // ���������, ��� ���� ��������� � ��������
                secure: false, // ���������� �������� �����������
                changeOrigin: true
            }
        }
    }
});
