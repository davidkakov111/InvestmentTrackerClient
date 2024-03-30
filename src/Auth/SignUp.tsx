import { useState } from 'react';

type newUserType = {
  email: string,
  password: string
}

function validateInput(email: string, password: string, passwordAgain: string) {
  // Checking email
  if (!email.includes('@') || !email.includes('.') || email.length < 5 ) {
    alert('The email address is invalid. Please provide a valid email address.');
    return false;
  }
  // Checking for type error
  if (password !== passwordAgain) {
    alert('The passwords do not match.');
    return false;
  }
  // Checking password length
  if (password.length < 6) {
    alert('The password is too short. It must be at least 6 characters long.');
    return false;
  }
  return true;
}

// Sign-up form component
const SignUpForm = () => {
  // Initializing router and state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordAgain: ''
  });

  // Function responsible for registration
  const handleSignUp = async () => {
    if (!validateInput(formData.email, formData.password, formData.passwordAgain)) return;

    const newUser: newUserType = {
      email: formData.email,
      password: formData.password
    }
    
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/SaveUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    
    const result = await response.json();

    if (result.result === "SignIn") {
      alert("The email address is already taken!")
    } 

    if (!response.ok) {
      alert("Error saving the new user! (API -> backend -> API)");
      return;
    }

    const JWT = response.headers.get('Authorization');
    if (JWT) {
      localStorage.setItem('JWTToken', JWT);
    }

    // Clean up 
    setFormData({ email: '', password: '', passwordAgain: '' });

    window.location.href = '/';
  };

  // State handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-start justify-center">
      <div className="max-w-md mx-auto pl-6 pr-6 pb-6 pt-3 mt-14 border border-green-500 bg-black rounded-md shadow-md self-start">
        <h2 className="text-2xl text-green-500 text-center font-semibold mb-3">Sign Up</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-green-500">
              Email address
            </label>
            <input
              placeholder='john@mail.com'
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full h-8 bg-white border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-green-500">
              Password
            </label>
            <input
              placeholder='Keep it secret'
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full h-8 bg-white border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="passwordAgain" className="block text-sm font-medium text-green-500">
              Password again
            </label>
            <input
              placeholder='Keep it secret'
              type="password"
              id="passwordAgain"
              name="passwordAgain"
              value={formData.passwordAgain}
              onChange={handleChange}
              className="mt-1 p-2 w-full h-8 bg-white border rounded-md"
            />
          </div>
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full mt-2 bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
