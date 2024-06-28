import React, { useEffect, useState } from 'react';
import SearchInput from './SearchInput';
import UserTable, { User } from './UserTable';
import UserDetailsModal from "./UserDetailsModal";

const API_URL = process.env.REACT_APP_API_URL;

const SearchTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [professions, setProfessions] = useState<string[]>([]);
    const [selectedProfession, setSelectedProfession] = useState('');
    const [startDate, setStartDate] = useState<Date>(new Date('2010-01-02'));
    const [endDate, setEndDate] = useState<Date>(new Date());

    useEffect(() => {
        const fetchInitialUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/api/users`);
                const result = await response.json();
                setUsers(result.data || []);
            } catch (error) {
                console.error('Error fetching initial users:', error);
            }
        };
        const fetchProfessions = async () => {
            try {
                const response = await fetch(`${API_URL}/api/users/professions`);
                const result = await response.json();
                setProfessions(result.data || []);
            } catch (error) {
                console.error('Error fetching professions:', error);
            }
        };
        fetchProfessions().catch(error => console.error('Error fetching professions:', error));
        fetchInitialUsers().catch(error => console.error('Error fetching initial users:', error));
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/api/users/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.error) {
                throw new Error(result.message);
            }
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const fetchUserDetails = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/api/users/${id}`, {
                method: 'GET'
            });
            const result = await response.json();
            if (result.error) {
                throw new Error(result.data);
            }
            setSelectedUser(result.data || null);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleSearch = async () => {
        setSelectedProfession('');
        setStartDate(new Date());
        setEndDate(new Date());
        try {
            if (searchTerm) {
                const response = await fetch(`${API_URL}/api/users/search?q=${searchTerm}`);
                const result = await response.json();
                if (result.error) {
                    throw new Error(result.data);
                }
                setUsers(result.data || []);
            } else {
                try {
                    const response = await fetch(`${API_URL}/api/users`);
                    const result = await response.json();
                    setUsers(result.data || []);
                } catch (error) {
                    console.error('Error fetching initial users:', error);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleStartDateRangeChange = async (date: Date) => {
        setSearchTerm('');
        setSelectedProfession('');
        setStartDate(date);
        await fetchUsersByDateRange(date, endDate);
    };

    const handleEndDateRangeChange = async (date: Date) => {
        setSearchTerm('');
        setSelectedProfession('');
        setEndDate(date);
        await fetchUsersByDateRange(startDate, date);
    };

    const fetchUsersByDateRange = async (startDate: Date | null, endDate: Date | null) => {
        try {
            let url = `${API_URL}/api/users/search/date-range?`;
            if (startDate && endDate) {
                const startDateStr = startDate.toISOString().split('T')[0];
                const endDateStr = endDate.toISOString().split('T')[0];
                url += `startDate=${startDateStr}` + `&endDate=${endDateStr}`;
            }
            const response = await fetch(url);
            const result = await response.json();
            if (result.error) {
                throw new Error(result.data);
            }
            setUsers(result.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleProfessionChange = async (profession: string) => {
        setSearchTerm('');
        setStartDate(new Date());
        setEndDate(new Date());
        setSelectedProfession(profession);
        if (profession) {
            try {
                const response = await fetch(`${API_URL}/api/users/professions/${profession}`);
                const result = await response.json();
                if (result.error) {
                    throw new Error(result.data);
                }
                setUsers(result.data || []);
            } catch (error) {
                console.error('Error fetching users by profession:', error);
            }
        } else {
            await handleSearch();
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 dark:text-white">
            <SearchInput
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSearch={handleSearch}
                professions={professions}
                selectedProfession={selectedProfession}
                onProfessionChange={handleProfessionChange}
                changeStartDate={handleStartDateRangeChange}
                changeEndDate={handleEndDateRangeChange}
            />
            <UserTable users={users} onDelete={handleDelete} onDetails={fetchUserDetails} />
            <UserDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} />
        </div>
    );
};

export default SearchTable;
