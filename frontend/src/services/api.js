const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Generic API request helper
 */
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    }
  );

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;

    try {
      const errorData = await response.json();

      errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorMessage;
    } catch {
      // Keep default error.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json();
}

/* =========================================================
   USERS / CANDIDATES
========================================================= */

export const getUsers = () =>
  apiRequest('/api/users/');

export const getUser = (id) =>
  apiRequest(`/api/users/${id}`);

export const createUser = (userData) =>
  apiRequest('/api/users/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const updateUser = (id, userData) =>
  apiRequest(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });

export const deleteUser = (id) =>
  apiRequest(`/api/users/${id}`, {
    method: 'DELETE',
  });

/**
 * Candidate aliases.
 *
 * A candidate is stored as a user in your current backend.
 */
export const getCandidates = getUsers;

export const getCandidate = getUser;

export const createCandidate = createUser;

export const updateCandidate = updateUser;

export const deleteCandidate = deleteUser;

/* =========================================================
   JOBS
========================================================= */

export const getJobs = (statusFilter = null) => {
  const query = statusFilter
    ? `?status_filter=${encodeURIComponent(
        statusFilter
      )}`
    : '';

  return apiRequest(`/api/jobs/${query}`);
};

export const getJob = (id) =>
  apiRequest(`/api/jobs/${id}`);

export const createJob = (jobData) =>
  apiRequest('/api/jobs/', {
    method: 'POST',
    body: JSON.stringify(jobData),
  });

export const updateJob = (id, jobData) =>
  apiRequest(`/api/jobs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(jobData),
  });

export const deleteJob = (id) =>
  apiRequest(`/api/jobs/${id}`, {
    method: 'DELETE',
  });

/* =========================================================
   RESUMES
========================================================= */

export const getResumes = () =>
  apiRequest('/api/resumes/');

export const getResume = (id) =>
  apiRequest(`/api/resumes/${id}`);

export const createResume = (resumeData) =>
  apiRequest('/api/resumes/', {
    method: 'POST',
    body: JSON.stringify(resumeData),
  });

/**
 * Upload a PDF resume.
 *
 * IMPORTANT:
 * Do not manually set Content-Type here.
 * Browser sets multipart/form-data boundary automatically.
 */
export const uploadResume = async ({
  userId,
  file,
  templateName = null,
  completion = null,
  atsScore = null,
}) => {
  if (!userId) {
    throw new Error('Candidate ID is required.');
  }

  if (!file) {
    throw new Error('Resume PDF is required.');
  }

  const formData = new FormData();

  formData.append(
    'user_id',
    String(userId)
  );

  formData.append(
    'file',
    file
  );

  if (
    templateName !== null &&
    templateName !== undefined &&
    String(templateName).trim()
  ) {
    formData.append(
      'template_name',
      String(templateName)
    );
  }

  if (
    completion !== null &&
    completion !== undefined &&
    completion !== ''
  ) {
    formData.append(
      'completion',
      String(completion)
    );
  }

  if (
    atsScore !== null &&
    atsScore !== undefined &&
    atsScore !== ''
  ) {
    formData.append(
      'ats_score',
      String(atsScore)
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/resumes/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    let errorMessage =
      `API Error: ${response.status}`;

    try {
      const errorData =
        await response.json();

      errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorMessage;
    } catch {
      // Keep default error.
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

export const updateResume = (
  id,
  resumeData
) =>
  apiRequest(`/api/resumes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(resumeData),
  });

export const deleteResume = (id) =>
  apiRequest(`/api/resumes/${id}`, {
    method: 'DELETE',
  });

/* =========================================================
   APPLICATIONS
========================================================= */

export const getApplications = () =>
  apiRequest('/api/applications/');

export const getApplication = (id) =>
  apiRequest(`/api/applications/${id}`);

export const createApplication = (
  applicationData
) =>
  apiRequest('/api/applications/', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });

export const updateApplication = (
  id,
  applicationData
) =>
  apiRequest(`/api/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(applicationData),
  });

export const deleteApplication = (id) =>
  apiRequest(`/api/applications/${id}`, {
    method: 'DELETE',
  });

/* =========================================================
   INTERVIEWS
========================================================= */

export const getInterviews = () =>
  apiRequest('/api/interviews/');

export const getInterview = (id) =>
  apiRequest(`/api/interviews/${id}`);

export const createInterview = (
  interviewData
) =>
  apiRequest('/api/interviews/', {
    method: 'POST',
    body: JSON.stringify(interviewData),
  });

export const updateInterview = (
  id,
  interviewData
) =>
  apiRequest(`/api/interviews/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(interviewData),
  });

export const deleteInterview = (id) =>
  apiRequest(`/api/interviews/${id}`, {
    method: 'DELETE',
  });

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,

  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,

  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,

  getResumes,
  getResume,
  createResume,
  uploadResume,
  updateResume,
  deleteResume,

  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,

  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
};