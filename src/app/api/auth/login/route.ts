import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = LoginSchema.parse(body);
    
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    // Set session expiration time (1 hour from now)
    const sessionExpiration = Date.now() + 3600000; // 1 hour in milliseconds

    const loggedInUser = NextResponse.json({
      success: true,
      user: data.user,
      sessionExpiration // Include session expiration timestamp
    });
    return loggedInUser;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
} 