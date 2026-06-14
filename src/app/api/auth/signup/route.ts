import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
  hashPassword,
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    const role = body.role === "company" ? "company" : "jobseeker";

    let username = (body.username || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Derive a username from the email if none supplied.
    if (!username) username = email.split("@")[0].replace(/[^a-z0-9_]/g, "");

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      const taken = existing.email === email ? "Email" : "Username";
      return NextResponse.json({ error: `${taken} is already registered` }, { status: 409 });
    }

    const user = await User.create({
      name,
      username,
      email,
      role,
      password: hashPassword(password),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
    });

    const safe = user.toObject();
    delete safe.password;

    const res = NextResponse.json({ user: safe }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, createSessionToken(user._id.toString()), sessionCookieOptions);
    return res;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
