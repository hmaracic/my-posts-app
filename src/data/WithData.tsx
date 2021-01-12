import React from "react";
import { randomToken } from "../utils/utils";
import { WithLogging } from "../utils/withLogging";

export type DataFunctionType<DataType, DataIdType> = (
  provideData: (newData: DataType) => void,
  dataId: DataIdType
) => void;

export type WithDataProps<DataType, DataIdType = undefined> = {
  dataId: DataIdType;
  dataFunction: DataFunctionType<DataType, DataIdType>;
  children: (data: DataType | null) => React.ReactNode;
};

type WithDataState<DataType, DataIdType = undefined> = {
  data: DataType | null;
  dataFunction: DataFunctionType<DataType, DataIdType>;
  dataId: DataIdType;
};

/**
 * Configurable data provider. Takes two props, `dataId` and `dataFunction`.
 * `dataFunction` is a function which is called to get data after the component
 * mounts, after the `dataId` prop changes and after the `dataFunction` function
 * itself changes.
 * Data is provided as the only parameter of a function which needs to be either
 * passed as the `children` prop or as the child element.
 * Value provided to the `children` function is either the data provided by the
 * `dataFunction` or `null` before the (new) data has been received.
 */
class WithData<DataType, DataIdType = undefined> extends React.Component<
  WithDataProps<DataType, DataIdType>,
  WithDataState<DataType, DataIdType>
> {
  _provideDataToken?: string;

  constructor(props: WithDataProps<DataType, DataIdType>) {
    super(props);

    this.state = {
      data: null,
      dataFunction: props.dataFunction,
      dataId: props.dataId,
    };
  }

  // `provideData` function is generated on every call to append a token check
  // this prevents an old, long-running function call from updating the data
  // if a new data change has already been initiated or if the component is
  // being unmounted (since `setState` must not be call on unmounted components)
  provideDataGenerator: (
    provideDataToken: string
  ) => (newData: DataType) => void = (provideDataToken) => {
    return (newData): void => {
      if (provideDataToken === this._provideDataToken) {
        this.setState({ data: newData });
        this._provideDataToken = undefined;
      }
    };
  };

  // qualifying conditions for data change are checked here instead of
  // in `onComponentUpdate` to prevent an initial render of old state
  // after the conditions change if the component is already mounted
  // but hidden/out of focus (e.g. using CSS) when the change occurs
  static getDerivedStateFromProps<DataType, DataIdType = undefined>(
    nextProps: WithDataProps<DataType, DataIdType>,
    prevState: WithDataState<DataType, DataIdType>
  ): Partial<WithDataState<DataType, DataIdType>> | null {
    if (
      nextProps.dataId !== prevState.dataId ||
      nextProps.dataFunction !== prevState.dataFunction
    ) {
      return {
        data: null,
        dataId: nextProps.dataId,
        dataFunction: nextProps.dataFunction,
      };
    }

    return null;
  }

  componentDidMount(): void {
    this.getData(this.props.dataId);
  }

  componentDidUpdate?(
    _prevProps: WithDataProps<DataType, DataIdType>,
    prevState: WithDataState<DataType, DataIdType>
  ): void {
    if (
      this.state.dataId !== prevState.dataId ||
      this.state.dataFunction !== prevState.dataFunction
    ) {
      this.getData(this.props.dataId);
    }
  }

  getData(dataId: DataIdType): void {
    // invalidate the old `provideData` token before starting
    // a new data request
    this._provideDataToken = randomToken(String(dataId));
    this.props.dataFunction(
      this.provideDataGenerator(this._provideDataToken),
      dataId
    );
  }

  componentWillUnmount(): void {
    // invalidate `provideData` token when unmounting to
    // disable state update attempts after the component
    // has been unmounted.
    this._provideDataToken = randomToken("unmounting");
  }

  render(): React.ReactNode {
    if (typeof this.props.children === "function")
      return this.props.children(this.state.data);
    return null;
  }
}

// exported this way because using `withLogging` as a HOC
// creates TS problems with passing generics for `DataType`
// and `DataIdType` to `WithData`
const WithDataWithProps = <DataType, DataIdType = undefined>(
  props: WithDataProps<DataType, DataIdType>
): React.ReactElement => {
  return (
    <WithLogging componentName={"withData"}>
      {(): React.ReactNode => <WithData<DataType, DataIdType> {...props} />}
    </WithLogging>
  );
};
export default WithDataWithProps;
