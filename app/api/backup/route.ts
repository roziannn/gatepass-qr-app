import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";

export async function GET(req: NextRequest) {
  const timestamp = Date.now();
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;

  if (!dbName) {
    return new Response(JSON.stringify({ message: "DB_NAME tidak ditemukan di environment" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const tmpDir = os.tmpdir();
  const sqlFile = path.join(tmpDir, `backup_${dbName}_${timestamp}.sql`);

  try {
    // dump database langsung ke file SQL
    await new Promise<void>((resolve, reject) => {
      const args = [`-hlocalhost`, `-u${dbUser}`];
      if (dbPassword) args.push(`-p${dbPassword}`);
      args.push("--default-character-set=utf8", dbName);

      const dump = spawn("C:\\xampp\\mysql\\bin\\mysqldump.exe", args);

      const writeStream = fs.createWriteStream(sqlFile);
      dump.stdout.pipe(writeStream);

      dump.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`mysqldump exited with code ${code}`));
      });

      dump.on("error", reject);
    });

    const data = fs.readFileSync(sqlFile);
    fs.unlinkSync(sqlFile);

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/sql",
        "Content-Disposition": `attachment; filename=backup_${dbName}_${timestamp}.sql`,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Gagal membuat backup database" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
