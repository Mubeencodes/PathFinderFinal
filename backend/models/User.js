const supabase = require('../config/supabase');

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.fullname = data.fullname || '';
    this.bio = data.bio || '';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new user
  static async create(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          email: userData.email,
          password_hash: userData.passwordHash,
          fullname: userData.fullname || '',
          bio: userData.bio || ''
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return new User(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw error;
      }

      return new User(data);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw error;
      }

      return new User(data);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw error;
      }

      return new User(data);
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  // Update user
  async update(updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update current instance
      Object.assign(this, new User(data));
      return this;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  async delete() {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', this.id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get all users (with optional pagination)
  static async findAll(options = {}) {
    try {
      const { limit = 50, offset = 0 } = options;
      
      let query = supabase
        .from('users')
        .select('*')
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data.map(user => new User(user));
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  // Check if email exists
  static async emailExists(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking email existence:', error);
      throw error;
    }
  }

  // Check if username exists
  static async usernameExists(username) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking username existence:', error);
      throw error;
    }
  }

  // Convert to JSON (excluding sensitive data)
  toJSON() {
    const { password_hash, ...safeData } = this;
    return safeData;
  }
}

module.exports = User;