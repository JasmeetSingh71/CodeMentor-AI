import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'; // added icon

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    let statusMatch = true;
    if (filters.status === 'solved') {
      statusMatch = solvedProblems.some(sp => sp._id === problem._id);
    }
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Navbar */}
      <nav className="navbar px-6 py-3 bg-gray-900/80 backdrop-blur-md border-b border-gray-700 shadow-lg">
        <div className="flex-1">
          <NavLink to="/" className="text-2xl font-semibold text-primary hover:text-primary-focus transition">
            CodeMentor
          </NavLink>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="flex items-center gap-2 cursor-pointer btn btn-ghost rounded-full px-3 hover:bg-gray-800 transition">
              <UserCircleIcon className="w-7 h-7 text-primary" />
              <span className="hidden sm:block font-medium">{user?.firstName}</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </div>
            <ul tabIndex={0} className="menu dropdown-content mt-3 p-2 shadow-lg bg-gray-800 text-gray-200 rounded-xl w-48 border border-gray-700">
              <li>
                <button onClick={handleLogout} className="hover:bg-gray-700 rounded-lg px-3 py-2 text-sm">
                  Logout
                </button>
              </li>
              {user.role === 'admin' && (
                <li>
                  <NavLink to="/admin" className="hover:bg-gray-700 rounded-lg px-3 py-2 text-sm">
                    Admin Dashboard
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <select
            className="select select-bordered select-sm bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-primary"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select
            className="select select-bordered select-sm bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-primary"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered select-sm bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-primary"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problem List */}
        <div className="grid gap-5">
          {filteredProblems.map(problem => (
            <div key={problem._id} className="card bg-gray-800/60 border border-gray-700 hover:border-primary transition-all duration-300 hover:shadow-primary/30 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title text-lg font-semibold">
                    <NavLink to={`/problem/${problem._id}`} className="hover:text-primary transition">
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some(sp => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info text-gray-900">{problem.tags}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success text-gray-900';
    case 'medium': return 'badge-warning text-gray-900';
    case 'hard': return 'badge-error text-gray-900';
    default: return 'badge-neutral text-gray-900';
  }
};

export default Homepage;
