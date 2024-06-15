import React from "react";

const PrivacyPolicyTabs = () => {
    return (
        <React.Fragment>
            <div className="card">
                <div className="card-body">
                    <h6 className="mb-4 text-15">Security & Privacy</h6>
                    <div className="space-y-6">
                        <div className="flex flex-col justify-between gap-2 md:flex-row">
                            <div>
                           
                                <p className="mt-1 text-slate-500 dark:text-zink-200">
                                Ensuring the security and privacy of user data is paramount in our application. To this end, we implement several measures to protect data both in transit and at rest. All data exchanges between the frontend and backend are secured using HTTPS, which encrypts the data to prevent interception by unauthorized parties. On the server side, sensitive data such as passwords are hashed using strong, industry-standard algorithms  before being stored in the database. Access controls and permissions are rigorously enforced to ensure that only authorized users can access specific data and functionalities.</p>
                            </div>
                            </div>       </div>     
                </div>
            </div>
        </React.Fragment>

    );
}

export default PrivacyPolicyTabs;