import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import BreadCrumb from 'Common/BreadCrumb';
import { Link } from 'react-router-dom';
import { Dropdown } from 'Common/Components/Dropdown';
import TableContainer from 'Common/TableContainer';
import { Search, Eye, Trash2, FileEdit, Plus } from 'lucide-react';
import Modal from 'Common/Components/Modal';
import DeleteModal from 'Common/DeleteModal';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import filterDataBySearch from 'Common/filterDataBySearch';
import ContactService from 'services/ContactService';
import AdminService, { Contact } from 'services/AdminService';
import { ToastContainer, toast } from 'react-toastify';
import Header from 'Layout/Header';
import Sidebar from 'Layout/VerticalLayout/Sidebar';
import Footer from 'Layout/Footer';

const API_URL = 'https://your-api-url.com/';

export const fetchContacts = async () => {
    try {
        const response = await axios.get(`${API_URL}contacts`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || "An error occurred while fetching contacts.");
        } else {
            throw new Error("An error occurred while fetching contacts.");
        }
    }
};

const ContactList = () => {
    const [contactList, setContactList] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [eventData, setEventData] = useState<any>();

    const [show, setShow] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const deleteToggle = () => setDeleteModal(!deleteModal);

    const onClickDelete = (contact: Contact) => {
        setDeleteModal(true);
        setEventData(contact);
    };

    const handleDelete = async () => {
        if (eventData) {
            try {
                await AdminService.deleteContact(eventData.id);
                setContactList((prev) => prev.filter((item) => item.id !== eventData.id));
                setDeleteModal(false);
                toast.success('Contact deleted successfully');
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete contact');

            }
        }
    };

    const fetchContactData = async () => {
        try {
            const response = await ContactService.fetchContacts();
            setContactList(response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchContactData();
    }, []);

    useEffect(() => {
        setContacts(contactList);
    }, [contactList]);

   
    const handleUpdateDataClick = (contact: Contact) => {
        setEventData(contact);
        setIsEdit(true);
        setShow(true);
    };


    const validation = useFormik<Contact>({
        enableReinitialize: true,
        initialValues: {
            id: eventData?.id || 0,
            first_name: eventData?.first_name || '',
            last_name: eventData?.last_name || '',
            email: eventData?.email || '',
            phone: eventData?.phone || '',
            company_name: eventData?.company_name || '',
            subject: eventData?.subject || '',
            comments: eventData?.comments || '',
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('Please Enter First Name'),
            last_name: Yup.string().required('Please Enter Last Name'),
            email: Yup.string().required('Please Enter Email'),
            phone: Yup.string().required('Please Enter Phone Number'),
            company_name: Yup.string().required('Please Enter Company Name'),
            subject: Yup.string().required('Please Enter Subject'),
            comments: Yup.string().required('Please Enter Comments'),
        }),
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    await AdminService.updateContact(values);
                    setContactList((prev) =>
                        prev.map((item) => (item.id === values.id ? values : item))
                    );
                    toast.success("Contact updated successfully");
                } else {
                    const newContact: Contact = {
                        ...values,
                        id: Math.floor(Math.random() * 10000),
                    };
                    setContactList((prev) => [...prev, newContact]);
                    toast.success("Contact added successfully");
                }
                toggle();
            } catch (error) {
                console.error(error);
                toast.error("Failed to submit contact");
            }
        },
    });

    const toggle = useCallback(() => {
        if (show) {
            setShow(false);
            setEventData('');
            setIsEdit(false);
        } else {
            setShow(true);
            setEventData('');
            validation.resetForm();
        }
    }, [show, validation]);

    const filterSearchData = (e: any) => {
        const search = e.target.value;
        const keysToSearch = ['firstname', 'lastname', 'email', 'phone', 'companyname', 'subject', 'comments'];
        filterDataBySearch(contactList, search, keysToSearch, setContacts);
    };

    const columns = useMemo(() => [
        {
            header: 'ID',
            accessorKey: 'id',
            enableColumnFilter: false,
        },
        {
            header: 'First Name',
            accessorKey: 'first_name',
            enableColumnFilter: false,
        },
        {
            header: 'Last Name',
            accessorKey: 'last_name',
            enableColumnFilter: false,
        },
        {
            header: 'Email',
            accessorKey: 'email',
            enableColumnFilter: false,
        },
        {
            header: 'Phone',
            accessorKey: 'phone',
            enableColumnFilter: false,
        },
        {
            header: 'Company Name',
            accessorKey: 'company_name',
            enableColumnFilter: false,
        },
        {
            header: 'Subject',
            accessorKey: 'subject',
            enableColumnFilter: false,
        },
        {
            header: 'Comments',
            accessorKey: 'comments',
            enableColumnFilter: false,
        },
        {
            header: 'Action',
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cell: any) => (
                <div className="flex space-x-2">
                    <button 
                        className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-600"
                        onClick={() => handleUpdateDataClick(cell.row.original)}

                    >
                        <FileEdit className="size-4" />
                    </button>
                   
                    <button 
                        className="p-2 text-white bg-red-500 rounded hover:bg-red-600 focus:bg-red-600"
                        onClick={() => onClickDelete(cell.row.original)}
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            ),
        }
    ], []);

    return (
        <React.Fragment>
  <Header />
  <Sidebar />
  <Footer />
            <BreadCrumb title='Contact List' pageTitle='Contacts' />
            <DeleteModal show={deleteModal} onHide={deleteToggle} onDelete={handleDelete} />
            <ToastContainer closeButton={false} limit={1} />
            <div className="grid grid-cols-1 gap-x-4 xl:grid-cols-12">
                <div className="xl:col-span-12">
                    <div className="ml-72 mr-4 mt-20 mb-14">
                    <div className="card" id="contactsTable">
                        <div className="card-body">
                            <div className="flex items-center">
                                <h6 className="text-15 grow">Contacts List</h6>
                              
                            </div>
                        </div>
                        <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
                            <form onSubmit={(e) => { e.preventDefault(); validation.handleSubmit(); }}>
                                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                                    <div className="relative xl:col-span-2">
                                        <input type="text" className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Search for name, email, phone number etc..." autoComplete="off" onChange={(e) => filterSearchData(e)} />
                                        <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="card-body">
                            {contacts && contacts.length > 0 ?
                                <TableContainer
                                    isPagination={true}
                                    columns={columns}
                                    data={contacts}
                                    customPageSize={10}
                                    divclassName="-mx-5 -mb-5 overflow-x-auto"
                                    tableclassName="w-full border-separate table-custom border-spacing-y-1 whitespace-nowrap"
                                    theadclassName="text-left relative rounded-md bg-slate-100 dark:bg-zink-600 after:absolute ltr:after:border-l-2 rtl:after:border-r-2 ltr:after:left-0 rtl:after:right-0 after:top-0 after:bottom-0 after:border-transparent [&.active]:after:border-custom-500 [&.active]:bg-slate-100 dark:[&.active]:bg-zink-600"
                                    thclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold"
                                    tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5"
                                    PaginationClassName="flex flex-col items-center mt-8 md:flex-row"
                                />
                                :
                                (<div className="noresult">
                                    <div className="py-6 text-center">
                                        <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                                        <h5 className="mt-2 mb-1">Loading Data .....</h5>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </div>
            </div>
            </div>

            <Modal show={show} onHide={toggle} id="defaultModal" modal-center="true"
                className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600">
                <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
                    closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500">
                    <Modal.Title className="text-16">{!!isEdit ? 'Edit Contact' : 'Add Contact'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
                <form onSubmit={(e) => { e.preventDefault(); validation.handleSubmit(); }}>
                        <div className="mb-3">
                            <label htmlFor="first_name" className="inline-block mb-2 text-base font-medium dark:text-zink-100">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                placeholder="Enter first name"
                                onChange={validation.handleChange}
                                value={validation.values.first_name}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="last_name" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                placeholder="Enter last name"
                                onChange={validation.handleChange}
                                value={validation.values.last_name}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                placeholder="Enter email"
                                onChange={validation.handleChange}
                                value={validation.values.email}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                placeholder="Enter phone number"
                                onChange={validation.handleChange}
                                value={validation.values.phone}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="company_name" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Company Name</label>
                            <input
                                type="text"
                                id="company_name"
                                name="company_name"
                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                placeholder="Enter company name"
                                onChange={validation.handleChange}
                                value={validation.values.company_name}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="subject" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                placeholder="Enter subject"
                                onChange={validation.handleChange}
                                value={validation.values.subject}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comments" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Comments</label>
                            <textarea
                                id="comments"
                                name="comments"
                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                placeholder="Enter comments"
                                onChange={validation.handleChange}
                                value={validation.values.comments}
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="reset" className="text-red-500 bg-white border-white btn" onClick={toggle}>Cancel</button>
                            <button type="submit" className="text-white bg-custom-500 border-custom-500 btn">
                                {isEdit ? 'Update Contact' : 'Add Contact'}
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        </React.Fragment>
    );
};

export default ContactList;