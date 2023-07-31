import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';
import Axios from 'axios';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Cookies from 'js-cookie';

const filter = createFilterOptions();


export default function EmailSuggestionBox(props) {
    const [value, setValue] = React.useState(null);
    const [options, setOptions] = React.useState([]);

    useEffect(() => {
        Axios.get('../api/users',{withCredentials:true}).then(
            (resp) => {
               // setOptions(resp.data.filter((x)=> x.email!=Cookies.get('email')));
               setOptions(resp.data);
                console.log(resp.data);
            }
        )
    }, []);
    return (
        <Autocomplete
            value={value}
            freeSolo
            id="autocomplete"
            disableClearable
            options={options}
            onChange={(event, newValue) => {
                if (typeof newValue == 'string') {
                    console.log(newValue);
                    newValue = { email: newValue, name: null,image:null }

                }
                setValue(newValue);
                props.handleChange(newValue);
            }}
            getOptionLabel={(option) => {
                if (typeof option === 'string') {
                    return option;
                }
                if (option && option.name)
                    return option.name;
                else return option.email;
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                console.log(params);
                // Suggest the creation of a new value
                if (params.inputValue !== '') {
                  filtered.push({
                    email: params.inputValue,
                    name: null,
                    image:null
                  });
                }
        
                return filtered;
              }}
            renderOption={(option) => (
                
                <React.Fragment>
                    <ListItemAvatar>
                        <Avatar alt={option.name} src={option.image} />
                    </ListItemAvatar>
                    <ListItemText style={{ wordWrap: 'break-word ' }}
                        primary={option.name ? option.name :'Invite ' + option.email}
                        secondary={option.name? option.email:''}
                    />
                </React.Fragment>
            )}

            renderInput={(params) => (
                <TextField {...params} label="Email" />
            )}
        />
    );
}
