import React, { useState ,useEffect } from "react";
import { Nav } from "Common/Components/Tab/Nav";
import Tab from "Common/Components/Tab/Tab";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Github, Mail, Smartphone, Twitter } from "lucide-react";
import { Dropdown } from "Common/Components/Dropdown";
import AuthService from '../../../services/authService'; 
import { register, AuthData,Role,Service } from '../../../services/authService';
import { Modal, Button } from 'react-bootstrap';

// Image 
import logoLight from "assets/images/logo-light.png";
import logoDark from "assets/images/logo-dark.png";
import image1 from "assets/images/auth/img-01.png";
import us from "assets/images/flags/us.svg";
import es from "assets/images/flags/es.svg";
import de from "assets/images/flags/de.svg";
import fr from "assets/images/flags/fr.svg";
import jp from "assets/images/flags/jp.svg";
import it from "assets/images/flags/it.svg";
import ru from "assets/images/flags/ru.svg";
import ae from "assets/images/flags/ae.svg";
import ocp from "assets/images/ocp.png";
import { ToastContainer, toast } from "react-toastify";
interface Role {
    id: number;
    name: string;
    // Ajoutez d'autres propriétés du rôle ici
  }
  
  interface Service {
    id: number;
    name: string;
    // Ajoutez d'autres propriétés du service ici
  }
  type FormErrors = {
    email?: string;
    password?: string;
    password_confirmation?: string;
    phone?: string;
    country_code?: string; // Assurez-vous que le nom du champ correspond
    name?: string;
    role_id?: string;
    service_id?: string;
    profile_image?: string;
  };
