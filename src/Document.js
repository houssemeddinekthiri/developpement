import { Paper } from '@material-ui/core';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Loader from './Loader';
import NavBar from './Navbar';
import Pdf from './Pdf';

export default function Document(props) {
    const [document, setDocument] = useState(null);
    const [comments, setComments] = useState([]);
    const [name,setName]= useState('');
    const [owner,setOwner] = useState('');
    const [signed,setSigned] = useState(false);
    const [isOwnerSigner,setIsOwnerSigner] = useState(false);
    let params = useParams();
    const loadPdf = ()=>{
        setDocument(null);
        axios.get('/api/documents/' + params.fileId, { withCredentials: true }).then(
            resp => {
                setDocument(null);
                setDocument(resp.data.buffer);
                setComments(resp.data.comments);
                setName(resp.data.name);
                setOwner(resp.data.owner);
                setIsOwnerSigner(resp.data.isOwnerSigner);
                let signer  =resp.data.signers.filter((signer)=>signer.email === Cookies.get('email'));

                setSigned((signer.length>0 && (signer[0].status==='signed'|| signer[0].status==='rejected'  || signer[0].status==='expired' )));
                console.log(signer);
                localStorage.setItem('current_id',params.fileId);

            },
            (err) => {
                console.log(err)
            }
        )
    }
    useEffect(() => {
        loadPdf();
    }, [])

    return (
        <React.Fragment>
            <Loader open={!document}></Loader>
            {document != null ?
                (<Pdf pdf={document} signed={signed} isOwnerSigner={isOwnerSigner} loadPdf = {loadPdf} owner={owner} comments={comments} name={name}></Pdf>) :
                (<>
                    <NavBar></NavBar>
                </>)
            }
        </React.Fragment>

    )
}