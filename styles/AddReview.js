import styled from 'styled-components';

export const InputWrapper = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

export const InputField = styled.TextInput`
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    text-align: center;
    width: 90%;
`;

export const AddImage = styled.Image`
    width: 100%;
    height: 250px;
    margin-bottom: 15px;
`;

export const StatusWrapper = styled.View`
    justify-content: center;
    align-items: center;
`;

export const SubmitBtn = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    background-color: #2e64e515;
    border-radius: 5px;
    padding: 10px 25px;
    borderColor: '#2e64e5';
    borderWidth: 2;
`;

export const SubmitBtnText = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #2e64e5;
`;