const RegisterBoxed = () => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [country_code, setcountry_code] = useState("");
    const [roleId, setRoleId] = useState<number | null>(null);
    const [serviceId, setServiceId] = useState<number | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("No file selected");
    const [profileImage, setProfileImage] = useState<File | null>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
          setProfileImage(event.target.files[0]);
        } else {
          setProfileImage(null); // Assurez-vous de remettre à null si aucun fichier n'est sélectionné
        }
      };
    
    
    
   
    useEffect(() => {
      const fetchData = async () => {
        const rolesData = await AuthService.Role();
        const servicesData = await AuthService.Service();
        setRoles(rolesData);
        setServices(servicesData);
      };
      fetchData();
    }, []);
    const [errors, setErrors] = useState<FormErrors>({});
    const [alertType, setAlertType] = useState<"success" | "error" | "">("");

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let errors: FormErrors = {};
    let formIsValid = true;

    if (!email) {
        formIsValid = false;
        errors["email"] = "Email is required.";
    }

    if (!password) {
        formIsValid = false;
        errors["password"] = "Password is required.";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(password)) {
        formIsValid = false;
        errors["password"] = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    
    if (password !== confirmationPassword) {
        formIsValid = false;
        errors["password_confirmation"] = "Passwords do not match.";
    }

    if (!phone) {
        formIsValid = false;
        errors["phone"] = "Phone number is required.";
    }
    if (!country_code) {
        formIsValid = false;
        errors["country_code"] = "countryCode is required.";
    }
    if (!name) {
        formIsValid = false;
        errors["name"] = "Name is required.";
    }

    if (!roleId) {
        formIsValid = false;
        errors["role_id"] = "Role is required.";
    }

    if (!serviceId) {
        formIsValid = false;
        errors["service_id"] = "Service is required.";
    }

    if (!profileImage) {
        formIsValid = false;
        errors["profile_image"] = "Profile image is required.";
    }
    if (!email || !email.includes("@gmail.com")) {
        alert("Email address must contain '@gmail.com' .");
        return;
    }
    // Check if the form is valid before making the request
    if (!formIsValid) {
        setErrors(errors);
        return;
    }
    if (password !== confirmationPassword) {
            alert("Passwords do not match.");
            return;
        }
    
        // Assurez-vous que les IDs de rôle et service sont sélectionnés
        if (roleId === null || serviceId === null) {
            alert("The role and service are required.");
            return;
        }
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("password_confirmation", confirmationPassword);
        formData.append("phone", phone);
        formData.append('country_code', country_code); // Utilisez 'country_code' ici
        formData.append("name", name);
        formData.append("role_id", roleId?.toString());
        formData.append("service_id", serviceId?.toString());
        
        if (profileImage) {
            formData.append("profile_image", profileImage);

        }
    
        try {
            await AuthService.register(formData);
            toast.success("Signup successfully!");
            setAlertType("success");
            navigate("/dashboards-social");
        }catch (error: any) {
            console.error("Caught error:", error);
        
            let errorMessage = "An error occurred during signup.";
        
            if (error.message) {
                if (error.message.includes("email has already been taken")) {
                    errorMessage = "The email has already been taken.";
                    setErrors({ ...errors, email: errorMessage });
                } else if (error.message.includes("phone has already been taken")) {
                    errorMessage = "The phone number has already been taken.";
                    setErrors({ ...errors, phone: errorMessage });
                } else if (error.message.includes("password must be at least 6 characters")) {
                    errorMessage = "The password must be at least 6 characters.";
                    setErrors({ ...errors, password: errorMessage });
                }
            }
        
            
        }
        <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        
        

        
          
    };        
    
      
    document.title = "Inscription | OCPLINK- Plateforme de collaboration";
    
    return (
        <React.Fragment>
             {alertMessage && (
                <div className="card bg-green-100 border-green-500 text-green-900 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {alertMessage}</span>
                </div>
            )}
            <div className="flex items-center justify-center min-h-screen px-4 py-16 bg-cover bg-auth-pattern dark:bg-auth-pattern-dark dark:text-zink-100 font-public">
                <div className="mb-0 border-none shadow-none xl:w-2/3 card bg-white/70 dark:bg-zink-500/70"style={{ width: '80%' }}>
                    <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <div className="!px-10 !py-12 card-body">
                                <Tab.Container defaultActiveKey="emailTabs">

                                    
                                    <div>
                                        <Tab.Content className="mt-5 tab-content">
                                            <Tab.Pane eventKey="emailTabs" className="tab-pane" id="emailTabs">
                                            <div className="text-center">
                                    <h4 className="mb-2 text-purple-500 dark:text-purple-500">Welcome Back !</h4>
                                    <p className="text-slate-500 dark:text-zink-200">Welcome to OCPLINK! Create your account below to access exclusive features and resources.</p>
                                </div>
                                            <form onSubmit={handleRegister}  className="mt-10 w-3/4 lg:w-full" id="signInForm"  encType="multipart/form-data">                                                   
                                      
                                            <div className="mb-3">
                                                        <label htmlFor="name" className="inline-block mb-2 text-base font-medium">UserName</label>
                                                        <input type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} className="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter username" />
                                                        {errors.name && <div className="error-message text-red-500">{errors.name}</div>}
                                                        <div id="name-error" className="hidden mt-1 text-sm text-red-500">Please enter a username.</div>
                                                    </div>
        <div className="col-md-6">
          <label htmlFor="email" className="inline-block mb-2 text-base font-medium">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)}   className="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter email" />
          {errors.email && <div className="error-message text-red-500">{errors.email}</div>}
          {
  alertMessage && (
    <div className={`alert ${alertType === "error" ? "bg-red-100" : "bg-green-100"} text-${alertType === "error" ? "red-600" : "green-600"}`}>
      {alertType === "success" ? <strong>Success!</strong> : <strong>Error!</strong>}
      <span className="block sm:inline"> {alertMessage}</span>
    </div>
  )
}
          <div id="email-id-error" className="hidden mt-1 text-sm text-red-500">Please enter a valid Email </div>
        </div>
     
                                                   
        <div className="mb-3 flex">
    <div className="mr-3">
        <label htmlFor="password" className="inline-block mb-2 text-base font-medium">Password</label>
        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} name="password" className="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter password" />
        {errors.password && <div className="error-message text-red-500">{errors.password}</div>}
        <div id="password-error" className="hidden mt-1 text-sm text-red-500">Password must be at least 8 characters long and contain both letters and numbers.</div>
    </div>
    <div>
        <label htmlFor="confirmationpassword" className="inline-block mb-2 text-base font-medium">Confirmation Password</label>
        <input type="password" id="confirmationpassword" value={confirmationPassword} onChange={e => setConfirmationPassword(e.target.value)} name="confirmationpassword" className="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter password" />
        {errors.password_confirmation && <div className="error-message text-red-500">{errors.password_confirmation}</div>}
        <div id="confirmationpassword-error" className="hidden mt-1 text-sm text-red-500">Password must be at least 8 characters long and contain both letters and numbers.</div>
    </div>
