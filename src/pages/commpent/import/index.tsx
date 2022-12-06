import { Button } from '@mui/material';
import React, { Component } from 'react';
import upload from '../../../event/upload';
import "./style.css"

class SearchData extends Component {
    showFile = async (e: any) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e?.target?.result)
            console.log(text)
            alert(text)
            upload.emit('sendValue', text)

        };
        reader.readAsText(e.target.files[0])
    }

    render() {

        return (
            <div className='upload'>
                <h3>上传文件</h3>
                <input style={{ 'display': 'none' }} type="file" id='fileupload' onChange={(e) => this.showFile(e)} />
                <Button onClick={() => { document.getElementById('fileupload')?.click() }}>Click to Upload</Button>
            </div>
        );
    }
}

export default SearchData;