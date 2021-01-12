import React from "react";
import withLogging from "../../utils/withLogging";
import "./SearchBar.css";

interface SearchBarProps extends React.HTMLProps<HTMLDivElement> {
  searchTerm: string;
  updateSearchTerm: (newSearchTerm: string) => void;
}

interface SearchBarState {
  searchTerm: string;
}

/**
 * Search bar which takes in two props, `searchTerm` and `updateSearchTerm`.
 * `searchTerm` is used only to set the initial value before mounting the component
 * i.e. when the filter already has a value before navigating to the page.
 * Changes to `searchTerm` after the compnent has been mounted will be ignored.
 * To change the displayed search term a `key` on the component can be used to replace
 * it with a new instance (which will then load its initial value from the prop).
 */
class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  updateTimeout?: NodeJS.Timeout;
  updateSearchTerm: (e: React.ChangeEvent<HTMLInputElement>) => void;

  constructor(props: SearchBarProps) {
    super(props);
    this.state = {
      //set search term to initial value
      searchTerm: this.props.searchTerm,
    };
    this.updateSearchTerm = (e): void => {
      const newTerm = e.target.value;
      //immediately set new value to reflect input in the element
      this.setState({ searchTerm: newTerm });

      //clear pending global search term updates in case of new input change
      if (this.updateTimeout != null) {
        clearTimeout(this.updateTimeout);
      }
      //wait 0.5s before updating globally in case user changes input
      this.updateTimeout = setTimeout(() => {
        this.props.updateSearchTerm(newTerm);
        delete this.updateTimeout;
      }, 500);
    };
  }

  render(): React.ReactElement {
    const { searchTerm } = this.state;
    const { searchTerm: _, updateSearchTerm: __, ...props } = this.props;
    return (
      <div className="search-bar" {...props}>
        <span className="label">Search by author name:</span>
        <input
          name="search-term-input"
          type="text"
          value={searchTerm}
          onChange={this.updateSearchTerm}
        />
      </div>
    );
  }
}

export default withLogging(SearchBar, "SearchBar");
