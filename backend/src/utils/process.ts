import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const VM_USER = process.env.VM_USER!;
const VM_HOST = process.env.VM_HOST!;

interface ProcessInfo {
    pid: number;
    user: string;
    cpu: number;
    mem: number;
    comm: string;
}

interface SystemSummary {
    loadAverage: string;
    tasks: string;
    cpuUsage: string;
    memUsage: string;
    swapUsage: string;
}

export interface SystemStatus {
    summary: SystemSummary;
    processes: ProcessInfo[];
}

export const getSystemStatus = (): Promise<SystemStatus> => {
    return new Promise((resolve, reject) => {
        exec(`ssh ${VM_USER}@${VM_HOST} "top -b -n 1"`, (err, stdout, stderr) => {
            if (err) {
                console.error("SSH command failed:", stderr);
                return reject(err);
            }

            const lines = stdout.trim().split("\n");

            const summary: SystemSummary = {
                loadAverage: lines[0]?.split('load average: ')[1] || 'N/A',
                tasks: lines[1]?.split('Tasks: ')[1] || 'N/A',
                cpuUsage: lines[2]?.split('%Cpu(s): ')[1] || 'N/A',
                memUsage: lines[3]?.split(': ')[1]?.trim() || 'N/A',
                swapUsage: lines[4]?.split(': ')[1]?.trim() || 'N/A',
            };

            const headerIndex = lines.findIndex(line => line.trim().startsWith('PID'));
            if (headerIndex === -1){
                return resolve({ summary, processes: []});
            }

            const processLines = lines.slice(headerIndex + 1);
            const processes: ProcessInfo[] = processLines.map(line => {
                const parts = line.trim().split(/\s+/);
                const [pidStr = "0", user = "", , , , , , , cpuStr = "0", memStr = "0"] = parts;
                const comm = parts.slice(11).join(' ');

                return {
                    pid: parseInt(pidStr, 10) || 0,
                    user: user || '',
                    cpu: parseFloat(cpuStr) || 0,
                    mem: parseFloat(memStr) || 0,
                    comm: comm || '',
                }
            }).filter(p => p.pid > 0);

            resolve({ summary, processes });
        });
    });
};