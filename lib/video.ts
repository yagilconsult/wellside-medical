/**
 * Wraps Daily.co's REST API for creating video visit rooms and
 * short-lived meeting tokens.
 *
 * IMPORTANT — before this is used for a real patient session: Daily's
 * free/standard tier is NOT HIPAA-eligible. A video visit is the actual
 * clinical session — the most sensitive data on this whole platform.
 * Going live with real patients requires upgrading to Daily's HIPAA
 * add-on plan and signing a BAA first. This integration is fully
 * functional for building and testing now; treat any real usage before
 * that upgrade as a compliance gap, the same way the insurance
 * verification integration was intentionally left paused pending a BAA.
 */

const DAILY_API_BASE = "https://api.daily.co/v1";

function requireApiKey() {
  const key = process.env.DAILY_API_KEY;
  if (!key) {
    throw new Error(
      "DAILY_API_KEY is not set. Add your Daily.co API key to .env to enable video visits."
    );
  }
  return key;
}

/**
 * Creates a new private Daily room for an appointment. Rooms expire 24
 * hours after creation so they don't accumulate indefinitely.
 */
export async function createVideoRoom(appointmentId: string): Promise<string> {
  const apiKey = requireApiKey();
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24h from now

  const res = await fetch(`${DAILY_API_BASE}/rooms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `wellside-${appointmentId}`.slice(0, 128),
      privacy: "private",
      properties: {
        exp: expiresAt,
        enable_screenshare: true,
        enable_chat: true,
        enable_knocking: false,
        eject_at_room_exp: true,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create Daily room: ${res.status} ${body}`);
  }

  const room = await res.json();
  return room.name;
}

/**
 * Issues a short-lived token granting one specific user access to a
 * private room. The token — not the room name — is what actually
 * authorizes joining, so it must only be handed to someone already
 * confirmed (server-side) to be allowed on that call.
 */
export async function createMeetingToken(
  roomName: string,
  userName: string,
  isOwner: boolean
): Promise<string> {
  const apiKey = requireApiKey();

  const res = await fetch(`${DAILY_API_BASE}/meeting-tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: userName,
        is_owner: isOwner,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // valid 2 hours
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create meeting token: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.token;
}

export function roomUrl(roomName: string, token: string): string {
  const domain = process.env.DAILY_DOMAIN;
  if (!domain) {
    throw new Error("DAILY_DOMAIN is not set. Add your Daily.co subdomain to .env.");
  }
  return `https://${domain}.daily.co/${roomName}?t=${token}`;
}
