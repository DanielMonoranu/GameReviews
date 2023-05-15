import { Field, useFormikContext } from "formik";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from 'react';

export default function MultiSelectField(props: multipleSelectFieldProps) {
    const { values } = useFormikContext<any>()
    useEffect(() => {
        values[props.field] = props.selectedOptions?.map((option) => option.key);
    }, []);

    const handleSelect = (selectedList: multipleSelectModel[]) => {
        const selectedKeys = selectedList.map((option) => option.key);
        values[props.field] = selectedKeys;
    };

    const handleRemove = (selectedList: multipleSelectModel[]) => {
        const selectedKeys = selectedList.map((option) => option.key);
        values[props.field] = selectedKeys;
    };

    return (
        <div className=" mb-3  form-group">
            <label htmlFor={props.field}> {props.displayName}</label>

            <Multiselect
                id={props.field}
                displayValue="value"
                onKeyPressFn={function noRefCheck() { }}
                onRemove={handleRemove}
                onSelect={handleSelect}
                onSearch={function noRefCheck() { }}
                options={props.allOptions}
                selectedValues={props.selectedOptions}
                singleSelect={props.singleSelect}

            />

        </div>
    )
}
interface multipleSelectFieldProps {
    allOptions: multipleSelectModel[];
    selectedOptions?: multipleSelectModel[];
    displayName?: string;
    singleSelect?: boolean;
    field: string;
}

export interface multipleSelectModel {
    key: number;
    value: string;
}
