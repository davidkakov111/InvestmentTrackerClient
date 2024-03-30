import { useState } from 'react';

type newUserType = {
  email: string,
  password: string
}

function validateInput(formData: newUserType) {
  // Checking email
  if (!formData.email.includes('@') || !formData.email.includes('.') || formData.email.length < 5 ) {
    alert('The email address is invalid. Please provide a valid email address.');
    return false;
  }
  // Checking password length
  if (formData.password.length < 6) {
    alert('The password is too short. It must be at least 6 characters long.');
    return false;
  }
  return true;
}

// Sign-In form component
const SignInForm = () => {
  // Initializing router and state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Function responsible for sign in
  const handleSignIn = async () => {
    if (!validateInput(formData)) return;

    const newUser: newUserType = {
      email: formData.email,
      password: formData.password
    }

    const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/SignInUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      alert("Error occurred when trying to sign in the user! (API -> backend -> API)");
      return;
    }
    if (result.result === "SignUp") {
      alert("Invalid email! Please sign up!")
      return;
    } else if (result.result === "Incorrect password") {
      alert("Incorrect password!")
      return;
    }
    
    const JWT = response.headers.get('Authorization');
    if (JWT) {
      localStorage.setItem('JWTToken', JWT);
    }
    
    // Clean up 
    setFormData({ email: '', password: ''});
    
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
      <div className="max-w-md mx-auto pl-5 pr-5 pb-5 pt-3 mt-14 border border-green-500 bg-black rounded-md shadow-md self-start">
        <h2 className="text-2xl text-green-500 text-center font-semibold mb-3">Sign In</h2>
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
              placeholder='Just you know'
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full h-8 bg-white border rounded-md"
            />
          </div>
          <button
            type="button"
            onClick={handleSignIn}
            className="w-full mt-1 bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
