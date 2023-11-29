import React, { useEffect, useState } from 'react';
import { Grid, TextField, InputAdornment, IconButton } from '@material-ui/core';
import SideBar from './SideBar';
import Axios from 'axios';
import Cookies from 'js-cookie';
import Loader from './Loader';
import Files from './Files';
import DocumentInfo from './DocumentInfo';
import SearchIcon from '@material-ui/icons/Search';
import Pdf from './Pdf';
import Document from './Document'
export default function Status(props) {
    const [state, setState] = useState({
        status: "ALL_DOCUMENTS",
        ALL_DOCUMENTS: null,
        WAITING_FOR_OTHERS: [],
        FAILED: [],
        EXPIRING_SOON: [],
        DRAFTS: [],
        STARRED: [],
        ACTION_REQUIRED: [],
        FAILED: [],
        COMPLETED: [],
        MY_DOCUMENTS: [],
        SHARED_DOCUMENTS: [],
        clicked: false,
        selectedFile: null,
        open: false
    });
    const [searchTerm, setSearchTerm] = useState('');
const [filteredDocuments, setFilteredDocuments] = useState([]);
const filterDocumentsByName = (term) => {
  const filtered = state.ALL_DOCUMENTS.filter(document => {
    return document.name.toLowerCase().includes(term.toLowerCase());
  });
  setFilteredDocuments(filtered);
  setSearchTerm(term);
};

    useEffect(() => {
        Axios.get("api/documents", { withCredentials: true }).then(
            data => {
                console.log(data.data);
                seggregate(data.data);
            },
            error => { console.error(error) }
        )
    }, []);
    const unique = (array) =>{
        let set  = new Set();
        let newList = [];
        array.forEach((doc)=>{
            if(!set.has(doc._id)){
               newList.push(doc);
               set.add(doc._id)
            }
        })
        return newList;
    }
    const seggregate = (documents) => {
        let MY_DOCUMENTS = documents.ownedDocuments;
        let SHARED_DOCUMENTS = documents.sharedDocuments;
        let ALL_DOCUMENTS = unique ([...MY_DOCUMENTS, ...SHARED_DOCUMENTS]);

        let WAITING_FOR_OTHERS = [];
        let FAILED = [];
        let DRAFTS = [];
        let COMPLETED = [];
        let ACTION_REQUIRED = [];
        let EXPIRING_SOON = [];
        let STARRED = [];
        MY_DOCUMENTS.forEach((document, index1) => {
            if (document.status === 'sent') {
                console.log("hhhhhhh:"+state.status)
                let rejected = false;
                let signed = false;
                let expired = false;
                document.signers.forEach((signer, inex2) => {
                    if (signer.status === 'rejected') rejected = true;
                    if (signer.status === 'signed' /*&& signer.email!==Cookies.get('email')*/) signed = true;
                    if (Date.now() - new Date(signer.deadline) > 0 && signer.status !== 'signed' && signer.status !== 'rejected') expired = true;

                })
                if (rejected || expired) FAILED.push(document);
                else if (signed)  COMPLETED.push(document);
                else WAITING_FOR_OTHERS.push(document);
            }
            else {
                DRAFTS.push(document);
            }
            if (document.starred) STARRED.push(document);
        })
        SHARED_DOCUMENTS.forEach((document, index1) => {
            let signer = document.signers.filter((signer) =>
                signer.email === Cookies.get('email')
            )[0];
            if (signer) {

                if (signer.status === 'signed') COMPLETED.push(document)    ;
                else if (signer.status === 'rejected') FAILED.push(document);
                else if (new Date(signer.deadline) - Date.now() < 0) FAILED.push(document);
                else if (new Date(signer.deadline) - Date.now() < 86_400_000) {
                    EXPIRING_SOON.push(document);
                    ACTION_REQUIRED.push(document);
                }
                else {
                    ACTION_REQUIRED.push(document);
                }
                if (document.starred) STARRED.push(document);
            }

        })
        setState({
            ...state, ALL_DOCUMENTS: unique(ALL_DOCUMENTS), WAITING_FOR_OTHERS: unique(WAITING_FOR_OTHERS),
            FAILED: unique(FAILED), DRAFTS: unique(DRAFTS), STARRED: unique(STARRED), ACTION_REQUIRED: unique(ACTION_REQUIRED),
            COMPLETED: unique(COMPLETED), MY_DOCUMENTS: unique(MY_DOCUMENTS), SHARED_DOCUMENTS: unique(SHARED_DOCUMENTS),
            EXPIRING_SOON: unique(EXPIRING_SOON)
        });
    }

    const setStatus = (status) => {
        setState({ ...state, status: status, selectedFile: null });
    }
    const handleSelect = (event) => {

        for (let index = 0; index < state.ALL_DOCUMENTS.length; index++) {
            if (state.ALL_DOCUMENTS[index]._id === event.currentTarget.id) {
                console.log(state.ALL_DOCUMENTS[index]);
                setState({ ...state, selectedFile: state.ALL_DOCUMENTS[index], open: true });
                break;
            }
        }
    }
    const getDocuments = () => {
        return state[state.status];
    }

    const handleClose = () => {
        setState({ ...state, open: false });
    }



    return (
        <Grid container >

            {state.open ? (<DocumentInfo handleClose={handleClose} document={state.selectedFile} open={state.open}  state={state}></DocumentInfo>

            ) : (<></>)}
            <Grid item xs={6} sm={4} md={3}  >
                <SideBar status={state.status} setStatus={setStatus}></SideBar>
            </Grid>
            <Grid item xs={6} sm={8} md={9} style={{

            }} >
              <br/>
&nbsp;&nbsp;&nbsp;&nbsp;<TextField
  label="         Search"
  value={searchTerm}
  onChange={(e) => filterDocumentsByName(e.target.value)}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => filterDocumentsByName('')}>
          <SearchIcon />
        </IconButton>
      </InputAdornment>
    ),
  }}

/>

                {state.ALL_DOCUMENTS  ? (
                  <Files handleSelect={handleSelect} documents={filteredDocuments.length > 0 ? filteredDocuments : getDocuments()} />

                ) : (
                    <Loader open={true}></Loader>
                )}
            </Grid>

        </Grid>
    );
}
