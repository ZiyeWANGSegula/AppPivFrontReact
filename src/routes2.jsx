import Error from "./pages/Error/Error";
import SignIn from "./pages/Login/Login";
import SignUp from "./pages/Sigup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserAdd from "./pages/Dashboard/User/UserAdd";
import UserEdit from "./pages/Dashboard/User/UserEdit";
import Test from "./pages/Dashboard/Test/Test";
import Page404 from "./pages/Page404";

const routes = [
    {
        name: "account",
        collapse: [
            {
                name: "sign in",
                route: "/pages/authentication/sign-in",
                component: <SignIn />
            },
            {
                name: "sign up",
                route: "/pages/authentication/sign-up",
                component: <SignUp />
            },
            
        ]
    },
    {
        name: "index",
        route:"*",
        component: <Page404></Page404>

    },
    {
        name: "dashboard",
        route:"/dashboard",
        component: <Dashboard></Dashboard>

    },
    {
        name: "test",
        route:"/test",
        component: <Test></Test>

    },
    {
        name: "user",
        collapse: [
            {
                name: "user add",
                route: "/user/add",
                component: <UserAdd/>
            },
            {
                name: "user edit",
                route: "/user/edit/:id",

                component: <UserEdit/>
            },
            
        ]
    }
]

export default routes