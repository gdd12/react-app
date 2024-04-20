const Logout = async () => {
  try {
    const token = sessionStorage.getItem('token');
    sessionStorage.removeItem('token');
    const response = await fetch('http://localhost:3000/api/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    return(response)
  } catch (error) {
    console.error('Logout error:', error.message);
  }
};

export default Logout