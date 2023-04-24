import AuthGuard from './AuthGuard';
import { Route} from 'react-router-dom';
const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        // if (route.protected) {
        //   return (
        //     <Route key={route.key} element={<ProtectedRoute />}>
        //       <Route path={route.route} element={route.component} />
        //     </Route>
        //   );
        // }
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });
export default getRoutes;