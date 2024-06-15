import React, { useState, useEffect, ChangeEvent } from "react";
import AuthService from '../../../services/authService';
import Select, { SingleValue } from 'react-select';
import authService from "../../../services/authService";
import { ToastContainer, toast } from 'react-toastify';
import { ImagePlus } from "lucide-react";

interface User {
  id:number;
  email: string;
  country_code: string;
  phone: string;
  name: string;
  role: string;
  service: string;
  profile_image: File | null;
}
const countryOptions = [
  { value: '+1', label: 'United States (+1)' },
  { value: '+44', label: 'United Kingdom (+44)' },
  { value: '+33', label: 'France (+33)' },
  { value: '+49', label: 'Germany (+49)' },
  { value: '+81', label: 'Japan (+81)' },
  { value: '+86', label: 'China (+86)' },
  { value: '+91', label: 'India (+91)' },
  { value: '+61', label: 'Australia (+61)' },
  { value: '+7', label: 'Russia (+7)' },
  { value: '+34', label: 'Spain (+34)' },
  { value: '+39', label: 'Italy (+39)' },
  { value: '+82', label: 'South Korea (+82)' },
  { value: '+1', label: 'Canada (+1)' },
  { value: '+31', label: 'Netherlands (+31)' },
  { value: '+46', label: 'Sweden (+46)' },
  { value: '+64', label: 'New Zealand (+64)' },
  { value: '+41', label: 'Switzerland (+41)' },
  { value: '+971', label: 'United Arab Emirates (+971)' },
  { value: '+358', label: 'Finland (+358)' },
  { value: '+52', label: 'Mexico (+52)' },
  { value: '+55', label: 'Brazil (+55)' },
  { value: '+420', label: 'Czech Republic (+420)' },
  { value: '+45', label: 'Denmark (+45)' },
  { value: '+20', label: 'Egypt (+20)' },
  { value: '+30', label: 'Greece (+30)' },
  { value: '+852', label: 'Hong Kong (+852)' },
  { value: '+36', label: 'Hungary (+36)' },
  { value: '+62', label: 'Indonesia (+62)' },
  { value: '+353', label: 'Ireland (+353)' },
  { value: '+972', label: 'Israel (+972)' },
  { value: '+965', label: 'Kuwait (+965)' },
  { value: '+60', label: 'Malaysia (+60)' },
  { value: '+356', label: 'Malta (+356)' },
  { value: '+212', label: 'Morocco (+212)' },
  { value: '+234', label: 'Nigeria (+234)' },
  { value: '+47', label: 'Norway (+47)' },
  { value: '+63', label: 'Philippines (+63)' },
  { value: '+48', label: 'Poland (+48)' },
  { value: '+351', label: 'Portugal (+351)' },
  { value: '+974', label: 'Qatar (+974)' },
  { value: '+966', label: 'Saudi Arabia (+966)' },
  { value: '+65', label: 'Singapore (+65)' },
  { value: '+27', label: 'South Africa (+27)' },
  { value: '+66', label: 'Thailand (+66)' },
  { value: '+90', label: 'Turkey (+90)' },
  { value: '+84', label: 'Vietnam (+84)' },
  { value: '+260', label: 'Zambia (+260)' },
  { value: '+263', label: 'Zimbabwe (+263)' }
];

  const roleOptions = [
    { value: 'Intern', label: 'Intern' },
    { value: 'Collaborator', label: 'Collaborator' },
    { value: 'External partner', label: 'External partner' }
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
    { value: 'JESA', label: 'JESA' }
  
  ];
  
