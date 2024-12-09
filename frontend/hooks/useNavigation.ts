import { useState } from 'react'; // Import useState for dropdown toggle

export const useNavigation = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Manage dropdown visibility


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen); // Toggle the dropdown visibility
    };

    return{
        isDropdownOpen,
        toggleDropdown
    };
};