import React from "react";
import withLogging from "../../utils/withLogging";
import SearchBar from "./SearchBar";
import SearchContext from "./SearchContext";

interface SearchContainerProps {
  children: React.ReactNode;
  initialSeachTerm?: string;
}

interface SearchContainerState {
  searchTerm: string;
  updateSearchTerm: (newSearchTerm: string) => void;
}

/**
 * Search bar which needs to be a descendant of `SearchContainer`
 */
const connectedSearchBar = (
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement => (
  <SearchContext.Consumer>
    {(searchContext): React.ReactElement => (
      <SearchBar
        {...props}
        key={searchContext.initialSearchTerm}
        searchTerm={searchContext.searchTerm}
        updateSearchTerm={searchContext.updateSearchTerm}
      />
    )}
  </SearchContext.Consumer>
);

/**
 * Container to encapsulate `SearchBar` and `withSearch`-wrapped components with.
 * Supports setting the initial search term using the `initialSearchTerm` prop.
 */
class SearchContainer extends React.Component<
  SearchContainerProps,
  SearchContainerState
> {
  static SearchBar = connectedSearchBar;

  constructor(props: SearchContainerProps) {
    super(props);
    this.state = {
      searchTerm: props.initialSeachTerm ?? "",
      updateSearchTerm: (newSearchTerm): void => {
        this.setState({ searchTerm: newSearchTerm });
      },
    };
  }

  render(): React.ReactNode {
    return (
      <SearchContext.Provider
        value={{
          ...this.state,
          initialSearchTerm: this.props.initialSeachTerm ?? "",
        }}
      >
        {this.props.children}
      </SearchContext.Provider>
    );
  }
}

export default withLogging<SearchContainerProps>(
  SearchContainer,
  "SearchContainer"
);

export { connectedSearchBar as SearchBar };
