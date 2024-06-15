import { Mail } from "lucide-react";
import React, { useState } from "react";
import { ContactData, sendContactMessage } from "services/ContactService";
import { ToastContainer, toast } from 'react-toastify';

const ContactsForm = () => {
    const [formData, setFormData] = useState<ContactData>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        subject: '',
        comments: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await sendContactMessage(formData);
            toast.success('Message sent successfully!');
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                company_name: '',
                subject: '',
                comments: '',
            });
        } catch (error) {
            toast.error('An error occurred while sending the message.');
            console.error(error);
        }
    };

    return (
        <React.Fragment>
            <div className="card">
            
                <div className="card-body">
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                        <div className="xl:col-span-3 bg-custom-200 card !mb-0 dark:bg-custom-950">
                            <div className="flex flex-col h-full card-body">
                                <div className="mb-6">
                                <h4 className="mb-2">Contact Us</h4>
                <p className="text-slate-800 dark:text-zink-200">For any inquiries or information, please feel free to contact us at the following email address:
                <div className="flex flex-col items-center justify-center gap-4">
  <div className="flex gap-2 justify-center items-center">
    <a href="mailto:OCPLINK@gmail.com" className="flex items-center justify-center size-[37.5px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20">
      <Mail className="size-4"></Mail>
    </a>
  </div>
  <span className="text-center">OR</span>
</div>

                    Fill out the form and a member from our sales team will get back to you within 2 working days</p>
           
                                </div>
                                <div className="mt-auto">
                                    
                                </div>
                            </div>
                        </div>
                        <div className="xl:col-span-9">
                        <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                        <label htmlFor="first_name" className="inline-block mb-2 text-base font-medium dark:text-gray-400">First Name</label>
                        <input type="text" id="first_name" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" value={formData.first_name} onChange={handleChange} placeholder="Enter your First Name" required />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Last Name</label>
                        <input type="text" id="last_name" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" value={formData.last_name} onChange={handleChange} placeholder="Enter your Last Name" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Email</label>
                        <input type="email" id="email" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" value={formData.email} onChange={handleChange} placeholder="Enter your Email" required />
                    </div>
                    <div>
                        <label htmlFor="phone" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Phone</label>
                        <input type="text" id="phone" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" value={formData.phone} onChange={handleChange} placeholder="Phone no" required />
                    </div>
                    <div>
                        <label htmlFor="company_name" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Company Name</label>
                        <input type="text" id="company_name" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" value={formData.company_name} onChange={handleChange} placeholder="Company name" required />
                    </div>
                    <div>
                        <label htmlFor="subject" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Subject</label>
                        <input type="text" id="subject" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="comments" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Comments</label>
                        <textarea id="comments" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" value={formData.comments} onChange={handleChange} rows={5} placeholder="Enter comments"></textarea>
                    </div>
                </div>
                <div className="mt-5 ltr:text-right rtl:text-left">
                    <button type="submit" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Send Message</button>
                </div>
            </form>
                        </div>
                    </div>
                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

                </div>
            </div>
        </React.Fragment>
    );
}

export default ContactsForm;