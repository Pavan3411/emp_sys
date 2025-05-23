import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/authContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const getInitials = (name) =>
    name
      ?.split(' ')
      .map((n) => n[0]?.toUpperCase())
      .join('')
      .slice(0, 2) || '?'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')
console.log('Token being sent:', token);

    if (user?.role === 'employee' && user?._id) {
      console.log('Fetching employee with ID:', user._id);
      axios
        .get(`http://localhost:7001/api/employees/${user._id}`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setEmployee(res.data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Full error details:', {
    message: err.message,
    response: err.response?.data,
    status: err.response?.status,
    config: err.config
  })
          setNotFound(true)
          setLoading(false)
        })
    } else {
      setNotFound(true)
      setLoading(false)
    }
  }, [])

  if (loading) return <div className="text-center mt-20">Loading...</div>

  if (notFound)
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        No data found
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-700">Employee Profile</h1>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 transition-all duration-300 hover:scale-[1.01]">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-blue-600 text-white flex items-center justify-center rounded-full text-4xl font-bold shadow-lg mb-4 ring-4 ring-white">
            {getInitials(employee.name)}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {employee.name}
          </h2>
          <p className="text-sm text-gray-500">{employee.role}</p>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
          <ProfileField label="Email" value={employee.email} />
          <ProfileField label="Role" value={employee.role} />
          <ProfileField
            label="Date of Joining"
            value={new Date(employee.doj).toLocaleDateString()}
          />
          <ProfileField label="Salary" value={employee.salary} />
          <ProfileField label="Experience" value={employee.experience} />
          <ProfileField label="Age" value={`${employee.age} years`} />
          <ProfileField label="Department" value={employee.department} />
          <ProfileField label="Location" value={employee.location} />
        </div>
      </div>
    </div>
  )
}

const ProfileField = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
    <p className="text-gray-500 font-medium mb-1">{label}</p>
    <p className="text-gray-800">{value}</p>
  </div>
)

export default EmployeeProfile
