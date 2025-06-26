import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Assets from "../pages/Assets";
import Calendar from "../pages/Calendar";
import Employees from "../pages/Employees";
import Facilities from "../pages/Facilities";
import Events from "../pages/Events";
import Contacts from "../pages/Contacts";
import Tasks from "../pages/Tasks";
import Finances from "../pages/Finances";
import Settings from "../pages/Settings";
import Images from "../pages/Images";

const managementRoutes: RouteObject[] = [
  {
    path: "/assets",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Assets />
      }
    ]
  },
  {
    path: "/calendar",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Calendar />
      }
    ]
  },
  {
    path: "/employees",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Employees />
      }
    ]
  },
  {
    path: "/facilities",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Facilities />
      }
    ]
  },
  {
    path: "/events",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Events />
      }
    ]
  },
  {
    path: "/contacts",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Contacts />
      }
    ]
  },
  {
    path: "/tasks",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Tasks />
      }
    ]
  },
  {
    path: "/finances",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Finances />
      }
    ]
  },
  {
    path: "/settings",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Settings />
      }
    ]
  },
  {
    path: "/images",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Images />
      }
    ]
  },
  {
    path: "/employee-clock-in",
    element: React.lazy(() => import("@/pages/EmployeeClockIn"))
  }
];

export default managementRoutes;
```

```
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Assets from "../pages/Assets";
import Calendar from "../pages/Calendar";
import Employees from "../pages/Employees";
import Facilities from "../pages/Facilities";
import Events from "../pages/Events";
import Contacts from "../pages/Contacts";
import Tasks from "../pages/Tasks";
import Finances from "../pages/Finances";
import Settings from "../pages/Settings";
import Images from "../pages/Images";
import React from "react"; // Import React to use React.lazy

const managementRoutes: RouteObject[] = [
  {
    path: "/assets",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Assets />
      }
    ]
  },
  {
    path: "/calendar",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Calendar />
      }
    ]
  },
  {
    path: "/employees",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Employees />
      }
    ]
  },
  {
    path: "/facilities",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Facilities />
      }
    ]
  },
  {
    path: "/events",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Events />
      }
    ]
  },
  {
    path: "/contacts",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Contacts />
      }
    ]
  },
  {
    path: "/tasks",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Tasks />
      }
    ]
  },
  {
    path: "/finances",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Finances />
      }
    ]
  },
  {
    path: "/settings",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Settings />
      }
    ]
  },
  {
    path: "/images",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Images />
      }
    ]
  },
  {
    path: "/employee-clock-in",
    element: React.lazy(() => import("@/pages/EmployeeClockIn"))
  }
];

export default managementRoutes;