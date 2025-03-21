
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return new Response(
        JSON.stringify({ error: "Email, OTP, and password are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Special case for test accounts
    if (email === "test@example.com" && otp === "123456") {
      // Create test accounts
      const testUsers = [
        { email: "test1@example.com", password: "password123" },
        { email: "test2@example.com", password: "password123" },
        { email: "test3@example.com", password: "password123" }
      ];
      
      console.log("Creating test accounts...");
      
      for (const user of testUsers) {
        try {
          // Check if user already exists
          const { data: existingUsers } = await supabase.auth.admin.listUsers({
            filters: { email: user.email }
          });
          
          if (existingUsers && existingUsers.users.length > 0) {
            console.log(`User ${user.email} already exists, skipping...`);
            continue;
          }
          
          // Create the user
          const { error: createError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true
          });
          
          if (createError) {
            console.error(`Error creating test user ${user.email}:`, createError);
          } else {
            console.log(`Test user created: ${user.email}`);
          }
        } catch (error) {
          console.error(`Error processing test user ${user.email}:`, error);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          message: "Test accounts created successfully", 
          testAccounts: testUsers
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Regular OTP verification flow
    const { data, error } = await supabase
      .from("auth_otps")
      .select("*")
      .eq("email", email)
      .eq("code", otp)
      .gt("expires_at", new Date().toISOString())
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.error("Error verifying OTP:", error);
      return new Response(
        JSON.stringify({ error: "Invalid or expired OTP" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Mark the OTP as verified
    await supabase
      .from("auth_otps")
      .update({ verified: true })
      .eq("id", data.id);

    // Create the user account
    const { data: userData, error: signupError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (signupError) {
      console.error("Error creating user:", signupError);
      return new Response(
        JSON.stringify({ error: signupError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Account created successfully",
        user: userData?.user
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
