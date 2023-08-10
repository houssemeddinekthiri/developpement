import cn from 'classnames';
import { forwardRef } from 'react';
import styles from './FieldBox.module.scss';
import ResizableContent from './ResizableContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
const FieldBox = forwardRef(({ label, className, ...props }, ref) => (
  <><div ref={ref} className={cn(styles.box, className)} {...props}>
    <h1 style={{fontSize:'12px'}}> {label}</h1>
   
  </div>
 
 </>
));


export default FieldBox;
