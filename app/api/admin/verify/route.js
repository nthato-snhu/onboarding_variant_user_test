// API route to verify admin password
export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Check against environment variable
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      return Response.json(
        { error: 'Admin password not configured' },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      return Response.json({ authenticated: true });
    } else {
      return Response.json(
        { authenticated: false, error: 'Incorrect password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying password:', error);
    return Response.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    );
  }
}
