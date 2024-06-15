import React from 'react';
import { BadgeCheck, Calendar, UserCircle } from 'lucide-react';
import RecentStatistics from './RecentStatistics';
import { countryCodes } from 'pages/Chat/countryCodes';
import { format, parseISO } from 'date-fns';

interface TableData {
  label: string;
  value?: string;
  link?: boolean;
}

interface OverviewTabsProps {
  user: {
    id: number;
    name: string;
    email: string;
    country_code: string;
    phone: string;
    role: string;
    service: string;
    profile_image: string | null;
    online: boolean;
    created_at: string;
  };
}

const OverviewTabs: React.FC<OverviewTabsProps> = ({ user }) => {
    console.log('User data in OverviewTabs:', user);  

    const userTableData: TableData[] = [
      { label: "Name", value: user.name || 'N/A' },
      { label: "Email", value: user.email || 'N/A' },
      { label: "Phone No", value: user.phone || 'N/A' },
      { label: "Role", value: user.role || 'N/A' },
      { label: "Service", value: user.service || 'N/A' },
      { label: "Joining Date", value: user.created_at ? format(parseISO(user.created_at), 'PPP') : 'N/A' },
      { label: "Location", value: countryCodes[user.country_code] || 'Unknown' },
    ];
  
    console.log('User table data in OverviewTabs:', userTableData);
  return (
    <React.Fragment>
      <div className="grid grid-cols-1 gap-x-5 2xl:grid-cols-12">
        <div className="2xl:col-span-9">
          {/* <div className="card">
            <div className="card-body">
              <h6 className="mb-3 text-15">Recent Statistics</h6>
              <RecentStatistics chartId="recentStatistics" />
            </div>
          </div> */}
         
        </div>
        <div className="2xl:col-span-3">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-4 text-15">Personal Information</h6>
              <div className="overflow-x-auto">
                <table className="w-full ltr:text-left rtl:text-right">
                  <tbody>
                    {userTableData.map((item, index) => (
                      <tr key={index}>
                        <th className="py-2 font-semibold ps-0" scope="row">{item.label}</th>
                        <td className="py-2 text-right text-slate-500 dark:text-zink-200">
                          {item.link ? <a href="http://themesdesign.in/" rel="noopener" className="text-custom-500">www.themesdesign.in</a> : item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OverviewTabs;