</div>

                                                    <div className="mb-3 flex">
    <div className="mr-3">
        <label htmlFor="countryCode" className="block mb-2 text-base font-medium">Country Code</label>
         <select id="countryCode" name="countryCode" className="form-select dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 w-24"value={country_code} onChange={e => setcountry_code(e.target.value)} >
         <option value="">Select a Country Code</option>

        <option value="+1">+1 (United States)</option>
<option value="+44">+44 (United Kingdom)</option>
<option value="+33">+33 (France)</option>
<option value="+49">+49 (Germany)</option>
<option value="+81">+81 (Japan)</option>
<option value="+86">+86 (China)</option>
<option value="+91">+91 (India)</option>
<option value="+61">+61 (Australia)</option>
<option value="+7">+7 (Russia)</option>
<option value="+34">+34 (Spain)</option>
<option value="+39">+39 (Italy)</option>
<option value="+82">+82 (South Korea)</option>
<option value="+1">+1 (Canada)</option>
<option value="+31">+31 (Netherlands)</option>
<option value="+46">+46 (Sweden)</option>
<option value="+64">+64 (New Zealand)</option>
<option value="+41">+41 (Switzerland)</option>
<option value="+971">+971 (United Arab Emirates)</option>
<option value="+358">+358 (Finland)</option>
<option value="+52">+52 (Mexico)</option>
<option value="+55">+55 (Brazil)</option>
<option value="+420">+420 (Czech Republic)</option>
<option value="+45">+45 (Denmark)</option>
<option value="+20">+20 (Egypt)</option>
<option value="+358">+358 (Finland)</option>
<option value="+33">+33 (France)</option>
<option value="+30">+30 (Greece)</option>
<option value="+852">+852 (Hong Kong)</option>
<option value="+36">+36 (Hungary)</option>
<option value="+91">+91 (India)</option>
<option value="+62">+62 (Indonesia)</option>
<option value="+353">+353 (Ireland)</option>
<option value="+972">+972 (Israel)</option>
<option value="+39">+39 (Italy)</option>
<option value="+81">+81 (Japan)</option>
<option value="+82">+82 (South Korea)</option>
<option value="+965">+965 (Kuwait)</option>
<option value="+60">+60 (Malaysia)</option>
<option value="+356">+356 (Malta)</option>
<option value="+52">+52 (Mexico)</option>
<option value="+212">+212 (Morocco)</option>
<option value="+31">+31 (Netherlands)</option>
<option value="+64">+64 (New Zealand)</option>
<option value="+234">+234 (Nigeria)</option>
<option value="+47">+47 (Norway)</option>
<option value="+63">+63 (Philippines)</option>
<option value="+48">+48 (Poland)</option>
<option value="+351">+351 (Portugal)</option>
<option value="+974">+974 (Qatar)</option>
<option value="+7">+7 (Russia)</option>
<option value="+966">+966 (Saudi Arabia)</option>
<option value="+65">+65 (Singapore)</option>
<option value="+27">+27 (South Africa)</option>
<option value="+34">+34 (Spain)</option>
<option value="+46">+46 (Sweden)</option>
<option value="+41">+41 (Switzerland)</option>
<option value="+66">+66 (Thailand)</option>
<option value="+90">+90 (Turkey)</option>
<option value="+971">+971 (United Arab Emirates)</option>
<option value="+44">+44 (United Kingdom)</option>
<option value="+1">+1 (United States)</option>
<option value="+84">+84 (Vietnam)</option>
<option value="+260">+260 (Zambia)</option>
<option value="+263">+263 (Zimbabwe)</option>

        </select>
        {errors.country_code && <div className="error-message text-red-500">{errors.country_code}</div>}

    </div>
    
    <div>
        <label htmlFor="phone" className="block mb-2 text-base font-medium">Phone Number</label>
        <input type="tel" id="phone" name="phone" value={phone} onChange={e => setPhone(e.target.value)} className="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200 "  style={{ width: '250px' }}  placeholder="Enter phone" />
        {errors.phone && <div className="error-message text-red-500">{errors.phone}</div>}
        <div id="phone-number-error" className="hidden mt-1 text-sm text-red-500">Please enter a valid phone number.</div>
    </div>
