import React from 'react'
import "./_textarea.scss"

type Props = {
    label: string;
    inputValue: string;
    required: boolean;
    rows: number;
    cols: number;
    maxLength: number;
    onChangeFunction: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;

}

function TextArea({label, inputValue, required, rows, cols, maxLength, onChangeFunction}: Props) {
  return (
    <div className='textarea_wrapper'>
        <span className='textarea_label flex_row_center'>{label} {required && <p className='required_symbol'>*</p>}</span>
        <textarea className='textarea' rows={rows} cols={cols} required={required} value={inputValue.substring(0, maxLength - 1)} onChange={onChangeFunction}/>
        <p className='input_count'>{inputValue.length}/{maxLength}</p>
    </div>
  )
}

export default TextArea
