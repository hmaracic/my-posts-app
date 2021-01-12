import React from "react";
import SearchContext from "./SearchContext";

export interface InjectedSearchProps {
  searchTerm: string;
}

/** Injects current search term into the wrapped component. Must be a descendant of a `SearchContainer` */
const withSearch = <P extends InjectedSearchProps>(
  Component: React.ComponentType<P>
): React.ComponentClass<Omit<P, keyof InjectedSearchProps>> =>
  class WithSearch extends React.Component<Omit<P, keyof InjectedSearchProps>> {
    render(): React.ReactNode {
      return (
        <SearchContext.Consumer>
          {(searchContext): React.ReactNode => (
            <Component
              {...(this.props as P)}
              searchTerm={searchContext.searchTerm}
            />
          )}
        </SearchContext.Consumer>
      );
    }
  };

export default withSearch;
