import React from 'react'

export interface SearchContextType {
    searchTerm: string;
    initialSearchTerm: string;
    updateSearchTerm: (newSearchTerm: string) => void;
}

const SearchContext = React.createContext<SearchContextType>({
    searchTerm: "",
    initialSearchTerm: "",
    updateSearchTerm: (_) => { },
});

export default SearchContext;