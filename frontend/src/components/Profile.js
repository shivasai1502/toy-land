import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone_number: '',
    addresses: [],
  });
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login page if token is not available
        return;
      }
      const response = await axios.get('http://localhost:5000/api/profile/get', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setIsChanged(true);
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...profile.addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };
    setProfile({ ...profile, addresses: updatedAddresses });
    setIsChanged(true);
  };

  const handleAddAddress = () => {
    setProfile({
      ...profile,
      addresses: [...profile.addresses, { address_line_1: '', address_line_2: '', city: '', state: '', zipcode: '' }],
    });
    setIsChanged(true);
  };

  const handleDeleteAddress = async (index) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login page if token is not available
        return;
      }
      await axios.delete('http://localhost:5000/api/profile/delete-address', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          address_index: index,
        },
      });
      setProfile({
        ...profile,
        addresses: profile.addresses.filter((_, i) => i !== index),
      });
      setIsChanged(true);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login page if token is not available
        return;
      }
      await axios.put('http://localhost:5000/api/profile/update', profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully');
      setIsChanged(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-fields">
        <div className="profile-field">
          <label>First Name:</label>
          <input type="text" name="firstname" value={profile.firstname} onChange={handleChange} />
        </div>
        <div className="profile-field">
          <label>Last Name:</label>
          <input type="text" name="lastname" value={profile.lastname} onChange={handleChange} />
        </div>
      </div>
      <div className="profile-fields">
        <div className="profile-field">
          <label>Email:</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} />
        </div>
        <div className="profile-field">
          <label>Phone Number:</label>
          <input type="text" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} />
        </div>
      </div>
      <div className="profile-addresses">
        <h3>Addresses</h3>
        {profile.addresses.length === 0 ? (
          <p>No addresses found. Please add an address.</p>
        ) : (
          profile.addresses.map((address, index) => (
            <div key={index} className="profile-address">
              <div className="profile-address-fields">
                <div className="profile-address-field">
                  <label>Address Line 1:</label>
                  <input
                    type="text"
                    value={address.address_line_1}
                    onChange={(e) => handleAddressChange(index, 'address_line_1', e.target.value)}
                  />
                </div>
                <div className="profile-address-field">
                  <label>Address Line 2:</label>
                  <input
                    type="text"
                    value={address.address_line_2}
                    onChange={(e) => handleAddressChange(index, 'address_line_2', e.target.value)}
                  />
                </div>
              </div>
              <div className="profile-address-fields">
                <div className="profile-address-field">
                  <label>City:</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                  />
                </div>
                <div className="profile-address-field">
                  <label>State:</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                  />
                </div>
                <div className="profile-address-field">
                  <label>Zipcode:</label>
                  <input
                    type="text"
                    value={address.zipcode}
                    onChange={(e) => handleAddressChange(index, 'zipcode', e.target.value)}
                  />
                </div>
              </div>
              <div className="profile-address-delete">
                <button onClick={() => handleDeleteAddress(index)}>Delete</button>
              </div>
            </div>
          ))
        )}
        <div className="profile-add-address">
          <button onClick={handleAddAddress}>Add Address</button>
        </div>
      </div>
      <div className="profile-save-button">
        <button onClick={handleSave} disabled={!isChanged}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;