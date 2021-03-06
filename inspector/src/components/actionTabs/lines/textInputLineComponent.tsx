import * as React from "react";
import { Observable } from "babylonjs";
import { PropertyChangedEvent } from "components/propertyChangedEvent";

interface ITextInputLineComponentProps {
    label: string,
    target: any,
    propertyName: string,
    onPropertyChangedObservable?: Observable<PropertyChangedEvent>
}

export class TextInputLineComponent extends React.Component<ITextInputLineComponentProps, { value: string }> {
    private _localChange = false;

    constructor(props: ITextInputLineComponentProps) {
        super(props);

        this.state = { value: this.props.target[this.props.propertyName] || "" }
    }

    shouldComponentUpdate(nextProps: ITextInputLineComponentProps, nextState: { value: string }) {
        if (this._localChange) {
            this._localChange = false;
            return true;
        }

        const newValue = nextProps.target[nextProps.propertyName];
        if (newValue !== nextState.value) {
            nextState.value = newValue || "";
            return true;
        }
        return false;
    }

    raiseOnPropertyChanged(newValue: string, previousValue: string) {
        if (!this.props.onPropertyChangedObservable) {
            return;
        }
        this.props.onPropertyChangedObservable.notifyObservers({
            object: this.props.target,
            property: this.props.propertyName,
            value: newValue,
            initialValue: previousValue
        });
    }

    updateValue(value: string) {

        this._localChange = true;
        const store = this.props.target[this.props.propertyName];
        this.setState({ value: value });

        this.raiseOnPropertyChanged(value, store);
        this.props.target[this.props.propertyName] = value;
    }

    render() {
        return (
            <div className="textInputLine">
                <div className="label">
                    {this.props.label}
                </div>
                <div className="value">
                    <input value={this.state.value} onChange={evt => this.updateValue(evt.target.value)} />
                </div>
            </div>
        );
    }
}
