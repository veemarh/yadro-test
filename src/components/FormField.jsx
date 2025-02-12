import React from "react";

export default function FormField({label, name, register, error, as: Component = "input", ...rest}) {
    return (
        <div>
            <label>
                {label}
                <Component {...register(name)} {...rest} />
            </label>
            {error && (<span style={{color: "red"}}>{error.message || error}</span>)}
        </div>
    );
}
