import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import React, { useReducer, useState, useEffect } from 'react'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TablePagination,
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material'
import { Delete, Edit, Logout } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const initialForm = {
  name: '',
  email: '',
  location: '',
  doj: '',
  salary: '',
  age: '',
  experience: '',
  department: '',
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN':
      return {
        ...state,
        open: true,
        editingId: action.payload?._id || null,
        form: action.payload || initialForm,
      }
    case 'CLOSE':
      return { ...state, open: false, editingId: null, form: initialForm }
    case 'UPDATE_FIELD':
      return { ...state, form: { ...state.form, [action.field]: action.value } }
    default:
      return state
  }
}

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  location:z.string().min(1, 'Location is required'),
  department: z.string().min(1, 'Department is required'),
  salary: z.union([z.string(), z.number()]).transform(val => Number(val)),
  age: z.union([z.string(), z.number()])
    .transform(val => Number(val))
    .refine(val => !isNaN(val) && val >= 1 && val <= 100, {
      message: 'Age must be between 1 and 100'
    }),
  experience: z.union([z.string(), z.number()]).transform(val => Number(val)),
  doj: z.string().min(1, 'Date of Joining is required'),
})

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([])
  const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 5 })
  const [sortField, setSortField] = useState('name')
  const [open, setOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setLoading(true)
    axios
      .get('https://emp-sys-server.onrender/api/admin/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEmployees(res.data)
        console.log("employees: ", res.data)
        setError(null)
      })
      .catch((err) => {
        console.log(err)
        setError('Error fetching employees')
        toast.error('Error fetching employees')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [refreshKey])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  const [state, dispatch] = useReducer(reducer, {
    open: false,
    editingId: null,
    form: initialForm,
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOpen = (employee = null) => {
    console.log(' Employee: ', employee)
    dispatch({ type: 'OPEN', payload: employee })
  }
  const handleClose = () => {
    dispatch({ type: 'CLOSE' })
    setErrors({})
  }

  const handleSubmit = () => {
    const data = {
      ...state.form,
      // Convert numeric fields
      age: parseInt(state.form.age) || 0,
      salary: parseInt(state.form.salary) || 0,
      experience: parseInt(state.form.experience) || 0
    }

    // Validate with Zod
    const result = employeeSchema.safeParse(data)

    if (!result.success) {
      // Convert Zod errors to a more usable format
      const fieldErrors = {}
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0]
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = []
        }
        fieldErrors[fieldName].push(err.message)
      })

      setErrors(fieldErrors)
      toast.error('Please fix the form errors')
      return // Stop submission if invalid
    }

    // Clear errors if validation passes
    setErrors({})

    const token = localStorage.getItem('token')

    console.log('Sending data: ', data)

    if (state.editingId) {
      // logic to update employee by id
      axios
        .put(
          `https://emp-sys-server.onrender/api/admin/employees/${state.editingId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setEmployees((prev) =>
            prev.map((emp) => (emp._id === state.editingId ? res.data : emp))
          )
          toast.success('Updated successfully!')
          setRefreshKey((prev) => prev + 1)
          handleClose()
        })
        .catch((err) => {
          console.error('Error updating employee:', err);
          toast.error(err.response?.data?.error || 'Error updating employee');
        })
    } else {
      // logic to create new employee
      axios
        .post('https://emp-sys-server.onrender/api/admin/employees', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setEmployees((prev) => [...prev, res.data])
          toast.success('Created successfully!')
          setRefreshKey((prev) => prev + 1)
          handleClose()
        })
        .catch((err) => {
          console.error('Error creating employee:', err);
          toast.error(err.response?.data?.error || 'Error creating employee');
        })
    }
  }

  const handleDelete = (id) => {
    const token = localStorage.getItem('token')
    axios
      .delete(`https://emp-sys-server.onrender/api/admin/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setEmployees((prev) => prev.filter((emp) => emp._id !== id))
        toast.success('Deleted successfully!')
      })
      .catch((err) => console.log(err))
  }

  const handleSort = (field) => {
    const sorted = [...employees].sort((a, b) =>
      a[field]?.toString().localeCompare(b[field]?.toString())
    )
    setEmployees(sorted)
    setSortField(field)
  }

  const handleChangePage = (e, newPage) =>
    setPagination({ ...pagination, page: newPage })
  const handleChangeRowsPerPage = (e) =>
    setPagination({ page: 0, rowsPerPage: parseInt(e.target.value, 10) })

  const paginated = employees.slice(
    pagination.page * pagination.rowsPerPage,
    pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
  )

  const getInitial = (name) => name?.charAt(0)?.toUpperCase()

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh' }}>
      {/* AppBar Header */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar>{getInitial('Admin')}</Avatar>
            <Typography variant="h6">Admin Dashboard</Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box p={isMobile ? 2 : 4}>
        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
            height="300px"
          >
            <CircularProgress />
            <Typography variant="h5" sx={{ ml: 2 }}>
              Loading...
            </Typography>
          </Box>
        )}
        {error && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
            flexDirection="column"
          >
            <Typography color="error" variant="h6">
              Failed to load data
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setRefreshKey((prev) => prev + 1)}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Box>
        )}

        {!loading && !error && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h5">Employee List</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
              >
                Add Employee
              </Button>
            </Box>

            <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
              <Button variant="outlined" onClick={() => handleSort('name')}>
                Sort by Name
              </Button>
              <Button variant="outlined" onClick={() => handleSort('doj')}>
                Sort by Joining Date
              </Button>
            </Box>

            {/* Responsive Table or Card Layout */}
            {isMobile ? (
              <>
                <Box display="grid" gap={2}>
                  {paginated.map((emp) => (
                    <Paper
                      key={emp._id}
                      elevation={3}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        {emp.name}
                      </Typography>

                      <Box display="grid" gap={0.5}>
                        <Typography variant="body2">
                          <Box
                            component="span"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            Email:
                          </Box>{' '}
                          {emp.email}
                        </Typography>
                        <Typography variant="body2">
                          <Box
                            component="span"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            Location
                          </Box>{' '}
                          {emp.location}
                        </Typography>
                        <Typography variant="body2">
                          <Box
                            component="span"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            Department:
                          </Box>{' '}
                          {emp.department}
                        </Typography>
                        <Typography variant="body2">
                          <Box
                            component="span"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            Salary:
                          </Box>{' '}
                          ₹{emp.salary}
                        </Typography>
                        <Typography variant="body2">
                          <Box
                            component="span"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            Age:
                          </Box>{' '}
                          {emp.age}
                        </Typography>
                        <Typography variant="body2">
                          <Box
                            component="span"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            Experience:
                          </Box>{' '}
                          {emp.experience}
                        </Typography>
                        <Typography variant="body2">
                          <Box
                            component="span"
                            fontWeight={600}
                            color="text.secondary"
                          >
                            Joined:
                          </Box>{' '}
                          {emp.doj}
                        </Typography>
                      </Box>

                      <Box
                        mt={2}
                        display="flex"
                        justifyContent="flex-end"
                        gap={1}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(emp)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(emp._id)}
                        >
                          <Delete />
                        </IconButton>

                        <ToastContainer position="top-right" autoClose={3000} />
                      </Box>
                    </Paper>
                  ))}
                </Box>

                {/* Pagination for Mobile */}
                <TablePagination
                  component="div"
                  count={employees.length}
                  page={pagination.page}
                  onPageChange={handleChangePage}
                  rowsPerPage={pagination.rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 20]}
                  sx={{ mt: 2 }}
                />
              </>
            ) : (
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Email</b>
                      </TableCell>
                      <TableCell>
                        <b>Location</b>
                      </TableCell>
                      <TableCell>
                        <b>Department</b>
                      </TableCell>
                      <TableCell>
                        <b>Salary</b>
                      </TableCell>
                      <TableCell>
                        <b>Age</b>
                      </TableCell>
                      <TableCell>
                        <b>Experience</b>
                      </TableCell>
                      <TableCell>
                        <b>Joining Date</b>
                      </TableCell>
                      <TableCell>
                        <b>Actions</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.map((emp) => (
                      <TableRow key={emp._id || emp.id || emp.email}>
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>{emp.location}</TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>₹{emp.salary}</TableCell>
                        <TableCell>{emp.age}</TableCell>
                        <TableCell>{emp.experience}</TableCell>
                        <TableCell>
                          {new Date(emp.doj).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpen(emp)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(emp._id || emp.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <TablePagination
                  component="div"
                  count={employees.length}
                  page={pagination.page}
                  onPageChange={handleChangePage}
                  rowsPerPage={pagination.rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 20]}
                />
              </TableContainer>
            )}

            {/* Add/Edit Employee Dialog */}
            <Dialog
              open={state.open}
              onClose={handleClose}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>
                {state.editingId ? 'Edit Employee' : 'Add Employee'}
              </DialogTitle>
              <DialogContent>
                <Box display="grid" gap={2} mt={1}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={state.form.name}
                    error={!!errors.name}
                    helperText={errors.name?.[0]}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'name',
                        value: e.target.value,
                      })
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.[0]}
                    value={state.form.email}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'email',
                        value: e.target.value,
                      })
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                  />
                  <TextField
                    label="Location"
                    fullWidth
                    error={!!errors.location}
                    helperText={errors.location?.[0]}
                    value={state.form.location}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'location',
                        value: e.target.value,
                      })
                      if (errors.location)
                        setErrors((prev) => ({ ...prev, location: undefined }))
                    }}
                  />
                  <TextField
                    label="Department"
                    fullWidth
                    error={!!errors.department}
                    helperText={errors.department?.[0]}
                    value={state.form.department}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'department',
                        value: e.target.value,
                      })
                      if (errors.department)
                        setErrors((prev) => ({
                          ...prev,
                          department: undefined,
                        }))
                    }}
                  />
                  <TextField
                    label="Salary"
                    type="number"
                    fullWidth
                    error={!!errors.salary}
                    helperText={errors.salary?.[0]}
                    value={state.form.salary}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'salary',
                        value: e.target.value,
                      })
                      if (errors.salary)
                        setErrors((prev) => ({ ...prev, salary: undefined }))
                    }}
                  />
                  <TextField
                    label="Age"
                    type="number"
                    fullWidth
                    error={!!errors.age}
                    helperText={errors.age?.[0]}
                    value={state.form.age}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'age',
                        value: e.target.value,
                      })
                      if (errors.age)
                        setErrors((prev) => ({ ...prev, age: undefined }))
                    }}
                  />
                  <TextField
                    label="Experience"
                    type="number"
                    fullWidth
                    error={!!errors.experience}
                    helperText={errors.experience?.[0]}
                    value={state.form.experience}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'experience',
                        value: e.target.value,
                      })
                      if (errors.experience)
                        setErrors((prev) => ({
                          ...prev,
                          experience: undefined,
                        }))
                    }}
                  />
                  <TextField
                    label="Date of Joining"
                    type="date"
                    fullWidth
                    error={!!errors.doj}
                    helperText={errors.doj?.[0]}
                    InputLabelProps={{ shrink: true }}
                    value={state.form.doj}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'doj',
                        value: e.target.value,
                      })
                      if (errors.doj)
                        setErrors((prev) => ({ ...prev, doj: undefined }))
                    }}
                  />

                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="inherit">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  {state.editingId ? 'Update' : 'Add'}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </Box>
  )
}

export default AdminDashboard
