import React from "react";
import {TabMenu, Tab, TabLineStyle} from "./css/Tabs.styled";

function CommonTabs({ tabs = [], current, onChange, fontSize }) {

    return (
        <TabMenu>
            {tabs.map(({ id, label }) => (
                <Tab
                    key={id}
                    $active={current === id}
                    onClick={() => onChange(id)}
                    fontSize={fontSize}
                >
                    {label}
                </Tab>
            ))}

            <TabLineStyle/>
        </TabMenu>
    );
}

export default CommonTabs;