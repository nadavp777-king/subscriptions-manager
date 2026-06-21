import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId, userMetadata = {}) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile(data);
    } else if (error && error.code === 'PGRST116') {
      // Profile doesn't exist (PGRST116 = no rows returned). This happens often with Google Login.
      // We create the profile here so foreign key constraints on subscriptions don't fail.
      const fallbackName = userMetadata?.full_name || userMetadata?.name || 'User';
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, full_name: fallbackName }])
        .select()
        .single();
        
      if (newProfile) {
        setProfile(newProfile);
      } else if (insertError) {
        console.error('Error creating profile:', insertError);
      }
    } else {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id, session.user.user_metadata);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.user_metadata);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const register = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) return { data, error };
    
    // Insert into profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, full_name: fullName }]);
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }
    
    return { data, error };
  };

  const loginWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const logout = async () => {
    return await supabase.auth.signOut();
  };

  const value = {
    user,
    profile,
    login,
    register,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
