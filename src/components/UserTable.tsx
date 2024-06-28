import { TrashIcon } from '@heroicons/react/24/solid';

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    profession: string;
    dateCreated: string; // Assuming the date is represented as a string
    country: string;
    city: string;
}

interface UserTableProps {
    users: User[];
    onDelete: (id: number) => void;
    onDetails: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDelete, onDetails }) => {
    const formatDate = (dateString: string) => {
        const tIndex = dateString.indexOf('T');
        return tIndex !== -1 ? dateString.substring(0, tIndex) : dateString;
    }

    return (
        <>
            <table className="min-w-full bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600">
                <thead>
                <tr>
                    <th className="px-4 py-2 text-left bg-gray-200 border-b border-gray-300 dark:bg-gray-600 dark:border-gray-500">First Name</th>
                    <th className="px-4 py-2 text-left bg-gray-200 border-b border-gray-300 dark:bg-gray-600 dark:border-gray-500">Last Name</th>
                    <th className="px-4 py-2 text-left bg-gray-200 border-b border-gray-300 dark:bg-gray-600 dark:border-gray-500">Email</th>
                    <th className="px-4 py-2 text-left bg-gray-200 border-b border-gray-300 dark:bg-gray-600 dark:border-gray-500">Profession</th>
                    <th className="px-4 py-2 text-left bg-gray-200 border-b border-gray-300 dark:bg-gray-600 dark:border-gray-500">Date Created</th>
                    <th className="px-4 py-2 text-left bg-gray-200 border-b border-gray-300 dark:bg-gray-600 dark:border-gray-500">Country</th>
                    <th className="px-4 py-2 text-left bg-gray-200 border-b border-gray-300 dark:bg-gray-600 dark:border-gray-500">City</th>
                    <th className="px-4 py-2 text-left bg-gray-200 border-b border-gray-300 dark:bg-gray-600 dark:border-gray-500"></th>
                    <th className="px-4 py-2 text-left bg-gray-200 border-b border-gray-300 dark:bg-gray-600 dark:border-gray-500"></th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={index} className="border-b dark:border-gray-500">
                        <td className="px-4 py-2">{user.firstname}</td>
                        <td className="px-4 py-2">{user.lastname}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.profession}</td>
                        <td className="px-4 py-2">{formatDate(user.dateCreated)}</td>
                        <td className="px-4 py-2">{user.country}</td>
                        <td className="px-4 py-2">{user.city}</td>
                        <td className="px-4 py-2">
                            <button
                                onClick={() => onDelete(user.id)}
                                className="flex items-center px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
                            >
                                <TrashIcon className="w-5 h-5" />
                                <span className="ml-1">Delete</span>
                            </button>
                        </td>
                        <td className="px-4 py-2">
                            <button className="flex items-center px-2 py-1 text-white bg-green-500 rounded hover:bg-green-700" onClick={() => onDetails(user.id)}>User Details</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default UserTable;