</div>



<div className="flex justify-between items-center">
  <div className="flex-1 mb-3 mr-2">
    <label htmlFor="Role" className="block mb-2 text-base font-medium">Role</label>
    {/* Champs d'entrée pour email, password, etc. */}
    <select onChange={(e) => setRoleId(Number(e.target.value))} value={roleId || undefined}className="form-select w-full dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:text-zink-100 dark:focus:border-custom-800 text-slate-500">
        <option value="">Select a role</option>
        {roles.map((role: any) => (
          <option key={role.id} value={role.id}>{role.name}</option>
        ))}
      </select>
      {errors.role_id && <div className="error-message text-red-500">{errors.role_id}</div>}

      </div>
  <div className="flex-1 mb-3 mr-2">
    <label htmlFor="Role" className="block mb-2 text-base font-medium">Service</label>
      <select onChange={(e) => setServiceId(Number(e.target.value))} value={serviceId || undefined}className="form-select w-full dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:text-zink-100 dark:focus:border-custom-800 text-slate-500">
        <option value="">Select a service</option>
        {services.map((service: any) => (
          <option key={service.id} value={service.id}>{service.name}</option>
        ))}
      </select>
      {errors.service_id && <div className="error-message text-red-500">{errors.service_id}</div>}

  </div>
  
</div>

     
    
<div className="mb-3">
  <label htmlFor="profileImage" className="inline-block mb-2 text-base font-medium">Profile Image</label>
  <input
    type="file"
    id="profileImage"
    name="profileImage"
    onChange={(event) => {
      if (event.target.files && event.target.files[0]) {
        setProfileImage(event.target.files[0]);
        setSelectedFileName(event.target.files[0].name); // Mettre à jour le nom de fichier sélectionné
      }
    }}
    className="form-input block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
  />        {errors.profile_image && <div className="error-message text-red-500 ">{errors.profile_image}</div>}

  {selectedFileName && <span className="mt-2 text-sm font-normal">{selectedFileName}</span>}
