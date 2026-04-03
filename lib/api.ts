export type TenantBootstrap = {
  tenant: {
    id: string;
    name: string;
    slug: string;
    domain: string;
    status: string;
    config: {
      theme?: {
        brandName?: string;
        primary?: string;
        secondary?: string;
        appearance?: string;
      };
    };
  };
};

export type LoginRequest = {
  tenant_slug: string;
  identity: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    tenant_slug: string;
    username: string;
    email: string;
    role: string;
    profile: Record<string, unknown>;
  };
  tenant: TenantBootstrap["tenant"];
};

export type MeResponse = {
  user: LoginResponse["user"];
};

export type UsersResponse = {
  users: LoginResponse["user"][];
};

const apiBaseURL = "";

export async function fetchTenantBootstrap(
  slug: string,
): Promise<TenantBootstrap> {
  const response = await fetch(`${apiBaseURL}/api/v1/tenant/bootstrap`, {
    headers: {
      "X-Tenant-Slug": slug,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(payload?.error ?? "failed to bootstrap tenant");
  }

  return (await response.json()) as TenantBootstrap;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${apiBaseURL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Slug": payload.tenant_slug,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const responsePayload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(responsePayload?.error ?? "login failed");
  }

  return (await response.json()) as LoginResponse;
}

export async function fetchCurrentUser(token: string): Promise<MeResponse> {
  const response = await fetch(`${apiBaseURL}/api/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const responsePayload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(responsePayload?.error ?? "failed to fetch current user");
  }

  return (await response.json()) as MeResponse;
}

export async function fetchUsers(token: string): Promise<UsersResponse> {
  const response = await fetch(`${apiBaseURL}/api/v1/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const responsePayload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(responsePayload?.error ?? "failed to fetch users");
  }

  return (await response.json()) as UsersResponse;
}
