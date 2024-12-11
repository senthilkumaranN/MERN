import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authcontext } from '../Context/Context';

const ProtectedRoute = ({ element, role }) => {
   const { isAuthenticated, user, protectloading } = useContext(Authcontext);
   const navigate = useNavigate();

   // Handle navigation based on authentication and role
   useEffect(() => {

      if (protectloading) return
      if (!isAuthenticated) {
         navigate('/login'); // Redirect to login if not authenticated
      } else if (role && user?.role !== role) {
         navigate('/'); // Redirect to home if the role doesn't match
      }
   }, [isAuthenticated, user, role, navigate]);

   // Render the protected element only if the conditions are met
   return isAuthenticated && (!role || user?.role === role) ? element : null;
};

export default ProtectedRoute;
