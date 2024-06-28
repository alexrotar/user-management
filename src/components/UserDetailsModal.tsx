import React from 'react';
import { Modal } from "flowbite-react";
import {User} from "./UserTable";

interface UserDetailsModalProps {
    isOpen: boolean
    onClose: () => void;
    user: User | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
    if (!user) return null;

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>User Details</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        User ID: {user.id}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        First Name: {user.firstname}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Last Name: {user.lastname}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Email: {user.email}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Profession: {user.profession}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Date Created: {user.dateCreated}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Country: {user.country}
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        City: {user.city}
                    </p>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default UserDetailsModal;
