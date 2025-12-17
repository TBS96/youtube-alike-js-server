export const DB_NAME = 'youtube-alike-db';

export const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};



// NOTES:
// for localhost(http), sameSite=Lax, secure=false
// for production(https), sameSite=None, secure=true