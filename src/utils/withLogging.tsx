import React from "react";

interface LoggingContextType {
  propsMessage: string;
}

export const LoggingContext = React.createContext<LoggingContextType>({
  propsMessage: "Default logging message:",
});

/**
 * A component which adds a call to console.log for each (re-)rendering. 
 * The message format is "`propsMessage` `componentName`". `componentName` 
 * is passed as a prop to the component, while the `propsMessage` is 
 * retrieved from the `LoggingProvider` which needs to be an ancestor of 
 * this component. In case no `LoggingProvider` ancestor is available, a 
 * default `"Default logging message:"` is used.
 */
export const WithLogging = ({
  componentName,
  children,
}: {
  componentName: string;
  children: () => React.ReactNode;
}): React.ReactElement | null => {
  return (
    <LoggingContext.Consumer>
      {(loggingContext): React.ReactNode => {
        console.log(`${loggingContext.propsMessage} ${componentName}`);
        return children();
      }}
    </LoggingContext.Consumer>
  );
};

/**
 * A HOC wrapper which adds a call to console.log for each (re-)rendering. 
 * The message format is "`propsMessage` `componentName`". `componentName` 
 * is passed as the 2nd argument, while the `propsMessage` is retrieved 
 * from the `LoggingProvider` which needs to be an ancestor of this 
 * component. In case no `LoggingProvider` ancestor is available, a default 
 * `"Default logging message:"` is used.
 */
const withLogging = <P, S = {}>(
  Component: React.ComponentClass<P, S> | React.FunctionComponent<P>,
  componentName: string
): React.FunctionComponent<P> => (props): React.ReactElement | null => (
  <WithLogging componentName={componentName}>
    {(): React.ReactNode => <Component {...props} />}
  </WithLogging>
);

/**
 * A provider which sets the `propsMessage` component for all the 
 * descendant `WithLogging` components and `withLogging`-wrapped 
 * components.
 * The message is passed as the `propsMessage` prop.
 */
export const LoggingProvider = ({
  children,
  propsMessage,
}: {
  children: React.ReactNode;
  propsMessage: string;
}): React.ReactElement => (
  <LoggingContext.Provider value={{ propsMessage }}>
    {children}
  </LoggingContext.Provider>
);

export default withLogging;
