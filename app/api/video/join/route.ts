import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as db from "@/lib/db";
import { createVideoRoom, createMeetingToken, roomUrl } from "@/lib/video";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { appointmentId } = await req.json();
  if (!appointmentId) {
    return NextResponse.json({ error: "Missing appointmentId" }, { status: 400 });
  }

  const appointment = await db.findAppointmentById(appointmentId);
  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  const isPatient = session.user.id === appointment.patientId;
  const isProvider = session.user.role === "PROVIDER";
  if (!isPatient && !isProvider) {
    return NextResponse.json({ error: "Not authorized for this appointment" }, { status: 403 });
  }

  if (appointment.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "This appointment isn't confirmed yet, so the video visit isn't open." },
      { status: 400 }
    );
  }

  try {
    let roomName = appointment.videoRoomName;
    if (!roomName) {
      roomName = await createVideoRoom(appointment.id);
      await db.setAppointmentVideoRoom(appointment.id, roomName);
    }

    const user = await db.findUserById(session.user.id);
    const token = await createMeetingToken(
      roomName,
      user?.name ?? "Guest",
      isProvider
    );

    return NextResponse.json({ url: roomUrl(roomName, token) });
  } catch (err) {
    console.error("[video/join] failed:", err);
    return NextResponse.json(
      { error: "Video visits aren't configured yet. Add DAILY_API_KEY and DAILY_DOMAIN." },
      { status: 500 }
    );
  }
}
