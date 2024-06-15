import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import BreadCrumb from 'Common/BreadCrumb';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'Common/Components/Dropdown';
import TableContainer from 'Common/TableContainer';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import Select from 'react-select';
import { Search, Eye, Trash2, Plus, MoreHorizontal, FileEdit, CheckCircle, Loader, X, Download, SlidersHorizontal, ImagePlus } from 'lucide-react';
import Modal from 'Common/Components/Modal';
import DeleteModal from 'Common/DeleteModal';
import dummyImg from 'assets/images/users/user-dummy-img.jpg';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import filterDataBySearch from 'Common/filterDataBySearch';
import authService from 'services/authService';
import { countryCodes } from 'pages/Chat/countryCodes';
import AdminService, { User } from 'services/AdminService';
import { ToastContainer, toast } from 'react-toastify';
import OverviewTabs from 'pages/Pages/Account/OverviewTabs';
import Header from 'Layout/Header';
import Sidebar from 'Layout/VerticalLayout/Sidebar';
import RightSidebar from 'Layout/RightSidebar';
import { menuData } from 'Layout/LayoutMenuData';
import Footer from 'Layout/Footer';
import LightDark from 'Common/LightDark';


const ListView = () => {
    const [userList, setUserList] = useState<any[]>([]);
    const [user, setUser] = useState<User[]>([]);
    const [eventData, setEventData] = useState<any>();
    const [showOverview, setShowOverview] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [show, setShow] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await authService.getUsers();
            setUserList(response);

        } catch (error) {
            console.error(error);
        }
    };
   
    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setUser(userList);
    }, [userList]);

    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const deleteToggle = () => setDeleteModal(!deleteModal);

    const onClickDelete = (cell: any) => {
        setDeleteModal(true);
        if (cell.id) {
            setEventData(cell);
        }
    };
    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        navigate('/pages-account', { state: { user } });
    };
    const handleUserChange = (userId: number) => {
        const selectedUser = userList.find(user => user.id === userId);
        setSelectedUser(selectedUser);
    };
    const handleDelete = async () => {
        if (eventData) {
            try {
                await AdminService.deleteUser(eventData.id);
                setUserList((prev) => prev.filter((item) => item.id !== eventData.id));
                setDeleteModal(false);
                toast.success('User deleted successfully');
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    
    const handleUpdateDataClick = (ele: any) => {
        setEventData({ ...ele });
        setIsEdit(true);
        setShow(true);
    };

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            profile_image: eventData?.profile_image || '',
            userId: eventData?.id || '',
            name: eventData?.name || '',
            role: eventData?.role || '',
            service: eventData?.service || '',
            email: eventData?.email || '',
            country_code: eventData?.country_code || '',
            phone: eventData?.phone || '',
            created_at: eventData?.created_at || '',
            online: eventData?.online !== undefined ? eventData.online.toString() : '',
        },
        validationSchema: Yup.object({
            profile_image: Yup.string().required('Please Add Image'),
            name: Yup.string().required('Please Enter Name'),
            role: Yup.string().required('Please Enter Role'),
            service: Yup.string().required('Please Enter Service'),
            email: Yup.string().required('Please Enter Email'),
            country_code:Yup.string().required('Please Enter Country code '),
            phone: Yup.string().required('Please Enter Phone Number'),
            created_at: Yup.string().required('Please Enter Joining Date'),
            online: Yup.string().required('Please Enter Status'),
        }),
        onSubmit: async (values) => {
            if (isEdit) {
                try {
                    const dataToSend: User = {
                        ...eventData,
                        ...values,
                        online: values.online === 'true', // Convert to boolean
                    } as User;
    
                    const updatedUser = await AdminService.updateUser(dataToSend);
                    setUserList((prev) => prev.map((item) => (item.id === updatedUser.id ? updatedUser : item)));
                    setShow(false);
                    setIsEdit(false);
                    toast.success('User updated successfully');
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data.message || 'Failed to update user');
                    } else {
                        toast.error('Failed to update user');
                    }
                }
            }
        }
    });
    const [selectedImage, setSelectedImage] = useState<any>();
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target) {
                    validation.setFieldValue('profile_image', file);
                    setSelectedImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    

const toggle = useCallback(() => {
    if (show) {
        setShow(false);
        setEventData(null);
        setIsEdit(false);
        setSelectedImage(null);
    } else {
        setShow(true);
        setEventData(null);
        setSelectedImage(null);
        validation.resetForm();
    }
}, [show, validation]);

    const filterSearchData = (e: any) => {
        const search = e.target.value;
        const keysToSearch = ['name', 'role', 'location', 'email', 'status'];
        filterDataBySearch(userList, search, keysToSearch, setUser);
    };

    const Status = ({ item }: any) => {
        switch (item) {
            case 'Online':
                return (
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent inline-flex items-center status">
                        <CheckCircle className="size-3 mr-1.5" /> {item}
                    </span>
                );
            case 'Offline':
                return (
                    <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent status">
                        <X className="size-3 mr-1.5" /> {item}
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-slate-100 border-transparent text-slate-500 dark:bg-slate-500/20 dark:border-transparent inline-flex items-center status">
                        {item}
                    </span>
                );
        }
    };
    
    
    const OnlineStatus = ({ item }: any) => {
        return item === 1 ? (
            <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent inline-flex items-center status">Online</span>
        ) : (
            <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent inline-flex items-center status">Offline</span>
        );
    };
    const columns = useMemo(() => [
        {
            header: 'ID',
            accessorKey: 'id',
            enableColumnFilter: false,
            headerClassName: "dark:text-zinc-100", 

        },
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (cell: any) => (
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center size-10 font-medium rounded-full shrink-0 bg-slate-200 text-slate-800 dark:text-zink-50 dark:bg-zink-600">
                        {cell.row.original.profile_image ? (
                            <img src={`http://localhost:8000/storage/profile_images/${cell.row.original.profile_image}`} alt="" className="h-10 rounded-full" />
                        ) : (
                            cell.getValue().split(' ').map((word: any) => word.charAt(0)).join('')
                        )}
                    </div>
                    <div className="grow">
                        <h6 className="mb-1"><Link to="#!" className="name">{cell.getValue()}</Link></h6>
                    </div>
                </div>
            ),
            headerClassName: "dark:text-zinc-100", 

        },
        {
            header: 'Email',
            accessorKey: 'email',
            enableColumnFilter: false,
            headerClassName: "dark:text-zinc-100", 
        },
        {
            header: 'Country_code',
            accessorKey: 'country_code',
            enableColumnFilter: false,
            headerClassName: "dark:text-zinc-100", 
        },
        {
            header: 'Phone',
            accessorKey: 'phone',
            enableColumnFilter: false,
            headerClassName: "dark:text-zinc-100", 
        },
        {
            header: 'Location',
            accessorKey: 'location',
            enableColumnFilter: false,
            cell: (cell: any) => countryCodes[cell.row.original.country_code] || 'Unknown',
            headerClassName: "dark:text-zink-100", 
        },
        {
          
            header: 'Role',
            accessorKey: 'role',
            enableColumnFilter: false,
            headerClassName: "dark:text-zinc-100", 
        },
        {
            header: 'Service',
            accessorKey: 'service',
            enableColumnFilter: false,
            headerClassName: "dark:text-zinc-100", 
        },
        {
            header: 'Category',
            accessorKey: 'category',
            enableColumnFilter: false,
            headerClassName: "dark:text-zinc-100", 
        },
        {
            header: 'Status',
            accessorKey: 'online',
            enableColumnFilter: false,
            cell: (cell: any) => <Status item={cell.getValue() === 1 ? 'Online' : 'Offline'} />,
            headerClassName: "dark:text-zinc-100", 
            
        },
        {
            header: 'Joining Date',
            accessorKey: 'created_at',
            enableColumnFilter: false,
            cell: (cell: any) => moment(cell.getValue()).format('DD MMMM, YYYY'),
            headerClassName: "dark:text-zinc-100", 
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
                        className="p-2 text-white bg-green-500 rounded hover:bg-green-600 focus:bg-green-600"
                        onClick={() => handleSelectUser(cell.row.original)}

                    >
                        <Eye className="size-4" />
                    </button>
                    <button 
                        className="p-2 text-white bg-red-500 rounded hover:bg-red-600 focus:bg-red-600"
                        onClick={() => onClickDelete(cell.row.original)}
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            ),
            headerClassName: "dark:text-zinc-100", 
        }
        
    ], []);
 
    const options = [
        { value: 'Select Status', label: 'Select Status' },
        { value: 'Online', label: 'Online' },
        { value: 'Offline', label: 'Offline' },
        
    ];
    const roleOptions = [
        { value: 'Intern', label: 'Intern' },
        { value: 'Collaborator', label: 'Collaborator' },
        { value: 'External partner', label: 'External partner' },
    ];
    
    const serviceOptions = [
        { value: 'DSI', label: 'DSI' },
        { value: 'JFC2', label: 'JFC2' },
        { value: 'JFC3', label: 'JFC3' },
        { value: 'JFC4', label: 'JFC4' },
        { value: 'JFC5', label: 'JFC5' },
        { value: 'IMACID', label: 'IMACID' },
        { value: 'EMAPHOS', label: 'EMAPHOS' },
        { value: 'PAKPHOS', label: 'PAKPHOS' },
        { value: 'JESA', label: 'JESA' },
    ];
    const countryOptions = Object.entries(countryCodes).map(([code, country]) => ({
        value: code,
        label: `${code} - ${country}`,
    }));
    const handleChange = (selectedOption: any) => {
        if (selectedOption.value === 'Select Status' || selectedOption.value === 'Hidden') {
            setUser(userList);
        } else {
            const filteredUsers = userList.filter((data) => data.status === selectedOption.value);
            setUser(filteredUsers);
        }
    };
    const imageUrl = selectedImage 
    ? selectedImage 
    : validation.values.profile_image 
        ? `http://localhost:8000/storage/profile_images/${validation.values.profile_image}`
        : undefined;
    
    return (
        <React.Fragment>
 <Header />
  <Sidebar />
  <Footer />
  <DeleteModal show={deleteModal} onHide={deleteToggle} onDelete={handleDelete} />
  <ToastContainer closeButton={false} limit={1} />
  <div className="grid grid-cols-1 gap-x-4 xl:grid-cols-12">
    <div className="xl:col-span-12">
      {/* Ajout de marge en haut pour déplacer la carte vers le bas */}
      <div className="ml-72 mr-4 mt-24 mb-14">
        <div className="card" id="usersTable">
          <div className="card-body">
            <div className="flex items-center h-4">
              <h6 className="text-15 grow">Users List</h6>
            </div>
          </div>
          <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
            <form action="#!">
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <div className="relative xl:col-span-2">
                  <input
                    type="text"
                    className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Search for name, email, phone number etc..."
                    autoComplete="off"
                    onChange={(e) => filterSearchData(e)}
                  />
                  <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                </div>
                <div className="xl:col-span-2">
                  <Select
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    options={options}
                    isSearchable={false}
                    defaultValue={options[0]}
                    onChange={(event) => handleChange(event)}
                    id="choices-single-default"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="card-body">
            {user && user.length > 0 ? (
              <TableContainer
                isPagination={true}
                columns={columns}
                data={user}
                customPageSize={10}
                divclassName="-mx-5 -mb-5 overflow-x-auto"
                tableclassName="w-full border-separate table-custom border-spacing-y-1 whitespace-nowrap"
                theadclassName="text-left relative rounded-md bg-slate-100 dark:bg-zink-600 after:absolute ltr:after:border-l-2 rtl:after:border-r-2 ltr:after:left-0 rtl:after:right-0 after:top-0 after:bottom-0 after:border-transparent [&.active]:after:border-custom-500 [&.active]:bg-slate-100 dark:[&.active]:bg-zink-600"
                thclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold"
                tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5"
                PaginationClassName="flex flex-col items-center mt-8 md:flex-row"
              />
            ) : (
              <div className="noresult">
                <div className="py-6 text-center">
                  <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                  <h5 className="mt-2 mb-1">Loading Data....</h5>
                 
                </div>
              </div>
            )}
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
                    <Modal.Title className="text-16">{!!isEdit ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
                    <form action="#!" onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}>
                        <div className="mb-3">
                            <div className="relative size-24 mx-auto mb-4 rounded-full shadow-md bg-slate-100 profile-user dark:bg-zink-500">
                            <img src={imageUrl} alt="" className="object-cover w-full h-full rounded-full user-profile-image" />
                                <div className="absolute bottom-0 flex items-center justify-center size-8 rounded-full ltr:right-0 rtl:left-0 profile-photo-edit">
                                    <input
                                        id="profile-img-file-input"
                                        name="profile-img-file-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden profile-img-file-input"
                                        onChange={handleImageChange} />
                                    <label htmlFor="profile-img-file-input" className="flex items-center justify-center size-8 bg-white rounded-full shadow-lg cursor-pointer dark:bg-zink-600 profile-photo-edit">
                                        <ImagePlus className="size-4 text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500" />
                                    </label>
                                </div>
                            </div>
                        
                        </div>

                        <div className="mb-3">
                            <label htmlFor="userId" className="inline-block mb-2 text-base font-medium dark:text-zink-100">User ID</label>
                            <input type="text" id="userId" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" disabled
                                value={validation.values.userId }
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="joiningDateInput" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Joining Date</label>
                            <Flatpickr
                                id="joiningDateInput"
                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none  focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                options={{
                                    dateFormat: 'd M, Y'
                                }}
                                name="joiningDate"
                                placeholder='Select date'
                                onChange={(date) => validation.setFieldValue('created_at', moment(date[0]).format('DD MMMM ,YYYY'))}
                                value={validation.values.created_at|| ''}
                            />
                            
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userNameInput" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Name</label>
                            <input type="text" id="userNameInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter name"
                                name="name"
                                onChange={validation.handleChange}
                                value={validation.values.name || ''}
                            />
                           
                        </div>
                        <div className="mb-3">
                <label htmlFor="roleSelect" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Role</label>
                <select
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    id="roleSelect"
                    name="role"
                    onChange={validation.handleChange}
                    value={validation.values.role || ''}
                >
                    <option value="">Select Role</option>
                    {roleOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="serviceSelect" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Service</label>
                <select
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    id="serviceSelect"
                    name="service"
                    onChange={validation.handleChange}
                    value={validation.values.service || ''}
                >
                    <option value="">Select Service</option>
                    {serviceOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
                        <div className="mb-3">
                            <label htmlFor="emailInput" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Email</label>
                            <input type="email" id="emailInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter email"
                                name="email"
                                onChange={validation.handleChange}
                                value={validation.values.email || ''}
                            />
                           
                        </div>
                        <div className="mb-3 flex items-center space-x-4">
    <div className="flex flex-col">
        <label htmlFor="countrycodeInput" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Country code</label>
        <select
                    className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    id="countryCodeSelect"
                    name="country_code"
                    onChange={validation.handleChange}
                    value={validation.values.country_code || ''}
                >
                    <option value="">Select Country Code</option>
                    {countryOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
    </div>
    <div className="flex flex-col">
        <label htmlFor="phoneInput" className="inline-block mb-2 text-base font-medium dark:text-zink-100">Phone Number</label>
        <input
            type="text"
            id="phoneInput"
            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
            placeholder="12345 67890"
            name="phone"
            onChange={validation.handleChange}
            value={validation.values.phone || ''}
        />
    </div>
</div>

{/* <div className="mb-3">
                <label htmlFor="statusSelect" className="inline-block mb-2 text-base font-medium">Status</label>
                <select
                    className="form-input border-slate-300 focus:outline-none focus:border-custom-500"
                    id="statusSelect"
                    name="online"
                    onChange={validation.handleChange}
                    value={validation.values.online !== undefined ? validation.values.online.toString() : ''}
                >
                    <option value="">Select Status</option>
                    <option value="1">Online</option>
                    <option value="0">Offline</option>
                </select>
            </div> */}



                        <div className="flex justify-end gap-2 mt-4">
                            <button type="reset" data-modal-close="addDocuments" className="text-red-500 transition-all duration-200 ease-linear bg-white border-white btn hover:text-red-600 focus:text-red-600 active:text-red-600 dark:bg-zink-500 dark:border-zink-500" onClick={toggle}>Cancel</button>
                            <button type="submit" className="text-white transition-all duration-200 ease-linear btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">
                                {!!isEdit ? 'Update User' : 'Add User'}
                            </button>
                        </div>
                    </form>

                </Modal.Body>
            </Modal>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        </React.Fragment>
    );
};

export default ListView;
