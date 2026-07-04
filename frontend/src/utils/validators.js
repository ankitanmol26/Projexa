export const isValidUrl = (value) => {
  try {
    if (!value) return true
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const validateAuthPayload = ({ email, password, name }) => {
  const errors = {}

  if (!name?.trim()) {
    errors.name = 'Name is required.'
  }

  if (!email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password?.trim()) {
    errors.password = 'Password is required.'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  return errors
}

export const validateProjectPayload = ({ title, description, technologies, githubUrl, liveDemoUrl }) => {
  const errors = {}

  if (!title?.trim()) errors.title = 'Project title is required.'
  if (!description?.trim()) errors.description = 'Project description is required.'
  if (githubUrl && !isValidUrl(githubUrl)) errors.githubUrl = 'Please enter a valid GitHub URL.'
  if (liveDemoUrl && !isValidUrl(liveDemoUrl)) errors.liveDemoUrl = 'Please enter a valid demo URL.'
  
  if (!technologies || technologies.length === 0) {
    errors.technologies = 'At least one technology is required.'
  }

  return errors
}
