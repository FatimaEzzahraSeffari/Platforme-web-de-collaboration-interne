import { UserListViewData } from "Common/data";
import { Award, CalendarDays, CircuitBoard, Codesandbox, FileText, LifeBuoy, LocateFixed, Mail, Map, MessageSquare, MonitorDot, PackagePlus, PictureInPicture2, PieChart, RadioTower, ScrollText, Share2, ShoppingBag, Table, Trophy, User, UserRound } from "lucide-react";


const menuData: any = [
    {
        label: 'ADMIN DASHBOARD',
        isTitle: true,
    },
    {
        id: 'Users List',
        label: 'Users List',
        icon: <User />,
        link: '/dashboards-admin',
        parentId: "Admin Dashboard"
    },
    {
        id: 'Contact List',
        label: 'Contact List',
        icon: <MessageSquare />,
        link: '/ContactList',
        parentId: "Admin Dashboard"
    },
   
    
    
    
];

export { menuData };
