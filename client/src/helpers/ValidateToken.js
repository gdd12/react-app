const ValidateToken = async (token) => {
  try {
    const response = await fetch('http://localhost:3000/api/user/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    if (response.ok) {
      console.log('Token is valid');
    } else {
      console.error('Token validation failed:', response.statusText);
    }
    return(response.status)
  } catch (error) {
    console.error('Token validation error:', error.message);
    return
  }
};

export default ValidateToken