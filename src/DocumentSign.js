import { Paper } from '@material-ui/core';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Loader from './Loader';
import NavBar from './Navbar';
import AjoutComposonSPdf from './AjoutComposonsPdf';

import { cookie } from 'express-validator';

export default function DocumentSign(props) {
    const [document, setDocument] = useState(null);
    const [document1, setDocument1] = useState(null);
    const [comments, setComments] = useState([]);
    const [name,setName]= useState('');
    const [owner,setOwner] = useState('');
    const [signed,setSigned] = useState(false);
    const [isOwnerSigner,setIsOwnerSigner] = useState(false);
    const[statuus , setStatuus]=useState(null)
    let params = useParams();
    const loadPdf = ()=>{
        setDocument(null);
        axios.get('/api/documents/' + params.fileId, { withCredentials: true }).then(
            resp => {
                setDocument(null);

                let signer  =resp.data.signers.filter((signer)=>signer.email/*===Cookies.get('email')*/);

                if(signer[0].documentSigné===null  ){
                  setDocument(resp.data.buffer);
                }
                else{
                  setDocument(signer[0].documentSigné);
                }

                setComments(resp.data.comments);
                setName(resp.data.name);
                setOwner(resp.data.owner);
                setIsOwnerSigner(resp.data.isOwnerSigner);


                setSigned((signer.length>0 && (signer[0].status==='signed'|| signer[0].status==='rejected'  || signer[0].status==='expired' )));
               console.log(signer[0].status)
                setStatuus(signer[0].status)
                console.log("status:"+statuus);
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
                (<AjoutComposonSPdf pdf={document} signed={signed} statuus={statuus} pdf1={document1} isOwnerSigner={isOwnerSigner} loadPdf = {loadPdf}    owner={owner} comments={comments} name={name}></AjoutComposonSPdf>) :
                (<>
                    <NavBar></NavBar>
                </>)
            }
        </React.Fragment>

    )
}