</div>


                                                    <p className="italic text-15 text-slate-500 dark:text-zink-200">By registering you agree to the OCPLINK <a href="#!" className="underline">Terms of Use</a></p>
                                         
                                                    <div className="mt-5">
                                                        <button type="submit" className="w-full text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Sign Up</button>
                                                    </div>
                                                </form>
                                            </Tab.Pane>
                                           
                                        </Tab.Content>
                                        <div className="relative text-center my-9 before:absolute before:top-3 before:left-0 before:right-0 before:border-t before:border-t-slate-200 dark:before:border-t-zink-500">
                                            <h5 className="inline-block px-4 py-0.5 text-sm bg-white text-slate-500 dark:bg-zink-700 dark:text-zink-200 rounded relative">Create account with</h5>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-2">
                                            <button type="button" className="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 active:text-white active:bg-custom-600 active:border-custom-600">
                                                <Facebook className="size-4"></Facebook>
                                            </button>
                                            <button type="button" className="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-white btn bg-orange-500 border-orange-500 hover:text-white hover:bg-orange-600 hover:border-orange-600 focus:text-white focus:bg-orange-600 focus:border-orange-600 active:text-white active:bg-orange-600 active:border-orange-600">
                                                <Mail className="size-4"></Mail>
                                            </button>
                                            <button type="button" className="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-white btn bg-sky-500 border-sky-500 hover:text-white hover:bg-sky-600 hover:border-sky-600 focus:text-white focus:bg-sky-600 focus:border-sky-600 active:text-white active:bg-sky-600 active:border-sky-600">
                                                <Twitter className="size-4"></Twitter>
                                            </button>
                                            <button type="button" className="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-white btn bg-slate-500 border-slate-500 hover:text-white hover:bg-slate-600 hover:border-slate-600 focus:text-white focus:bg-slate-600 focus:border-slate-600 active:text-white active:bg-slate-600 active:border-slate-600">
                                                <Github className="size-4"></Github>
                                            </button>
                                        </div>

                                        <div className="mt-10 text-center">
                                            <p className="mb-0 text-slate-500 dark:text-zink-200">Already have an account ? <Link to="/auth-login-boxed" className="font-semibold underline transition-all duration-150 ease-linear text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500">Login</Link> </p>
                                        </div>
                                    </div>
                                </Tab.Container>
                            </div>
                        </div>
                        <div className="mx-2 mt-2 mb-2 border-none shadow-none lg:col-span-7 card bg-white/60 dark:bg-zink-500/60"style={{ marginLeft: '80px' }}>
                            <div className="!px-10 !pt-10 h-full !pb-0 card-body flex flex-col">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="grow">
                                        <Link to="/">
                                            <img src={ocp} alt="" className="hidden h-20 w-30 dark:block img-styling" />
                                            <img src={ocp} alt="" className="block h-20 w-30 dark:hidden img-styling"  />
                                        </Link>
                                    </div>
                                    <div className="shrink-0">
                                        <Dropdown className="relative text-end">
                                            <Dropdown.Trigger type="button" className="inline-flex items-center gap-3 transition-all duration-200 ease-linear dropdown-toggle btn border-slate-200 dark:border-zink-400/60 group/items focus:border-custom-500 dark:focus:border-custom-500" id="dropdownMenuButton" data-bs-toggle="dropdown">
                                                <img src={us} alt="" className="object-cover h-5 rounded-full" />
                                                <h6 className="text-base font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">English</h6>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content placement="right-end" className="absolute z-50 p-3 mt-1 text-left list-none bg-white rounded-md shadow-md dropdown-menu min-w-[9rem] flex flex-col gap-3 dark:bg-zink-600" aria-labelledby="dropdownMenuButton">
                                                <a href="#!" className="flex items-center gap-3 group/items">
                                                    <img src={us} alt="" className="object-cover h-4 rounded-full" />
                                                    <h6 className="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">English</h6>
                                                </a>
                                                <a href="#!" className="flex items-center gap-3 group/items">
                                                    <img src={es} alt="" className="object-cover h-4 rounded-full" />
                                                    <h6 className="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">Spanish</h6>
                                                </a>
                                                <a href="#!" className="flex items-center gap-3 group/items">
                                                    <img src={de} alt="" className="object-cover h-4 rounded-full" />
                                                    <h6 className="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">German</h6>
                                                </a>
                                                <a href="#!" className="flex items-center gap-3 group/items">
                                                    <img src={fr} alt="" className="object-cover h-4 rounded-full" />
                                                    <h6 className="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">French</h6>
                                                </a>
                                                <a href="#!" className="flex items-center gap-3 group/items">
                                                    <img src={jp} alt="" className="object-cover h-4 rounded-full" />
                                                    <h6 className="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">Japanese</h6>
                                                </a>
                                                <a href="#!" className="flex items-center gap-3 group/items">
                                                    <img src={it} alt="" className="object-cover h-4 rounded-full" />
                                                    <h6 className="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">Italian</h6>
                                                </a>
                                                <a href="#!" className="flex items-center gap-3 group/items">
                                                    <img src={ru} alt="" className="object-cover h-4 rounded-full" />
                                                    <h6 className="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">Russian</h6>
                                                </a>
                                                <a href="#!" className="flex items-center gap-3 group/items">
                                                    <img src={ae} alt="" className="object-cover h-4 rounded-full" />
                                                    <h6 className="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">Arabic</h6>
                                                </a>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
  <div className="mt-auto">
    <img src={image1} alt="" className="md:max-w-[32rem] mx-auto" />
  </div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
        </React.Fragment>
  );
};


export default RegisterBoxed;