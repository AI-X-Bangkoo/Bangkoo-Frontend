import React from "react";
import {TabMenu, Tab, TabLineStyle} from "./css/Tabs.styled";

function CommonTabs({ tabs = [], current, onChange, fontSize, className }) {

    return (
        <TabMenu className={className}>
            {tabs.map(({ id, label }) => (
                <Tab
                    key={id}
                    $active={current === id}
                    onClick={() => onChange(id)}
                    fontSize={fontSize}
                    className={id === "interior" ? "tab-interior" : ""}
                >
                    {label}
                </Tab>
            ))}

            <TabLineStyle/>
        </TabMenu>
    );
}

export default CommonTabs;