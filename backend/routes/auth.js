const express = require('express');
const supabase = require('../db/supabase');

const router = express.Router();

// Middleware to verify Supabase JWT
const authenticateJWT = async (req, res, next) => {
    let token = req.cookies.access_token;
    
    // Fallback to Bearer token string if cookie is not present
    if (!token && req.headers['authorization']) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Note: To truly verify the token offline you'd verify JWT directly, 
    // but the easiest secure way via Supabase is getUser()
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    
    // Fetch hotel_id from profiles
    try {
        const { data: profile, error: profileErr } = await supabase
            .from('profiles')
            .select('hotel_id')
            .eq('user_id', user.id)
            .single();
            
        if (!profileErr && profile) {
            req.user.hotel_id = profile.hotel_id;
        }
    } catch(err) {
        console.error("Error fetching hotel_id:", err);
    }

    next();
};

router.post('/signup', async (req, res) => {
    const { username, hotel_name, phone_number, email, password } = req.body;

    if (!username || !email || !hotel_name || !password) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        // 1. Create User in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            return res.status(400).json({ message: authError.message });
        }

        const user = authData.user;
        if (!user) {
            return res.status(400).json({ message: 'Signup failed. User not returned.' });
        }

        // 2. Insert into hotels using Service Role bypass
        const { data: hotelData, error: hotelError } = await supabase
            .from('hotels')
            .insert([{ hotel_name }])
            .select()
            .single();

        if (hotelError) {
            return res.status(400).json({ message: `Failed to create hotel: ${hotelError.message}` });
        }

        // 3. Insert into profiles
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                user_id: user.id,
                hotel_id: hotelData.id,
                username,
                phone_number,
                email
            }]);

        if (profileError) {
            return res.status(400).json({ message: `Failed to create profile: ${profileError.message}` });
        }

        return res.status(201).json({ 
            message: 'User created successfully. Please check your email to confirm the account.',
            requires_email_confirmation: !authData.session
        });

    } catch (err) {
        console.error('Signup Error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({ message: error.message });
        }

        const { session, user } = data;

        // Fetch User Info to get hotel details
        const { data: profile } = await supabase
            .from('profiles')
            .select('hotel_id, username, hotels(hotel_name)')
            .eq('user_id', user.id)
            .single();

        const hotel_id = profile?.hotel_id;
        const hotelName = profile?.hotels?.hotel_name;
        const username = profile?.username;

        // Set secure HttpOnly cookie for refresh token
        res.cookie('refresh_token', session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            access_token: session.access_token,
            user: { 
                id: user.id, 
                email: user.email, 
                username: username,
                hotel_id: hotel_id,
                hotelName: hotelName,
                role: 'Admin'
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/refresh', async (req, res) => {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
        return res.status(401).json({ message: 'No refresh token' });
    }

    try {
        const { data, error } = await supabase.auth.refreshSession({ refresh_token });

        if (error || !data.session) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        res.cookie('refresh_token', data.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ access_token: data.session.access_token });
    } catch (err) {
        console.error("Refresh token error:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/logout', async (req, res) => {
    res.clearCookie('refresh_token');
    
    // Attempt to log out of Supabase if access_token provided
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        await supabase.auth.signOut();
    }
    
    res.json({ message: 'Logged out successfully' });
});

router.get('/me', authenticateJWT, async (req, res) => {
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('hotel_id, username, email, hotels(hotel_name)')
            .eq('user_id', req.user.id)
            .single();

        return res.json({ 
            user: {
                id: req.user.id,
                email: profile?.email || req.user.email,
                username: profile?.username,
                hotelName: profile?.hotels?.hotel_name,
                hotel_id: profile?.hotel_id,
                role: 'Admin'
            }
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = {
    router,
    authenticateJWT
};
