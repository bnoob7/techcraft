import Header from '../../components/header/header'
import CustomerList from '../../components/customerList/customerList'
import SignupForm from '../../components/customerForm/signupForm'
import LoginForm from '../../components/customerForm/loginForm'

import './admin.css'


const admin = () => {
  return (
    <div className='body'>
      <Header />
      <div className="form-wrapper">

        <div className="signup">
          <h1>customer signup</h1>
          <SignupForm />
        </div>

        <div className="login">
          <h1>CustomerLogin</h1>
        <LoginForm />
        </div>

      </div>
      <div className='table-wrapper'>
      <CustomerList />
      </div>
    </div>
  )
}

export default admin