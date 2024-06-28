import React from 'react';
import { Datepicker } from "flowbite-react";

interface SearchInputProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    onSearch: () => void;
    professions: string[];
    selectedProfession: string;
    onProfessionChange: (profession: string) => void;
    changeStartDate: (date: Date) => void;
    changeEndDate: (date: Date) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, onSearchTermChange, onSearch, professions,
                                                     selectedProfession, onProfessionChange, changeStartDate, changeEndDate }) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return;
        }
        onSearch();
    };

    return (
        <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="searchTerm">
                Search Term:
            </label>
            <div className="flex mb-4">
                <input
                    type="text"
                    id="searchTerm"
                    className="w-80 px-4 py-2 border rounded-l-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={onSearch}
                    className="px-4 py-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-700"
                >
                    Search
                </button>
            </div>

            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profession">
                Filter by Profession:
            </label>
            <div className="flex mb-4">
                <select
                    id="profession"
                    className="w-80 px-4 py-2 border rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    value={selectedProfession}
                    onChange={(e) => onProfessionChange(e.target.value)}
                >
                    <option value="">Select Profession</option>
                    {professions.map((profession, index) => (
                        <option key={index} value={profession}>{profession}</option>
                    ))}
                </select>
            </div>


            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profession">
                Filter by date range:
            </label>
            <div className="flex mb-4">
                <Datepicker
                    defaultDate={new Date('2010-01-02')}
                    onSelectedDateChanged={(date) => {
                        changeStartDate(date);
                    }}
                />
                <Datepicker
                    onSelectedDateChanged={(date) => {
                        changeEndDate(date);
                    }}
                />
            </div>
        </div>
    );
}

export default SearchInput;