const PersonalTabs = () => {
  const [user, setUser] = useState<User>({
    id: 0,
    email: '',
    country_code: '',
    phone: '',
    name: '',
    role: '',
    service: '',
    profile_image: null,
  });
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Parsed User:", parsedUser); // Debugging line
          const profileImageUrl = parsedUser.user.profile_image
                        ? `http://localhost:8000/storage/profile_images/${encodeURIComponent(parsedUser.user.profile_image)}`
                        : undefined;
                    setSelectedImage(profileImageUrl);

          setUser({
            id: parsedUser.user.id,
            email: parsedUser.user.email || '',
            country_code: parsedUser.user.country_code || '',
            phone: parsedUser.user.phone || '',
            name: parsedUser.user.name || '',
            role: parsedUser.user.role || '',
            service: parsedUser.user.service || '',
            profile_image: null,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name}, Value: ${value}`); 
    setUser(prevState => ({
        ...prevState,
        [name]: value,
    }));
};

const handleCountryChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    console.log(`Country Code changed: ${selectedOption ? selectedOption.value : ''}`); 
    setUser(prevState => ({
        ...prevState,
        country_code: selectedOption ? selectedOption.value : '',
    }));
};

const handleRoleChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    console.log(`Role changed: ${selectedOption ? selectedOption.value : ''}`); 
    setUser(prevState => ({
        ...prevState,
        role: selectedOption ? selectedOption.value : '',
    }));
};

const handleServiceChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    console.log(`Service changed: ${selectedOption ? selectedOption.value : ''}`);
    setUser(prevState => ({
        ...prevState,
        service: selectedOption ? selectedOption.value : '',
    }));
};
const handleSubmit = async () => {
    
      try {
        const updatedUser: User = {
            ...user,
            profile_image: user.profile_image
        }; 
      console.log("Updated User Data:", updatedUser); 
  
      const response = await AuthService.updateUser(updatedUser);
      // Mise à jour de l'utilisateur localement après succès de la mise à jour
      localStorage.setItem('user', JSON.stringify({ user: response }));
      setUser(response);

      toast.success('User updated successfully');
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error('Failed to update user');
    }
  };
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setUser(prevState => ({
            ...prevState,
            profile_image: file,
        }));
    }
};

  return (
    <React.Fragment>
      <div className="card">
        <div className="card-body">
          <h6 className="mb-1 text-15">Personal Information</h6>
          <p className="mb-4 text-slate-500 dark:text-zink-200">Update your photo and personal details here easily.</p>
          <form>
         
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-11">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-11 2xl:grid-cols-12">
                    <div className="lg:col-span-2 2xl:col-span-1">
                        <div className="relative inline-block size-20 rounded-full shadow-md bg-slate-100 profile-user xl:size-28">
                        <img
                                src={selectedImage}
                                alt="Profile"
                                className="object-cover border-0 rounded-full img-thumbnail user-profile-image"
                                style={{ height: '100%', width: '100%' }}
                            />
                            <div className="absolute bottom-0 flex items-center justify-center size-8 rounded-full ltr:right-0 rtl:left-0 profile-photo-edit">
                                <input id="profile-img-file-input" type="file"
                                    className="hidden profile-img-file-input"
                                    onChange={handleImageChange} />
                                <label htmlFor="profile-img-file-input" className="flex items-center justify-center size-8 bg-white rounded-full shadow-lg cursor-pointer dark:bg-zink-600 profile-photo-edit">
                                    <ImagePlus className="size-4 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-500"></ImagePlus>
                                </label>
                            </div>
                        </div>
                    </div>
                    </div>

              <div className="xl:col-span-4">
                
                <label htmlFor="inputValueName" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Name</label>
                <input
                  type="text"
                  id="inputValueName"
                  name="name"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 dark:text-gray-400 dark:bg-zink-700 "
                  placeholder="Enter your name"
                  value={user.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="xl:col-span-6 flex space-x-4">
              <div className="w-1/3">
                  <label htmlFor="inputValueCountryCode" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Country Code</label>
                  <Select
                    id="inputValueCountryCode"
                    name="country_code"
                    options={countryOptions}
                    value={countryOptions.find(option => option.value === user.country_code)}
                    onChange={handleCountryChange}
                    className="dark:text-gray-400"
                  />
                </div>
                <div className="w-2/3">
                                    <label htmlFor="inputValuePhone" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Phone Number</label>
                                    <input
                                        type="text"
                                        id="inputValuePhone"
                                        name="phone"
                                        className="form-input border-slate-200 dark:border-zink-500 dark:text-gray-400 focus:outline-none focus:border-custom-500 dark:bg-zink-700 "
                                        placeholder="Enter phone number"
                                        value={user.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
              </div>

              <div className="xl:col-span-6">
                <label htmlFor="inputValueEmail" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Email Address</label>
                <input
                  type="email"
                  id="inputValueEmail"
                  name="email"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none dark:text-gray-400 focus:border-custom-500 dark:bg-zink-700 "
                  placeholder="Enter your email address"
                  value={user.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="xl:col-span-5">
                <label htmlFor="inputValueRole" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Role</label>
                <Select
                  id="inputValueRole"
                  name="role"
                  options={roleOptions}
                  value={roleOptions.find(option => option.value === user.role)}
                  onChange={handleRoleChange}
                  className="dark:text-gray-400"
                />
              </div>

              <div className="xl:col-span-5">
                <label htmlFor="inputValueService" className="inline-block mb-2 text-base font-medium dark:text-gray-400">Service</label>
                <Select
                  id="inputValueService"
                  name="service"
                  options={serviceOptions}
                  value={serviceOptions.find(option => option.value === user.service)}
                  onChange={handleServiceChange}
                  className="dark:text-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-x-4">
              <button type="button"  onClick={handleSubmit}  className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 focus:text-white focus:bg-custom-600 active:text-white active:bg-custom-600 dark:bg-custom-400">Update</button>
              <button type="button" className="text-red-500 dark:text-white bg-red-100 btn hover:text-white hover:bg-red-600 focus:text-white focus:bg-red-600 active:text-white active:bg-red-600 dark:bg-red-500">Cancel</button>
            </div>
          </form>
        </div>

      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

    </React.Fragment>
  );
}

export default PersonalTabs;
