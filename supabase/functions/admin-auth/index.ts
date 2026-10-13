import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, type User } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import bcrypt from "npm:bcryptjs@3.0.3";
import * as OTPAuth from "npm:otpauth@9.4.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-recovery-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type AdminRecord = {
  id: string;
  user_id: string | null;
  username: string;
  role: string | null;
  password_hash: string | null;
  two_factor_secret: string | null;
  two_factor_enabled: boolean | null;
  backup_codes: string[] | null;
};

function response(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, { status, headers: corsHeaders });
}

function getSyntheticEmail(adminId: string): string {
  return `admin-${adminId}@bwivox.invalid`;
}

function secretsMatch(expected: string, provided: string): boolean {
  const encoder = new TextEncoder();
  const expectedBytes = encoder.encode(expected);
  const providedBytes = encoder.encode(provided);
  let difference = expectedBytes.length ^ providedBytes.length;

  for (let index = 0; index < Math.max(expectedBytes.length, providedBytes.length); index++) {
    difference |= (expectedBytes[index] ?? 0) ^ (providedBytes[index] ?? 0);
  }

  return difference === 0;
}

function generateBackupCodes(): string[] {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  return Array.from({ length: 10 }, () => {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  });
}

async function rateLimitKey(username: string): Promise<string> {
  const normalizedUsername = username.trim().toLowerCase();
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalizedUsername),
  );
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function verifyOtp(admin: AdminRecord, value: string): { valid: boolean; backupCode?: string } {
  if (!admin.two_factor_secret) return { valid: false };
  if (/^\d{6}$/.test(value)) {
    const totp = new OTPAuth.TOTP({
      issuer: "Admin Panel",
      label: admin.username,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(admin.two_factor_secret),
    });
    return { valid: totp.validate({ token: value, window: 1 }) !== null };
  }

  const backupCode = value.toUpperCase();
  return (admin.backup_codes ?? []).includes(backupCode)
    ? { valid: true, backupCode }
    : { valid: false };
}

