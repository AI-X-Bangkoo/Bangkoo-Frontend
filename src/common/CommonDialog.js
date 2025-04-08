import React  from 'react';
import {
    DialogStyle,
    TitleBox,
    IconButton,
    ContentsBox,
    ControllerBox
} from "./css/Dialog.styled"
import { ReactComponent as CloseIcon } from "../assets/images/CloseIcon.svg";
import CommonButton from './CommonButton';
import {Text} from "./Typography";

const CommonDialog = ({
                          open,
                          onClose,
                          onClick,
                          title,
                          children,
                          cancel = true,
                          submit = true,
                          submitText = '확인',
                      }) => {

    const buttonProps = {
        width:"140px",
        height: "40px",
        fontSize: "xs"
    };

    return (
        <DialogStyle onClose={onClose} open={open}>
            <TitleBox>
                <Text size="base" $weight={700}>{title}</Text>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </TitleBox>
            <ContentsBox>
                {children}
            </ContentsBox>
            <ControllerBox>
                {cancel &&
                    <CommonButton
                        type="outline"
                        onClick={onClose}
                        children={"취소"}
                        {...buttonProps}
                    />
                }

                {submit &&
                    <CommonButton
                        onClick={onClick}
                        children={submitText}
                        {...buttonProps}
                    />
                }

            </ControllerBox>
        </DialogStyle>
    );
};

export default CommonDialog;