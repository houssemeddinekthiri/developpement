import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

function SignatureComponent() {
  const signatureRef = useRef();
  const signatureCanvasRef = useRef(null);
  const handleClear = () => {
    signatureRef.current.clear();
  };

  const handleSave = () => {
    const signatureData = signatureRef.current.toDataURL(); // Obtient l'image de la signature au format Data URL
    // Traitez les données de signature (enregistrez-les sur un serveur, par exemple)
  };

  return (
    <div>
     <SignatureCanvas
       ref={signatureCanvasRef}
  penColor="black"
  canvasProps={{ width: 500, height: 200, className: 'signatureCanvas' }}
/>
      <button onClick={() => signatureCanvasRef.current.clear()}>Effacer</button>
      <button onClick={handleSave}>Sauvegarder</button>
    </div>
  );
}

export default SignatureComponent;
