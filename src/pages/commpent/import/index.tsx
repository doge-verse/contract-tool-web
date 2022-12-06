import { Button } from '@mui/material';
import React, { Component } from 'react';
import "./style.css"

class SearchData extends Component {


    render() {

        return (
            <div className='upload'>
                <h3>上传文件</h3>
                <Button >Click to Upload</Button>
            </div>
        );
    }
}

export default SearchData;