async function verifyAndConsumeOtp(
  admin: AdminRecord,
  value: string,
  consumeBackupCode: (adminId: string, code: string) => Promise<boolean>,
): Promise<boolean> {
  const result = verifyOtp(admin, value);
  if (!result.valid) return false;
  if (!result.backupCode) return true;

  return consumeBackupCode(admin.id, result.backupCode);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceKey || !anonKey) {
    console.error("Admin authentication configuration is incomplete");
    return response({ error: "Authentication service is temporarily unavailable" }, 503);
  }

  const service = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const consumeBackupCode = async (adminId: string, code: string): Promise<boolean> => {
    const { data, error } = await service.rpc("consume_admin_backup_code", {
      p_admin_id: adminId,
      p_code: code,
    });
    if (error) throw error;
    return data === true;
  };

  try {
    const body: unknown = await req.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return response({ error: "Invalid request" }, 400);
    }
    const payload = body as Record<string, unknown>;
    const action = payload.action;

    if (action === "recover-shika-password") {
      const recoverySecret = Deno.env.get("ADMIN_RECOVERY_TOKEN");
      if (!recoverySecret || new TextEncoder().encode(recoverySecret).length < 32) {
        console.error("Admin recovery is not configured with a sufficiently long secret");
        return response({ error: "Temporary recovery is unavailable" }, 503);
      }

      const providedSecret = req.headers.get("x-admin-recovery-token") ?? "";
      if (
        new TextEncoder().encode(providedSecret).length < 32 ||
        !secretsMatch(recoverySecret, providedSecret)
      ) {
        return response({ error: "Invalid recovery authorization" }, 401);
      }

      const newPassword = typeof payload.newPassword === "string" ? payload.newPassword : "";
      const newPasswordBytes = new TextEncoder().encode(newPassword).length;
      if (newPassword.length < 12 || newPasswordBytes > 72) {
        return response({ error: "New password must be at least 12 characters and no more than 72 UTF-8 bytes" }, 400);
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      const { data, error } = await service.rpc("recover_shika_admin_password", {
        p_password_hash: passwordHash,
      });
      if (error) throw error;
      if (data !== true) {
        return response({ error: "Temporary recovery has expired or was already used" }, 410);
      }

      return response({ success: true });
    }

    if (action === "login") {
      const username = typeof payload.username === "string" ? payload.username.trim() : "";
      const password = typeof payload.password === "string" ? payload.password : "";
      const otpCode = typeof payload.otpCode === "string" ? payload.otpCode.trim() : "";
      if (!username || !password || username.length > 128 || password.length > 1024) {
        return response({ error: "Invalid username or password" }, 400);
      }

      const key = await rateLimitKey(username);
      const { data: allowed, error: rateError } = await service.rpc("admin_auth_rate_limit", {
        p_key: key,
        p_success: false,
      });
      if (rateError) throw rateError;
      if (allowed !== true) {
        return response({ error: "Too many login attempts. Try again in 15 minutes." }, 429);
      }

      const { data: admin, error: adminError } = await service
        .from("admin_users")
        .select("id, user_id, username, role, password_hash, two_factor_secret, two_factor_enabled, backup_codes")
        .eq("username", username)
        .maybeSingle<AdminRecord>();
      if (adminError) throw adminError;

      const passwordMatches = Boolean(
        admin?.password_hash && await bcrypt.compare(password, admin.password_hash),
      );
      if (!admin || !passwordMatches) {
        return response({ success: false, error: "Invalid username or password" });
      }

      if (admin.two_factor_enabled) {
        if (!otpCode) return response({ success: true, requires2FA: true });
        if (!await verifyAndConsumeOtp(admin, otpCode, consumeBackupCode)) {
          return response({ success: false, error: "Invalid authentication code" });
        }
      }

      let authUser: User | null = null;
      if (admin.user_id) {
        const { data, error } = await service.auth.admin.getUserById(admin.user_id);
        if (error) {
          console.error("Linked admin auth account could not be loaded", { adminId: admin.id });
          return response({ error: "Admin account needs support before it can be migrated" }, 409);
        }
        authUser = data.user;
      }

      const email = authUser?.email || getSyntheticEmail(admin.id);
      const appMetadata = {
        ...(authUser?.app_metadata ?? {}),
        admin: true,
        admin_username: admin.username,
      };

      if (authUser) {
        const { data, error } = await service.auth.admin.updateUserById(authUser.id, {
          email,
          email_confirm: true,
          password,
          app_metadata: appMetadata,
        });
        if (error) throw error;
        authUser = data.user;
      } else {
        const { data, error } = await service.auth.admin.createUser({
          email,
          email_confirm: true,
          password,
          app_metadata: appMetadata,
        });
        if (error) throw error;
        authUser = data.user;

        const { error: linkError } = await service
          .from("admin_users")
          .update({ user_id: authUser.id })
          .eq("id", admin.id)
          .is("user_id", null);
        if (linkError) throw linkError;
      }

      const { error: clearRateError } = await service.rpc("admin_auth_rate_limit", {
        p_key: key,
        p_success: true,
      });
      if (clearRateError) throw clearRateError;

      const anonymous = createClient(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data: signedIn, error: signInError } = await anonymous.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError || !signedIn.session) {
        console.error("Legacy admin verification succeeded but Supabase session creation failed", {
          adminId: admin.id,
          error: signInError?.message,
        });
        return response({ error: "Could not establish a secure admin session" }, 503);
      }

      return response({
        success: true,
        requires2FA: false,
        session: {
          access_token: signedIn.session.access_token,
          refresh_token: signedIn.session.refresh_token,
        },
      });
    }

    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return response({ error: "Admin authentication required" }, 401);
    const { data: authData, error: authError } = await service.auth.getUser(token);
    if (authError || !authData.user) return response({ error: "Admin authentication required" }, 401);

    const { data: admin, error: adminError } = await service
      .from("admin_users")
      .select("id, user_id, username, role, password_hash, two_factor_secret, two_factor_enabled, backup_codes")
      .eq("user_id", authData.user.id)
      .maybeSingle<AdminRecord>();
    if (adminError) throw adminError;
    if (!admin) return response({ error: "Administrator access required" }, 403);

    if (action === "security-settings") {
      return response({
        username: admin.username,
        two_factor_enabled: Boolean(admin.two_factor_enabled),
      });
    }

    if (action === "change-credentials") {
      const currentPassword = typeof payload.currentPassword === "string" ? payload.currentPassword : "";
      const newUsername = typeof payload.newUsername === "string" ? payload.newUsername.trim() : "";
      const newPassword = typeof payload.newPassword === "string" ? payload.newPassword : "";
      if (!currentPassword || (!newUsername && !newPassword)) {
        return response({ error: "Current password and a new credential are required" }, 400);
      }
      if (newPassword && newPassword.length < 8) {
        return response({ error: "Password must contain at least 8 characters" }, 400);
      }
      if (newUsername && (newUsername.length > 128 || newUsername === admin.username)) {
        return response({ error: "Enter a different valid username" }, 400);
      }
      if (!admin.password_hash || !await bcrypt.compare(currentPassword, admin.password_hash)) {
        return response({ error: "Current password is incorrect" }, 401);
      }
      if (admin.two_factor_enabled) {
        const otpCode = typeof payload.otpCode === "string" ? payload.otpCode.trim() : "";
        if (!await verifyAndConsumeOtp(admin, otpCode, consumeBackupCode)) {
          return response({ error: "A valid authenticator or backup code is required" }, 400);
        }
      }

      const updatedHash = newPassword ? await bcrypt.hash(newPassword, 10) : admin.password_hash;
      const nextUsername = newUsername || admin.username;
      const { error: updateError } = await service
        .from("admin_users")
        .update({ username: nextUsername, password_hash: updatedHash })
        .eq("id", admin.id);
      if (updateError) throw updateError;

      if (newPassword) {
        const { error: authUpdateError } = await service.auth.admin.updateUserById(authData.user.id, {
          password: newPassword,
          app_metadata: {
            ...authData.user.app_metadata,
            admin: true,
            admin_username: nextUsername,
          },
        });
        if (authUpdateError) {
          console.error("Admin password changed but Supabase auth password sync failed", {
            adminId: admin.id,
            error: authUpdateError.message,
          });
          return response({
            error: "Credentials were saved, but session synchronization failed. Sign in again with the new password.",
          }, 503);
        }
      } else if (newUsername) {
        const { error: authUpdateError } = await service.auth.admin.updateUserById(authData.user.id, {
          app_metadata: {
            ...authData.user.app_metadata,
            admin: true,
            admin_username: nextUsername,
          },
        });
        if (authUpdateError) throw authUpdateError;
      }

      return response({ success: true });
    }

    if (action === "save-2fa") {
      if (admin.two_factor_enabled) {
        return response({ error: "Disable 2FA with your current code before setting it up again" }, 409);
      }
      const secret = typeof payload.secret === "string" ? payload.secret : "";
      const otpCode = typeof payload.otpCode === "string" ? payload.otpCode.trim() : "";
      if (!/^[A-Z2-7]{16,64}$/.test(secret) || !/^\d{6}$/.test(otpCode)) {
        return response({ error: "Invalid authenticator setup" }, 400);
      }
      if (!verifyOtp({ ...admin, two_factor_secret: secret }, otpCode).valid) {
        return response({ error: "The authenticator code is invalid" }, 400);
      }

      const backupCodes = generateBackupCodes();
      const { data, error } = await service
        .from("admin_users")
        .update({
          two_factor_enabled: true,
          two_factor_secret: secret,
          backup_codes: backupCodes,
          created_backup_codes_at: new Date().toISOString(),
        })
        .eq("id", admin.id)
        .or("two_factor_enabled.is.null,two_factor_enabled.eq.false")
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) return response({ error: "2FA settings changed; reload and try again" }, 409);
      return response({ success: true, backup_codes: backupCodes });
    }

    if (action === "regenerate-backup-codes") {
      const otpCode = typeof payload.otpCode === "string" ? payload.otpCode.trim() : "";
      if (!admin.two_factor_enabled || !await verifyAndConsumeOtp(admin, otpCode, consumeBackupCode)) {
        return response({ error: "A valid authenticator or backup code is required" }, 400);
      }
      const backupCodes = generateBackupCodes();
      const { data, error } = await service
        .from("admin_users")
        .update({ backup_codes: backupCodes, created_backup_codes_at: new Date().toISOString() })
        .eq("id", admin.id)
        .eq("two_factor_enabled", true)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) return response({ error: "2FA settings changed; reload and try again" }, 409);
      return response({ success: true, backup_codes: backupCodes });
    }

    if (action === "disable-2fa") {
      const otpCode = typeof payload.otpCode === "string" ? payload.otpCode.trim() : "";
      if (!admin.two_factor_enabled || !await verifyAndConsumeOtp(admin, otpCode, consumeBackupCode)) {
        return response({ error: "A valid authenticator or backup code is required" }, 400);
      }
      const { data, error } = await service
        .from("admin_users")
        .update({ two_factor_enabled: false, two_factor_secret: null, backup_codes: null })
        .eq("id", admin.id)
        .eq("two_factor_enabled", true)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) return response({ error: "2FA settings changed; reload and try again" }, 409);

      return response({ success: true });
    }

    return response({ error: "Unsupported admin action" }, 400);
  } catch (error) {
    console.error("Admin authentication request failed", error);
    return response({ error: "Admin authentication request failed" }, 500);
  }
});
